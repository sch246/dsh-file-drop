/** Inspect exact profile ownership and use the Harness transaction for explicit add/remove requests. */
import { existsSync, lstatSync, readFileSync, realpathSync, unlinkSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'

const { DSH_CHECKOUT: checkout, DSH_HOME: home, DSH_PROFILE: profile } = process.env
if (!checkout || !home || !profile) throw new Error('file-drop: set DSH_CHECKOUT, DSH_HOME and DSH_PROFILE explicitly')
const mode = process.argv[2] ?? '--check'
if (!['--check', '--install', '--remove'].includes(mode)) throw new Error('file-drop: unknown profile operation')
const name = '@dsh-external/dsh-file-drop'
const target = realpathSync(new URL('../packages/dsh-file-drop', import.meta.url))
const directory = join(home, 'profiles', profile)
const manifestPath = join(directory, 'package.json')
const installedPath = join(directory, 'node_modules', name)
const require = createRequire(join(checkout, 'apps/cli/package.json'))
const { load, DEFAULT_SCHEMA, Type } = require('js-yaml')
const schema = DEFAULT_SCHEMA.extend([new Type('tag:yaml.org,2002:js', { kind: 'scalar', construct: value => value })])
const cli = (...args) => execFileSync(process.execPath, ['--import', 'tsx/esm', 'apps/cli/src/bin.ts', ...args], {
  cwd: checkout, env: process.env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 8 * 1024 * 1024,
})
function inspect() {
  if (!existsSync(manifestPath)) return { present: false, manifest: {} }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const dependency = manifest.dependencies?.[name]
  const lockPath = join(directory, 'pnpm-lock.yaml')
  const locked = existsSync(lockPath) ? load(readFileSync(lockPath, 'utf8'))?.importers?.['.']?.dependencies?.[name] : undefined
  const bundles = (manifest.dsh?.profile?.bundles ?? []).filter(value => value === name).length
  const installed = lstatSync(installedPath, { throwIfNoEntry: false })
  if (dependency === undefined) {
    if (locked !== undefined || bundles !== 0 || installed !== undefined) throw new Error('file-drop: undeclared installation, lock entry or Bundle remains')
  } else {
    if (locked?.specifier !== dependency || bundles !== 1 || installed === undefined
      || realpathSync(installedPath) !== target) throw new Error('file-drop: profile dependency, lock, Bundle and target disagree')
    if (locked.version.startsWith('link:') && realpathSync(resolve(directory, locked.version.slice(5))) !== target) {
      throw new Error('file-drop: lock points to another checkout')
    }
    cli('plugin', '--profile', profile, 'why', name)
  }
  const tree = load(cli('--profile', profile, '--dump-config'), { schema })
  const rows = entries => entries.flatMap(entry => [entry, ...(entry.group && Array.isArray(entry.config) ? rows(entry.config) : [])])
  if (rows(tree).filter(entry => entry.name === name).length !== Number(dependency !== undefined)) {
    throw new Error('file-drop: effective plugin composition disagrees with installation')
  }
  return { present: dependency !== undefined, manifest }
}
const current = inspect()
if (mode === '--install' && !current.present) cli('plugin', '--profile', profile, 'add', target)
if (mode === '--remove' && current.present) {
  for (const consumer of Object.keys(current.manifest.dependencies ?? {})) {
    if (consumer === name) continue
    const path = join(directory, 'node_modules', consumer, 'package.json')
    if (!existsSync(path)) throw new Error(`file-drop: cannot inspect consumer ${consumer}`)
    const manifest = JSON.parse(readFileSync(path, 'utf8'))
    if (manifest.dependencies?.[name] !== undefined
      || manifest.peerDependencies?.[name] !== undefined && manifest.peerDependenciesMeta?.[name]?.optional !== true) {
      throw new Error(`file-drop: ${consumer} requires this provider`)
    }
  }
  cli('plugin', '--profile', profile, 'remove', name)
  // Some package managers retain local links after the dependency transaction.
  const residue = lstatSync(installedPath, { throwIfNoEntry: false })
  if (residue?.isSymbolicLink() && realpathSync(installedPath) === target) unlinkSync(installedPath)
}
const result = mode === '--check' ? current : inspect()
if (mode === '--install' && !result.present || mode === '--remove' && result.present) throw new Error('file-drop: profile transaction did not settle')
console.log(`file-drop: ${result.present ? 'installed with matching dependency, lock, target, Bundle and composition' : 'absent from the profile'}`)
