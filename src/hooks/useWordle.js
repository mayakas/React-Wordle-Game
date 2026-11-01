import { useState } from "react";

const useWordle = (solution, onInvalid) => {
  //STATES
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([...Array(6)]);
  const [history, setHistory] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});

  //FORMATTING THE GUESS INTO AN OBJECT

  const formatGuess = () => {
    // console.log("Word formatting in Progress");
    const solutionArray = [...solution];
    const formattedGuess = [...currentGuess].map((letter) => {
      return { key: letter, color: "grey" };
    });

    //SET CORRECTLY PLACED LETTER COLOR TO GREEN
    formattedGuess.forEach((letter, i) => {
      if (letter.key === solutionArray[i]) {
        letter.color = "green";
        solutionArray[i] = null;
      }
    });

    //SET THE INCLUSIVE LETTER COLOR TO YELLOW

    formattedGuess.forEach((letter, i) => {
      if (solutionArray.includes(letter.key) && letter.color !== "green") {
        formattedGuess[i].color = "yellow";
        solutionArray[solutionArray.indexOf(letter.key)] = null;
      }
    });

    return formattedGuess;
  };

  //ADDING THE FORMATTED GUESS TO THE GUESSES ARRAT

  const addNewGuess = (formattedGuess) => {
    if (currentGuess === solution) {
      setIsCorrect(true);
    }

    setGuesses((prev) => {
      let newGuesses = [...prev];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });

    setHistory((prev) => {
      return [...prev, currentGuess];
    });

    setTurn((prev) => {
      return prev + 1;
    });

    setUsedKeys((prevUsedKeys) => {
      let newKeys = { ...prevUsedKeys };

      formattedGuess.forEach((letter) => {
        let currentColor = newKeys[letter.key];
        if (letter.color === "green") {
          newKeys[letter.key] = "green";
          return;
        }
        if (letter.color === "yellow" && currentColor !== "green") {
          newKeys[letter.key] = "yellow";
          return;
        }
        if (
          letter.color === "grey" &&
          currentColor !== "green" &&
          currentColor !== "yellow"
        ) {
          newKeys[letter.key] = "grey";
          return;
        }
      });

      return newKeys;
    });

    setCurrentGuess("");
  };

  console.log(guesses);

  // THE LOGIC THAT TAKE PLACE WHEN ENTER KEY IS PRESSED

  const handleKeyUp = ({ key }) => {
    if (key === "Enter") {
      //if the number of turn is not grater than 6
      if (turn > 5) {
        setCurrentGuess("");
        console.log("Guesses Depleted.");
        return;
      }
      //check for already typed guess
      if (history.includes(currentGuess)) {
        console.log("Word already guessed.");
        onInvalid("Already guessed");
        return;
      }
      //check for length of the word
      if (currentGuess.length !== 5) {
        console.log("Word should have 5 characters");
        onInvalid("Not enough letters");
        return;
      }

      let formatted = formatGuess();
      console.log(formatted);
      addNewGuess(formatted);
    }

    if (key === "Backspace" || key === "Delete") {
      //   console.log(key);
      setCurrentGuess((prev) => {
        return prev.slice(0, -1);
      });
      return;
    }
    // console.log(key);

    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => {
          return (prev + key).toLocaleLowerCase();
        });
      }
    }
  };

  return { turn, currentGuess, guesses, usedKeys, isCorrect, handleKeyUp };
};

export default useWordle;
