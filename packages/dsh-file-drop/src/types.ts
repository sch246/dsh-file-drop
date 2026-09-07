/** Browser-native file-drop region registration; consumers own intake and presentation. */
/** Cordis context with this optional service declaration merged in. */
export type { Context } from '@deepseek-ai/cordis'

/** Hover state for the one deepest matching registered region. */
export interface FileDropHoverState {
  readonly active: boolean
  readonly accepted: boolean
}

/** A mounted target; callbacks read the consumer's current acceptance and intake state. */
export interface FileDropRegion {
  readonly element: HTMLElement
  readonly canAccept: () => boolean
  readonly onHover: (state: FileDropHoverState) => void
  readonly onDrop: (files: readonly File[]) => void | Promise<void>
  /** Receives callback failures; absent handlers report through the browser console. */
  readonly onError?: (error: unknown) => void
}

/** Shared native Files routing, independently consumed by Chat and optional file managers. */
export interface IFileDrop {
  /**
   * Register a live DOM target. Nested targets take precedence even when they reject a drop.
   * @param region Target and consumer-owned callbacks; one registration per element.
   * @returns Idempotent disposer that clears this region's active hover state.
   */
  registerRegion(region: FileDropRegion): () => void
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Optional browser-native Files routing provider. */
    fileDrop: IFileDrop
  }
}
