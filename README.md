# [@internationalized/date](https://www.npmjs.com/package/@internationalized/date) - Bikram Sambat Patch

A patch that adds Bikram Sambat (Nepali calendar) support to the [`@internationalized/date`](https://www.npmjs.com/package/@internationalized/date) package.

## Features

- ✅ Bikram Sambat calendar support
- ✅ Multiple package version compatibility
- ✅ Works with both source code and build output

## Version Compatibility

| Package Version | Latest Patch | Status |
|-----------------|--------------|--------|
| 3.12.4          | 1.6.4        | ✅ Latest |
| 3.12.3          | 1.6.3        | ✅ Supported |
| 3.12.2          | 1.6.2        | ✅ Supported |
| 3.12.1          | 1.6.1        | ✅ Supported |
| 3.12.0          | 1.6.0        | ✅ Supported |
| 3.11.0          | 1.5.0        | ✅ Supported |
| 3.10.1          | 1.4.1        | ✅ Supported |
| 3.10.0          | 1.4.0        | ✅ Supported |
| 3.9.0           | 1.3.1        | ✅ Supported |
| 3.8.2           | 1.2.1        | ✅ Supported |
| 3.8.1           | 1.2.0        | ✅ Supported |
| 3.8.0           | 1.1.4        | ✅ Supported |

## Supported Date Range

Month-length data is bundled for **BS 1970 – 2099**, roughly **1913-04-13 – 2043-04-13 AD**. Dates outside this range are not supported. The source data lives in [`scripts/generate-bikramsambat-monthlength.ts`](scripts/generate-bikramsambat-monthlength.ts#L10-L141).

## Quick Start

1. **Choose your patch**: Select the appropriate patch file from the `patches/` directory based on your `@internationalized/date` version (see compatibility table below).

2. **Configure pnpm**: Add the patch to your `package.json`:

   ```json
   {
     "pnpm": {
       "patchedDependencies": {
         "@internationalized/date": "patches/@internationalized__date@3.12.4__1.6.4.patch"
       }
     }
   }
   ```

3. **Apply the patch**: Run `pnpm install`

## Contributing

Found a bug? Please report date conversion issues with:

- Specific incorrect date(s)
- Expected vs actual conversion
- Your `@internationalized/date` version

## License

This project is licensed under the same terms as the original [`@internationalized/date`](https://www.npmjs.com/package/@internationalized/date) package.

## Acknowledgments

Built on the excellent [`@internationalized/date`](https://www.npmjs.com/package/@internationalized/date) package by [Adobe](https://www.adobe.com/) and the [React Spectrum](https://react-spectrum.adobe.com/) team.
