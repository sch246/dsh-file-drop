import { afterEach, expect, it, vi } from 'vitest'
import { FileDropRouter } from '../src/client/router.ts'

const owners: FileDropRouter[] = []
afterEach(() => { owners.splice(0).forEach(owner => owner.dispose()); document.body.replaceChildren() })
function router(): FileDropRouter { const value = new FileDropRouter(document); owners.push(value); return value }
function region(parent: HTMLElement = document.body): HTMLDivElement {
  const element = document.createElement('div'); parent.append(element); return element
}
function drag(target: EventTarget, type: string, types = ['Files'], extra = {}) {
  const file = new File(['hello'], 'file.txt')
  const transfer = { types, files: [file], dropEffect: 'none' }
  const event = new Event(type, { bubbles: true, cancelable: true, composed: true })
  Object.defineProperties(event, Object.fromEntries(Object.entries({ dataTransfer: transfer, clientX: 10, clientY: 10, ...extra })
    .map(([key, value]) => [key, { value }])))
  target.dispatchEvent(event)
  return { event, transfer, file }
}

it('routes only to the deepest live region, including a rejecting nested target', () => {
  const owner = router(); const outer = region(); const inner = region(outer)
  const outerDrop = vi.fn(); const innerDrop = vi.fn(); const outerHover = vi.fn(); const innerHover = vi.fn()
  owner.registerRegion({ element: outer, canAccept: () => true, onHover: outerHover, onDrop: outerDrop })
  let accepted = false
  owner.registerRegion({ element: inner, canAccept: () => accepted, onHover: innerHover, onDrop: innerDrop })
  drag(outer, 'dragenter')
  expect(outerHover).toHaveBeenLastCalledWith({ active: true, accepted: true })
  expect(drag(inner, 'dragover').transfer.dropEffect).toBe('none')
  expect(outerHover).toHaveBeenLastCalledWith({ active: false, accepted: false })
  expect(innerHover).toHaveBeenLastCalledWith({ active: true, accepted: false })
  drag(inner, 'drop')
  expect(innerDrop).not.toHaveBeenCalled(); expect(outerDrop).not.toHaveBeenCalled()
  accepted = true
  const { file } = drag(inner, 'drop')
  expect(innerDrop).toHaveBeenCalledExactlyOnceWith([file]); expect(outerDrop).not.toHaveBeenCalled()
  inner.remove()
  drag(outer, 'drop')
  expect(outerDrop).toHaveBeenCalledOnce()
})

it('suppresses native file navigation outside regions without intake, preserving text and tab drags', () => {
  const owner = router(); const element = region(); const onDrop = vi.fn(); const onHover = vi.fn()
  owner.registerRegion({ element, canAccept: () => true, onHover, onDrop })
  expect(drag(document.body, 'drop').event.defaultPrevented).toBe(true)
  expect(onDrop).not.toHaveBeenCalled(); expect(onHover).not.toHaveBeenCalled()
  for (const types of [['text/plain'], ['application/x-dsh-tab']]) {
    expect(drag(element, 'dragover', types).event.defaultPrevented).toBe(false)
    expect(drag(element, 'drop', types).event.defaultPrevented).toBe(false)
  }
  expect(onDrop).not.toHaveBeenCalled(); expect(onHover).not.toHaveBeenCalled()
})

it('clears hover on region removal, viewport exit and disposal and releases document listeners', () => {
  const owner = router(); const element = region(); const onHover = vi.fn()
  const remove = owner.registerRegion({ element, canAccept: () => true, onHover, onDrop: vi.fn() })
  drag(element, 'dragenter'); drag(element, 'dragenter')
  drag(element, 'dragleave')
  expect(onHover).toHaveBeenLastCalledWith({ active: true, accepted: true })
  drag(element, 'dragleave', ['Files'], { clientX: -1 })
  expect(onHover).toHaveBeenLastCalledWith({ active: false, accepted: false })
  drag(element, 'dragenter'); remove(); remove()
  expect(onHover).toHaveBeenLastCalledWith({ active: false, accepted: false })
  owner.registerRegion({ element, canAccept: () => true, onHover, onDrop: vi.fn() })
  drag(element, 'dragenter'); window.dispatchEvent(new Event('dragend'))
  expect(onHover).toHaveBeenLastCalledWith({ active: false, accepted: false })
  drag(element, 'dragenter'); owner.dispose()
  expect(onHover).toHaveBeenLastCalledWith({ active: false, accepted: false })
  expect(drag(element, 'drop').event.defaultPrevented).toBe(false)
})

it('reports rejected intake callbacks and preserves later routing', async () => {
  const owner = router(); const element = region(); const onError = vi.fn(); const onDrop = vi.fn()
    .mockRejectedValueOnce(new Error('upload failed')).mockResolvedValue(undefined)
  owner.registerRegion({ element, canAccept: () => true, onHover: () => {}, onDrop, onError })
  drag(element, 'drop'); await Promise.resolve()
  expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'upload failed' }))
  drag(element, 'drop'); expect(onDrop).toHaveBeenCalledTimes(2)
})
