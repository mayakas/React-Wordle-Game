import React, { useEffect, useState } from "react";
import useWordle from "../hooks/useWordle";
import Grid from "./Grid";
import Keypad from "./Keypad";
import Modal from "./Modal";

// TIME FOR ALL 5 TILES TO FLIP (keep in sync with --reveal-time in index.css)
const REVEAL_TIME = 1700;
// HOW LONG THE WIN / LOSE MESSAGE SHOWS BEFORE THE MODAL OPENS
const END_MESSAGE_TIME = 1500;
// WIN MESSAGES FOR GETTING IT ON THE 1ST, 2ND ... 6TH GUESS
const WIN_MESSAGES = [
  "Genius",
  "Magnificent",
  "Impressive",
  "Splendid",
  "Great",
  "Phew",
];

export default function Wordle({ solution, onNextWord, paused }) {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [shake, setShake] = useState(false);

  // SHAKE THE ROW AND SHOW A SHORT MESSAGE WHEN A GUESS IS NOT ACCEPTED
  const showInvalid = (message) => {
    setToast({ message, duration: 1000 });
    setShake(true);
  };

  const { currentGuess, handleKeyUp, guesses, usedKeys, turn, isCorrect } =
    useWordle(solution, showInvalid);
  const isGameOver = isCorrect || turn > 5;
  const [keyColors, setKeyColors] = useState(usedKeys);

  // CLOSING THE MODAL MOVES ON TO THE NEXT WORD
  const modalRemover = () => {
    onNextWord();
  };

  // CLICKS ON THE ON-SCREEN KEYBOARD
  const handleKeyClick = (key) => {
    if (isGameOver || paused) {
      return;
    }
    handleKeyUp({ key });
  };

  // ONLY LISTEN FOR KEYS WHILE THE GAME IS STILL GOING (AND SETTINGS ARE CLOSED)
  useEffect(() => {
    if (isGameOver || paused) {
      return;
    }

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp, isGameOver, paused]);

  // COLOR THE KEYBOARD ONLY ONCE THE TILES HAVE FINISHED FLIPPING
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyColors(usedKeys);
    }, REVEAL_TIME);

    return () => {
      clearTimeout(timer);
    };
  }, [usedKeys]);

  // WHEN THE GAME ENDS: WAIT FOR THE TILES TO FLIP, SHOW A MESSAGE, THEN THE MODAL
  useEffect(() => {
    if (!isGameOver) {
      return;
    }

    if (isCorrect) {
      console.log("Congratulations You Won !!");
    } else {
      console.log("Opps! You Run out of Moves");
    }

    const message = isCorrect
      ? WIN_MESSAGES[turn - 1]
      : solution.toUpperCase();

    const toastTimer = setTimeout(() => {
      setToast({ message, duration: END_MESSAGE_TIME });
    }, REVEAL_TIME);

    const modalTimer = setTimeout(() => {
      setShowModal(true);
    }, REVEAL_TIME + END_MESSAGE_TIME);

    return () => {
      clearTimeout(toastTimer);
      clearTimeout(modalTimer);
    };
  }, [isGameOver, isCorrect, turn, solution]);

  // HIDE THE TOAST AFTER A MOMENT
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, toast.duration);

    return () => {
      clearTimeout(timer);
    };
  }, [toast]);

  // STOP SHAKING ONCE THE ANIMATION IS DONE
  useEffect(() => {
    if (!shake) {
      return;
    }

    const timer = setTimeout(() => {
      setShake(false);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [shake]);

  return (
    <main className="game">
      {toast && <div className="toast">{toast.message}</div>}
      <div className="board-container">
        <Grid
          currentGuess={currentGuess}
          guesses={guesses}
          turn={turn}
          shake={shake}
        />
      </div>
      <Keypad keys={keyColors} onKey={handleKeyClick} />
      {showModal && (
        <Modal
          turn={turn}
          modalRemover={modalRemover}
          isCorrect={isCorrect}
          solution={solution}
        />
      )}
    </main>
  );
}
