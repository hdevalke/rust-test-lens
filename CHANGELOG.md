# Change Log

### 0.3.2

#### Fixes

* Find correct target for integration tests 60d1f43, closes #15

### 0.3.1

#### Fixes

* add test lens to async tests 1ee0155, closes #13

## 0.3.0

### Features

* allow arguments for main and test binaries ([#12](https://github.com/hdevalke/rust-test-lens/issues/12))

### 0.2.1

#### Features

* multi root workspaces

#### Fixes

* make test fn regex non greedy 4fec4cd

## 0.2.0

- Support for multi root workspaces ([#7](https://github.com/hdevalke/rust-test-lens/issues/7))

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