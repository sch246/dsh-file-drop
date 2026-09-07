/** Host entry for a browser-only Bundle; it contributes no Host service or file access. */
import type { Context } from '@deepseek-ai/cordis'

/** Loader-visible plugin identity. */
export const name = 'file-drop'

/** @param _ctx Host context; native drag routing belongs exclusively to the browser entry. */
export function apply(_ctx: Context): void {}
