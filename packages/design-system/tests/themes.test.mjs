import assert from 'node:assert/strict';
import { test } from 'node:test';
import { brandThemes, contrastRatio, FOUNDATIONS, getBrandTheme, getPalette } from '../src/index.ts';

const requiredPairs = [['ink','canvas'], ['muted','canvas'], ['ink','surface'], ['muted','surface'], ['onAccent','accent'], ['onTint','tint'], ['accent','canvas']];

test('all ten unique product profiles are accessible and discoverable', () => {
  assert.equal(brandThemes.length, 10);
  assert.equal(new Set(brandThemes.map((theme) => theme.id)).size, 10);
  assert.equal(new Set(brandThemes.map((theme) => theme.hero)).size, 10);
  for (const theme of brandThemes) {
    assert.equal(getBrandTheme(theme.id), theme);
    assert.ok(theme.typography.bodySize >= FOUNDATIONS.minBodyFontSize);
    assert.ok(theme.copy.headline && theme.copy.primaryAction);
    assert.ok(theme.layout && theme.motion && theme.avoid);
    for (const mode of ['light', 'dark']) {
      const palette = getPalette(theme, mode);
      for (const [foreground, background] of requiredPairs) {
        const score = contrastRatio(palette[foreground], palette[background]);
        assert.ok(score >= 4.5, `${theme.id}/${mode}: ${foreground} on ${background} ${score.toFixed(2)}`);
      }
    }
  }
});

test('themes have different hero compositions, not only different colors', () => {
  assert.equal(new Set(brandThemes.map((theme) => theme.archetype)).size, 10);
  assert.ok(new Set(brandThemes.map((theme) => theme.shape.cardRadius)).size >= 6);
  assert.ok(new Set(brandThemes.map((theme) => theme.typography.family)).size >= 2);
});

test('contrast validator rejects invalid colors and recognizes extremes', () => {
  assert.equal(contrastRatio('#000000', '#FFFFFF'), 21);
  assert.throws(() => contrastRatio('#F00', '#FFFFFF'), TypeError);
});
