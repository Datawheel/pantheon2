"use client";
import { useCallback, useState } from "react";
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
import { useI18n, useScopedI18n } from "../../locales/client";
import countries from "/public/jsons/countries.json";
import allUsaStates from "/public/jsons/usastates.json";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function QuestionDemo(datap) {
  const { customClasses, children, title, getkey } = datap;
  let combinedClassNames;
  if (Array.isArray(customClasses)) {
    // If classNames is an array, join it with the hardcoded class
    combinedClassNames = ["question-wrapper", ...customClasses].join(" ");
  } else {
    // If classNames is a string, concatenate it with the hardcoded class
    combinedClassNames = `question-wrapper ${customClasses}`;
  }
  return (
    <div key={getkey} className={combinedClassNames}>
      <h6 className="title">{title}</h6>
      {children}
    </div>
  );
}

const filterItem = (query, item) => {
  return item.toString().toLowerCase().indexOf(query.toLowerCase()) >= 0;
};
const filterItemCountries = (query, item) => {
  item.toString().toLowerCase().indexOf(query.name.toString().toLowerCase()) >=
    0;
};

export default function DemographicForm({
  universe,
  isOpenDemographicForm,
  setIsOpenDemographicForm,
  scoreDB,
  setScoreDB,
}) {
  const t = useI18n();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [lang, setLang] = useState("en");
  const [sex, setSex] = useState({ id: 99, name: t("text.game.popup.skip") });
  const [age, setAge] = useState({ id: 99, name: t("text.game.popup.skip") });
  const [education, setEducation] = useState({
    id: 99,
    name: t("text.game.popup.skip"),
  });
  const [countryCode, setCountryCode] = useState(undefined);
  const [usaStates, setUsaStates] = useState(undefined);
  const [languages, setLanguages] = useState([]);

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

  const sexOptions = [
    { id: 1, name: t("text.game.popup.sex-female") },
    { id: 2, name: t("text.game.popup.sex-male") },
    { id: 98, name: t("text.game.popup.other") },
    { id: 99, name: t("text.game.popup.skip") },
  ];
  const ageOptions = [
    { id: 1, name: "10-19 " + t("text.game.text.years") },
    { id: 2, name: "20-29 " + t("text.game.text.years") },
    { id: 3, name: "30-39 " + t("text.game.text.years") },
    { id: 4, name: "40-49 " + t("text.game.text.years") },
    { id: 5, name: "50-59 " + t("text.game.text.years") },
    { id: 6, name: "60-69 " + t("text.game.text.years") },
    { id: 7, name: "70+ " + t("text.game.text.years") },
    { id: 98, name: t("text.game.popup.other") },
    { id: 99, name: t("text.game.popup.skip") },
  ];
  const educationLevel = [
    { id: 1, name: t("text.game.popup.education-pretitle") },
    { id: 2, name: t("text.game.popup.education-highschool") },
    { id: 3, name: t("text.game.popup.education-undergraduate-i") },
    { id: 4, name: t("text.game.popup.education-licence") },
    { id: 5, name: t("text.game.popup.education-master") },
    { id: 6, name: t("text.game.popup.education-doctorant") },
    { id: 99, name: t("text.game.popup.skip") },
  ];
  const tmpLocation = countries
    ? countries.concat([
        { id: 998, name: t("text.game.popup.outside") },
        { id: 999, name: t("text.game.popup.skip") },
      ])
    : [];
  const countriesFiltered = countryCode
    ? tmpLocation
        .filter(
          (d) =>
            filterItemCountries(countryCode, d.name) ||
            filterItemCountries(countryCode, d.name)
        )
        .slice(0, 200)
    : tmpLocation.slice(0, 200);
  const USAtmpLocation = allUsaStates
    ? allUsaStates.concat([
        { id: 998, name: t("text.game.popup.outside"), abbreviation: "" },
        { id: 999, name: t("text.game.popup.skip"), abbreviation: "" },
      ])
    : [];
  const languageOptions = [
    { id: 1, name: t("text.game.popup.english") },
    { id: 2, name: t("text.game.popup.portuguese") },
    { id: 3, name: t("text.game.popup.spanish") },
    { id: 4, name: t("text.game.popup.italian") },
    { id: 5, name: t("text.game.popup.french") },
    { id: 6, name: t("text.game.popup.german") },
    { id: 7, name: t("text.game.popup.chinese") },
    { id: 8, name: t("text.game.popup.japanese") },
    { id: 9, name: t("text.game.popup.hindi") },
    { id: 10, name: t("text.game.popup.russian") },
    { id: 11, name: t("text.game.popup.polish") },
    { id: 12, name: t("text.game.popup.mandarin") },
    { id: 13, name: t("text.game.popup.arabic") },
    { id: 14, name: t("text.game.popup.bengali") },
    { id: 15, name: t("text.game.popup.indonesian") },
    { id: 16, name: t("text.game.popup.korean") },
    { id: 98, name: t("text.game.popup.other") },
    { id: 99, name: t("text.game.popup.skip") },
  ];

  const updateLanguages = (lid) => {
    const newLanguages = [];
    languages.forEach(function (obj, ind, arr) {
      newLanguages.push(obj);
    });
    newLanguages.push(lid);
    setLanguages(newLanguages);
  };

  const submit = useCallback(async () => {
    const token = await executeRecaptcha("trivia");
    if (countryCode && education && sex && age && languages) {
      var languageIds = [];
      if (languages.length > 0) {
        languages.forEach(function (obj, ind, arr) {
          languageIds.push(parseInt(obj));
        });
      }

      const locationId = usaStates === undefined ? 99 : usaStates.id * 1;

      const token = localStorage.getItem("mptoken");
      if (!token) {
        localStorage.setItem("mptoken", uuidv4());
      }

      const data = {
        user_id: localStorage.getItem("mptoken"),
        country_id: countryCode.id * 1,
        location_id: locationId,
        age_id: age.id,
        sex_id: sex.id * 1,
        languages: languageIds,
        education_id: education.id * 1,
        lang: lang,
        token: token,
        universe: universe,
        scoreDB: scoreDB,
      };
      // lang, location_id, education_id, country_id, age_id, sex_id, languages, user_id, token, universe
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      setIsOpenDemographicForm(false);
      await fetch("/api/createParticipant", requestOptions);
    } else {
      console.log("didn't work!");
      // addToast(
      //   {
      //     message: messageError,
      //     intent: Intent.DANGER,
      //   },
      //   undefined
      // );
    }
  }, [executeRecaptcha, countryCode, education, sex, age, languages]);

  return (
    <Dialog
      className="popupwrapper"
      isOpen={isOpenDemographicForm}
      onClose={() => setIsOpenDemographicForm(false)}
      title={""}
    >
      <div className="bp3-dialog popup popupwrapper">
        <p>{popupDescription}</p>

        {/************
          1. GENDER / SEX
         *************/}
        <QuestionDemo title={sexTitle} getkey={"firstquestion"}>
          <Select
            className="popup-select"
            items={sexOptions}
            filterable={false}
            inputProps={{ placeholder: popupFilter }}
            itemPredicate={filterItem}
            itemRenderer={(d, active) => (
              <MenuItem
                active={sex?.id === d.id}
                key={`${d.name}_sex`}
                onClick={() => setSex(d)}
                text={d.name}
              />
            )}
            noResults={<MenuItem text={popupNoResults} />}
          >
            <Button
              className="select-button"
              rightIcon="chevron-down"
              text={sex?.name || popupSelect}
            />
          </Select>
        </QuestionDemo>

        {/************
          2. AGE
         *************/}
        <QuestionDemo
          title={agetTitle}
          getkey={"secondquestion"}
          customClasses="age-option"
        >
          <Select
            className="popup-select"
            items={ageOptions}
            filterable={false}
            inputProps={{ placeholder: popupFilter }}
            itemPredicate={filterItem}
            itemRenderer={(d, active) => (
              <MenuItem
                active={age?.id === d.id}
                key={`${d.name}_age`}
                onClick={() => setAge(d)}
                text={d.name}
              />
            )}
            noResults={<MenuItem text={popupNoResults} />}
          >
            <Button
              className="select-button"
              rightIcon="chevron-down"
              text={age?.name || popupSelect}
            />
          </Select>
        </QuestionDemo>

        {/************
          3. EDUCATION
         *************/}
        <QuestionDemo title={educationTitle} getkey={"thirdquestion"}>
          <Select
            className="popup-select"
            items={educationLevel}
            filterable={false}
            scrollToActiveItem={true}
            inputProps={{ placeholder: popupFilter }}
            itemPredicate={filterItem}
            itemRenderer={(d, active) => (
              <MenuItem
                active={education?.id === d.id}
                key={`${d.name}_education`}
                onClick={() => setEducation(d)}
                text={d.name}
              />
            )}
            noResults={<MenuItem text={popupNoResults} />}
          >
            <Button
              className="select-button"
              rightIcon="chevron-down"
              text={education?.name || popupSelect}
            />
          </Select>
        </QuestionDemo>

        {/************
          4. Where are you from?
         *************/}
        <QuestionDemo title={countryTitle} getkey={"fourthquestion"}>
          <Select
            className="popup-select2"
            items={tmpLocation}
            filterable={false}
            resetOnSelect={true}
            inputProps={{ placeholder: popupFilter }}
            defaultItem={{ id: 999, name: t("text.game.popup.skip") }}
            onItemSelect={countriesFiltered}
            // itemPredicate={filterItemCountries}
            onQueryChange={(e) => setCountryCode(e)}
            itemRenderer={(d, active) => (
              <MenuItem
                active={countryCode?.id === d.id}
                onClick={() => setCountryCode(d)}
                key={`${d.name}_location`}
                text={
                  [998, 999].includes(d.id) ? d.name : `${d.name} (${d.id})`
                }
              />
            )}
          >
            <Button
              className="select-button"
              rightIcon="chevron-down"
              text={
                countryCode
                  ? `${countryCode.name} (${countryCode.id})`
                  : popupSelect
              }
            />
          </Select>
        </QuestionDemo>

        {/************
          4b. Where are you from? (US STATES)
         *************/}
        {countryCode && countryCode.name == "United States" && (
          <QuestionDemo title={USATitle} getkey={"USAquestion"}>
            <Select
              className="popup-select2"
              items={USAtmpLocation}
              filterable={false}
              inputProps={{ placeholder: popupFilter }}
              // itemPredicate={filterItemCountries}
              onQueryChange={(e) => setUsaStates(e)}
              itemRenderer={(d, active) => (
                <MenuItem
                  active={usaStates?.id === d.id}
                  onClick={() => setUsaStates(d)}
                  key={`${d.name}_usalocation`}
                  text={
                    [998, 999].includes(d.id) ? d.name : `${d.name} (${d.id})`
                  }
                />
              )}
              noResults={(d, active) => (
                <MenuItem
                  active={d.id === 999}
                  onClick={() => setUsaStates(d)}
                  key={`${d.name}_usalocation`}
                  text={
                    [998, 999].includes(d.id) ? d.name : `${d.name} (${d.id})`
                  }
                />
              )}
            >
              <Button
                className={styles["select-button"]}
                rightIcon="chevron-down"
                text={
                  usaStates
                    ? `${usaStates.name} (${usaStates.id})`
                    : popupSelect
                }
              />
            </Select>
          </QuestionDemo>
        )}

        {/************
          5. LANGUAGE
         *************/}
        <QuestionDemo title={languageTitle} getkey={"fifthquestion"}>
          <div key={"languageoptionsdiv"}>
            {languageOptions.map((d) => (
              <Checkbox
                key={`${d.id}_language`}
                label={d.name}
                value={d.id}
                inline={true}
                onChange={(e) => updateLanguages(e.target.value)}
              />
            ))}
          </div>
        </QuestionDemo>

        <br />
        <div
          id={"buttonsgroup"}
          key={"democonsentsubmission"}
          className="options"
        >
          <Button
            key="demobttclose"
            className="button lite"
            onClick={() => setIsOpenDemographicForm(false)}
          >
            {preferNotToAnswer}
          </Button>
          <Button
            id="acceptbutton"
            key="demotosubmit"
            className="button"
            onClick={submit}
          >
            {popupSend}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
