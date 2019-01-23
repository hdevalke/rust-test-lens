'use strict';
// Helper function and interfaces to work with cargo metadata.
import { workspace } from "vscode";
import { spawn, SpawnOptions } from "child_process";

export interface Target {
    name: string;
    src_path: string;
    kind: string[];
}

export interface Package {
    name: string;
    authors: string[];
    version: string;
    manifest_path: string;
    targets: Target[];
}

export interface Metadata {
    packages: Package[];
    target_directory: string;
    version: number;
    workspace_members: string[];
    workspace_root: string;
}

type StrSink = (data: string) => void;

export async function metadata(onStdErr?: StrSink,
    retry = false): Promise<Metadata> {
    let meta = "";
    const cargoArgs = [
        "metadata",
        "--no-deps",
        "--format-version=1"];
    return runCargo(cargoArgs, data => meta += data, onStdErr)
        .then(_ => JSON.parse(meta))
        .catch((reason) => {
            if (onStdErr) {
                onStdErr(`Couldn't get metadata: ${reason}. 
                Cargo command run: cargo ${cargoArgs.join(' ')} 
                Metadata read so far: ${meta}`);
            }
            if (retry) {
                return metadata(onStdErr);
            } else {
                return Promise.reject(reason);
            }
        });
}

async function runCargo(args?: ReadonlyArray<string>, onStdOut?: StrSink,
    onStdErr?: StrSink): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        const workspaceFolders = workspace.workspaceFolders;
        const options: SpawnOptions = {
            cwd: workspaceFolders ? workspaceFolders[0].uri.fsPath : undefined,
            stdio: ['ignore', 'pipe', 'pipe'],
        };

        const proc = spawn("cargo", args, options);
        proc.on('error',
            err => {
                reject(err);
            }
        );

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
