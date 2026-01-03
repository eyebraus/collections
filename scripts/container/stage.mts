#!/usr/bin/env node --loader ts-node/esm

import { existsSync, lstatSync } from 'node:fs';
import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const fileDirectory = dirname(fileURLToPath(import.meta.url));
const [, , dest] = process.argv;
const destPath = resolve(fileDirectory, dest);
console.info(`destPath: ${destPath}`);

if (!existsSync(destPath) || !lstatSync(destPath).isDirectory()) {
    throw new Error(`Path ${destPath} is not a valid directory`);
}

console.info('Staging build outputs...');

const stageDirectory = async (dir: string): Promise<boolean> => {
    const source = resolve(fileDirectory, `../../${dir}`);

    if (!existsSync(source)) {
        return false;
    }

    const target = resolve(destPath, dir);
    console.info(`\tCopying ${source}/** -> ${target}`);
    await mkdir(target, { recursive: true });
    await cp(source, target, { force: true, recursive: true });
    console.info(`\tCopied ${source}/** -> ${target}`);

    return true;
};

const stageFile = async (file: string): Promise<boolean> => {
    const source = resolve(fileDirectory, `../../${file}`);

    if (!existsSync(source)) {
        return false;
    }

    const target = resolve(destPath, file);
    console.info(`\tCopying ${source} -> ${target}`);
    await mkdir(dirname(target), { recursive: true });
    await cp(source, target, { force: true });
    console.info(`\tCopied ${source} -> ${target}`);

    return true;
};

const [libStaged, specStaged, tsBuildInfoStaged] = await Promise.all([
    stageDirectory('lib'),
    stageDirectory('spec'),
    stageFile('tsconfig.tsbuildinfo'),
]);

if (!libStaged && !specStaged && !tsBuildInfoStaged) {
    console.info(`\tNo contents staged`);
}
