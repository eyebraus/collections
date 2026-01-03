import { spawn } from 'node:child_process';

type RunOptions = {
    cwd?: string;
};

export const run = (cmd: string, args: string[], opts?: RunOptions): Promise<number> =>
    new Promise<number>((resolve, reject) => {
        const proc = spawn(cmd, args, opts);

        proc.on('close', (code) => {
            resolve(code ?? 0);
        });

        proc.on('error', (err) => {
            reject(err);
        });

        proc.stderr.on('data', (data) => {
            console.error(`${data}`);
        });

        proc.stdout.on('data', (data) => {
            console.info(`${data}`);
        });
    });
