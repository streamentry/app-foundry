import { spawnSync } from 'node:child_process';

/** One independently compiled app per representative workflow, plus the 100-idea gallery.
 * Shared engine is typechecked/tested once; native JS entrypoints are generated from the same template. */
const workspaces=[
  '@foundry/idea-lab',
  '@foundry/idea-cash-float-count',
  '@foundry/idea-freelance-retainer-hours',
  '@foundry/idea-truck-pretrip',
  '@foundry/idea-knitting-row-counter',
  '@foundry/idea-home-filter-replacement',
];
for(const name of workspaces){
  console.log('=== iOS/Android export: '+name+' ===');
  const result=spawnSync('npm',['run','bundle','-w',name],{stdio:'inherit',shell:process.platform==='win32'});
  if(result.status!==0)process.exit(result.status??1);
}
console.log('Representative Idea Lab and native JS entrypoints exported successfully.');
