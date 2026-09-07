# File drop for DeepSeek Harness

## Workspace operations

The root is a development workspace; installable packages live under `packages/`. Run these root entries with prepared repository-local dependencies. `DSH_CHECKOUT` selects compatible Host source/declarations; profile operations also require explicit `DSH_HOME` and `DSH_PROFILE`.

| Root entry | Direct command from this repository | Effect |
| --- | --- | --- |
| `build` | `bash scripts/build.sh` | Build owned package artifacts. |
| `typecheck` | `bash scripts/typecheck.sh` | Check owned Host and Client programs. |
| `setup` | `bash scripts/setup.sh` | Inspect by default; append `--install` for installation. |
| `inspect` | `bash scripts/inspect.sh` | Inspect only. |
| `remove` | `bash scripts/remove.sh` | Inspect by default; append `--remove` for removal. |

Build, typecheck and existing tests call installed Node tools directly; they never install dependencies. Tool versions are TypeScript 5.9.3, tsdown 0.22.14 and Vitest 4.1.8, with pnpm 10.17.1 declared for explicit dependency preparation. Use independent dependency directories when reusing existing package contents. Installation and removal retain the existing `dsh plugin` transactions and never restart services. The `uninstall` alias, where present, has the same inspection default as `remove`.

Each repository and package keeps its own version: compatibility means satisfying declared API ranges, not equal version numbers. Optional cooperation does not make another feature a required dependency. Root and distributed package licenses are MIT, with their copyright notices retained.

`@dsh-external/dsh-file-drop` provides optional native browser file-drop routing. Chat and independently installed file managers consume the same region API; each consumer owns its intake policy and overlay. No sidebar, manager, user-files provider or attachment renderer is required by this plugin.

Read [STATE](.intent/state/STATE.md) for installation, Host adaptation and removal. The [package reference](packages/dsh-file-drop/README.md) owns the API; [LOG](.intent/LOG.md) records executed evidence.

```sh
DSH_CHECKOUT=/absolute/candidate/harness bash scripts/build.sh
DSH_CHECKOUT=/absolute/candidate/harness bash scripts/test.sh
DSH_CHECKOUT=/absolute/candidate/harness DSH_HOME=/absolute/private/home DSH_PROFILE=web bash scripts/setup.sh
```

Build and test call existing TypeScript, tsdown and Vitest entry files directly without automatic dependency installation. Setup and removal use the profile package transaction. None of these scripts restarts a service. Plugin tools come from this workspace; the explicit Host-adapter operation uses the selected Host tools. Prepare declared dependencies in this repository's own directories; never run a package manager through a shared `node_modules` symlink. Host declarations must match the adapter before building this plugin.

Setup inspects by default; `--install` applies the attributable adapter, builds affected Host/plugin artifacts and adds this Bundle through the Harness transaction. Removal also inspects by default; `--remove` removes the Bundle and reverses the exact owned Host contribution. Existing adapters under another receipt require explicit ownership transfer. A full removal restores the selected upstream baseline, including its original attachment drop behavior. Disabling the plugin while retaining the adapter leaves the optional drop seat empty.
