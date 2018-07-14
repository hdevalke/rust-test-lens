'use strict';
import {
    CancellationToken, CodeLens, CodeLensProvider, Event, EventEmitter,
    Range, TextDocument, DebugConfiguration
} from 'vscode';
import { RustTests } from './RustTests';
import { basename } from 'path';

export class RustCodeLensProvider implements CodeLensProvider {

    private static readonly TEST_LEN = "#[test]".length;

    constructor(private _onDidChange: EventEmitter<void>,
        private rustTests: RustTests) {
    }

    get onDidChangeCodeLenses(): Event<void> {
        return this._onDidChange.event;
    }

    public async provideCodeLenses(doc: TextDocument, 
            token: CancellationToken): Promise<CodeLens[]> {
        if (token.isCancellationRequested) {
            return [];
        }
        const text = doc.getText();
        const reTest = /#\[test\]/g;
        const reFnTest = /fn\s+(.+)\s*\(\s*\)/g;
        let lenses: CodeLens[] = [];
        while (reTest.exec(text) !== null) {
            const end = doc.positionAt(reTest.lastIndex);
            let startIdx = reTest.lastIndex - RustCodeLensProvider.TEST_LEN;
            const start = doc.positionAt(startIdx);
            const range = new Range(start, end);
            reFnTest.lastIndex = reTest.lastIndex;
            const match = reFnTest.exec(text);
            const fn = match === null ? null : match[1];
            if (fn) {
                const debugConfig = this.createDebugConfig(fn, doc.fileName);
                if (debugConfig) {
                    lenses.push(new CodeLens(range, {
                        title: 'Debug test',
                        command: "extension.debugTest",
                        tooltip: 'Debug Test',
                        arguments: [debugConfig]
                    }));
                }
            }
        }
        return lenses;
    }

    createDebugConfig(fn: string, uri: string): DebugConfiguration | undefined {
        const pkg = this.rustTests.getPackage(fn, uri);
        if (pkg) {
            return {
                type: "lldb",
                request: "launch",
                name: `Debug ${fn} in ${basename(uri)}`,
                cargo: {
                    "args": [
                        "test",
                        "--no-run",
                        `--package=${pkg.name}`
                    ]
                },
                "args": [fn],
                "cwd": "${workspaceFolder}"
            };
        }
    }
}