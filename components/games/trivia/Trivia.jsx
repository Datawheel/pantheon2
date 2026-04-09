"use client";
import {useEffect, useMemo, useReducer, useRef, useState} from "react";
import {useParams, usePathname} from "next/navigation";
import {v4 as uuidv4} from "uuid";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
import ModeSelector from "./ModeSelector";
import DifficultySelector from "./DifficultySelector";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import AnswerGrid from "./AnswerGrid";
import TimerBar from "./TimerBar";
import PersonReveal from "./PersonReveal";
import ScoreSummary from "./ScoreSummary";
import ResultsReview from "./ResultsReview";
import {gameNumber as calcGameNumber, todayDateStr} from "/lib/trivia/seedRandom";
import "./Trivia.css";

const TIME_PER_QUESTION = 20;

// State machine phases
const PHASE = {
  MODE_SELECT: "MODE_SELECT",
  DIFFICULTY_SELECT: "DIFFICULTY_SELECT",
  LOADING: "LOADING",
  PLAYING: "PLAYING",
  ANSWER_REVEAL: "ANSWER_REVEAL",
  RESULTS: "RESULTS",
};

const initialState = {
  phase: PHASE.MODE_SELECT,
  mode: null, // "daily" | "practice"
  difficulty: "mixed",
  questions: [],
  currentIndex: 0,
  selectedIndex: null,
  answers: [], // {selectedIndex, correct, score, timeLeft}
  timeLeft: TIME_PER_QUESTION,
  totalScore: 0,
  streak: 0,
  dailyPlayed: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_MODE":
      if (action.mode === "daily") {
        return {...state, phase: PHASE.LOADING, mode: "daily", difficulty: "mixed"};
      }
      return {...state, phase: PHASE.DIFFICULTY_SELECT, mode: "practice"};

    case "SELECT_DIFFICULTY":
      return {...state, phase: PHASE.LOADING, difficulty: action.difficulty};

    case "BACK_TO_MODE":
      return {...state, phase: PHASE.MODE_SELECT, mode: null};

    case "QUESTIONS_LOADED":
      return {
        ...state,
        phase: PHASE.PLAYING,
        questions: action.questions,
        currentIndex: 0,
        selectedIndex: null,
        answers: [],
        timeLeft: TIME_PER_QUESTION,
        totalScore: 0,
        error: null,
      };

    case "LOAD_ERROR":
      return {...state, phase: PHASE.MODE_SELECT, error: action.error};

    case "SELECT_ANSWER":
      if (state.phase !== PHASE.PLAYING) return state;
      return {...state, selectedIndex: action.index};

    case "CONFIRM_ANSWER": {
      const q = state.questions[state.currentIndex];
      const correct = state.selectedIndex === q.correctIndex;
      const timeLeft = state.timeLeft;
      let pts = 0;
      if (correct) {
        if (timeLeft > 10) pts = 100;
        else if (timeLeft > 5) pts = 75;
        else if (timeLeft > 0) pts = 50;
        else pts = 25;
      }
      const answer = {
        selectedIndex: state.selectedIndex,
        correct,
        score: pts,
        timeLeft,
      };
      return {
        ...state,
        phase: PHASE.ANSWER_REVEAL,
        answers: [...state.answers, answer],
        totalScore: state.totalScore + pts,
      };
    }

    case "TIMEOUT": {
      // Auto-submit with no selection
      const q = state.questions[state.currentIndex];
      const hasSelection = state.selectedIndex != null;
      const correct = hasSelection && state.selectedIndex === q.correctIndex;
      const pts = correct ? 25 : 0;
      const answer = {
        selectedIndex: state.selectedIndex,
        correct,
        score: pts,
        timeLeft: 0,
      };
      return {
        ...state,
        phase: PHASE.ANSWER_REVEAL,
        answers: [...state.answers, answer],
        totalScore: state.totalScore + pts,
      };
    }

    case "NEXT_QUESTION":
      if (state.currentIndex + 1 >= state.questions.length) {
        return {...state, phase: PHASE.RESULTS};
      }
      return {
        ...state,
        phase: PHASE.PLAYING,
        currentIndex: state.currentIndex + 1,
        selectedIndex: null,
        timeLeft: TIME_PER_QUESTION,
      };

    case "TICK":
      if (state.phase !== PHASE.PLAYING) return state;
      return {...state, timeLeft: Math.max(0, state.timeLeft - 1)};

    case "SET_STREAK":
      return {...state, streak: action.streak};

    case "SET_DAILY_PLAYED":
      return {...state, dailyPlayed: action.played};

    case "RESTART":
      return {
        ...initialState,
        streak: state.streak,
        dailyPlayed: state.dailyPlayed,
      };

    default:
      return state;
  }
}

function getLocaleFromParams(params, pathname) {
  if (params?.locale && SUPPORTED_LOCALES.includes(params.locale)) {
    return params.locale;
  }
  const pathMatch = pathname?.match(new RegExp(`^/(${SUPPORTED_LOCALES.join("|")})(/|$)`));
  return pathMatch ? pathMatch[1] : DEFAULT_LOCALE;
}

export default function Trivia() {
  const params = useParams();
  const pathname = usePathname();
  const locale = getLocaleFromParams(params, pathname);

  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef(null);
  const revealTimerRef = useRef(null);

  const dateStr = todayDateStr();
  const gNumber = calcGameNumber(dateStr);

  // Init on mount
  useEffect(() => {
    const token = localStorage.getItem("mptoken");
    if (!token) {
      localStorage.setItem("mptoken", uuidv4());
    }

    // Load streak
    const storedStreak = JSON.parse(localStorage.getItem("triviaStreak") || "{}");
    if (storedStreak.count) {
      dispatch({type: "SET_STREAK", streak: storedStreak.count});
    }

    // Check if daily already played
    const lastDaily = localStorage.getItem("triviaLastDaily");
    if (lastDaily === dateStr) {
      dispatch({type: "SET_DAILY_PLAYED", played: true});
    }
  }, [dateStr]);

  // Timer tick
  useEffect(() => {
    if (state.phase !== PHASE.PLAYING) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      dispatch({type: "TICK"});
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [state.phase, state.currentIndex]);

  // Handle timeout
  useEffect(() => {
    if (state.phase === PHASE.PLAYING && state.timeLeft === 0) {
      dispatch({type: "TIMEOUT"});
    }
  }, [state.timeLeft, state.phase]);

  // Keyboard shortcuts: 1-4 select answer, Enter confirms/advances
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (state.phase === PHASE.PLAYING) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 4) {
          const idx = num - 1;
          const q = state.questions[state.currentIndex];
          if (q && idx < q.options.length) {
            dispatch({type: "SELECT_ANSWER", index: idx});
          }
        } else if (e.key === "Enter" && state.selectedIndex != null) {
          e.preventDefault();
          dispatch({type: "CONFIRM_ANSWER"});
        }
      } else if (state.phase === PHASE.ANSWER_REVEAL) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          clearTimeout(revealTimerRef.current);
          dispatch({type: "NEXT_QUESTION"});
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.phase, state.currentIndex, state.selectedIndex, state.questions]);

  // Auto-advance after reveal
  useEffect(() => {
    if (state.phase === PHASE.ANSWER_REVEAL) {
      revealTimerRef.current = setTimeout(() => {
        dispatch({type: "NEXT_QUESTION"});
      }, 5000);
      return () => clearTimeout(revealTimerRef.current);
    }
  }, [state.phase, state.currentIndex]);

  // Load questions when entering LOADING phase
  useEffect(() => {
    if (state.phase !== PHASE.LOADING) return;

    const params = new URLSearchParams({
      mode: state.mode,
      count: "10",
      difficulty: state.difficulty,
    });

    fetch(`/api/triviaQuestions?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load questions");
        return r.json();
      })
      .then((questions) => {
        if (!questions || questions.length === 0) {
          throw new Error("No questions returned");
        }
        dispatch({type: "QUESTIONS_LOADED", questions});
      })
      .catch((err) => {
        dispatch({type: "LOAD_ERROR", error: err.message});
      });
  }, [state.phase, state.mode, state.difficulty]);

  // Save score when results phase is reached
  useEffect(() => {
    if (state.phase !== PHASE.RESULTS) return;

    // Update streak for daily mode
    if (state.mode === "daily") {
      localStorage.setItem("triviaLastDaily", dateStr);
      dispatch({type: "SET_DAILY_PLAYED", played: true});

      const storedStreak = JSON.parse(localStorage.getItem("triviaStreak") || "{}");
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const yesterdayStr = `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(2, "0")}-${String(yesterday.getUTCDate()).padStart(2, "0")}`;

      let newStreak = 1;
      if (storedStreak.lastDate === yesterdayStr) {
        newStreak = (storedStreak.count || 0) + 1;
      } else if (storedStreak.lastDate === dateStr) {
        newStreak = storedStreak.count || 1;
      }

      localStorage.setItem(
        "triviaStreak",
        JSON.stringify({count: newStreak, lastDate: dateStr})
      );
      dispatch({type: "SET_STREAK", streak: newStreak});
    }

  }, [state.phase]);

  const handleConfirm = () => {
    if (state.selectedIndex == null) return;
    dispatch({type: "CONFIRM_ANSWER"});
  };

  const handleRevealTap = () => {
    clearTimeout(revealTimerRef.current);
    dispatch({type: "NEXT_QUESTION"});
  };

  const question = state.questions[state.currentIndex];

  const correctCount = state.answers.filter((a) => a.correct).length;
  const showConfetti = state.phase === PHASE.RESULTS && correctCount >= 9;

  const confettiPieces = useMemo(() => {
    const palette = ["#C8943E", "#D4A853", "#3A7D44", "#3B82F6", "#9B5DE5", "#D4513F"];
    return Array.from({length: 60}, (_, i) => ({
      id: `trivia-confetti-${i}`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1}s`,
      duration: `${2.5 + Math.random() * 2.5}s`,
      drift: `${Math.round(Math.random() * 120 - 60)}px`,
      rotate: `${Math.round(Math.random() * 360)}deg`,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));
  }, [state.phase]);

  return (
    <div className="trivia-container">
      {state.phase === PHASE.MODE_SELECT && (
        <ModeSelector
          streak={state.streak}
          dailyPlayed={state.dailyPlayed}
          onSelectMode={(mode) => dispatch({type: "SELECT_MODE", mode})}
        />
      )}

      {state.phase === PHASE.DIFFICULTY_SELECT && (
        <DifficultySelector
          onSelect={(d) => dispatch({type: "SELECT_DIFFICULTY", difficulty: d})}
          onBack={() => dispatch({type: "BACK_TO_MODE"})}
        />
      )}

      {state.phase === PHASE.LOADING && (
        <div className="trivia-loading">
          <div className="loading-spinner" />
          <p>Generating questions...</p>
        </div>
      )}

      {state.phase === PHASE.PLAYING && question && (
        <div className="quiz-container">
          <ProgressBar
            current={state.currentIndex}
            total={state.questions.length}
            answers={state.answers}
          />

          <TimerBar timeLeft={state.timeLeft} maxTime={TIME_PER_QUESTION} />

          <QuestionCard question={question}>
            <AnswerGrid
              options={question.options}
              selectedIndex={state.selectedIndex}
              revealed={false}
              correctIndex={question.correctIndex}
              onSelect={(idx) => dispatch({type: "SELECT_ANSWER", index: idx})}
              disabled={false}
            />
          </QuestionCard>

          <div className="confirm-container">
            <button
              className={`btn-confirm ${state.selectedIndex == null ? "btn-disabled" : ""}`}
              onClick={handleConfirm}
              disabled={state.selectedIndex == null}
              type="button"
            >
              Confirm &amp; Continue
            </button>
          </div>
        </div>
      )}

      {state.phase === PHASE.ANSWER_REVEAL && question && (
        <div className="quiz-container">
          <ProgressBar
            current={state.currentIndex}
            total={state.questions.length}
            answers={state.answers}
          />

          <div className="reveal-container">
            <PersonReveal
              question={question}
              correct={state.answers[state.answers.length - 1]?.correct}
              onNext={handleRevealTap}
            />
          </div>
        </div>
      )}

      {state.phase === PHASE.RESULTS && (
        <div className="results-container">
          {showConfetti && (
            <div className="trivia-confetti" aria-hidden>
              {confettiPieces.map((piece) => (
                <span
                  className="trivia-confetti-piece"
                  key={piece.id}
                  style={{
                    left: piece.left,
                    animationDelay: piece.delay,
                    animationDuration: piece.duration,
                    backgroundColor: piece.color,
                    "--confetti-drift": piece.drift,
                    "--confetti-rotate": piece.rotate,
                  }}
                />
              ))}
            </div>
          )}
          <ScoreSummary
            answers={state.answers}
            totalQuestions={state.questions.length}
            gameNumber={gNumber}
            streak={state.streak}
            mode={state.mode}
            score={state.totalScore}
          />
          <ResultsReview questions={state.questions} answers={state.answers} />

          {state.mode === "practice" && (
            <button
              className="btn-play-again"
              onClick={() => dispatch({type: "RESTART"})}
              type="button"
            >
              Play Again
            </button>
          )}

          <button
            className="btn-back-home"
            onClick={() => dispatch({type: "RESTART"})}
            type="button"
          >
            Back to Menu
          </button>
        </div>
      )}

      {state.error && (
        <div className="trivia-error">
          <p>Something went wrong: {state.error}</p>
          <button onClick={() => dispatch({type: "RESTART"})} type="button">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
