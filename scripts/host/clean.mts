#!/usr/bin/env node --loader ts-node/esm

import { existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const fileDirectory = dirname(fileURLToPath(import.meta.url));

console.info('Cleaning...');

const libPath = resolve(fileDirectory, '../../lib');
const specPath = resolve(fileDirectory, '../../spec');
const tsBuildInfoPath = resolve(fileDirectory, '../../tsconfig.tsbuildinfo');

const libExists = existsSync(libPath);
const specExists = existsSync(specPath);
const tsBuildInfoExists = existsSync(tsBuildInfoPath);

if (!libExists && !specExists && !tsBuildInfoExists) {
    console.info('\tNo contents to clean; skipping');
}

if (libExists) {
    rmSync(libPath, { force: true, recursive: true });
    console.info('\tDeleted lib directory');
}

if (specExists) {
    rmSync(specPath, { force: true, recursive: true });
    console.info('\tDeleted spec directory');
}

if (tsBuildInfoExists) {
    rmSync(tsBuildInfoPath, { force: true });
    console.info('\tDeleted tsconfig.tsbuildinfo');
}
