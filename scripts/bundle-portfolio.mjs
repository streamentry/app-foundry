import { spawnSync } from 'node:child_process';
const names = ["countdown-widget","medication-checklist","baby-feeding-log","plant-watering","pet-medication","mileage-log","warranty-tracker","cleaning-schedule","elderly-routine"];
for (const name of names) {
  console.log('=== Bundling ' + name + ' for iOS and Android ===');
  const result=spawnSync('npm',['run','bundle','-w','@foundry/'+name],{stdio:'inherit',shell:process.platform==='win32'});
  if (result.status!==0) {
    console.error('Bundle failed: '+name);
    process.exit(result.status??1);
  }
}
console.log('All 9 native JS bundles exported successfully.');
