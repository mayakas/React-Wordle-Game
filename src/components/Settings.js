import React, { useEffect } from "react";
import { CloseIcon } from "./Icons";

export default function Settings({ darkMode, onToggleDarkMode, onClose }) {
  // ESCAPE CLOSES THE PANEL
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal settings"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <h2 id="settings-title">Settings</h2>

        <div className="setting">
          <span className="setting-name" id="dark-theme-label">
            Dark Theme
          </span>
          <button
            type="button"
            role="switch"
            className="switch"
            aria-checked={darkMode}
            aria-labelledby="dark-theme-label"
            onClick={onToggleDarkMode}
          >
            <span className="knob" />
          </button>
        </div>
      </div>
    </div>
  );
}
