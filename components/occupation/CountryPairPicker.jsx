"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {vsPath} from "@/components/occupation-country/vs";
import {localizePath} from "@/app/utils/hreflang";

export default function CountryPairPicker({countries, occupation, locale, labels}) {
  const router = useRouter();
  const [first, setFirst] = useState(countries[0].slug);
  const [second, setSecond] = useState(countries[1].slug);
  const alphabetical = [...countries].sort((a, b) => a.name.localeCompare(b.name, locale));
  return <form className="occupation-pair-picker" onSubmit={event => {
    event.preventDefault();
    if (first !== second) router.push(localizePath(locale, vsPath(occupation, first, second)));
  }}>
    <fieldset>
      <legend>{labels.build}</legend>
      <div>
        {[[labels.a, first, setFirst, second], [labels.b, second, setSecond, first]].map(([label, value, setValue, other]) =>
          <label key={label}>{label}
            <select value={value} onChange={event => setValue(event.target.value)}>
              {alphabetical.map(c => <option key={c.slug} value={c.slug} disabled={c.slug === other}>
                {c.name} ({c.count.toLocaleString(locale)})
              </option>)}
            </select>
          </label>)}
        <button type="submit">{labels.compare} <span aria-hidden="true">↗</span></button>
      </div>
    </fieldset>
  </form>;
}
