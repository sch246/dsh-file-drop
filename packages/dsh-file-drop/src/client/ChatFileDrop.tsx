/** Optional Conversation adapter; InputBar retains image validation and localized copy. */
import { useEffect, useRef, useState } from 'react'
import type { ComposerFileDropProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { FileDropHoverState, IFileDrop } from '../types.ts'
import { DropOverlay } from './DropOverlay.tsx'

/** @param props Conversation owner state and the shared routing service. @returns Region-owned hover decoration. */
export function ChatFileDrop(props: ComposerFileDropProps & { fileDrop: IFileDrop }) {
  const current = useRef(props)
  current.current = props
  const [hover, setHover] = useState<FileDropHoverState>({ active: false, accepted: false })
  const [region, setRegion] = useState<HTMLElement | null>(null)
  useEffect(() => {
    if (props.dropRegionId === undefined) return
    const element = document.getElementById(props.dropRegionId)
    if (element === null) throw new Error('file-drop: Conversation drop region is missing')
    setRegion(element)
    return props.fileDrop.registerRegion({
      element,
      canAccept: () => current.current.canAcceptDrop,
      onHover: setHover,
      onDrop: files => current.current.onAddImages(files),
    })
  }, [props.fileDrop, props.dropRegionId])
  if (!hover.active || region === null) return null
  return <DropOverlay container={region} disabled={!props.canAcceptDrop} labels={props.labels} />
}
