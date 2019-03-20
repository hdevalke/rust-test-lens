'use strict';
import { Metadata, Package } from "./cargo";
import { basename, dirname } from "path";

export interface Filter {
    kind: undefined | string;
    name: undefined | string;
}

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

    getBin(uri: string, pkg: Package): string | undefined {
        let main = undefined;
        for (const target of pkg.targets) {
            const source_name = basename(target.src_path, '.rs');
            if (source_name === 'main') {
                main = target.name;
            }
            if (uri === target.src_path) {
                return target.name;
            }
        }
        return main;
    }

    /// Get the kind of the target to select.
    /// For example
    getFilter(uri: string, pkg: Package, bin: string | undefined): Filter {
        const targets = pkg.targets;
        let target = undefined;
        // fast path
        if (targets.length === 1) {
            target = targets[0];
        }
        // slow path
        for (const t of pkg.targets) {
            if (t.src_path === uri) {
                target = t;
                break;
            }
        }
        let kind = undefined;
        let name = undefined;
        if (target === undefined) {
            kind = bin === undefined ? "lib" : "bin";
        } else {
            kind = target.kind[0];
            name = kind === "test" ? target.name : undefined;
        }
        return {
            kind: kind,
            name: name,
        };
    }
}
