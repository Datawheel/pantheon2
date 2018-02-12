import React from "react";
import AnchorList from "components/utils/AnchorList";
import SectionHead from "pages/profile/common/SectionHead";
import {Tree} from "d3plus-react";
import {plural} from "pluralize";
import {shapeConfig, groupTooltip, groupBy, on} from "viz/helpers";

const RelatedOccupations = ({peopleInDomain, occupation, occupations}) => {
  const tmapDomainData = peopleInDomain
    .filter(p => p.birthyear !== null)
    .sort((a, b) => b.langs - a.langs);

  tmapDomainData.forEach(d => {
    d.industry = d.occupation.industry;
    d.domain = d.occupation.domain;
    d.occupation_id = `${d.occupation_id}`;
    d.occupation_name = d.occupation.occupation;
  });

  const attrs = occupations.reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  return (
    <section className="profile-section">
      <SectionHead title="Related Occupations" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            {plural(occupation.occupation)} are found within the {occupation.domain} domain which also contains the following occupations <AnchorList items={occupations.filter(p => p.domain_slug === occupation.domain_slug && p.id !== occupation.id).slice(0, 5)} name={d => d.occupation} url={d => `/profile/occupation/${d.occupation_slug}/`} />.
          </p>
        </div>
        <Tree
          key="tree_domain"
          config={{
            title: `Related Occupations Within the ${occupation.domain} Domain`,
            data: tmapDomainData,
            depth: 2,
            groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
            legend: false,
            on: on("occupation", d => d.occupation.occupation_slug),
            orient: "horizontal",
            shapeConfig: Object.assign({}, shapeConfig(attrs),
              {
                labelConfig: {
                  fontColor: "#4B4A48",
                  fontFamily: () => "Amiko",
                  fontResize: false,
                  fontSize: () => 13
                }
              }),
            tooltipConfig: groupTooltip(tmapDomainData, d => d.occupation.occupation_slug),
            sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
          }} />
      </div>
    </section>
  );
};

export default RelatedOccupations;
