#!/usr/bin/env node --loader ts-node/esm

import { run } from '../common/run.mjs';

const exitCode = await run('npm', ['run', 'test']);

if (exitCode !== 0) {
    throw new Error('Test failed');
}
