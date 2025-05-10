#!/bin/bash

# Exit on error and print commands
set -e -x

# Check if required commands are installed
for cmd in jq rsync yarn pnpm; do
    if ! command -v $cmd &> /dev/null; then
        echo "$cmd could not be found. Please install it."
        exit 1
    fi
done

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

# Copy patch.json and modified-files to temp dir
cp patch.json "$TEMP_DIR/"
cp -r modified-files "$TEMP_DIR/"

# Change to temp directory
cd "$TEMP_DIR"

# Get version from patch.json
patch_version=$(jq -r '.upstreamVersion' patch.json)

# Clone and setup react-spectrum
git clone --depth 1 --branch "@internationalized/date@$patch_version" https://github.com/adobe/react-spectrum.git
cd react-spectrum
rm -rf .nvmrc

# Install dependencies
yarn install

# Add node_modules/.bin to PATH
export PATH="$PWD/node_modules/.bin:$PATH"

# Copy modified files
rsync -av ../modified-files/ packages/@internationalized/date/

# Build packages
parcel build packages/@internationalized/{message,string,date,number}/ --no-optimize --config .parcelrc-build
for pkg in packages/@internationalized/{message,string,date,number}/; do
    node scripts/buildEsm.js "$pkg"
done
node scripts/buildI18n.js
node scripts/generateIconDts.js

# Setup patched package
cd ..
mkdir patched-packages
cd patched-packages
pnpm init
pnpm install "@internationalized/date@$patch_version"

mkdir -p @internationalized/date
pnpm patch @internationalized/date --edit-dir @internationalized/date

# Copy built files
rsync -av ../react-spectrum/packages/@internationalized/date/dist/ @internationalized/date/dist/
rsync -av ../react-spectrum/packages/@internationalized/date/src/ @internationalized/date/src/

# Create and copy patch
pnpm patch-commit "$(pwd)/@internationalized/date"

PATCH_FILE="@internationalized_date_${patch_version}.patch"
mkdir -p "$OLDPWD/patches"
cp patches/@internationalized__date.patch "$OLDPWD/patches/$PATCH_FILE"

echo "Patch file created at patches/$PATCH_FILE"
