import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const requested=process.argv[2]??'';
const ideas=JSON.parse(readFileSync('docs/ideas/ideas.json','utf8')).ideas;
if(!ideas.some(idea=>idea.slug===requested)){
  console.error('Usage: npm run idea:start -- <slug> (see docs/ideas/ideas.json)');
  process.exit(2);
}
const result=spawnSync('npm',['run','start','-w','@foundry/idea-'+requested],{
  stdio:'inherit',shell:process.platform==='win32',
});
process.exit(result.status??1);
