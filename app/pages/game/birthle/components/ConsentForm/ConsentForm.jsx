import { useRef, useEffect, useState } from "react";
import React from "react";
import {Classes, Dialog} from "@blueprintjs/core";
import classNames from "classnames";
import styles from "./ConsentForm.module.scss";
import {v4 as uuidv4} from "uuid";
import {loadReCaptcha, ReCaptcha} from "react-recaptcha-v3";

export default function ConsentForm({
  isOpenConsentForm,
  setIsOpenConsentForm,
  acceptBtnRef,
  universe,
  saveConsent,
  setSaveConsent,
  scoreDB,
  setScoreDB,
  t
}) {

  const [recap, setRecap] = useState(undefined);
  const [rKey, setRKey] = useState(Math.random() * (100 - 50) + 50);
  const consentText = t("text.game.popup.consent-form");

  const verifyCallback = (recaptchaToken) => {
    setRecap(recaptchaToken);
  }

  const acceptClick = async () => {

    setRKey(rKey+1);
    loadReCaptcha("6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D");
    
    setIsOpenConsentForm(false);
    setSaveConsent(false);

    const data = {
      user_id: localStorage.getItem("mptoken"),
      locale: "en",
      universe: universe,
      url: window.location.href,
      token: recap,
      scoreDB: scoreDB
    };

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    };
    
    await fetch("/api/createConsent", requestOptions);

  }

  const fetchDB = async () => {

    const token = localStorage.getItem("mptoken");
    if (!token) {
      localStorage.setItem("mptoken", uuidv4());
    }
    
    const gameDataSave = {
      user_id: localStorage.getItem("mptoken")
    }
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(gameDataSave)
      };

    await fetch("/api/getConsent", requestOptions)
        .then(resp => resp.json())
        .then(consent => {
          if (consent.length > 0) {
            setScoreDB(parseFloat(consent[0].score_bot));
            setSaveConsent(false);
            setIsOpenConsentForm(false);
          }else{
            setSaveConsent(true);
            setIsOpenConsentForm(true);
          }
        });
    
  }

  useEffect(() => {
    loadReCaptcha("6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D");
  }, []); 

  return (
      <Dialog
      isOpen={isOpenConsentForm}
      id="consentpopup"
      key={"consentpopup"}
      isCloseButtonShown={false}
      title={""}
    >
      <ReCaptcha
        id="consent"
        // key={"consent"+rKey.toString()}
        key={Math.random().toString()}
        sitekey="6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D"
        verifyCallback={verifyCallback}
      />
      <div key={"dialogbody"} className={classNames(Classes.DIALOG_BODY, styles.consentform)}>
      <div key={"cosenttitle"} className={styles.description} dangerouslySetInnerHTML={{__html:consentText}} />

        <div key={"consentbuttons"} className={styles.options}>
        <button
         key={"consentno"}
         className={classNames(styles.button, styles.lite)}
         onClick={event =>  window.location.href='/data/faq'}
         >Do not accept</button>

          <button
            key={"consentyes"}
            className={styles.button}
            ref = {acceptBtnRef}
            onClick={acceptClick}
          >Accept</button>
        </div>
      </div>

    </Dialog>
  );
}




