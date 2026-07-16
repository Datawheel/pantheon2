"use client";
import {useDispatch, useSelector} from "react-redux";
import {updateBirthMonth, updateBirthDay, clearBirthDate} from "../../features/exploreSlice";
import {getExploreTranslations} from "@/app/exploreTranslations";

const MONTHS = [
  {value: 1, days: 31},
  {value: 2, days: 29},
  {value: 3, days: 31},
  {value: 4, days: 30},
  {value: 5, days: 31},
  {value: 6, days: 30},
  {value: 7, days: 31},
  {value: 8, days: 31},
  {value: 9, days: 30},
  {value: 10, days: 31},
  {value: 11, days: 30},
  {value: 12, days: 31},
];

const getMaxDaysForMonth = month => {
  if (month === null) return 31;
  const monthData = MONTHS.find(m => m.value === month);
  return monthData ? monthData.days : 31;
};

export default function BirthdayControl({locale}) {
  const t = getExploreTranslations(locale);
  const dispatch = useDispatch();
  const {birthMonth, birthDay} = useSelector(state => state.explore);

  const maxDays = getMaxDaysForMonth(birthMonth);
  const days = Array.from({length: maxDays}, (_, i) => ({value: i + 1, label: `${i + 1}`}));

  const handleMonthChange = e => {
    const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
    dispatch(updateBirthMonth(value));

    // Clamp day if it exceeds the new month's max days
    if (birthDay !== null && value !== null) {
      const newMaxDays = getMaxDaysForMonth(value);
      if (birthDay > newMaxDays) {
        dispatch(updateBirthDay(newMaxDays));
      }
    }
  };

  const handleDayChange = e => {
    const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
    dispatch(updateBirthDay(value));
  };

  const handleClear = e => {
    e.preventDefault();
    dispatch(clearBirthDate());
  };

  const isActive = birthMonth !== null || birthDay !== null;

  return (
    <div className="birthday-control filter">
      <h4>{t("bornOnThisDay")}</h4>
      <div className="birthday-inputs">
        <select value={birthMonth ?? ""} onChange={handleMonthChange}>
          <option value="">{t("anyMonth")}</option>
          {MONTHS.map(m => (
            <option key={m.value} value={m.value}>
              {new Intl.DateTimeFormat(locale, {
                month: "long",
                timeZone: "UTC",
              }).format(new Date(Date.UTC(2000, m.value - 1, 1)))}
            </option>
          ))}
        </select>
        <select value={birthDay ?? ""} onChange={handleDayChange}>
          <option value="">{t("anyDay")}</option>
          {days.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>
      {isActive && (
        <a href="#" className="clear-birthday" onClick={handleClear}>
          {t("clear")}
        </a>
      )}
    </div>
  );
}
