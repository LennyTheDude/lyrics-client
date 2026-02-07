import { useRef, useEffect, type FormEvent, type ClipboardEvent, type KeyboardEvent } from "react";
import "./Lines.scss";

interface ILinesProps {
    lines: string[];
    editable: boolean;
    tag: string;
    hoveredLine: number | null;
    setHoveredLine: Function;
    activeLine?: number | null;
    setActiveLine?: Function;
    updateText?: (index: number, plainText: string) => void;
}

/** Get plain text from a contentEditable element (no HTML). */
function getPlainText(el: HTMLDivElement): string {
  return (el.innerText ?? el.textContent ?? "").trimEnd();
}

const Lines: React.FC<ILinesProps> = ({ lines, editable, tag, hoveredLine, setHoveredLine, activeLine, setActiveLine, updateText }) => {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // When a line becomes active, set its DOM content from state once (so we don't overwrite while typing).
  useEffect(() => {
    if (activeLine == null || !editable) return;
    const el = lineRefs.current[activeLine];
    if (el) el.textContent = lines[activeLine] ?? "";
  }, [activeLine, editable]);

  const handleInput = (e: FormEvent<HTMLDivElement>, index: number) => {
    if (!updateText) return;
    const plain = getPlainText(e.currentTarget);
    updateText(index, plain);
  }

  const handleBlur = (e: FormEvent<HTMLDivElement>, index: number) => {
    if (updateText) {
      const plain = getPlainText(e.currentTarget);
      updateText(index, plain);
    }
    setActiveLine?.(null);
  }

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  const isActive = (index: number) => editable && activeLine === index;

  return (
    <div id={tag} className="text-wrapper">
      {lines.map((line, index) => (
        <div
          key={`${tag}-line-${index}`}
          ref={(el) => { lineRefs.current[index] = el; }}
          contentEditable={editable}
          suppressContentEditableWarning={true}
          className={`line${activeLine == index ? ' activeLine' : ''}${hoveredLine == index ? ' hoveredLine' : ''}`}
          onFocus={setActiveLine ? () => setActiveLine(index) : undefined}
          onBlur={editable ? (e) => handleBlur(e, index) : undefined}
          onMouseEnter={() => setHoveredLine(index)}
          onMouseLeave={() => setHoveredLine(null)}
          onInput={(e) => handleInput(e, index)}
          onPaste={editable ? handlePaste : undefined}
          onKeyDown={editable ? handleKeyDown : undefined}
        >
          {isActive(index) ? null : line}
        </div>
      ))}
    </div>
  )
}

export default Lines;