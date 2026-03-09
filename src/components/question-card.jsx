import { useState, useEffect } from 'react';
import questions from './questions.json';

function QuestionCard() {

  const [questionCount, setQuestionCount] = useState(0);
  const questionLimit = 10;

  function withBase(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

  
  const [gameStarted, setGameStarted] = useState(false);


  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function buildChoices(allQuestions, correctAnswer) {
  const wrongPool = [
    ...new Set(
      allQuestions
        .map((q) => q.answer)
        .filter((answer) => answer !== correctAnswer)
    ),
  ];

  const wrongChoices = shuffle(wrongPool).slice(0, 3);
  return shuffle([correctAnswer, ...wrongChoices]);
  }

  const [remainingQuestions, setRemainingQuestions] = useState (
      shuffle([...questions])
    )

  const [currentQuestion, setCurrentQuestion] = useState(remainingQuestions[0]);
  const [choices, setChoices] = useState(() =>
    buildChoices(questions, remainingQuestions[0].answer)
  );

  
  const [gameOver, setGameOver] = useState(false);

  const [feedback, setFeedback] = useState("");

    function playPromptAudio() {
    if (!currentQuestion?.promptAudio) return;
    const audio = new Audio(withBase(currentQuestion.promptAudio));
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.log("Autoplay blocked until user interacts:", err);
    });
  }

   useEffect(() => {
    if (!gameStarted) return;   // 👈 stop if still on start screen
    playPromptAudio();
}, [currentQuestion, gameStarted]);


  function nextQuestion() {
  if (questionCount + 1 >= questionLimit) {
    setGameOver(true);
    return;
  }

  setFeedback("");

  setRemainingQuestions((prev) => {
    const updated = prev.slice(1); // drop the one we just used
    const next = updated[0];

    setCurrentQuestion(next);
    setChoices(buildChoices(questions, next.answer));
    return updated;
  });

  setQuestionCount((prev) => prev + 1);
}



  function handleClickChoice(choice) {
    if (choice === currentQuestion.answer) {
      setFeedback("✅ Correct!");
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      setFeedback("❌ Try again!")
    }
  }

  

function resetGame() {
  const newDeck = shuffle([...questions]);

  setRemainingQuestions(newDeck);
  setCurrentQuestion(newDeck[0]);
  setChoices(buildChoices(questions, newDeck[0].answer));

  setGameOver(false);
  setQuestionCount(0);
  setFeedback("");

  setGameStarted(false); // go back to start screen
}



  if(!gameStarted) {
    return (
      <div className='question-card'>
        <img
  src={`assets/dino-start.png`}
  alt="start game"
  className="start-image"
  onClick={() => setGameStarted(true)}
  style={{ cursor: "pointer" }}
/>


        <h2>Tap to Start</h2>
      </div>
    )
  }

  if(gameOver) {
    return (
      <div className='question-card'>
        <h2 className='prompt'>Great Job!</h2>
        <p>You finished all 10 questions.</p>
        <button className='choice-button' onClick={resetGame}>
          Play Again
        </button>
      </div>
    )
  }

  

  return (
    <div className="question-card">
     

      {currentQuestion.promptImage && (
        <img
          src={withBase(currentQuestion.promptImage)}
          alt="prompt"
          className="prompt-image"
          onClick={playPromptAudio}
          style={{ cursor: "pointer"}}
        />
      )}

      <h2 className='prompt'>{currentQuestion.promptText}</h2>

      {feedback && <p className="feedback">{feedback}</p>}


      <div className="choices">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleClickChoice(choice)}
            className="choice-button"
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
