import * as assert from 'assert';

import { Metadata } from '../cargo';
import { RustTests } from '../RustTests';
import { WorkspaceFolder, Uri } from 'vscode';

/// skipping tests
/// have to migrate to vscode-test
/// https://code.visualstudio.com/api/working-with-extensions/testing-extension#migrating-from-vscode
suite.skip("RustTests Tests", function () {
    const workspaceFolder : WorkspaceFolder = {
        uri: Uri.file('./root_crate'),
        name: 'name',
        index: 0
    };
    const metadata: Metadata = {
        packages: [{
            name: "other_sub_crate",
            authors: [
                "author"
            ],
            version: "0.1.2",
            manifest_path: "./root_crate/other_sub_crate/Cargo.toml",
            targets: []
        }, {
            name: "root_crate",
            authors: [
                "author"
            ],
            version: "0.1.2",
            manifest_path: "./root_crate/Cargo.toml",
            targets: []
        }, {
            name: "sub_crate",
            authors: [
                "author"
            ],
            version: "0.1.2",
            manifest_path: "./root_crate/sub_crate/Cargo.toml",
            targets: []
        }],
        target_directory: "target",
        version: 1,
        workspace_members: ["root_crate", "sub_crate", "other_sub_crate"],
        workspace_root: ".",
    };

    test("getPackage root test", function () {
        let map = new Map<WorkspaceFolder, Metadata>();
        map.set(workspaceFolder, metadata);
        let rustTests = new RustTests(map);
        let pkg = rustTests.getPackage("test_in_root",
                Uri.file("./root_crate/test.rs"));
        if (pkg === undefined) {
            assert.fail("A package should be found");
        } else {
            assert.equal("root_crate", pkg.name);
        }
    });
    test("getPackage sub_crate test", function () {
        let map = new Map<WorkspaceFolder, Metadata>();
        map.set(workspaceFolder, metadata);
        let rustTests = new RustTests(map);
        let pkg = rustTests.getPackage("test_in_sub_crate",
            Uri.file("./root_crate/sub_crate/test.rs"));
        if (pkg === undefined) {
            assert.fail("A package should be found");
        } else {
            assert.equal("sub_crate", pkg.name);
        }
    });
    test("getPackage other_sub_crate test", function () {
        let map = new Map<WorkspaceFolder, Metadata>();
        map.set(workspaceFolder, metadata);
        let rustTests = new RustTests(map);
        let pkg = rustTests.getPackage("test_in_other_sub_crate",
            Uri.file("./root_crate/other_sub_crate/test.rs"));
        if (pkg === undefined) {
            assert.fail("A package should be found");
        } else {
            assert.equal("other_sub_crate", pkg.name);
        }
    });
});