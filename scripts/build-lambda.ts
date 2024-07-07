import { build } from 'esbuild'

// build cm-crawler lambda
void build({
  platform: 'node',
  target: 'node20',
  bundle: true,
  minify: true,
  sourcemap: true,
  sourcesContent: false,
  entryPoints: [`cm-crawler/index.ts`],
  outfile: `dist/cm-crawler/index.js`,
  external: ['aws-sdk'],
})
