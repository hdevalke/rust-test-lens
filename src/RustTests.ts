"use strict";
import { Metadata, Package } from "./cargo";
import { basename, dirname } from "path";
import { WorkspaceFolder, workspace, Uri } from "vscode";

export interface Filter {
  kind: undefined | string;
  name: undefined | string;
}

export class RustTests {
  private readonly testMap: Map<
    WorkspaceFolder,
    Map<string, Package>
  > = new Map<WorkspaceFolder, Map<string, Package>>();

  constructor(private metadata_map: Map<WorkspaceFolder, Metadata>) {
    // sort packages by manifest path length to match the longest path.
    metadata_map.forEach(metadata =>
      metadata.packages.sort((a, b) => {
        return b.manifest_path.length - a.manifest_path.length;
      })
    );
  }
  /**
   * Get the package based on the function name.
   * @param fn function name
   */
  getPackage(fn: string, uri: Uri): Package | undefined {
    const cws = workspace.getWorkspaceFolder(uri);
    if (cws === undefined) {
      return undefined;
    }
    let pkg_map = this.testMap.get(cws);
    if (pkg_map === undefined) {
      pkg_map = new Map<string, Package>();
      this.testMap.set(cws, pkg_map);
    }
    const fsPath = uri.fsPath;
    let pkg = pkg_map.get(`${fsPath}::${fn}`);
    if (!pkg) {
      const metadata = this.metadata_map.get(cws);
      if (metadata) {
        for (pkg of metadata.packages) {
          let pkg_dir = dirname(pkg.manifest_path);
          if (fsPath.startsWith(pkg_dir)) {
            break;
          }
        }
        if (pkg) {
          pkg_map.set(`${uri}::${fn}`, pkg);
        }
      }
    }
    return pkg;
  }

  getBin(uri: string, pkg: Package): string | undefined {
    let main = undefined;
    for (const target of pkg.targets) {
      const source_name = basename(target.src_path, ".rs");
      if (source_name === "main") {
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
    } else {
      // slow path
      // sort in order to find longest path.
      targets.sort((a, b) => {
        return b.src_path.length - a.src_path.length;
      });
      for (const t of pkg.targets) {
        let target_dir = dirname(t.src_path);
        if (uri.startsWith(target_dir)) {
          const found = t.kind.find(e => e === "test");
          if (
            found === undefined ||
            (found && basename(t.src_path) === basename(uri))
          ) {
            target = t;
            break;
          }
        }
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
      name: name
    };
  }
}
