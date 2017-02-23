import {COLORS_DOMAIN} from "types";



export function groupBy(attrs) {

  return g => d => {
    let val;

    if (d[g]) val = d[g];
    else if (d.occupation_id instanceof Array) val = attrs[d.occupation_id[0]][g];
    else val = attrs[d.occupation_id][g];

    return val;
  };

}

export function groupTooltip(data) {
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
  }
};

export function shapeConfig(attrs) {
  return {
    fill: d => {
      if (d.color) return d.color;
      else if (d.occupation_id !== void 0) {
        const occ = d.occupation_id.constructor === Array ? d.occupation_id[0] : d.occupation_id;
        return COLORS_DOMAIN[attrs[occ].domain_slug];
      }
      return "#ccc";
    }
  };
}
