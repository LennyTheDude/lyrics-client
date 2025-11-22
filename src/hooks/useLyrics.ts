import { useState, type ChangeEvent } from "react"

export const useLyrics = () => {
  const [original, setOriginal] = useState<string[]>([])
  const [translation, setTranslation] = useState<string[]>([])

  const [activeLine, setActiveLine] = useState<number | null>(null)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  
  const updateOriginal = (event: ChangeEvent, index: number) => {
    const newOriginal = original;
    newOriginal[index] = event.target.innerHTML;
    setOriginal(newOriginal);
  }

  const updateTranslation = (event: ChangeEvent, index: number) => {
    const newTranslation = translation;
    newTranslation[index] = event.target.innerHTML;
    setTranslation(newTranslation);
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