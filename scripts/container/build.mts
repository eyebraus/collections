#!/usr/bin/env node --loader ts-node/esm

import { run } from '../common/run.mjs';

const exitCode = await run('npx', ['tsc', '--build', 'tsconfig.build.json']);

if (exitCode !== 0) {
    throw new Error('Build failed');
}
