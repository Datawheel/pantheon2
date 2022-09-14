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
  setSaveConsent
}) {
  const agreed = useRef(true);

  const acceptClick = () => {

    setIsOpenConsentForm(false);
    setSaveConsent(false);

    const data = {
      user_id: userId,
      locale: "en",
      universe: universe,
      url: window.location.href
    };
    console.log(data);
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    };
    fetch("/api/createConsent", requestOptions);

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
      console.log("setSaveConsent(false)");
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


  const noacceptBtn = "Do not accept"; // | t("text.game.no-accept");
  const acceptBtn = "Accept" // | t("text.game.accept");
  const consentFormContent = "<p>Welcome to Pantheon.world. By participating in our online games, you agree that your participation is voluntary and that the information you provide can be used for research purposes. The goal of this project is to understand human collective memory. </p> <p>If you agree to participate, we will collect data on your answers, and you will have the option to answer a demographic questionnaire (age, gender, location, education, and languages). The data collected will be anonymized at the moment of collection using a one-way (irreversible) hashing method. Participation data will be stored in pantheon.world servers. Anonymized data may be released publicly in the future for research purposes. As a user you can decide to end your participation in the study at any moment (no minimum participation time is required). You will not be paid for playing these online games. New games will be made available on a daily basis.</p> <p>This proposal has been reviewed and approved by the TSE-IAST Review Board for Ethical Standards in Research.</p> <p>In case of questions, contact <a href=\"mailto:hello@centerforcollectivelearning.org\">hello@centerforcollectivelearning.org</a> </p> <p>Agree and Continue</p>" 
  //| t("text.game.consent");
  
  return (
      <Dialog
      isOpen={isOpen}
      id="dialogpopup"
      isCloseButtonShown={false}
      title={""}
    >
      <div className={classNames(Classes.DIALOG_BODY, styles.consentform)}>
        <div dangerouslySetInnerHTML={{__html: consentFormContent}} />

        <div className={styles.options}>
        <button
         className={classNames(styles.button, styles.lite)}
         onClick={event =>  window.location.href='/data/faq'}
         >{noacceptBtn}</button>

          <button
            className={styles.button}
            ref = {acceptBtnRef}
            onClick={acceptClick}
          >{acceptBtn}</button>
        </div>
      </div>

    </Dialog>
  );
}


