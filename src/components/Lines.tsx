import type { FormEvent } from "react";
import "./Lines.scss";

interface ILinesProps {
    lines: string[];
    editable: boolean;
    tag: string;
    hoveredLine: number | null;
    setHoveredLine: Function;
    activeLine?: number | null;
    setActiveLine?: Function;
    updateText?: Function;
}

const Lines: React.FC<ILinesProps> = ({ lines, editable, tag, hoveredLine, setHoveredLine, activeLine, setActiveLine, updateText }) => {
  const handleInput = (e: FormEvent<HTMLDivElement>, index: number) => {
    if (!updateText) return;
    updateText(e, index)
  }

  return (
    <div id={tag} className="text-wrapper">
      {lines.map((line, index) => {
        return (
          <div
            key={`${tag}-line-${index}`}
            contentEditable={editable}
            suppressContentEditableWarning={true}
            className={`line${activeLine == index ? ' activeLine' : ''}${hoveredLine == index ? ' hoveredLine' : ''}`}
            onFocus={setActiveLine && (() => setActiveLine(index))}
            onMouseEnter={() => setHoveredLine(index)}
            onMouseLeave={() => setHoveredLine(null)}
            onInput={(e) => handleInput(e, index)}
          >{line}</div>
        )
      })}
    </div>
  )

}

export default Lines;