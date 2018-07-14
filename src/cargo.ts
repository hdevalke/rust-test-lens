'use strict';
// Helper function and interfaces to work with cargo metadata.
import { workspace } from "vscode";
import { spawn } from "child_process";

export interface Package {
    name: string;
    authors: string[];
    version: string;
    manifest_path: string;
}

export interface Metadata {
    packages: Package[];
    target_directory: string;
    version: number;
    workspace_members: string[];
    workspace_root: string;
}

type StrSink = (data: string) => void;

export async function metadata(onStdErr?: StrSink): Promise<Metadata> {
    let meta = "";
    const cargoArgs = [
        "metadata",
        "--no-deps",
        "--format-version=1"];
    return runCargo(cargoArgs, data => meta += data, onStdErr)
        .then(_ => JSON.parse(meta))
        .catch((errInfo) => console.error(`Couldn't get metadata: ${errInfo}`));
}


async function runCargo(args?: ReadonlyArray<string>, onStdOut?: StrSink,
    onStdErr?: StrSink): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        const workspaceFolders = workspace.workspaceFolders;
        const options = {
            cwd: workspaceFolders ? workspaceFolders[0].uri.fsPath : undefined,
            stdio: ['ignore', 'pipe', 'pipe'],
        };
        const proc = spawn("cargo", args, options);
        proc.on('error', err => reject(err));

        proc.stderr.on('data', chunk => {
            if (onStdErr) {
                onStdErr(chunk.toString());
            }
        });

        proc.stdout.on('data', chunk => {
            if (onStdOut) {
                onStdOut(chunk.toString());
            }
        });

        proc.on('exit', (exitCode, signal) => {
            exitCode === 0
                ? resolve(exitCode)
                : reject({ exitCode: exitCode, signal: signal });
        });
    });
}
