import { useRef, useEffect } from "react";
import React from "react";
import {Classes, Dialog} from "@blueprintjs/core";
import classNames from "classnames";
import styles from "./ConsentForm.module.scss";
import {v4 as uuidv4} from "uuid";

export default function ConsentForm({
  isOpen,
  setIsOpenConsentForm,
  acceptBtnRef,
  userId,
  universe,
  saveConsent,
  setSaveConsent,
  recap,
  t
}) {

  const consentText = t("text.game.popup.consent-form");

  const acceptClick = async () => {

    setIsOpenConsentForm(false);
    setSaveConsent(false);

    const data = {
      user_id: userId,
      locale: "en",
      universe: universe,
      url: window.location.href,
      token: recap
    };
    console.log(data);
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
      user_id: localStorage.getItem("mptoken", uuidv4())
    }
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(gameDataSave)
      };

    const consent = await fetch("/api/getConsent", requestOptions).then(resp => resp.json());
    
    if (consent.length > 0) {
      setSaveConsent(false);
      setIsOpenConsentForm(false);
    }else{
      setSaveConsent(true);
      setIsOpenConsentForm(true);
    }
  }

  useEffect(() => {
    
    fetchDB();

  }, []);
  
  return (
      <Dialog
      isOpen={isOpen}
      id="dialogpopup"
      isCloseButtonShown={false}
      title={""}
    >
      <div className={classNames(Classes.DIALOG_BODY, styles.consentform)}>
      <div className={styles.description} dangerouslySetInnerHTML={{__html:consentText}} />

        <div className={styles.options}>
        <button
         className={classNames(styles.button, styles.lite)}
         onClick={event =>  window.location.href='/data/faq'}
         >Do not accept</button>

          <button
            className={styles.button}
            ref = {acceptBtnRef}
            onClick={acceptClick}
          >Accept</button>
        </div>
      </div>

    </Dialog>
  );
}




