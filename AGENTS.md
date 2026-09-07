<!-- meta-intent:entry:start -->
## Intent-package entry

Start with [STATE](.intent/state/STATE.md) and the user's request. STATE owns intended effects, resources, installation, adaptation and removal. [LOG](.intent/LOG.md) records selected decisions and executed evidence; an implementation gap does not change user intent. Inspect the target before adapting it, preserve unrelated ownership, and do not treat a candidate as an accepted installation.
<!-- meta-intent:entry:end -->

# File drop plugin

This repository owns native browser file-drop routing and its optional Chat adapter. File managers consume the service optionally and own their overlays and uploads. Do not make them dependencies of this plugin.

Use isolated candidate checkouts. Build with explicit `DSH_CHECKOUT`; setup and removal also require `DSH_HOME` and `DSH_PROFILE`. Never run package-manager commands against shared dependency symlinks. Build scripts invoke compiler tools directly and never install dependencies or restart services. Keep Host adapter changes attributable to `dsh-file-drop.patch-state`; automatic adoption of another owner's patch is forbidden.
