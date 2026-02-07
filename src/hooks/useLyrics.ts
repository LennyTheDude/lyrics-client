import { useState } from "react"

export const useLyrics = () => {
  const [original, setOriginal] = useState<string[]>([])
  const [translation, setTranslation] = useState<string[]>([])

  const [activeLine, setActiveLine] = useState<number | null>(null)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  
  const updateOriginal = (index: number, plainText: string) => {
    const next = [...original]
    next[index] = plainText
    setOriginal(next)
  }

  const updateTranslation = (index: number, plainText: string) => {
    const next = [...translation]
    next[index] = plainText
    setTranslation(next)
  }

  const setupLyrics = (original: string[], translation: string[]) => {
    setOriginal(original)
    // const newTranslation = []
    // for (let i = 0; i < newOriginal.length; i++) {
    //   newTranslation.push('');
    // }
    setTranslation(translation)
  }

  return {
    original,
    updateOriginal,
    translation,
    updateTranslation,
    activeLine,
    setActiveLine,
    hoveredLine,
    setHoveredLine,
    setupLyrics,
  }
}