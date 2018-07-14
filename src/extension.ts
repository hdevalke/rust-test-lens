'use strict';
import {
    commands, EventEmitter, ExtensionContext, languages, window, debug,
    OutputChannel,
    workspace
} from 'vscode';
import { RustCodeLensProvider } from './RustCodeLensProvider';
import { RustTests } from './RustTests';
import { metadata } from './cargo';

const onDidChange: EventEmitter<void> = new EventEmitter<void>();
export const outputChannel: OutputChannel =
    window.createOutputChannel('Rust Test Output');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    const config = workspace.getConfiguration("rust-test-lens");
    if (config.get("enabled", true)) {
        metadata()
            .then(meta => {
                const rustTests: RustTests = new RustTests(meta);
                const codeLensProvider = new RustCodeLensProvider(onDidChange,
                    rustTests);
                context.subscriptions.push(languages.registerCodeLensProvider(
                    { scheme: 'file', language: 'rust' }, codeLensProvider));
            });

        let disposable = commands.registerCommand('extension.debugTest',
            (debugConfig) => {
                debug.startDebugging(undefined, debugConfig)
                    .then((r) => console.log("Result", r));
            });

        context.subscriptions.push(disposable);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}