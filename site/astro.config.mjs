import { defineConfig, sessionDrivers } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://tiniapps.runlumi.app',
  output: 'server',
  trailingSlash: 'always',
  session: { driver: sessionDrivers.lruCache() },
  adapter: cloudflare({
    imageService: 'passthrough',
    prerenderEnvironment: 'node',
  }),
});
