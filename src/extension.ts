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
  WorkspaceFolder
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
        const codeLensProvider = new RustCodeLensProvider(
          onDidChange,
          rustTests
        );
        context.subscriptions.push(
          languages.registerCodeLensProvider(
            { scheme: "file", language: "rust" },
            codeLensProvider
          )
        );
        let disposable = commands.registerCommand(
          "extension.debugTest",
          debugConfig => {
            const json = JSON.stringify(debugConfig, null, 2);
            outputChannel.appendLine(`Debugging: ${json}`);
            debug
              .startDebugging(undefined, debugConfig)
              .then(r => console.log("Result", r));
          }
        );
        context.subscriptions.push(disposable);
      }
    } else {
      outputChannel.append(
        "Only workspaces with a `./Cargo.toml` file are supported."
      );
    }
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
