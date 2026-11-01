import React from "react";
import { CloseIcon } from "./Icons";

export default function Modal({ turn, isCorrect, modalRemover, solution }) {
  return (
    // clicking outside the card, the close button or "Next word" starts the next game
    <div className="modal-overlay" onClick={modalRemover}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="close"
          onClick={modalRemover}
        >
          <CloseIcon />
        </button>

        {isCorrect ? (
          <>
            <h2>Congratulations!</h2>
            <p>
              You found the word in {turn} {turn === 1 ? "guess" : "guesses"}.
            </p>
          </>
        ) : (
          <>
            <h2>Better luck next time</h2>
            <p>The word was</p>
          </>
        )}

        <div className="modal-word">
          {[...solution].map((letter, index) => {
            return <span key={index}>{letter}</span>;
          })}
        </div>

        <button type="button" className="modal-button" onClick={modalRemover}>
          Next word
        </button>
      </div>
    </div>
  );
}
