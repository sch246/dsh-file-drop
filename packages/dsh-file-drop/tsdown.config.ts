import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { transform } from 'lightningcss'
import type { UserConfig } from 'tsdown'

export default [
  { entry: ['lib/types/index.js'], outDir: 'lib', format: 'esm', platform: 'node', fixedExtension: false, dts: false, clean: false },
  {
    entry: { client: 'src/client/index.ts' }, outDir: 'lib', format: 'cjs', platform: 'browser',
    dts: false, sourcemap: true, clean: false,
    deps: { neverBundle: ['@deepseek-ai/cordis', 'react', 'react-dom', 'react/jsx-runtime'] },
    plugins: [{
      name: 'file-drop-styles',
      resolveId(source, importer) {
        if (!source.endsWith('.css?inline') || importer === undefined) return null
        return '\0file-drop-css:' + resolve(dirname(importer), source.slice(0, -7)) + '.mjs'
      },
      async load(id) {
        if (!id.startsWith('\0file-drop-css:')) return null
        const filename = id.slice('\0file-drop-css:'.length, -4)
        const { code } = transform({ filename, code: await readFile(filename), minify: true })
        return `export default ${JSON.stringify(code.toString())};`
      },
    }],
    outputOptions: {
      entryFileNames: 'client.js',
      banner: 'window.__ModuleLoader__.load({ id: "@dsh-external/dsh-file-drop", factory: (require) => {',
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
  },
] satisfies UserConfig[]
