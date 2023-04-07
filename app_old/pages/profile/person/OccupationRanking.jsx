import React, { Component } from "react";
import Link from "next/link";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import { plural } from "pluralize";
import { FORMATTERS } from "types";
import { toTitleCase } from "viz/helpers";

class OccupationRanking extends Component {
  render() {
    const { person, ranking } = this.props;
    const me = ranking.find((rank) => rank.slug === person.slug);

    const betterRankedPeers = ranking.filter(
      (p) => p.occupation_rank_unique < me.occupation_rank_unique
    );
    const worseRankedPeers = ranking.filter(
      (p) => p.occupation_rank_unique > me.occupation_rank_unique
    );

    let betterPeers = null,
      worsePeers = null;

    if (betterRankedPeers.length) {
      betterPeers = (
        <span>
          Before{" "}
          {person.gender ? (person.gender === "M" ? "him" : "her") : "them"} are{" "}
          <AnchorList
            items={betterRankedPeers}
            name={(d) =>
              d.birthcountry
                ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})`
                : d.name
            }
            url={(d) => `/profile/person/${d.slug}/`}
          />
          .{" "}
        </span>
      );
    }
    if (worseRankedPeers.length) {
      worsePeers = (
        <span>
          After{" "}
          {person.gender ? (person.gender === "M" ? "him" : "her") : "them"} are{" "}
          <AnchorList
            items={worseRankedPeers}
            name={(d) =>
              d.birthcountry
                ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})`
                : d.name
            }
            url={(d) => `/profile/person/${d.slug}/`}
          />
          .
        </span>
      );
    }

    return (
      <div>
        <p>
          Among {plural(person.occupation.occupation.toLowerCase())},{" "}
          {person.name} ranks{" "}
          <strong>{FORMATTERS.commas(me.occupation_rank)}</strong> out of{" "}
          {FORMATTERS.commas(person.occupation.num_born)}.&nbsp;
          {betterPeers}
          {worsePeers}
        </p>
        <div className="rank-title">
          <h3>
            Most Popular {toTitleCase(plural(person.occupation.occupation))} in
            Wikipedia
          </h3>
          <Link
            href={`/explore/rankings?show=people&occupation=${person.occupation.id}`}
          >
            Go to all Rankings
          </Link>
        </div>
        <PhotoCarousel
          me={person}
          people={ranking}
          rankAccessor="occupation_rank_unique"
        />
      </div>
    );
  }
}

export default OccupationRanking;
