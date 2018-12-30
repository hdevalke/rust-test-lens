import * as assert from 'assert';

import { Metadata } from '../cargo';
import { RustTests } from '../RustTests';

suite("RustTests Tests", function () {

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
        let rustTests = new RustTests(metadata);
        let pkg = rustTests.getPackage("test_in_root", "./root_crate/test.rs");
        if (pkg === undefined) {
            assert.fail("A package should be found");
        } else {
            assert.equal("root_crate", pkg.name);
        }
    });
    test("getPackage sub_crate test", function () {
        let rustTests = new RustTests(metadata);
        let pkg = rustTests.getPackage("test_in_sub_crate",
            "./root_crate/sub_crate/test.rs");
        if (pkg === undefined) {
            assert.fail("A package should be found");
        } else {
            assert.equal("sub_crate", pkg.name);
        }
    });
    test("getPackage other_sub_crate test", function () {
        let rustTests = new RustTests(metadata);
        let pkg = rustTests.getPackage("test_in_other_sub_crate",
            "./root_crate/other_sub_crate/test.rs");
        if (pkg === undefined) {
            assert.fail("A package should be found");
        } else {
            assert.equal("other_sub_crate", pkg.name);
        }
    });
});