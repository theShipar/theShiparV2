"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Cache storage for loaded audio buffers to prevent duplicate network requests and memory usage.
 * Maps audio URL to its decoded AudioBuffer.
 */
const audioCache = new Map<
  string,
  {
    buffer: AudioBuffer | null
    loading: Promise<AudioBuffer> | null
  }
>()

/**
 * Shared AudioContext instance to avoid creating multiple contexts.
 * Multiple AudioContexts can cause performance issues and resource exhaustion.
 */
let sharedAudioContext: AudioContext | null = null

/**
 * Gets or creates a shared AudioContext instance.
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (sharedAudioContext) return sharedAudioContext

  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext

  if (!AudioContextClass) {
    console.warn("Web Audio API is not supported in this browser.")
    return null
  }

  sharedAudioContext = new AudioContextClass()
  return sharedAudioContext
}

/**
 * Custom React hook to load and play a sound from a given URL using the Web Audio API.
 */
export function useSound(url: string) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)

  useEffect(() => {
    const audioCtx = getAudioContext()
    if (!audioCtx) return

    audioCtxRef.current = audioCtx

    // Check if already cached
    const cached = audioCache.get(url)
    if (cached?.buffer) {
      bufferRef.current = cached.buffer
      return
    }

    // Check if already loading
    if (cached?.loading) {
      cached.loading
        .then((decoded) => {
          bufferRef.current = decoded
        })
        .catch(() => {
          // Error already logged during fetch
        })
      return
    }

    // Start loading
    const loadingPromise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch sound: ${res.statusText}`)
        return res.arrayBuffer()
      })
      .then((data) => audioCtx.decodeAudioData(data))
      .then((decoded) => {
        audioCache.set(url, { buffer: decoded, loading: null })
        bufferRef.current = decoded
        return decoded
      })
      .catch((error) => {
        console.error(`Error loading sound from ${url}:`, error)
        audioCache.delete(url)
        throw error
      })

    audioCache.set(url, { buffer: null, loading: loadingPromise })
  }, [url])

  const play = useCallback((volume: number = 1) => {
    if (audioCtxRef.current && bufferRef.current) {
      const source = audioCtxRef.current.createBufferSource()
      const gainNode = audioCtxRef.current.createGain()

      source.buffer = bufferRef.current
      gainNode.gain.value = volume

      source.connect(gainNode)
      gainNode.connect(audioCtxRef.current.destination)
      source.start(0)
    }
  }, [])

  return play
}

/**
 * Custom React hook for lazy loading and playing sounds with manual preload control.
 */
export function useSoundLazy(url: string) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const loadingPromiseRef = useRef<Promise<AudioBuffer> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(() => {
    const cached = audioCache.get(url)
    return !!cached?.buffer
  })

  useEffect(() => {
    const audioCtx = getAudioContext()
    if (audioCtx) {
      audioCtxRef.current = audioCtx
    }

    const cached = audioCache.get(url)
    if (cached?.buffer) {
      bufferRef.current = cached.buffer
    }
  }, [url])

  const load = useCallback(async () => {
    if (bufferRef.current) return bufferRef.current
    if (loadingPromiseRef.current) return loadingPromiseRef.current

    const audioCtx = getAudioContext()
    if (!audioCtx) throw new Error("Web Audio API not supported")

    audioCtxRef.current = audioCtx

    const cached = audioCache.get(url)
    if (cached?.buffer) {
      bufferRef.current = cached.buffer
      setIsLoaded(true)
      return cached.buffer
    }

    if (cached?.loading) {
      setIsLoading(true)
      const promise = cached.loading
        .then((decoded) => {
          bufferRef.current = decoded
          setIsLoaded(true)
          return decoded
        })
        .finally(() => {
          setIsLoading(false)
          loadingPromiseRef.current = null
        })

      loadingPromiseRef.current = promise
      return promise
    }

    setIsLoading(true)
    const loadingPromise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch sound: ${res.statusText}`)
        return res.arrayBuffer()
      })
      .then((data) => audioCtx.decodeAudioData(data))
      .then((decoded) => {
        audioCache.set(url, { buffer: decoded, loading: null })
        bufferRef.current = decoded
        setIsLoaded(true)
        return decoded
      })
      .catch((error) => {
        console.error(`Error loading sound from ${url}:`, error)
        audioCache.delete(url)
        throw error
      })
      .finally(() => {
        setIsLoading(false)
        loadingPromiseRef.current = null
      })

    audioCache.set(url, { buffer: null, loading: loadingPromise })
    loadingPromiseRef.current = loadingPromise
    return loadingPromise
  }, [url])

  const play = useCallback(
    async (volume: number = 1) => {
      try {
        const buffer = await load()
        if (audioCtxRef.current && buffer) {
          const source = audioCtxRef.current.createBufferSource()
          const gainNode = audioCtxRef.current.createGain()

          source.buffer = buffer
          gainNode.gain.value = volume

          source.connect(gainNode)
          gainNode.connect(audioCtxRef.current.destination)
          source.start(0)
        }
      } catch {
        // Error already logged
      }
    },
    [load]
  )

  return { play, preload: load, isLoading, isLoaded }
}
