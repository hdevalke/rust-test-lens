# Change Log

All notable changes to the "rust-test-lens" extension will be documented in this file.

Check [Keep a Changelog](https://keepachangelog.com/) for recommendations on how to structure this file.

## 0.1.2

- Fixes issue [#3](https://github.com/hdevalke/rust-test-lens/issues/3) where there is more than one target created.

## 0.1.1

- Fixes issue [#3](https://github.com/hdevalke/rust-test-lens/issues/3) where tests in binary crate are not launched.

## 0.1.0

- Adds a Debug codelens to the main function in binaries and examples.

## 0.0.5

- Solves the problem if there are still multiple binaries found. E.g. integration tests.
- Sets the current working directory to the package root instead of the workspace root.

## 0.0.4

- Works now if the package contains multiple binaries.

## 0.0.3

- Fix issue with workspace containing a root crate [#1](https://github.com/hdevalke/rust-test-lens/issues/1)

## 0.0.2

- Place codelens below `#[test]`
- More caching
- Better error logging

## 0.0.1

- Initial release
- Adds a codelens to quickly debug a specific test.