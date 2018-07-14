'use strict';
import { Metadata, Package } from "./cargo";
import { dirname } from "path";

export class RustTests {
    private readonly testMap: Map<string, Package> = new Map<string, Package>();
    constructor(private metadata: Metadata) {

    }
    /**
     * Get the package based on the function name.
     * @param fn function name
     */
    getPackage(fn: string, uri: string): Package | undefined {
        let pkg = this.testMap.get(fn);
        if (!pkg) {
            for (pkg of this.metadata.packages) {
                let pkg_dir = dirname(pkg.manifest_path);
                if (uri.startsWith(pkg_dir)) {
                    break;
                }
            }
        }
        return pkg;
    }
}
