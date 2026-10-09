import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = 'dist/.well-known/agent-skills/milo-hands-free-ai-via-siri';
const skillPath = join(root, skillDir, 'SKILL.md');
const indexPath = join(root, 'dist/.well-known/agent-skills/index.json');

const skill = readFileSync(skillPath);
const digest = `sha256:${createHash('sha256').update(skill).digest('hex')}`;

const frontmatter = skill.toString('utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
const description = frontmatter?.[1].match(/^description:\s*(.+)$/m)?.[1].trim();

if (!description) {
  console.error(`well-known: no frontmatter description found in ${skillPath}`);
  process.exit(1);
}

const index = {
  $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
  skills: [
    {
      name: 'milo-hands-free-ai-via-siri',
      type: 'skill-md',
      description,
      url: 'https://askmilo.pro/.well-known/agent-skills/milo-hands-free-ai-via-siri/SKILL.md',
      digest,
    },
  ],
};

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
console.log(`well-known: wrote ${indexPath.split('/').slice(-3).join('/')} (digest ${digest})`);
