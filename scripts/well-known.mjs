import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { AGENT_CARD } from './agent-card.mjs';
import { API_CATALOG } from './api-catalog.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = 'dist/.well-known/agent-skills/milo-hands-free-ai-via-siri';
const skillPath = join(root, skillDir, 'SKILL.md');
const indexPath = join(root, 'dist/.well-known/agent-skills/index.json');
const agentCardPath = join(root, 'dist/.well-known/agent-card.json');
const apiCatalogPath = join(root, 'dist/.well-known/api-catalog');

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

// A2A Agent Card — canonical shape lives in scripts/agent-card.mjs (the card
// is generated rather than committed so skills stay in sync with the WebMCP
// tool set and version with package.json).
writeFileSync(agentCardPath, `${JSON.stringify(AGENT_CARD, null, 2)}\n`);
console.log(`well-known: wrote ${agentCardPath.split('/').slice(-2).join('/')}`);

// RFC 9727 API catalog — canonical linkset lives in scripts/api-catalog.mjs.
// Written extensionless on purpose: the well-known URI is literally
// /.well-known/api-catalog, and GitHub Pages resolves only real file paths.
// Pages answers it as application/octet-stream; the Cloudflare transform rule
// in scripts/api-catalog.mjs corrects the Content-Type at the edge.
writeFileSync(apiCatalogPath, `${JSON.stringify(API_CATALOG, null, 2)}\n`);
console.log(`well-known: wrote ${apiCatalogPath.split('/').slice(-2).join('/')}`);
