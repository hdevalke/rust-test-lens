# Rust Test Lens

[![Build Status](https://travis-ci.org/hdevalke/rust-test-lens.svg?branch=master)](https://travis-ci.org/hdevalke/rust-test-lens)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/hdevalke.rust-test-lens)](https://marketplace.visualstudio.com/items?itemName=hdevalke.rust-test-lens)

A code lens to debug rust tests and binaries.

![test lens](images/test_codelens.png)

⚠ NOTE: No more maintenance will be done to this extension.
#17 has lead to adding the debug codelens into [rust-analyzer#3561](https://github.com/rust-analyzer/rust-analyzer/pull/3561). This code will remain available as is for those not using [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=matklad.rust-analyzer).

## Requirements

Depends on the LLDB extension [vscode-lldb](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb).

## Extension Settings

This extension can be enabled/disabled using the following setting:

* `rust-test-lens.enable`: true/false to enable/disable this extension
* `rust-test-lens.args.main`: An array of strings with the application arguments.
* `rust-test-lens.args.tests`: An array of strings with extra arguments.
  Defaults to `--no-capture`.
  Run `cargo test -- --help` to see all possible options.
