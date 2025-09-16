import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execSync('git ls-files -z', { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

const markers = ['<<<<<<<', '>>>>>>>'];
const offenders = [];

for (const file of files) {
  const contents = readFileSync(file, 'utf8');
  const found = markers.filter((marker) => contents.includes(marker));
  if (found.length > 0) {
    offenders.push({ file, markers: found });
  }
}

if (offenders.length > 0) {
  console.error('Conflict markers detected:');
  for (const { file, markers: found } of offenders) {
    console.error(`- ${file} -> ${found.join(', ')}`);
  }
  process.exit(1);
}

console.log('No merge conflict markers found.');
