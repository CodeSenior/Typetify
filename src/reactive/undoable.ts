/**
 * Undoable State - State management with undo/redo history
 * 
 * Perfect for editors, forms, and any UI that needs history.
 */

import { signal } from './signal'
import type { Signal } from './signal'

export interface UndoableState<T> {
  /** Current state value */
  value: Signal<T>
  /** Undo the last change */
  undo(): void
  /** Redo the last undone change */
  redo(): void
  /** Check if undo is available */
  canUndo(): boolean
  /** Check if redo is available */
  canRedo(): boolean
  /** Clear all history */
  clearHistory(): void
  /** Get history length */
  historyLength(): number
  /** Commit current state (creates a checkpoint) */
  commit(): void
}

export interface UndoableOptions {
  /** Maximum history size (default: 100) */
  maxHistory?: number
  /** Debounce commits in ms (default: 0 = no debounce) */
  debounce?: number
}

/**
 * Creates an undoable state with undo/redo capabilities.
 * 
 * @example
 * const state = createUndoableState({ count: 0, text: '' })
 * 
 * state.value.set({ count: 1, text: 'hello' })
 * state.commit()
 * 
 * state.value.set({ count: 2, text: 'world' })
 * state.commit()
 * 
 * console.log(state.value().count) // 2
 * 
 * state.undo()
 * console.log(state.value().count) // 1
 * 
 * state.redo()
 * console.log(state.value().count) // 2
 * 
 * @example
 * // With auto-commit on every change
 * const counter = createUndoableState(0)
 * 
 * counter.value.set(1)
 * counter.commit()
 * counter.value.set(2)
 * counter.commit()
 * 
 * counter.undo() // Back to 1
 * counter.undo() // Back to 0
 */
export function createUndoableState<T>(
  initialValue: T,
  options: UndoableOptions = {}
): UndoableState<T> {
  const { maxHistory = 100 } = options

  const value = signal<T>(initialValue)
  const history: T[] = [initialValue]
  let currentIndex = 0

  const canUndo = (): boolean => currentIndex > 0
  const canRedo = (): boolean => currentIndex < history.length - 1

  const undo = (): void => {
    if (canUndo()) {
      currentIndex--
      value.set(structuredClone(history[currentIndex]!))
    }
  }

  const redo = (): void => {
    if (canRedo()) {
      currentIndex++
      value.set(structuredClone(history[currentIndex]!))
    }
  }

  const commit = (): void => {
    const currentValue = value()
    
    // Don't commit if value hasn't changed
    if (currentIndex < history.length && 
        JSON.stringify(history[currentIndex]) === JSON.stringify(currentValue)) {
      return
    }

    // Remove any redo history
    history.splice(currentIndex + 1)
    
    // Add new state
    history.push(structuredClone(currentValue))
    currentIndex = history.length - 1

    // Trim history if too long
    if (history.length > maxHistory) {
      history.shift()
      currentIndex--
    }
  }

  const clearHistory = (): void => {
    const currentValue = value()
    history.length = 0
    history.push(structuredClone(currentValue))
    currentIndex = 0
  }

  const historyLength = (): number => history.length

  return {
    value,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    historyLength,
    commit,
  }
}

/**
 * Creates an undoable state that auto-commits on every change.
 * 
 * @example
 * const state = createAutoUndoableState({ name: '', age: 0 })
 * 
 * state.set({ name: 'John', age: 30 })
 * state.set({ name: 'Jane', age: 25 })
 * 
 * state.undo() // { name: 'John', age: 30 }
 * state.undo() // { name: '', age: 0 }
 */
export function createAutoUndoableState<T>(
  initialValue: T,
  options: UndoableOptions = {}
): {
  (): T
  set(value: T): void
  update(fn: (current: T) => T): void
  undo(): void
  redo(): void
  canUndo(): boolean
  canRedo(): boolean
} {
  const undoable = createUndoableState(initialValue, options)

  const read = (): T => undoable.value()

  read.set = (newValue: T): void => {
    undoable.value.set(newValue)
    undoable.commit()
  }

  read.update = (fn: (current: T) => T): void => {
    read.set(fn(undoable.value()))
  }

  read.undo = undoable.undo
  read.redo = undoable.redo
  read.canUndo = undoable.canUndo
  read.canRedo = undoable.canRedo

  return read
}
