"use client";
import {useState, useSyncExternalStore} from "react";
import {useRouter} from "next/navigation";
import {vsPath} from "@/components/occupation-country/vs";
import {localizePath} from "@/app/utils/hreflang";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export default function MatchupPicker({occupations, locale, labels}) {
  const router = useRouter();
  // Avoid accepting a selection before React can handle its change event.
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const initial = occupations.find(o => o.slug === "soccer-player") || occupations[0];
  const [occupationSlug, setOccupationSlug] = useState(initial?.slug || "");
  const [a, setA] = useState(initial?.countries.find(c => c.slug === "argentina")?.slug || initial?.countries[0]?.slug || "");
  const [b, setB] = useState(initial?.countries.find(c => c.slug === "brazil")?.slug || initial?.countries[1]?.slug || "");
  const occupation = occupations.find(o => o.slug === occupationSlug);
  const countries = occupation?.countries || [];
  const valid = a !== b && countries.some(c => c.slug === a) && countries.some(c => c.slug === b);
  const href = valid ? localizePath(locale, vsPath(occupationSlug, a, b)) : null;

  function changeOccupation(slug) {
    const next = occupations.find(o => o.slug === slug).countries;
    const nextA = next.some(c => c.slug === a) ? a : next[0].slug;
    const nextB = next.some(c => c.slug === b && c.slug !== nextA) ? b : next.find(c => c.slug !== nextA).slug;
    setOccupationSlug(slug);
    setA(nextA);
    setB(nextB);
  }

  function surprise() {
    const next = occupations[Math.floor(Math.random() * occupations.length)];
    const first = Math.floor(Math.random() * next.countries.length);
    const offset = 1 + Math.floor(Math.random() * (next.countries.length - 1));
    setOccupationSlug(next.slug);
    setA(next.countries[first].slug);
    setB(next.countries[(first + offset) % next.countries.length].slug);
  }

  if (!occupation) return <div className="arena-unavailable"><p>{labels.empty}</p><a href={localizePath(locale, "/vs")}>{labels.retry}</a></div>;
  return (
    <form className="arena-picker" onSubmit={event => {event.preventDefault(); if (href) router.push(href);}}>
      <fieldset className="arena-picker-controls" disabled={!ready}>
      <div className="arena-picker-title"><h2>{labels.build}</h2><button className="arena-surprise" type="button" onClick={surprise}><span aria-hidden="true">↝</span> {labels.surprise}</button></div>
      <div className="arena-fields">
        <label className="arena-field"><span>{labels.occupation}</span><select name="occupation" value={occupationSlug} onChange={event => changeOccupation(event.target.value)}>{occupations.map(o => <option key={o.slug} value={o.slug}>{o.name}</option>)}</select></label>
        <label className="arena-field arena-field-a"><span>{labels.countryA}</span><select name="countryA" value={a} onChange={event => setA(event.target.value)}>{countries.map(c => <option key={c.slug} value={c.slug} disabled={c.slug === b}>{c.name}</option>)}</select></label>
        <span className="arena-picker-vs" aria-hidden="true">VS</span>
        <label className="arena-field arena-field-b"><span>{labels.countryB}</span><select name="countryB" value={b} onChange={event => setB(event.target.value)}>{countries.map(c => <option key={c.slug} value={c.slug} disabled={c.slug === a}>{c.name}</option>)}</select></label>
        <button className="arena-submit" type="submit" disabled={!valid}>{labels.compare} <span aria-hidden="true">↗</span></button>
      </div>
      </fieldset>
    </form>
  );
}
