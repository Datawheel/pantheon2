import React, {Component} from "react";
import { useEffect, useRef, useState } from "react";
import "./Birthle.css";
import fetchSlugs from "./fetchSlugs";
import fetchPersons from "./fetchPersons";
import Result from "./components/Result/Result";
import Game from "./components/Game/Game";
import useTrait from "./useTrait";
import ConsentForm from "./components/ConsentForm/ConsentForm";
import DemographicForm from "./components/DemographicForm/DemographicForm"
import {v4 as uuidv4} from "uuid";
import { translate } from "react-i18next";
import {GoogleReCaptchaProvider, useGoogleReCaptcha} from "react-google-recaptcha-v3";

function convertTZ(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

const N_PERSONS = 5;
const MAX_ATTEMPTS = 3;

const boardCellDefault = {
  person: null,
  isCorrect: false,
};

const boardDefault = (() =>
  Array.from({ length: MAX_ATTEMPTS }, () =>
    Array.from({ length: N_PERSONS }, () => boardCellDefault)
  ))();

function Birthle(props) {


  const { t, i18n } = props;

  const [persons, setPersons] = useState([]);
  const [sortedPersons, setSortedPersons] = useState([]);
  const fetchError = useTrait(false);
  const selectedPersons = useTrait([]);
  const board = useTrait(boardDefault);
  const personPos = useTrait(0);
  const attempt = useTrait(0);
  const isWin = useTrait(false);
  const resultToShare = useTrait("");

  const [isOpenConsentForm, setIsOpenConsentForm] = useState(undefined);
  const [isOpenDemographicForm, setIsOpenDemographicForm] = useState(undefined);
  const [userId, setUserId]= useState(undefined);
  const [saveConsent, setSaveConsent] = useState(true);
  const [correctPersons, setCorrectPersons] = useState(undefined);

  const resultBlockRef = useRef(0);
  const gameBlockRef = useRef(0);
  const cancelBtnRef = useRef(0);
  const checkBtnRef = useRef(0);

  const date = convertTZ(new Date(), "Europe/Paris");
  const year = date.getFullYear();
  const day = date.getDate();
  const hour = date.getHours();
  const month = date.getMonth() + 1;
  const gameNumber = 1; // (hour >= 2 && hour < 14) ? 1 : 2;
  const gameDate = `${year}-${month}-${day}`; // 2022-5-25
  
  
  const fetchData = async () => {
    const slugs = await fetchSlugs();
    const persons = await fetchPersons(slugs);
    
    setPersons(persons);

    setSortedPersons(() =>
      [...persons].sort((a, b) => {
        if (a.birthyear === b.birthyear) {
          const dateA = new Date(a.birthdate);
          const dateB = new Date();

          return dateA - dateB;
        }

        return a.birthyear - b.birthyear;
      })
    );

    const savePersons = [...persons].sort((a, b) => {
      if (a.birthyear === b.birthyear) {
        const dateA = new Date(a.birthdate);
        const dateB = new Date();

        return dateA - dateB;
      }

      return a.birthyear - b.birthyear;
    })
    
  };
  
  useEffect(() => {

    const token = localStorage.getItem("mptoken");
    if (!token) {
      localStorage.setItem("mptoken", uuidv4());
    }
    setUserId(localStorage.getItem("mptoken"));

    board.set(boardDefault);
    selectedPersons.set([]);
    setSortedPersons([]);
    checkBtnRef.current.disabled = true;
    cancelBtnRef.current.disabled = true;
    fetchData().catch(() => {
      fetchError.set(true);
    });

  }, []);

 

  return (
    <div className="birthle">
      <DemographicForm 
        setIsOpenDemographicForm={setIsOpenDemographicForm}
        isOpenDemographicForm = {isOpenDemographicForm}
        universe = {"birthle"}
        t = {t}
        />
      <ConsentForm 
      isOpen={isOpenConsentForm} 
      setIsOpenConsentForm ={setIsOpenConsentForm}
      userId={userId}
      universe={"birthle"}
      saveConsent = {saveConsent}
      setSaveConsent = {setSaveConsent}
      /> 
      <Game
        MAX_ATTEMPTS={MAX_ATTEMPTS}
        N_PERSONS={N_PERSONS}
        fetchError={fetchError}
        persons={persons}
        setPersons={setPersons}
        selectedPersons={selectedPersons}
        sortedPersons={sortedPersons}
        board={board}
        boardCellDefault={boardCellDefault}
        personPos={personPos}
        attempt={attempt}
        isWin={isWin}
        resultToShare={resultToShare}
        checkBtnRef={checkBtnRef}
        cancelBtnRef={cancelBtnRef}
        resultBlockRef={resultBlockRef}
        gameBlockRef={gameBlockRef}
        gameDate = {gameDate}
        gameNumber = {gameNumber}
        userId={userId}
        correctPersons = {correctPersons}
        setCorrectPersons = {setCorrectPersons}
      />
      <Result
        MAX_ATTEMPTS={MAX_ATTEMPTS}
        sortedPersons={sortedPersons}
        attempt={attempt}
        isWin={isWin}
        resultToShare={resultToShare}
        resultBlockRef={resultBlockRef}
      />
    </div>
  );
  
}

export default translate()(Birthle);
