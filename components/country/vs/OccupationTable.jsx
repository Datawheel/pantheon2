"use client";
import {Fragment, useState} from "react";

// The "compare all occupations" table, sortable by any column. Cells arrive
// formatted from the server (`text`) with raw numbers for sorting (`values`),
// so no translation or number-formatting code ships to the client.
// Column 0 is the occupation; then count and RCA for each side. Between the
// sides, an arrow points to whichever leads on the sorted metric: RCA when an
// RCA column is sorted, otherwise the number of biographies.
export default function OccupationTable({caption, headings, sides, rows, empty, locale}) {
  const [sort, setSort] = useState({column: 0, dir: "asc"});
  const collator = new Intl.Collator(locale);
  const sorted = [...rows].sort((a, b) => {
    const order = sort.dir === "asc" ? 1 : -1;
    if (sort.column === 0) return order * collator.compare(a.label, b.label);
    const x = a.values[sort.column - 1];
    const y = b.values[sort.column - 1];
    // Missing values sink to the bottom in both directions; ties stay alphabetical.
    if (x == null || y == null) return x == null ? (y == null ? 0 : 1) : -1;
    return order * (x - y) || collator.compare(a.label, b.label);
  });
  const toggle = column => setSort(current => current.column === column
    ? {column, dir: current.dir === "asc" ? "desc" : "asc"}
    : {column, dir: column === 0 ? "asc" : "desc"});

  const header = (column, label, props = {}) => {
    const active = sort.column === column;
    return <th scope="col" {...props}
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}>
      <button type="button" className="analysis-sort" onClick={() => toggle(column)}>
        {label}
        <span className={`analysis-sort-icon${active ? " is-active" : ""}`} aria-hidden="true">
          {active && sort.dir === "asc" ? "↑" : "↓"}
        </span>
      </button>
    </th>;
  };

  const metric = sort.column && sort.column % 2 === 0 ? 1 : 0;
  const compared = metric ? headings.rca : headings.count;
  const lead = row => {
    if (sides.some(side => side.missing)) return null;
    const a = row.values[metric], b = row.values[2 + metric];
    if (a == null || b == null || (!a && !b)) return null;
    return a === b ? "tie" : a > b ? "a" : "b";
  };
  const leadCell = row => {
    const side = lead(row);
    return <td key="lead" className={`analysis-lead${side ? ` is-${side}` : ""}`}>
      {side && <span aria-hidden="true">{{a: "←", b: "→", tie: "="}[side]}</span>}
      {side && side !== "tie" && <span className="analysis-sr">{sides[side === "a" ? 0 : 1].label}</span>}
    </td>;
  };

  return (
    <table aria-label={caption}>
      <colgroup><col className="analysis-col-label"/></colgroup>
      <colgroup key={sides[0].key} span={2}/>
      <colgroup><col className="analysis-col-lead"/></colgroup>
      {sides.slice(1).map(side => <colgroup key={side.key} span={2}/>)}
      <thead>
        <tr>
          {header(0, headings.occupation, {rowSpan: 2})}
          {sides.flatMap((side, i) => [
            i === 1 && <th key="lead" scope="col" rowSpan={2} className="analysis-lead" title={compared}>
              <span className="analysis-sr">{compared}</span>
            </th>,
            <th key={side.key} scope="colgroup" colSpan={2}
              className={`analysis-side-${i ? "b" : "a"}`}>{side.label}</th>,
          ])}
        </tr>
        <tr>{sides.flatMap((side, i) => [
          <Fragment key={`${side.key}-n`}>{header(1 + 2 * i, headings.count)}</Fragment>,
          <Fragment key={`${side.key}-rca`}>{header(2 + 2 * i, headings.rca)}</Fragment>,
        ])}</tr>
      </thead>
      <tbody>{sorted.map(row => <tr key={row.slug}
        className={{a: "is-lead-a", b: "is-lead-b"}[lead(row)]}>
        <th scope="row">{row.label}</th>
        {sides.map((side, i) => [i === 1 && leadCell(row), side.missing
          ? <td key={side.key} colSpan={2}>{empty}</td>
          : [0, 1].map(j => {
            const column = 2 * i + j;
            const href = j === 0 && row.hrefs[i];
            const classes = [j === 0 && "analysis-count", !row.values[2 * i] && "is-zero",
              j === metric && lead(row) === (i ? "b" : "a") && "is-lead"].filter(Boolean).join(" ");
            return <td key={`${side.key}-${j}`} className={classes || null}>
              {href
                ? <a href={href} aria-label={`${row.label} · ${side.label}: ${row.text[column]}`}><bdi>{row.text[column]}</bdi></a>
                : <bdi>{row.text[column]}</bdi>}
            </td>;
          })])}
      </tr>)}</tbody>
    </table>
  );
}
