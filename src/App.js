import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Settings from "./components/Settings";
import Wordle from "./components/Wordle";

function App() {
  const [solution, setSolution] = useState(null);
  const [solutionArray, setSolutionArray] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  // the starting theme is picked by the script in public/index.html
  const [darkMode, setDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  // APPLY THE THEME TO THE PAGE (and the browser bar color on phones)
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", darkMode ? "#121213" : "#ffffff");
  }, [darkMode]);

  // FLIP THE THEME AND REMEMBER THE CHOICE FOR NEXT TIME
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    try {
      localStorage.setItem("wordle-theme", newDarkMode ? "dark" : "light");
    } catch (e) {
      // storage can be blocked (e.g. private browsing); the switch still works for this visit
    }
  };

  useEffect(() => {
    fetch("http://localhost:3001/solutions")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        let random = Math.floor(Math.random() * json.length);
        // console.log(json[random]);
        let obtainedArray = json;
        setSolutionArray(obtainedArray);
        setSolution(obtainedArray[random].word);
      });
  }, [setSolution]);

  // PICK A DIFFERENT RANDOM WORD FOR THE NEXT GAME
  const nextWord = () => {
    const others = solutionArray.filter((item) => item.word !== solution);
    let random = Math.floor(Math.random() * others.length);
    setSolution(others[random].word);
  };

  return (
    <div className="App">
      {/* <h1 className="wtitle">Wordle</h1> */}
      <Header onOpenSettings={() => setShowSettings(true)} />
      {/* key={solution} gives every new word a fresh board, guesses and keypad */}
      {solution && (
        <Wordle
          key={solution}
          solution={solution}
          arr={solutionArray}
          onNextWord={nextWord}
          paused={showSettings}
        />
      )}
      {showSettings && (
        <Settings
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;

/* 

data we need to track:
  -- solution
    -- 5 letter string, e.g. 'drain'
  -- past guesses
    -- an array of past guesses
    -- each past guess is an array of letter objects [{}, {}, {}, {}, {}]
    -- each object represents a letter in the guess word {letter: 'a', color: 'yellow'}
  -- current guess
    -- string 'hello'
  -- keypad letters
    -- array of letter objects [{key: 'a', color: 'green'}, {}, {} ...]
  -- number of turns
    -- an integer 0 - 6

game process:
  -- entering words:
    -- user enters a letter & a square is filled with that letter
    -- when a user hits delete it deletes the previous letter
    -- when a user hits enter it submits the word
      -- if all squares are not filled with letters then the word is not submitted
      -- if that word has already been used in a prev guess then the word is not submitted
  -- checking submitted words:
    -- each letter is checked to see if it matches to the solution
    -- each letter is assigned a color based on it's inclusion in the solution
      -- exact matches (correct position in the solution) are green
      -- partial matches (in the solution but not the correct position) are yellow
      -- none-matches (not in the solution at all) are grey
    -- the guess is added the grid with the correct colors
    -- the current guess moves to the next row
    -- the keypad letters are updated (colors)
  -- ending the game:
    -- when the guessed word fully matches the solution
      -- modal to say 'well done'
    -- when the user runs out of guesses
      -- modal to say 'unlucky'

*/
