"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dialog } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import "./ConsentForm.css";
import { useI18n, useScopedI18n } from "../../locales/client";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { v4 as uuidv4 } from "uuid";

export default function ConsentForm({
  isOpenConsentForm,
  setIsOpenConsentForm,
  acceptBtnRef,
  universe,
  saveConsent,
  setSaveConsent,
  scoreDB,
  setScoreDB,
}) {
  const t = useI18n();
  const consentText = t("text.game.popup.consent-form");
  const [rKey, setRKey] = useState(Math.random() * (100 - 50) + 50);
  const isMounted = useRef(true);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(
    async (buttonType) => {
      if (!executeRecaptcha) {
        console.log("Execute recaptcha not yet available");
        return;
      }

      const token = await executeRecaptcha("consentForm");

      setRKey(rKey + 1);

      setIsOpenConsentForm(false);
      setSaveConsent(false);

      const data = {
        user_id: localStorage.getItem("mptoken"),
        locale: "en",
        universe: universe,
        url: window.location.href,
        token: token,
        scoreDB: scoreDB,
      };

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      await fetch("/api/createConsent", requestOptions);

      if (buttonType === "trivia") {
        window.location.href = "/app/trivia";
      }
    },
    [executeRecaptcha]
  );

  const fetchDB = async () => {
    const token = localStorage.getItem("mptoken");
    if (!token) {
      localStorage.setItem("mptoken", uuidv4());
    }

    const gameDataSave = {
      user_id: localStorage.getItem("mptoken"),
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameDataSave),
    };

    await fetch("/api/getConsent", requestOptions)
      .then((resp) => resp.json())
      .then((consent) => {
        console.log("consent!!!", consent);
        if (consent.length > 0) {
          setScoreDB(parseFloat(consent[0].score_bot));
          setSaveConsent(false);
          setIsOpenConsentForm(false);
        } else {
          setSaveConsent(true);
          setIsOpenConsentForm(true);
        }
      });
  };

  useEffect(() => {
    // loadReCaptcha("6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D");
    if (isMounted.current) {
      fetchDB();
      return () => {
        isMounted.current = false;
      };
    }
  }, []);

  return (
    <Dialog
      isOpen={isOpenConsentForm}
      id="consentpopup"
      key={"consentpopup"}
      isCloseButtonShown={false}
      title={""}
    >
      <div key={"dialogbody"} className="bp5-dialog-body">
        <div
          key={"cosenttitle"}
          className="description"
          dangerouslySetInnerHTML={{ __html: consentText }}
        />

        <div
          id={"consentbuttons"}
          key={"consentbuttons"}
          className="options consentbuttons"
        >
          <Button
            key={"consentno"}
            id={"consentno"}
            className="bp5-button lite"
            onClick={(event) => (window.location.href = "/data/faq")}
          >
            Do not accept
          </Button>
          <Button
            key={"playTrivia"}
            id={"playTrivia"}
            className="bp5-button playTrivia"
            ref={acceptBtnRef}
            onClick={() => handleReCaptchaVerify("trivia")}
          >
            Accept and play Trivia
          </Button>
          <Button
            key={"consentyes"}
            id={"consentyes"}
            className="bp5-button consentyes"
            ref={acceptBtnRef}
            onClick={() => handleReCaptchaVerify("birthle")}
          >
            Accept and play Birthle
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
