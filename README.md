# [@internationalized/date](https://www.npmjs.com/package/@internationalized/date) - Bikram Sambat Patch

This repository contains a patch for the [`@internationalized/date`](https://www.npmjs.com/package/@internationalized/date) package to add support for the Bikram Sambat (Nepali calendar) system.

## Overview

This patch extends the [`@internationalized/date`](https://www.npmjs.com/package/@internationalized/date) package (version 3.8.0) to include support for the Bikram Sambat calendar system, which is widely used in Nepal. The patch is designed to be applied to both the original build output and source code.

## Features

- Adds Bikram Sambat (Nepali calendar) support to [`@internationalized/date`](https://www.npmjs.com/package/@internationalized/date)
- Compatible with version 3.8.0 of the package
- Can be applied to both source code and build output

## Version Compatibility

| Patch Version | Package Version | Notes |
|---------------|-----------------|-------|
| 1.0.0         | 3.8.0           | ✅ Supported |

## Usage

1. Download the appropriate patch file from the `patches` directory based on your `@internationalized/date` version.

2. Add the patch to your project's `package.json`:

   ```json
   {
     "pnpm": {
       "patchedDependencies": {
         "@internationalized/date": "patches/@internationalized__date.patch"
       }
     }
   }
   ```

3. Run `pnpm install` to apply the patch.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

If you find any date conversion issues or inaccuracies in the Bikram Sambat calendar implementation, please create an issue with:

- The specific date(s) that are incorrect
- The expected conversion
- The actual conversion you're seeing

## License

This project is licensed under the same terms as the original [`@internationalized/date`](https://www.npmjs.com/package/@internationalized/date) package.

## Acknowledgments

- Original [`@internationalized/date`](https://www.npmjs.com/package/@internationalized/date) package by [Adobe](https://www.adobe.com/)
- [React Spectrum](https://react-spectrum.adobe.com/) team for their work on internationalization
