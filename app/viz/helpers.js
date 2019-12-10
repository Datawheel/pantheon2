import {COLORS_DOMAIN, FORMATTERS} from "types/index";
import {extent, histogram, min, max, range} from "d3-array";

export const calculateYearBucket = (data = [], accessor = d => d.birthyear) => {
  let [minYear, maxYear] = extent(data, accessor);
  const earlyYears = minYear < -500 ? minYear + 500 : 1;
  const laterYears = maxYear > 2000 ? maxYear - 2000 : 1;
  if (minYear < -500) minYear = -500;
  if (maxYear > 2000) maxYear = 2000;
  const accessorClamp = d => {
    let y = accessor(d);
    if (y < minYear) y = minYear;
    if (y > maxYear) y = maxYear;
    return y;
  };
  const years = data.map(d => maxYear - accessorClamp(d));
  const buckets = 50;

  const linspace = (min, max, num) => {
    const r = range(0, num, 1);
    return r.map(n => min + n * (max - min) / (num - 1));
  };

  const big = Math.abs(minYear - maxYear);
  let a = linspace(0, Math.log10(big), buckets)
    .map(d => Math.ceil(Math.pow(10, d)));
  a = a.filter((d, i) => i === a.indexOf(d));

  const h = histogram()
    .domain([0, big])
    .thresholds(a)
    (years).reverse();

  data.forEach(d => {
    const ago = maxYear - accessorClamp(d);
    const bucket = !ago ? h[h.length - 1] : h.find(group => group.x0 <= ago);
    d.yearWeight = bucket.x1 === bucket.x0 ? 1 / earlyYears : !bucket.x0 ? 1 / laterYears : 1 / (bucket.x1 - bucket.x0);
    d.yearBucket = `${h.indexOf(bucket)}`;
  });

  const labels = h.map(b => FORMATTERS.year(Math.round(maxYear - (b.x0 + (b.x1 - b.x0) / 2))));

  const divisions = 5;
  const ticks = labels
    .map((d, i) => i)
    .filter(i => !i || i === labels.length - 1 || i <= labels.length - divisions && !(i % divisions));

  return [labels, ticks];

};

export const groupBy = attrs => {

  if (!attrs) return g => g;

  return g => d => {
    let val;

    if (d[g]) val = d[g];
    else if (d.occupation_id instanceof Array) {
      let id = d.occupation_id[0];
      if (id instanceof Array) id = id[0];
      val = attrs[id][g];
    }
    else {


      if (!attrs[d.occupation_id]) console.log(`No occupation found with ID: ${d.occupation_id}`, attrs[d.occupation_id]);
      val = attrs[d.occupation_id][g];
    }

    return val;
  };

};

export const groupTooltip = (data, accessor = () => []) => ({
  body: d => {
    const names = d.name instanceof Array ? d.name : [d.name];
    let txt = `<span class='sub'>Top Ranked ${names.length === 1 ? "Person" : "People"}</span>`;
    const people = data.sort((a, b) => b.hpi - a.hpi).filter(d => names.includes(d.name));
    const peopleNames = people.map(d => d.name);
    people.filter((d, i) => peopleNames.indexOf(d.name) === i).slice(0, 3).forEach(n => {
      txt += `<br /><span class="bold">${n.name}</span> b.${FORMATTERS.year(n.birthyear)}`;
    });
    return txt;
  },
  footer: d => {
    const id = accessor(d);
    return id instanceof Array ? "" : "Click to View Profile";
  }
});

export const on = (category, accessor) => ({
  "click.shape": d => {
    const id = accessor(d);
    if (!(id instanceof Array)) window.location.href = `/profile/${category}/${id}`;
  }
});

export const peopleTooltip = {
  body: d => {
    const birthyear = d.birthyear instanceof Array ? min(d.birthyear) : d.birthyear;
    const deathyear = d.deathyear instanceof Array ? max(d.deathyear) : d.deathyear;
    const suffix = d.birthyear instanceof Array ? " span" : "s old";
    const age = deathyear !== null
      ? deathyear - birthyear
      : new Date().getFullYear() - birthyear;
    return deathyear !== null
      ? `<span class="bold">${FORMATTERS.year(birthyear)} - ${FORMATTERS.year(deathyear)}</span>${age} year${suffix}</span>`
      : `<span class="bold">Born ${FORMATTERS.year(birthyear)}</span>${age} year${suffix}</span>`;
  },
  footer: d => d.name instanceof Array ? "" : "Click to View Profile"
};

export const shapeConfig = attrs => ({
  fill: d => {
    if (d.color) return d.color;
    else if (d.occupation_id !== undefined) {
      let occ = d.occupation_id.constructor === Array ? d.occupation_id[0] : d.occupation_id;
      if (occ instanceof Array) occ = occ[0];
      return COLORS_DOMAIN[attrs[occ].domain_slug];
    }
    return "#ccc";
  }
});

export const toTitleCase = myStr => myStr.replace(
  /\w\S*/g,
  txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
);
