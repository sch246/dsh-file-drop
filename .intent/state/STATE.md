# File drop installation and maintenance map

## Intended behavior

One optional browser plugin routes native `Files` drags to the deepest registered live DOM region. A rejecting nested target blocks its ancestors. Only that target shows hover feedback and receives a dropped batch; files outside registered regions never enter Chat or a file manager. The provider may prevent browser file navigation outside targets while leaving text and internal-tab drags untouched. Registration removal, aborted drags and plugin disposal clear hover and owned listeners. Consumer callback failures reach its error handler, or the browser console when none is supplied.

The routing service owns no upload protocol, filesystem, directory, image policy or overlay. Chat's optional adapter occupies `conversation.input.fileDrop`, uses its localized labels, and forwards accepted batches through InputBar's image validation. The attachment renderer owns the draft rail and original-image preview. A manager may consume `ctx.fileDrop` without requiring it; the manager owns each target-group overlay, SVG, destination selection and upload operation. Disabling this plugin while retaining the Host adapter leaves the optional drop seat empty and preserves consumer features and ordinary paste/button input. Full adapter reversal restores the selected Host baseline, including its original attachment drop behavior.

## Locate and adapt

- [Public types](../../packages/dsh-file-drop/src/types.ts) define region callbacks and disposal. [Router](../../packages/dsh-file-drop/src/client/router.ts) owns browser events. [Chat adapter](../../packages/dsh-file-drop/src/client/ChatFileDrop.tsx) owns Chat hover presentation.
- [Package reference](../../packages/dsh-file-drop/README.md) owns package exports and exact runtime behavior. [Build](../../scripts/build.sh) writes only candidate artifacts; use direct existing compiler tools without package-manager auto-install.
- [Host patch](../../patches/deepseek-harness.patch) provides Conversation's optional file-drop seat, region id and localized owner props, and removes the attachment plugin's drop responsibility. [Receipt helper](../../scripts/host-patch.mjs) permits exact attributable application and reversal only. Use upstream equivalents where available; do not duplicate seats or native listeners.

Read the selected Host revision and dirty files, profile Bundle list, dependency resolution and all existing ownership receipts before maintenance. Build the selected Host declarations before this plugin. Preserve unrelated Host modifications and profile fields. Existing scoped Chat changes owned by another plugin require an explicit, hunk-reviewed transfer with preserved old receipts; reverse applicability alone is not ownership. Record that transfer in LOG, then issue this plugin's receipt for the full selected adapter.

## Install, verify and remove

Set `DSH_CHECKOUT` to the selected Harness checkout, `DSH_HOME` to the selected home and `DSH_PROFILE` to the profile name. `bash scripts/setup.sh` inspects by default. On a Host with none of this adapter, `bash scripts/setup.sh --install` applies the exact owned patch, builds this plugin, and uses the Harness plugin transaction to add its package. Build affected Host declarations and browser artifacts before activating the composition. For first install or Bundle changes, perform these steps in a private Home with the intended package set before touching a managed profile. Setup does not restart services.

After a profile transaction, `bash scripts/inspect.sh` checks the Bundle, dependency, lock entry and actual resolved target, and inspects Host patch ownership. On an independently started candidate composition, manually drag files over Chat, a manager target if present, and empty page space. Confirm one target overlay, target-specific intake, blocked-region refusal, text/tab drag preservation and clean removal. Simple gestures need no browser automation or performance comparison.

`bash scripts/remove.sh` inspects by default. `bash scripts/remove.sh --remove` removes the Bundle through the Harness plugin transaction and reverses only this receipt's exact Host adapter; it refuses drift or a declared required consumer. Rebuild affected Host artifacts and remove stale generated output before activating. Optional consumers retain their ordinary UI while the service is absent. Preserve receipts and source on any conflict, reconcile attribution, and retry the explicit operation. Installation on disk and accepted activation are separate facts recorded in [LOG](../LOG.md).
