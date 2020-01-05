"use strict";
import {
  commands,
  EventEmitter,
  ExtensionContext,
  languages,
  window,
  debug,
  OutputChannel,
  workspace,
  WorkspaceFolder,
  Disposable
} from "vscode";
import { RustCodeLensProvider } from "./RustCodeLensProvider";
import { RustTests } from "./RustTests";
import { metadata, Metadata } from "./cargo";
import * as fs from "fs";
import * as path from "path";

const onDidChange: EventEmitter<void> = new EventEmitter<void>();
export const outputChannel: OutputChannel = window.createOutputChannel(
  "Rust Test Output"
);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  const config = workspace.getConfiguration("rust-test-lens");
  if (config.get("enabled", true)) {
    if (workspace.workspaceFolders) {
      const metaMap = new Map<WorkspaceFolder, Metadata>();
      for (const ws of workspace.workspaceFolders) {
        if (fs.existsSync(path.join(ws.uri.fsPath, "Cargo.toml"))) {
          let meta = await metadata(ws, err => outputChannel.append(err), true);
          metaMap.set(ws, meta);
        }
      }
      if (metaMap.size !== 0) {
        const rustTests: RustTests = new RustTests(metaMap);
        const main_args = config.get("args.main", []);
        const test_args = config.get("args.tests", ["--nocapture"]);
        const codeLensProvider = new RustCodeLensProvider(
          onDidChange,
          rustTests,
          main_args,
          test_args
        );
        const disposable = languages.registerCodeLensProvider(
          { scheme: "file", language: "rust" },
          codeLensProvider
        );

        context.subscriptions.push(
          workspace.onDidChangeConfiguration(e => {
            const config = workspace.getConfiguration("rust-test-lens");
            const main_args: string[] = config.get("args.main", []);
            const test_args = config.get("args.tests", ["--nocapture"]);
            codeLensProvider.update_args(main_args, test_args);
          })
        );

        context.subscriptions.push(disposable);
        context.subscriptions.push(registerCmdDebugTest());
      }
    } else {
      outputChannel.append(
        "Only workspaces with a `./Cargo.toml` file are supported."
      );
    }
  }
}

function registerCmdDebugTest(): Disposable {
  return commands.registerCommand("extension.debugTest", debugConfig => {
    const json = JSON.stringify(debugConfig, null, 2);
    outputChannel.appendLine(`Debugging: ${json}`);
    debug
      .startDebugging(undefined, debugConfig)
      .then(r => console.log("Result", r));
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
