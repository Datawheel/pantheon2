"use client";
import {
  Button,
  Classes,
  Dialog,
  Intent,
  Checkbox,
  MenuItem,
  Position,
  Toaster,
} from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import "./DemographicForm.css";
import { useI18n, useScopedI18n } from "../../../locales/client";

export default function DemographicForm({
  universe,
  isOpenDemographicForm,
  setIsOpenDemographicForm,
  scoreDB,
  setScoreDB,
}) {
  const t = useI18n();
  const popupTitle = t("text.game.popup.title");
  const popupDescription = t("text.game.popup.description");
  const sexTitle = t("text.game.popup.sex-title");
  const agetTitle = t("text.game.popup.age-title");
  const educationTitle = t("text.game.popup.education-title");
  const languageTitle = t("text.game.popup.language-title");
  const countryTitle = t("text.game.popup.country-title");
  const popupFilter = t("text.game.popup.filter");
  const messageError = t("text.game.popup.message-error");
  const popupNoResults = t("text.game.popup.no-results");
  const preferNotToAnswer = t("text.game.popup.prefer-not-to-answer");
  const popupSelect = t("text.game.popup.select");
  const popupSend = t("text.game.popup.send");
  const USATitle = t("text.game.popup.usa-title");

  return (
    <Dialog
      className="popupwrapper"
      isOpen={isOpenDemographicForm}
      onClose={() => setIsOpenDemographicForm(false)}
      title={""}
    >
      <div className="bp3-dialog popup popupwrapper">
        <p>{popupDescription}</p>
      </div>
    </Dialog>
  );
}
