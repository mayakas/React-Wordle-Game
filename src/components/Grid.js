import React from "react";
import Row from "./Row";

export default function Grid({ currentGuess, guesses, turn, shake }) {
  return (
    <div className="board">
      {guesses.map((guess, index) => {
        if (turn === index) {
          return <Row key={index} currentGuess={currentGuess} shake={shake} />;
        }
        return <Row key={index} guess={guess} />;
      })}
    </div>
  );
}
