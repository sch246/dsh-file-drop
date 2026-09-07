# File drop for DeepSeek Harness

`@dsh-external/dsh-file-drop` provides optional native browser file-drop routing. Chat and independently installed file managers consume the same region API; each consumer owns its intake policy and overlay. No sidebar, manager, user-files provider or attachment renderer is required by this plugin.

Read [STATE](.intent/state/STATE.md) for installation, Host adaptation and removal. The [package reference](packages/dsh-file-drop/README.md) owns the API; [LOG](.intent/LOG.md) records executed evidence.

```sh
DSH_CHECKOUT=/absolute/candidate/harness bash scripts/build.sh
DSH_CHECKOUT=/absolute/candidate/harness bash scripts/test.sh
DSH_CHECKOUT=/absolute/candidate/harness DSH_HOME=/absolute/private/home DSH_PROFILE=web bash scripts/setup.sh
```

Build and test call existing TypeScript, tsdown and Vitest entry files directly without automatic dependency installation. Setup and removal use the profile package transaction. None of these scripts restarts a service. `DSH_TOOL_ROOT` may select a separate prepared `node_modules` tool directory. Prepare declared dependencies in this repository's own directories; never run a package manager through a shared `node_modules` symlink. Host declarations must match the adapter before building this plugin.

Setup inspects by default; `--install` applies the attributable adapter, builds affected Host/plugin artifacts and adds this Bundle through the Harness transaction. Removal also inspects by default; `--remove` removes the Bundle and reverses the exact owned Host contribution. Existing adapters under another receipt require explicit ownership transfer. A full removal restores the selected upstream baseline, including its original attachment drop behavior. Disabling the plugin while retaining the adapter leaves the optional drop seat empty.
