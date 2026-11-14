import {test} from 'node:test';
import assert from 'node:assert/strict';
import {visualIdentity,contrastRatio} from '../src/theme.ts';
import {ideaSpecs} from '../src/specs.ts';
test('all ten palettes render clear accessible light and dark text',()=>{
  for(const spec of ideaSpecs){
    const visual=visualIdentity(spec);
    for(const p of [visual.light,visual.dark]){
      for(const [a,b] of [['ink','canvas'],['ink','surface'],['muted','canvas'],['muted','surface'],['onAccent','accent'],['onTint','tint'],['accent','canvas']]){
        const ratio=contrastRatio(p[a],p[b]);
        assert.ok(ratio>=4.5,spec.slug+' '+a+'/'+b+' '+ratio.toFixed(2));
      }
    }
  }
});
