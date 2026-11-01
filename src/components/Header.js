import React from "react";
import { SettingsIcon } from "./Icons";

export default function Header({ onOpenSettings }) {
  const handleClick = (e) => {
    // drop focus so the next Enter press submits a guess instead of reopening settings
    e.currentTarget.blur();
    onOpenSettings();
  };

  return (
    <header className="header">
      <h1 className="title">Wordle</h1>
      <button
        type="button"
        className="header-button"
        aria-label="settings"
        onClick={handleClick}
      >
        <SettingsIcon />
      </button>
    </header>
  );
}
