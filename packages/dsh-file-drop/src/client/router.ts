/** One document-level native Files dispatcher; overlays and intake belong to registered consumers. */
import type { FileDropRegion, IFileDrop } from '../types.ts'

/** Routes one drag to the deepest connected target and releases all owned listeners on disposal. */
export class FileDropRouter implements IFileDrop {
  readonly #regions = new Set<FileDropRegion>()
  #active: FileDropRegion | undefined
  #accepted = false
  #depth = 0
  #disposed = false

  /** @param document Browser document whose native Files events this instance owns. */
  constructor(private readonly document: Document) {
    document.addEventListener('dragenter', this.#enter, true)
    document.addEventListener('dragover', this.#over, true)
    document.addEventListener('dragleave', this.#leave, true)
    document.addEventListener('drop', this.#drop, true)
    document.defaultView?.addEventListener('dragend', this.#reset)
    document.defaultView?.addEventListener('blur', this.#reset)
  }

  registerRegion(region: FileDropRegion): () => void {
    if (this.#disposed) throw new Error('file-drop: router is disposed')
    if (region.element.ownerDocument !== this.document) throw new Error('file-drop: region belongs to another document')
    if ([...this.#regions].some(value => value.element === region.element)) throw new Error('file-drop: region already registered')
    this.#regions.add(region)
    return () => {
      this.#regions.delete(region)
      if (this.#active === region) this.#setActive(undefined)
    }
  }

  /** Remove listeners and clear every registered target without cancelling consumer-owned intake. */
  dispose(): void {
    if (this.#disposed) return
    this.#disposed = true
    this.document.removeEventListener('dragenter', this.#enter, true)
    this.document.removeEventListener('dragover', this.#over, true)
    this.document.removeEventListener('dragleave', this.#leave, true)
    this.document.removeEventListener('drop', this.#drop, true)
    this.document.defaultView?.removeEventListener('dragend', this.#reset)
    this.document.defaultView?.removeEventListener('blur', this.#reset)
    this.#reset()
    this.#regions.clear()
  }

  #report(region: FileDropRegion, error: unknown): void {
    if (region.onError === undefined) { console.error('file-drop: consumer callback failed', error); return }
    try { region.onError(error) } catch (failure) { console.error('file-drop: error callback failed', failure) }
  }

  #accepts(region: FileDropRegion): boolean {
    try { return region.canAccept() } catch (error) { this.#report(region, error); return false }
  }

  #hover(region: FileDropRegion, active: boolean, accepted: boolean): void {
    try { region.onHover({ active, accepted }) } catch (error) { this.#report(region, error) }
  }

  #setActive(region: FileDropRegion | undefined): void {
    const accepted = region === undefined ? false : this.#accepts(region)
    const previous = this.#active
    if (previous === region && this.#accepted === accepted) return
    this.#active = region
    this.#accepted = accepted
    if (previous !== undefined && previous !== region) this.#hover(previous, false, false)
    if (region !== undefined) this.#hover(region, true, accepted)
  }

  #select(path: readonly EventTarget[]): FileDropRegion | undefined {
    for (const target of path) {
      for (const region of this.#regions) {
        if (region.element === target && region.element.isConnected) return region
      }
    }
    return undefined
  }

  #files(event: DragEvent): DataTransfer | null {
    return event.dataTransfer?.types.includes('Files') === true ? event.dataTransfer : null
  }

  #route(event: DragEvent): DataTransfer | null {
    const transfer = this.#files(event)
    if (transfer === null) return null
    event.preventDefault()
    this.#setActive(this.#select(event.composedPath()))
    if (this.#active !== undefined) event.stopPropagation()
    transfer.dropEffect = this.#accepted ? 'copy' : 'none'
    return transfer
  }

  #enter = (event: DragEvent): void => {
    if (this.#route(event) !== null) this.#depth++
  }

  #over = (event: DragEvent): void => { this.#route(event) }

  #leave = (event: DragEvent): void => {
    if (this.#files(event) === null) return
    this.#depth = Math.max(0, this.#depth - 1)
    if (event.relatedTarget instanceof Node) {
      const path: Node[] = []
      for (let node: Node | null = event.relatedTarget; node !== null; node = node.parentNode) path.push(node)
      this.#setActive(this.#select(path))
    } else if (this.#depth === 0 || event.clientX < 0 || event.clientY < 0
      || event.clientX >= (this.document.defaultView?.innerWidth ?? Infinity)
      || event.clientY >= (this.document.defaultView?.innerHeight ?? Infinity)) this.#reset()
  }

  #drop = (event: DragEvent): void => {
    const transfer = this.#route(event)
    if (transfer === null) return
    const region = this.#active
    const accepted = this.#accepted
    const files = [...transfer.files]
    this.#reset()
    if (region === undefined || !accepted || files.length === 0) return
    try { void Promise.resolve(region.onDrop(files)).catch(error => this.#report(region, error)) }
    catch (error) { this.#report(region, error) }
  }

  #reset = (): void => {
    this.#depth = 0
    this.#setActive(undefined)
  }
}
