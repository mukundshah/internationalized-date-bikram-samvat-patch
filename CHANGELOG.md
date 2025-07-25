# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1](./patches/@internationalized__date@3.8.2__1.2.1.patch) (2025-07-19)

### Chore

- Update `@internationalized/date` to version 3.8.2

## [1.2.0](./patches/@internationalized__date@3.8.1__1.2.0.patch) (2025-05-31)

### Fix

- Support for `nepali` calendar from locale string. You can now use locale strings like `en-u-ca-nepali` to specify the Bikram Sambat calendar system.

## [1.1.5](./patches/@internationalized__date@3.8.1__1.1.5.patch) (2025-05-24)

### Chore

- Update `@internationalized/date` to version 3.8.1

## [1.1.4](./patches/@internationalized__date@3.8.0__1.1.4.patch) (2025-05-16)

### Refactor

- Remove console logs from the codebase

## [1.1.3](./patches/@internationalized__date@3.8.0__1.1.3.patch) (2025-05-15)

### Performance Improvements

- Use array buffer for month data

## [1.1.2](./patches/@internationalized__date@3.8.0__1.1.2.patch) (2025-05-15)

### Performance Improvements

- Use Julian epoch instead of timestamp for date calculations

## [1.1.1](./patches/@internationalized__date@3.8.0__1.1.1.patch) (2025-05-15)

### Fixes

- Correct months data for 1970-1999

## [1.1.0](./patches/@internationalized__date@3.8.0__1.1.0.patch) (2025-05-14)

### Fixes

- Sync months data with [`nepali-datetime`](https://github.com/opensource-nepal/node-nepali-datetime)

## [1.0.0](./patches/@internationalized__date@3.8.0__1.0.0.patch) (2025-05-10)

### Added

- Initial release
- Added support for Bikram Sambat calendar system
- Compatible with [`@internationalized/date@3.8.0`](https://www.npmjs.com/package/@internationalized/date)
- Support for date formatting and parsing in Bikram Sambat
