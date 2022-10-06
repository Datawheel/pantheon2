import { useRef, useEffect, useState } from "react";
import React from "react";
import classNames from "classnames";
import {Button, ButtonGroup, Classes, Dialog, Icon, Intent, Checkbox,  MenuItem, Position, Radio, RadioGroup, Slider, Toaster} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import styles from "./DemographicForm.module.scss";
import countries from "../../../../../../static/jsons/countries.json";
import allUsaStates from "../../../../../../static/jsons/usastates.json";
import {v4 as uuidv4} from "uuid";
import {loadReCaptcha, ReCaptcha} from "react-recaptcha-v3";

const range = (start, end) => Array(end - start + 1).fill().map((_, idx) => start + idx);
const filterItemCountries = (query, item) => {
  item.toString().toLowerCase().indexOf(query.name.toString().toLowerCase()) >= 0;
};

const filterItem = (query, item) => {
  return item.toString().toLowerCase().indexOf(query.toLowerCase()) >= 0;
}
function Question(datap) {
  const {customClasses, children, title} = datap;
  return <div className={classNames(customClasses, styles["question-wrapper"])}>
    <h6 className={styles.title}>{title}</h6>
    {children}
  </div>;
}

function CustomRadioGroup(datap) {
  const {data, defaultItem, identifier, setState} = datap;
  return <RadioGroup
    inline={true}
    onChange={e => setState(e.target.value)}
    selectedValue={defaultItem}
  >
    {data.map(d => <Radio
      key={`${identifier}_${d.id}`}
      label={d.name}
      value={d.id}
    />)}
  </RadioGroup>;
}

function CustomSelect(datap) {

  const {data, defaultItem, setState, popupFilter, popupNoResults, popupSelect} = datap;

  return <Select
    className={styles["popup-select"]}
    items={data}
    filterable={false}
    inputProps={{placeholder: popupFilter}}
    itemPredicate={filterItem}
    itemRenderer={(d, active) => <MenuItem 
      active={defaultItem?.id === d.id}
      key={`${d.name}`}
      onClick={() => setState(d)}
      text={d.name}
    />}
    noResults={<MenuItem disabled={true} text={popupNoResults} />}
  >
    <Button 
      className={styles["select-button"]}
      rightIcon="chevron-down" 
      text={defaultItem?.name || popupSelect}
    />
  </Select>;
}
export default function DemographicForm({
  universe,
  isOpenDemographicForm,
  setIsOpenDemographicForm,
  recap,
  setRecap,
  t
}) {
  
  
  const [education, setEducation] = useState({id: 99, name: t("text.game.popup.skip")});
  const [countryCode, setCountryCode] = useState(undefined);
  const [usaStates, setUsaStates] = useState(undefined);
  const [lang, setLang]= useState("en");
  const [languages, setLanguages] = useState([]);
  const [age, setAge] = useState({id: 99, name: t("text.game.popup.skip")});
  const [sex, setSex] = useState({id: 99, name: t("text.game.popup.skip")});

  const translating = (text) => {
      return text;
      }

  const closeDemo = () => {

    setIsOpenDemographicForm(false);

  }

  const verifyCallback = (recaptchaToken) => {
    setRecap(recaptchaToken);
  }
  
  const addToast = (toast, callback) => {
    
    const defaultToast = {
      className: "toast-sucess",
      timeout: 5000,
      intent: Intent.SUCCESS
    };

    const toastOutput = Object.assign(defaultToast, toast);
    refHandlers.current.show(toastOutput);
    if (callback) 
        setIsOpenDemographicForm(false);
  };

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
    const socioConsent = await fetch("/api/getParticipant", requestOptions).then(resp => resp.json());
    if (socioConsent.length > 0) {
      setIsOpenDemographicForm(false);
    }else{
      setIsOpenDemographicForm(true);
    }
  }
  useEffect(() => {

    fetchDB();

  }, []);
  
  
  
  countries.sort((a, b) => a.name.localeCompare(b.name));
  allUsaStates.sort((a, b) => a.name.localeCompare(b.name));

  const educationLevel = [
    {id: 1, name: t("text.game.popup.education-pretitle")},
    {id: 2, name: t("text.game.popup.education-highschool")},
    {id: 3, name: t("text.game.popup.education-undergraduate-i")},
    {id: 4, name: t("text.game.popup.education-licence")},
    {id: 5, name: t("text.game.popup.education-master")},
    {id: 6, name: t("text.game.popup.education-doctorant")},
    {id: 99, name: t("text.game.popup.skip")}
  ];
  
  const languageOptions = [
    {id: 1, name: t("text.game.popup.english")},
    {id: 2, name: t("text.game.popup.portuguese")},
    {id: 3, name: t("text.game.popup.spanish")},
    {id: 4, name: t("text.game.popup.italian")},
    {id: 5, name: t("text.game.popup.french")},
    {id: 6, name: t("text.game.popup.germany")},
    {id: 7, name: t("text.game.popup.chinese")},
    {id: 7, name: t("text.game.popup.japanese")},
    {id: 8, name: t("text.game.popup.hindi")},
    {id: 9, name: t("text.game.popup.russian")},
    {id: 10, name: t("text.game.popup.polish")},
    {id: 11, name: t("text.game.popup.mandarin")},
    {id: 98, name: t("text.game.popup.other")},
    {id: 99, name: t("text.game.popup.skip")}
  ];

  const sexOptions = [
    {id: 1, name: t("text.game.popup.sex-female")},
    {id: 2, name: t("text.game.popup.sex-male")},
    {id: 98, name: t("text.game.popup.other")},
    {id: 99, name: t("text.game.popup.skip")}
  ];

  const ageOptions = [
    {id: 1, name: "10-19 " + t("text.game.text.years")},
    {id: 2, name: "20-29 " + t("text.game.text.years")}, 
    {id: 3, name: "30-39 " + t("text.game.text.years")},  
    {id: 4, name: "40-49 " + t("text.game.text.years")},  
    {id: 5, name: "50-59 " + t("text.game.text.years")},
    {id: 6, name: "60-69 " + t("text.game.text.years")}, 
    {id: 7, name: "70+ " + t("text.game.text.years")}, 
    {id: 98, name: t("text.game.popup.other")},
    {id: 99, name: t("text.game.popup.skip")}
  ];

  const tmpLocation = countries
    ? countries.concat([{id: 998, name: t("text.game.popup.outside")}, {id: 999, name: t("text.game.popup.skip")}])
    : [];
  // console.log("tmpLocation", tmpLocation);
  const countriesFiltered = countryCode ?
  tmpLocation.filter(d => filterItemCountries(countryCode, d.name) || filterItemCountries(countryCode, d.name)).slice(0, 200) :
  tmpLocation.slice(0, 200);

  const USAtmpLocation = allUsaStates
    ? allUsaStates.concat([{id: 998, name: t("text.game.popup.outside")}, {id: 999, name: t("text.game.popup.skip")}])
    : [];
  // console.log("USAtmpLocation", USAtmpLocation);
  const USAstatesFiltered = usaStates ?
  USAtmpLocation.filter(d => filterItemCountries(usaStates, d.name) || filterItemCountries(usaStates, d.name)).slice(0, 200) :
  USAtmpLocation.slice(0, 200);

    

  const refHandlers = useRef();
  const popupTitle = t("text.game.popup.title");
  const popupDescription = t("text.game.popup.description");
  const sexTitle = t("text.game.popup.sex-title");
  const agetTitle = t("text.game.popup.age-title");
  const educationTitle = t("text.game.popup.education-title");
  // "What languages do you speak?";
  const languageTitle = t("text.game.popup.language-title");
  const countryTitle = t("text.game.popup.country-title");
  const popupFilter = t("text.game.popup.filter");
  const messageError = t("text.game.popup.message-error");
  const popupNoResults = t("text.game.popup.no-results");
  const preferNotToAnswer = t("text.game.popup.prefer-not-to-answer");
  const popupSelect = t("text.game.popup.select");
  const popupSend = t("text.game.popup.send");
  const USATitle = t("text.game.popup.usa-title");

  function updateLanguages(lid) {
    const newLanguages = [];
    languages.forEach(function(obj, ind, arr) {
      newLanguages.push(obj);
    });
    newLanguages.push(lid);
    setLanguages(newLanguages);
  }

  function SelectedUSA (){
    // United States
    if (countryCode && countryCode.name == "United States") {
      return (
        <Question
        title={USATitle}
      >
        <Select
          className={styles["popup-select"]}
          items={USAtmpLocation}
          filterable={false}
          inputProps={{placeholder: popupFilter}}
          // itemPredicate={filterItemCountries}
          onQueryChange={e => setUsaStates(e)}
          itemRenderer={(d, active) => <MenuItem 
            active={usaStates?.id === d.id}
            onClick={() => setUsaStates(d)}
            key={`${d.name}_location`}
            text={[998, 999].includes(d.id) ? d.name : `${d.name} (${d.id})`} 
          />}
          noResults={(d, active) => <MenuItem 
            active={d.id === 999}
            onClick={() => setUsaStates(d)}
            key={`${d.name}_location`}
            text={[998, 999].includes(d.id) ? d.name : `${d.name} (${d.id})`} 
          />}
        >
          <Button 
            className={styles["select-button"]}
            rightIcon="chevron-down" 
            text={usaStates ? `${usaStates.name} (${usaStates.id})` : popupSelect}
          />
        </Select>
      </Question>
      );
    }
    return false
  }

  return (
    <Dialog 
    className={styles.popupwrapper}
    isOpen={isOpenDemographicForm}
    onClose={() => setIsOpenDemographicForm(false)}
    title={popupTitle}
  >
    <ReCaptcha
        sitekey="6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D"
        verifyCallback={verifyCallback}
      />
    <div className={classNames(Classes.DIALOG_BODY, styles.popup, styles.popupwrapper)}>
      <p>{popupDescription}</p>
      <Question
        title={sexTitle}
      > 
      <Select
          className={styles["popup-select"]}
          items={sexOptions}
          filterable={false}
          inputProps={{placeholder: popupFilter}}
          itemPredicate={filterItem}
          itemRenderer={(d, active) => <MenuItem 
            active={sex?.id === d.id}
            key={`${d.name}`}
            onClick={() => setSex(d)}
            text={d.name}
          />}
          noResults={<MenuItem text={popupNoResults} />}
        >
          <Button 
            className={styles["select-button"]}
            rightIcon="chevron-down" 
            text={sex?.name || popupSelect}
          />
        </Select>
      </Question>

      <Question
        title={agetTitle}
        customClasses="age-option"
      >
        <Select
        className={styles["popup-select"]}
        items={ageOptions}
        filterable={false}
        inputProps={{placeholder: popupFilter}}
        itemPredicate={filterItem}
        itemRenderer={(d, active) => <MenuItem 
          active={age?.id === d.id}
          key={`${d.name}`}
          onClick={() => setAge(d)}
          text={d.name}
        />}
        noResults={<MenuItem text={popupNoResults} />}
      >
        <Button 
          className={styles["select-button"]}
          rightIcon="chevron-down" 
          text={age?.name || popupSelect}
        />
      </Select>
      </Question>

      <Question
        title={educationTitle}
      >
        <Select
          className={styles["popup-select"]}
          items={educationLevel}
          filterable={false}
          scrollToActiveItem={true}
          inputProps={{placeholder: popupFilter}}
          itemPredicate={filterItem}
          itemRenderer={(d, active) => <MenuItem 
            active={education?.id === d.id}
            key={`${d.name}`}
            onClick={() => setEducation(d)}
            text={d.name}
          />}
          noResults={<MenuItem text={popupNoResults} />}
        >
          <Button 
            className={styles["select-button"]}
            rightIcon="chevron-down" 
            text={education?.name || popupSelect}
          />
        </Select>
      </Question>
      <Question
        title={countryTitle}
      >
        <Select
          className={styles["popup-select2"]}
          items={tmpLocation}
          filterable={false}
          resetOnSelect= {true}
          inputProps={{placeholder: popupFilter}}
          defaultItem = {{id: 999, name: t("text.game.popup.skip")}}
          onItemSelect={countriesFiltered}
          // itemPredicate={filterItemCountries}
          onQueryChange={e => setCountryCode(e)}
          itemRenderer={(d, active) => <MenuItem 
            active={countryCode?.id === d.id}
            onClick={() => setCountryCode(d)}
            key={`${d.name}_location`}
            text={[998, 999].includes(d.id) ? d.name : `${d.name} (${d.id})`} 
          />}
          // noResults={(d, active) => <MenuItem 
          //   active={countryCode?.id === 999}
          //   onClick={() => setCountryCode(d)}
          //   key={`${d.name}_location`}
          //   text={[998, 999].includes(d.id) ? d.name : `${d.name} (${d.id})`} 
          // />}
        >
          <Button 
            className={styles["select-button"]}
            rightIcon="chevron-down" 
            text={countryCode ? `${countryCode.name} (${countryCode.id})` : popupSelect}
          />
        </Select>
      </Question>

      <SelectedUSA />

      <Question
        title={languageTitle}> 
      <div
        inline={true}
      >
        {languageOptions.map(d => <Checkbox
          key={`${"language"}_${d.id}`}
          label={d.name}
          value={d.id}
          inline = {true}
          onChange= {e => updateLanguages(e.target.value)}
        />)}
      </div>
      </Question>
        
      <br/>
      <div className={styles.options}>
        <Button
          className={classNames(styles.button, styles.lite)}
          onClick={() => setIsOpenDemographicForm(false)}
        >
          {preferNotToAnswer}
        </Button>
        <Button className={styles.button} onClick={async() => {
          // location && politics && age && sex && zone
          // lang, location_id, country_id, education_id, age_id, sex_id, languages, user_id, token
          if (countryCode && education && sex && age && languages) {
            
            var languageIds = [];
            if (languages.length > 0) {
              languages.forEach(function(obj, ind, arr) {languageIds.push(parseInt(obj));});
            }

            const locationId = usaStates === undefined ? 99 : usaStates.id * 1;
  
            const token = localStorage.getItem("mptoken");
            if (!token) {
              localStorage.setItem("mptoken", uuidv4());
            }

            loadReCaptcha("6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D");
            
            const data = {
              user_id: localStorage.getItem("mptoken"),
              country_id: countryCode.id * 1,
              location_id: locationId,
              age_id: age.id,
              sex_id: sex.id * 1,
              languages: languageIds,
              education_id: education.id * 1,
              lang: lang,
              token: recap,
              universe: universe
            };
            // lang, location_id, education_id, country_id, age_id, sex_id, languages, user_id, token, universe
            
            const requestOptions = {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(data)
            };
        
            await fetch("/api/createParticipant", requestOptions);
            closeDemo();
            
          }
          else {
            addToast({
              message: messageError,
              intent: Intent.DANGER
            }, undefined);
          }
        }}>
          {popupSend}
        </Button> 
        
      </div>

      <Toaster position={Position.BOTTOM} ref={refHandlers}>
        {/* <Toast
          intent={Intent.DANGER}
          // message="No pudimos almacenar tu respuesta. Inténtalo más tarde."
        /> */}
      </Toaster>
    </div>
  </Dialog>)
};