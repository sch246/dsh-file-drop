import { defineConfig } from 'vitest/config'

export default defineConfig({ test: { include: ['packages/dsh-file-drop/tests/**/*.spec.ts'], environment: 'jsdom' } })
