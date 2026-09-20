import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'vanilla');
const output = join(root, 'dist');

execFileSync(process.execPath, [join(source, 'build-data.mjs')], { cwd: root, stdio: 'inherit' });
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const file of ['index.html', 'style.css', 'app.js', 'data.js']) {
  cpSync(join(source, file), join(output, file));
}
cpSync(join(source, 'images'), join(output, 'images'), { recursive: true });
console.log('Vanilla site built in dist/');
