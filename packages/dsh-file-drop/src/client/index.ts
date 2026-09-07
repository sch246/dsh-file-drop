/** Native Files routing provider and optional Conversation slot adapter. */
import { createElement } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { ComposerFileDropProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import { ChatFileDrop } from './ChatFileDrop.tsx'
import { FileDropRouter } from './router.ts'
import stylesheet from './DropOverlay.css?inline'
export type { IFileDrop, FileDropRegion, FileDropHoverState } from '../types.ts'

/** @param ctx Browser context; the optional slot subscription does not block service activation. */
export function apply(ctx: Context): void {
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = '@dsh-external/dsh-file-drop'
    style.textContent = stylesheet
    document.head.append(style)
    return () => style.remove()
  })
  const router = new FileDropRouter(document)
  ctx.effect(() => () => router.dispose())
  ctx.provide('fileDrop', router)
  ctx.inject(['slots'], ctx => {
    ctx.slots.inject('conversation.input.fileDrop', () => ctx.slots.register({
      name: 'conversation.input.fileDrop',
    }, (props: ComposerFileDropProps) => createElement(ChatFileDrop, { ...props, fileDrop: router })))
  })
}
