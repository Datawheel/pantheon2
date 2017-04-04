import {COLORS_DOMAIN} from "types";
import {scaleLinear, scaleLog} from "d3-scale";

const domain = [1, 100], maxYear = 2016, minYear = -3500;
const yearMap = scaleLinear().domain([maxYear, minYear]).range(domain);
const logMap = scaleLog().domain(domain).rangeRound([50, 1]);

function bucketScale(val) {
  return logMap(yearMap(val));
}
bucketScale.invert = val => Math.round(yearMap.invert(logMap.invert(new Date(val).getFullYear())));
export {bucketScale};

export function groupBy(attrs) {

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


      if (!attrs[d.occupation_id]) console.log(d.occupation_id, attrs[d.occupation_id]);
      val = attrs[d.occupation_id][g];
    }

    return val;
  };

}

export function groupTooltip(data, accessor = () => []) {
  return {
    body: d => {
      const names = d.name instanceof Array ? d.name.slice(0, 3) : [d.name];
      let txt = `<span class='sub'>Notable ${names.length === 1 ? "Person" : "People"}</span>`;
      const people = data.filter(d => names.includes(d.name));
      const peopleNames = people.map(d => d.name);
      people.filter((d, i) => peopleNames.indexOf(d.name) === i).slice(0, 3).forEach(n => {
        txt += `<br /><span class="bold">${n.name}</span>b.${n.birthyear}`;
      });
      return txt;
    },
    footer: d => {
      const id = accessor(d);
      return id instanceof Array ? "" : "Click to View Profile";
    }
  };
}

export function on(category, accessor) {
  return  {
    "click.shape": d => {
      const id = accessor(d);
      if (!(id instanceof Array)) window.location.href = `/profile/${category}/${id}`;
    }
  };
}

export const peopleTooltip = {
  body: d => {
    const age = d.deathyear !== null
              ? d.deathyear - d.birthyear
              : new Date().getFullYear() - d.birthyear;
    return d.deathyear !== null
         ? `<span class="center">${d.birthyear} - ${d.deathyear}, ${age} years old</span>`
         : `<span class="center">Born ${d.birthyear}, ${age} years old</span>`;
  },
  footer: d => d.name instanceof Array ? "Click to Highlight" : "Click to View Profile"
};

export function shapeConfig(attrs) {
  return {
    fill: d => {
      if (d.color) return d.color;
      else if (d.occupation_id !== void 0) {
        let occ = d.occupation_id.constructor === Array ? d.occupation_id[0] : d.occupation_id;
        if (occ instanceof Array) occ = occ[0];
        return COLORS_DOMAIN[attrs[occ].domain_slug];
      }
      return "#ccc";
    }
  };
}
