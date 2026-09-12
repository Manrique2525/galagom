"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";

const LINE_ONE = "Transporte que conecta,";
const LINE_TWO = "soluciones que impulsan.";
export const HERO_HEADLINE = `${LINE_ONE} ${LINE_TWO}`;
const CHAR_MS = 38;
const CURSOR_HOLD_MS = 700;

type Phase = "static" | "typing" | "done";

export default function TypewriterHeading() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("static");
  const [visible, setVisible] = useState(0);

  const lines = useMemo(() => [LINE_ONE, LINE_TWO], []);
  const lineChars = useMemo(() => lines.map((line) => Array.from(line)), [lines]);
  const total = useMemo(() => lineChars.reduce((sum, chars) => sum + chars.length, 0), [lineChars]);

  useLayoutEffect(() => {
    if (reduceMotion !== false) return;
    const start = window.setTimeout(() => {
      setPhase("typing");
      setVisible(0);
    }, 0);
    return () => window.clearTimeout(start);
  }, [reduceMotion]);

  useEffect(() => {
    if (phase !== "typing") return;
    let count = 0;
    let hold: number | undefined;
    const timer = window.setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= total) {
        window.clearInterval(timer);
        hold = window.setTimeout(() => setPhase("done"), CURSOR_HOLD_MS);
      }
    }, CHAR_MS);
    return () => {
      window.clearInterval(timer);
      if (hold) window.clearTimeout(hold);
    };
  }, [phase, total]);

  const cursorVisible = phase === "typing" || phase === "done";
  const cursorPosition = useMemo(() => {
    if (!cursorVisible) return null;
    if (visible <= lineChars[0].length) return { line: 0, index: visible };
    return { line: 1, index: visible - lineChars[0].length };
  }, [cursorVisible, visible, lineChars]);

  const isShown = (line: number, index: number) => {
    if (phase === "static") return true;
    const globalIndex = line === 0 ? index : lineChars[0].length + index;
    return globalIndex < visible;
  };

  return (
    <span aria-hidden="true" data-tw-state={phase} className="block">
      {lineChars.map((chars, line) => {
        let cursorRendered = false;
        return (
          <span key={line} className="block">
            {chars.map((char, index) => {
              const placeCursorHere = cursorPosition !== null && cursorPosition.line === line && cursorPosition.index === index && !cursorRendered;
              if (placeCursorHere) cursorRendered = true;
              return (
                <Fragment key={index}>
                  {placeCursorHere && <TypewriterCursor done={phase === "done"} />}
                  <span data-letter className="tw-char" style={phase === "static" ? undefined : { opacity: isShown(line, index) ? 1 : 0 }}>
                    {char}
                  </span>
                </Fragment>
              );
            })}
            {cursorPosition !== null && cursorPosition.line === line && cursorPosition.index === chars.length && <TypewriterCursor done={phase === "done"} />}
          </span>
        );
      })}
    </span>
  );
}

function TypewriterCursor({ done }: { done: boolean }) {
  return <span data-cursor aria-hidden="true" className={`tw-cursor${done ? " tw-cursor--done" : " tw-cursor--typing"}`} />;
}