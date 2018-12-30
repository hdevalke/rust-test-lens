'use strict';
import { Metadata, Package } from "./cargo";
import { basename, dirname } from "path";

export class RustTests {
    private readonly testMap: Map<string, Package> = new Map<string, Package>();
    constructor(private metadata: Metadata) {
        // sort packages by manifest path length to match the longest path.
        metadata.packages.sort((a, b) => {
            return b.manifest_path.length - a.manifest_path.length;
        });
    }
    /**
     * Get the package based on the function name.
     * @param fn function name
     */
    getPackage(fn: string, uri: string): Package | undefined {
        let pkg = this.testMap.get(`${uri}::${fn}`);
        if (!pkg) {
            if (this.metadata) {
                for (pkg of this.metadata.packages) {
                    let pkg_dir = dirname(pkg.manifest_path);
                    if (uri.startsWith(pkg_dir)) {
                        break;
                    }
                }
                if (pkg) {
                    this.testMap.set(`${uri}::${fn}`, pkg);
                }
            }
        }
        return pkg;
    }

    getBin(uri: string, pkg: Package): String | undefined {
        const name = basename(uri, '.rs');
        if (name === "main") {
            return pkg.name;
        } else {
            for (const target of pkg.targets) {
                if (name === target.name) {
                    if (uri.indexOf("/bin/") !== -1) {
                        return name;
                    } else if ("main" === name) {
                        return dirname(pkg.manifest_path);
                    }
                }
            }
        }
        return undefined;
    }
}
