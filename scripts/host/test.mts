#!/usr/bin/env node --loader ts-node/esm

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { run } from '../common/run.mjs';

const fileDirectory = dirname(fileURLToPath(import.meta.url));

const { container, tag: tags } = yargs(hideBin(process.argv))
    .options({
        container: { alias: 'c', default: 'eyebraus.collections.test', type: 'string' },
        tag: { alias: 't', default: ['eyebraus.collections:local'], type: 'array' },
    })
    .parseSync();

const dockerContextDirectory = resolve(fileDirectory, '../..');
const dockerfile = resolve(fileDirectory, '../../dockerfile');
const privateNpmrc = resolve(process.env.HOME ?? '', '.npmrc');

// Extract GitHub access token from private .npmrc file
process.env.GITHUB_ACCESS_TOKEN = await readFile(privateNpmrc, 'utf8');

const buildExitCode = await run('docker', [
    'build',
    dockerContextDirectory,
    '--file',
    dockerfile,
    '--secret',
    'id=github-access-token,env=GITHUB_ACCESS_TOKEN',
    ...tags.flatMap((tag) => ['--tag', `${tag}`]),
    '--target',
    'test',
]);

if (buildExitCode !== 0) {
    throw new Error('Build failed');
}

const runExitCode = await run('docker', [
    'run',
    '--name',
    container,
    '--volume',
    `${dockerContextDirectory}:/dist`,
    `${tags[0]}`,
    'node --loader ts-node/esm /workspace/scripts/container/stage.mts /dist',
]);

await run('docker', ['container', 'rm', container]);

if (runExitCode !== 0) {
    throw new Error('Build failed');
}
