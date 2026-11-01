import React from "react";
import { BackspaceIcon } from "./Icons";

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
];

export default function Keypad({ keys, onKey }) {
  const handleClick = (e, key) => {
    // drop focus so pressing Enter on the real keyboard doesn't click this button again
    e.currentTarget.blur();
    onKey(key);
  };

  return (
    <div className="keypad">
      {ROWS.map((row, rowIndex) => {
        return (
          <div className="keypad-row" key={rowIndex}>
            {rowIndex === 1 && <div className="keypad-spacer" />}
            {row.map((key) => {
              const isWide = key === "Enter" || key === "Backspace";
              let className = isWide ? "key wide" : "key";
              if (keys[key]) {
                className += " " + keys[key];
              }

              return (
                <button
                  type="button"
                  className={className}
                  key={key}
                  aria-label={key === "Backspace" ? "backspace" : undefined}
                  onClick={(e) => handleClick(e, key)}
                >
                  {key === "Backspace" ? <BackspaceIcon /> : key}
                </button>
              );
            })}
            {rowIndex === 1 && <div className="keypad-spacer" />}
          </div>
        );
      })}
    </div>
  );
}
