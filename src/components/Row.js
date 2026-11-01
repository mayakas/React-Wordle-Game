import React from "react";

export default function Row({ guess, currentGuess, shake }) {
  // A SUBMITTED GUESS: COLORED TILES THAT FLIP OVER ONE BY ONE
  if (guess) {
    const isWin = guess.every((letter) => letter.color === "green");

    return (
      <div className={isWin ? "row win" : "row"}>
        {guess.map((letter, index) => {
          return (
            <div
              className={`tile ${letter.color}`}
              style={{ "--i": index }}
              key={index}
            >
              {letter.key}
            </div>
          );
        })}
      </div>
    );
  }

  // THE ROW BEING TYPED IN, OR AN EMPTY ROW
  const letters = currentGuess ? currentGuess.split("") : [];

  return (
    <div className={shake ? "row shake" : "row"}>
      {[...Array(5)].map((v, index) => {
        return (
          <div className={letters[index] ? "tile filled" : "tile"} key={index}>
            {letters[index]}
          </div>
        );
      })}
    </div>
  );
}
