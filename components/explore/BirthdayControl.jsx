"use client";
import {useDispatch, useSelector} from "react-redux";
import {updateBirthMonth, updateBirthDay, clearBirthDate} from "../../features/exploreSlice";

const MONTHS = [
  {value: 1, label: "January", days: 31},
  {value: 2, label: "February", days: 29},
  {value: 3, label: "March", days: 31},
  {value: 4, label: "April", days: 30},
  {value: 5, label: "May", days: 31},
  {value: 6, label: "June", days: 30},
  {value: 7, label: "July", days: 31},
  {value: 8, label: "August", days: 31},
  {value: 9, label: "September", days: 30},
  {value: 10, label: "October", days: 31},
  {value: 11, label: "November", days: 30},
  {value: 12, label: "December", days: 31},
];

const getMaxDaysForMonth = month => {
  if (month === null) return 31;
  const monthData = MONTHS.find(m => m.value === month);
  return monthData ? monthData.days : 31;
};

export default function BirthdayControl() {
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
      <h4>Born On This Day</h4>
      <div className="birthday-inputs">
        <select value={birthMonth ?? ""} onChange={handleMonthChange}>
          <option value="">Any Month</option>
          {MONTHS.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select value={birthDay ?? ""} onChange={handleDayChange}>
          <option value="">Any Day</option>
          {days.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>
      {isActive && (
        <a href="#" className="clear-birthday" onClick={handleClear}>
          Clear
        </a>
      )}
    </div>
  );
}
