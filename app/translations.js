// UI translations for different languages
export const translations = {
  en: {
    stillAlive: "today",
    birthdayToast: ({name, possessiveName}) => `Today is ${possessiveName || `${name}'s`} birthday`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank, possessiveName}) =>
      `${name} (${birthYear}–${deathYear}) is a ${demonym} ${occupation} ranked #${rank} globally by Pantheon's Historical Popularity Index. Explore ${possessiveName} biography, page views, memorability metrics, and comparisons.`,
    person: {
      loading: "Loading...",
      metaTitle: ({name}) => `${name} Biography | Pantheon`,
      sections: {
        trending: "Trending",
        memorabilityMetrics: "Memorability Metrics",
        trendingActivity: "Trending Activity",
        notableWorks: "Notable Works",
        pageViewsByLang: ({name}) => `Page views of ${name} by language`,
        amongOccupation: ({occupationPlural}) => `Among ${occupationPlural}`,
        contemporaries: "Contemporaries",
        inCountry: ({country}) => `In ${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `Among ${occupationPlural} In ${country}`,
        filmography: "Filmography",
        tvMovieRoles: "Television and Movie Roles",
        insights: "Data Insights",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} is the top-ranked of all ${totalFormatted} ${occupationPlural} in Pantheon worldwide.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} ranks #${rank} of ${totalFormatted} ${occupationPlural} worldwide — among the top ${topPercent}% of the profession.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} is the highest-ranked of the ${totalFormatted} individuals in Pantheon born in ${country}.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `Of the ${count} ${occupationPlural} born in ${country}, ${name} ranks first.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} is the most memorable of the ${count} notable people born in ${city}, ${country}${peers ? `, ahead of ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} is the most memorable of the ${count} notable people born in ${city}, in what is now modern-day ${country}${peers ? `, ahead of ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `Of the ${count} people in Pantheon born in ${year}, ${name} is the most memorable.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `${name}'s biography appears in ${count} language editions of Wikipedia — more than ${percent}% of all ${occupationPlural}.`,
        newLangs: ({name, count}) =>
          `${name}'s biography was added to ${count} new Wikipedia language editions in the past year.`,
        nonEnglish: ({name, count}) =>
          `${name}'s biography drew ${count} page views from non-English Wikipedia editions in the past year — fame that reaches well beyond the English-speaking world.`,
        enduringFame: ({name, centuries, rank}) =>
          `More than ${centuries} centuries after death, ${name} still holds rank #${rank} among all individuals in Pantheon.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `With ${views} Wikipedia page views over the past year, ${name} was the most viewed of all ${occupationPlural}.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `${name}'s Wikipedia page drew ${views} views over the past year — ${multiple}× the average among ${occupationPlural}.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `${name} is one of only ${womenCount} women among the ${totalFormatted} ${occupationPlural} in Pantheon.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `Despite a life of just ${age} years, ${name} ranks #${rank} among all ${occupationPlural} in history.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} is one of the ${count} earliest-born ${occupationPlural} in all of Pantheon.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} shares a ${date} birthday with ${twinNames}.`,
        fallback: ({name, count, hpi}) =>
          `${name}'s biography spans ${count} Wikipedia language editions and earns a Historical Popularity Index of ${hpi}.`,
      },
      metrics: {
        pageViews: "Page Views",
        past12Months: "Past 12 months",
        hpi: "HPI",
        hpiDesc: "Historical Popularity Index",
        avgOf: ({label}) => `Avg ${label}`,
      },
      ranking: {
        // *Html params arrive as pre-built HTML (<strong>rank</strong>, <a>country</a>);
        // sentences render via dangerouslySetInnerHTML so word order can vary per locale.
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `Among ${occupationPlural}, ${name} ranks ${rankHtml} out of ${totalFormatted}.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `Among people born in ${year}, ${name} ranks ${rankHtml}.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `Among people deceased in ${year}, ${name} ranks ${rankHtml}.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `Among people born in ${countryHtml}, ${name} ranks ${rankHtml} out of ${totalFormatted}.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `Among ${occupationPlural} born in ${countryHtml}, ${name} ranks ${rankHtml}.`,
        beforePeers: ({gender, count}) =>
          `Before ${gender === "M" ? "him" : gender === "F" ? "her" : "them"} ${count === 1 ? "is" : "are"} `,
        afterPeers: ({gender, count}) =>
          `After ${gender === "M" ? "him" : gender === "F" ? "her" : "them"} ${count === 1 ? "is" : "are"} `,
        notRankedIn: ({name, countryHtml}) => `${name} is not ranked in ${countryHtml}`,
        mostPopularInWikipedia: ({occupationPlural}) => `Most Popular ${occupationPlural} in Wikipedia`,
        othersBornInYear: ({year}) => `Others Born in ${year}`,
        othersDeceasedInYear: ({year}) => `Others Deceased in ${year}`,
        othersBornInCountry: ({countryHtml}) => `Others born in ${countryHtml}`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${demonym} born ${occupationPlural}`,
        goToAllRankings: "Go to all Rankings",
        and: " and ",
      },
      carousel: {
        present: "Present",
        hpiLabel: "HPI:",
        rankLabel: "Rank:",
      },
      footer: {
        relatedProfiles: "Related Profiles",
        individuals: ({countFormatted}) => `${countFormatted} Individuals`,
        rank: ({rankFormatted}) => `Rank ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `${langCode}.WIKIPEDIA PAGE VIEWS (PV)`,
        rankInLanguage: ({rank, language}) => `Rank #${rank} in ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `${count} trending ${count === 1 ? "day" : "days"}`,
        less: "Less",
        more: "More",
        clickForDetails: "Click for details",
        notTrending: "Not trending",
        rankNum: ({rank}) => `Rank #${rank}`,
        viewAllTrendingNews: ({date}) => `View all trending news for ${date}`,
      },
      pageViewsByLangChart: {
        languageEditions: "Language editions",
        pageviewsByLanguageEdition: "Pageviews by language edition",
        cumulativeLanguageEditions: "Cumulative language editions",
        editionsWord: "editions",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} views`,
        andOthers: ({count}) => `(and ${count} others)`,
        summaryIntro: ({name}) => `Over the past year ${name} has had the most page views in the `,
        wikipediaEdition: ({language}) => `${language} wikipedia edition`,
        withViewsFollowedBy: ({viewsFormatted}) => ` with ${viewsFormatted} views, followed by `,
        growthIntro: ". In terms of yearly growth of page views the top 3 wikipedia editions are ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) is a ${familyName} language in the ${primaryFamilyName} family of languages.`,
        // Localized names for the language-family legend; English is the identity.
        families: {},
      },
    },
    occupationCountry: {
      theMostFamous: "The Most Famous",
      from: "from",
      greatest: "Greatest",
      keepExploring: "Keep Exploring",
      trendingThisWeek: "Trending This Week",
      trendScoreLabel: "Trend Score",
      whyTrending: "Why is this trending?",
      clicksThisWeek: "Clicks this week",
      impressionsThisWeek: "Impressions this week",
      readMore: "Read more",
      showLess: "Show less",
      notablePeople: ({count, countFormatted}) =>
        `${countFormatted || count} notable ${count === 1 ? "person" : "people"}`,
      viewsLabel: "views",
      onDate: ({date}) => `on ${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Trending ${occupationPlural} This Week`;
        return hasFromPrefix
          ? `Trending ${occupationPlural} ${locationLabel} This Week`
          : `Trending ${locationLabel} ${occupationPlural} This Week`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `The top 10 ${occupationPlural} trending on Wikipedia`;
        return hasFromPrefix
          ? `The top 10 ${occupationPlural} ${locationLabel} trending on Wikipedia`
          : `The top 10 ${locationLabel} ${occupationPlural} trending on Wikipedia`;
      },
      trendingIntroSuffix: "in the past 7 days, with a quick note on what drove the spike.",
      trendingThisWeekShort: "Trending this week",
      trendingThisWeekDefault: "Trending this week on Wikipedia",
      metaTitle: ({demonym, occupationPlural}) => `Greatest ${demonym} ${occupationPlural} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPluralLower, occupationSingularLower, country}) => `Discover the ${countFormatted} most famous ${demonym} ${occupationPluralLower} in history. Explore notable ${occupationSingularLower} profiles from ${country} ranked by historical significance.`,
      birthDecadesTitle: "People by Birth Decade",
      birthDecadesIntro: ({demonym, occupationPlural}) => `Browse notable ${demonym} ${occupationPlural} grouped by birth decade. Each decade shows the top 10 by HPI; expand to see everyone.`,
      decadeLabel: ({decade}) => `${decade}s`,
      more: ({count}) => `+${count} more`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `Pantheon has ${totalCount} people classified as ${demonym} ${occupationPlural} born between ${oldestYear} and ${youngestYear}.`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `Of these ${totalCount}, none of them are still alive today.`;
        return `Of these ${totalCount}, ${aliveCountFormatted} (${aliveShare}) of them are still alive today.`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `The most famous living ${demonym} ${occupationPlural} include `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `The most famous deceased ${demonym} ${occupationPlural} include `,
      peopleNewAsOf: "April 2024",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `As of ${asOfLabel}, ${countFormatted} new ${demonym} ${occupationPlural} have been added to Pantheon including `,
      goToAllRankings: "Go to all Rankings",
      livingTitle: ({demonym, occupationPlural}) => `Living ${demonym} ${occupationPlural}`,
      deceasedTitle: ({demonym, occupationPlural}) => `Deceased ${demonym} ${occupationPlural}`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `Newly Added ${demonym} ${occupationPlural} (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        let text = `This page contains a list of the greatest ${demonym} ${occupationPlural}. `;
        text += `The pantheon dataset contains ${totalCount} ${occupationPlural}, ${countryCount} of which were born in ${country}. `;
        if (rank) {
          text += `This makes ${country} the birth place of the ${rank} most number of ${occupationPlural}`;
          if (countriesBehind) {
            text += ` behind ${countriesBehind}.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "and",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `The following people are considered by Pantheon to be the ${count === 10 ? "top 10" : ""} most legendary ${demonym} ${occupationPlural} of all time. This list of famous ${demonym} ${occupationPlural} is sorted by HPI (Historical Popularity Index), a metric that aggregates information on a biography's online popularity.`,
      visitRankings: "Visit the rankings page to view the entire list of",
      top: "Top",
      withHpi: ({hpi, name}) => `With an HPI of ${hpi}, ${name}`,
      isMostFamous: ({demonym, occupation}) => `is the most famous ${demonym} ${occupation}.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `is the ${rank} most famous ${demonym} ${occupation}.`,
      biographyTranslated: ({possessive, count}) => `${possessive} biography has been translated into ${count} different languages`,
      onWikipedia: "on wikipedia",
    },
    selectPerson: {
      heading: "Explore Notable People",
      subtitle: "Discover the most influential individuals in human history across every field, country, and era",
      metaDescription: "Browse over 85,000 biographies of notable people with Wikipedia presence in 15+ languages. Search by name, explore by occupation, country, or era.",
      searchPlaceholder: "Search people, places, & occupations",
      randomPerson: "Random Person",
      statPeople: "biographies",
      statLanguages: "language editions",
      description: "Pantheon tracks biographies with a presence in at least 15 Wikipedia language editions, classified by occupation and organized by country and city of origin.",
      featuredPeople: "Most Notable People",
      trendingNow: "Trending Now",
      browseByField: "Browse by Field",
      domainSports: "Sports",
      domainArts: "Arts & Entertainment",
      domainScience: "Science & Technology",
      domainPolitics: "Politics & Leadership",
      exploreMore: "Explore More",
      byOccupationCountry: "By Occupation & Country",
      rankings: "Rankings",
      byEra: "By Era",
    },
    selectCountry: {
      heading: "Explore Countries",
      subtitle: "Discover the most notable people from every country in the world",
      metaDescription: "Explore notable people from every country. Browse biographies by country of birth, view interactive maps, and discover historical figures from around the world.",
      totalCountries: "countries",
      totalPeople: "notable people",
      mapTitle: "Notable People by Country",
      countryList: "All Countries",
      sortAlpha: "A–Z",
      sortPeople: "Most People",
      people: "people",
      noPeopleData: "No data available",
      exploreMore: "Explore More",
      byPerson: "Notable People",
      byOccupation: "By Occupation & Country",
      rankings: "Rankings",
    },
    selectPlace: {
      heading: "Explore Places",
      subtitle: "Discover the cities and towns that shaped history's most notable people",
      metaDescription: "Explore the birthplaces of notable people worldwide. Browse cities by number of notable births, view interactive maps, and discover historical hotspots.",
      totalPlaces: "places",
      totalPeople: "notable people",
      mapTitle: "Birthplaces of Notable People",
      placeList: "Top Places",
      sortAlpha: "A–Z",
      sortPeople: "Most People",
      groupByCountry: "By Country",
      people: "people",
      exploreMore: "Explore More",
      byPerson: "Notable People",
      byCountry: "By Country",
      rankings: "Rankings",
    },
    selectOccupation: {
      heading: "Explore Occupations",
      subtitle: "Discover the fields and professions that shaped history's most notable people",
      metaDescription: "Explore 101 occupations of history's most notable people. Browse by profession, view the number of notable individuals in each field.",
      totalOccupations: "occupations",
      totalPeople: "notable people",
      occupationList: "All Occupations",
      sortAlpha: "A–Z",
      sortPeople: "Most People",
      people: "people",
      exploreMore: "Explore More",
      byPerson: "Notable People",
      byCountry: "By Country",
      rankings: "Rankings",
    },
    selectOccupationCountry: {
      heading: "Select an occupation and country",
      pleaseSelect: "Please select an occupation and country combination to see the most memorable biographies",
      selectOccupation: "Select an occupation",
      selectCountry: "Select a country",
      goToProfile: "Go to profile",
      whoAreTheMostFamous: "Who are the most famous...",
      trendingThisWeek: "Trending This Week",
      browseByCountry: "Browse by Country",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
      }) => {
        const possessive = gender === "M" ? "His" : gender === "F" ? "Her" : "Their";

        let sentence = `${possessive} biography is available in ${l} different languages on Wikipedia`;
        if (l_prev && l !== l_prev) {
          sentence += ` (${l > l_prev ? "up" : "down"} from ${l_prev} in 2024)`;
        }
        sentence += ". ";

        sentence += `${name} is the ${occupationRank === 1 ? "" : formatOrdinal(occupationRank)} most popular <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a>`;
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          sentence += ` (${occupationRank < occupationRankPrev ? "up" : "down"} from ${formatOrdinal(occupationRankPrev)} in 2024)`;
        }

        if (country) {
          sentence += `, the ${bplaceCountryRank !== 1 ? formatOrdinal(bplaceCountryRank) : ""} most popular biography from <a href="/profile/place/${countrySlug}">${country}</a>`;
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            sentence += ` (${bplaceCountryRank < bplaceCountryRankPrev ? "up" : "down"} from ${formatOrdinal(bplaceCountryRankPrev)} in 2019)`;
          }

          if (bplaceCountryOccupationRank) {
            sentence += ` and the ${bplaceCountryOccupationRank !== 1 ? formatOrdinal(bplaceCountryOccupationRank) : ""} most popular <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${demonym} ${occupation}</a>`;
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "Visualizations",
      rankings: "Rankings",
      profiles: "Profiles",
      people: "People",
      bornOnThisDay: "Born on This Day",
      places: "Places",
      countries: "Countries",
      occupations: "Occupations",
      occupationCountry: "Occupation / Country",
      eras: "Eras",
      deaths: "Deaths",
      about: "About",
      data: "Data",
      permissions: "Permissions",
      download: "Download",
      api: "API",
      games: "Games",
      yearbook: "Yearbook",
      birthle: "Birthle",
      trivia: "Trivia",
      news: "News",
      search: "Search",
      home: "Home",
      giveFeedback: "Give Feedback",
      usageCitation: "Usage Citation",
      newBadge: "new!",
      explore: "Explore",
      apps: "Apps",
      reportDataError: "Report Data Error",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
    readMoreWikipedia: "Read more on Wikipedia",
    learnMoreRankless: "Learn more about {name}'s academic impact at Rankless",
    home: {
      tagline: "Explore human collective memory!",
      subtitle:
        "Pantheon helps you discover the geography and dynamics of our planet's history.",
      explore: "Explore",
      people: "People",
      places: "Places",
      occupations: "Occupations",
      and: "and",
      eras: "Eras",
      trendingProfiles: "Trending Profiles Today",
      topProfilesBy: "Top profiles by pageviews for the",
      wikipediaEdition: "wikipedia edition",
      about:
        "is an observatory of collective memory focused on biographies with a presence in at least",
      languages: "languages",
      aboutContinued:
        "in Wikipedia. We have data on more than 85,000 biographies, organized by countries, cities, occupations, and eras. Explore this data to learn about the characters that shape human culture.",
      aboutDeveloped:
        "began as a project at the Collective Learning group at MIT. Today it is developed by",
      datawheel: "Datawheel",
      aboutDatawheel:
        ", a company specialized in the creation of data distribution and visualization solutions.",
      recentPassings: "Recent Passings",
      bornOnThisDay: "Born on This Day",
      bornOnThisDayText: "Discover which famous people share your birthday! Explore our new birthday pages to find celebrities, historical figures, and notable personalities born on any day of the year.",
      bornOnThisDayLink: "See who was born today",
      notableDeaths: "Notable Deaths of 2025",
      notableDeathsText:
        "Want to see the complete list of notable figures we've lost in 2025? Visit our",
      notableDeathsLink: "Notable Deaths of 2025",
      notableDeathsContinued:
        "page for a comprehensive collection of biographies featuring influential personalities, including celebrities, artists, leaders, and cultural icons who have passed away this year.",
      trendingSingers: "Trending Singers Today",
      trendingActors: "Trending Actors Today",
      recentlyAdded: "Recently Added to Pantheon",
      searchPlaceholder: "Search people, places, & occupations",
      isTrending: "is trending today",
      readFullStory: "Read full story",
      turningXToday: ({age}) => `Turning ${age} today!`,
      wouldHaveBeenX: ({age}) => `Would be ${age} today`,
      seeAllBirthdays: "See all birthdays",
      bornTodayTitle: "Famous People Born Today",
    },
    recentlyAdded: {
      title: "Recently Added to Pantheon",
      subtitle: "Discover the newest biographies added to Pantheon's collection, ordered by their addition date.",
      addedOn: ({date}) => `Added ${date}`,
      previous: "Previous",
      next: "Next",
      pageLabel: ({page}) => `Page ${page}`,
      viewMore: "See more recently added people",
      empty: "No recently added people were found.",
    },
    news: {
      pageTitle: "Who is Trending Today?",
      pageSubtitle: "Daily summaries of historical figures (generated by AI)",
      trendingIn: "Trending in",
      selectDate: "Select a different date",
      references: "References:",
      noData: "No trending data available for this date.",
      previousDay: "Previous Day",
      nextDay: "Next Day",
      unknown: "Unknown",
    },
    trending: {
      isTrendingToday: "{name} is trending today!",
      whyTrending: "Why {name} is Trending:",
      references: "References:",
      viewMoreTrending: "View more trending people",
    },
    bornOnThisDay: {
      famousBirthdays: "Famous Birthdays",
      bornOnThisDay: "Born on This Day",
      famousPeopleBornOnThisDay: ({count}) => `${count} famous ${count === 1 ? "person" : "people"} born on this day`,
      birthdayOf: ({displayDate, count}) => `${displayDate} is the birthday of ${count} celebrities and historically significant ${count === 1 ? "person" : "people"} in the Pantheon database.`,
      mostFamousInclude: "The most famous include",
      mostCommonOccupations: "The most common occupations for people born on this day are",
      exploreAnotherDate: "Explore Another Date",
      go: "Go",
      today: "Today",
      previousDay: "Previous Day",
      nextDay: "Next Day",
      famousPeopleBornOn: ({displayDate}) => `Famous People Born on ${displayDate}`,
      discoverRemarkable: ({displayDate}) => `Discover the remarkable individuals who share ${displayDate} as their birthday. From world leaders and groundbreaking scientists to beloved entertainers and legendary athletes, this day has seen the birth of many influential figures throughout history.`,
      someNotableInclude: "Some of the most notable include",
      stillLivingToday: ({total, living}) => `Of the ${total} famous people born on this date, ${living} are still living today.`,
      viewFullRankings: "View Full Rankings for This Day",
      born: "Born",
      birthdaysByOccupation: "Birthdays by Occupation",
      occupationIntro: ({displayDate}) => `See how the famous people born on ${displayDate} are distributed across different fields and occupations. Click on any person to learn more about their life and achievements.`,
      showLess: "Show less",
      more: ({count}) => `+${count} more`,
      formatDate: ({month, day}) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
        return `${months[month - 1]} ${day}${suffix}`;
      },
      metaTitle: ({displayDate}) => `Famous Birthdays on ${displayDate} | Who Was Born Today? | Pantheon`,
      metaDescription: ({displayDate}) => `Discover the most famous people born on ${displayDate} throughout history. Explore birthday profiles of celebrities, historical figures, scientists, artists, athletes and more who share this birthday.`,
      months: {
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December",
      },
    },
  },
  es: {
    stillAlive: "presente",
    person: {
      loading: "Cargando...",
      metaTitle: ({name}) => `Biografía de ${name} | Pantheon`,
      sections: {
        trending: "Tendencias",
        memorabilityMetrics: "Métricas de memorabilidad",
        trendingActivity: "Actividad de tendencias",
        notableWorks: "Obras destacadas",
        pageViewsByLang: ({name}) => `Visitas a la página de ${name} por idioma`,
        amongOccupation: ({occupationPlural}) => `Entre ${occupationPlural}`,
        contemporaries: "Contemporáneos",
        inCountry: ({country}) => `En ${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `Entre ${occupationPlural} en ${country}`,
        filmography: "Filmografía",
        tvMovieRoles: "Papeles en televisión y cine",
        insights: "Datos destacados",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} ocupa el primer puesto entre los ${totalFormatted} ${occupationPlural} de Pantheon en todo el mundo.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} ocupa el puesto n.º ${rank} entre ${totalFormatted} ${occupationPlural} del mundo, dentro del ${topPercent} % más destacado de la profesión.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} es la figura mejor clasificada de las ${totalFormatted} personas de Pantheon nacidas en ${country}.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `De los ${count} ${occupationPlural} nacidos en ${country}, ${name} ocupa el primer puesto.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} es la figura más memorable de las ${count} personas notables nacidas en ${city}, ${country}${peers ? `, por delante de ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} es la figura más memorable de las ${count} personas notables nacidas en ${city}, en lo que hoy es ${country}${peers ? `, por delante de ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `De las ${count} personas de Pantheon nacidas en ${year}, ${name} es la más memorable.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `La biografía de ${name} aparece en ${count} ediciones lingüísticas de Wikipedia, más que el ${percent} % de los ${occupationPlural}.`,
        newLangs: ({name, count}) =>
          `La biografía de ${name} se añadió a ${count} nuevas ediciones lingüísticas de Wikipedia durante el último año.`,
        nonEnglish: ({name, count}) =>
          `La página de ${name} recibió ${count} visitas desde ediciones de Wikipedia distintas de la inglesa durante el último año: una fama que va mucho más allá del mundo anglosajón.`,
        enduringFame: ({name, centuries, rank}) =>
          `Más de ${centuries} siglos después de su muerte, ${name} aún ocupa el puesto n.º ${rank} entre todas las personas de Pantheon.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `Con ${views} visitas en Wikipedia durante el último año, ${name} fue quien más visitas recibió entre los ${occupationPlural}.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `La página de Wikipedia de ${name} recibió ${views} visitas durante el último año: ${multiple} veces la media de los ${occupationPlural}.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `${name} es una de apenas ${womenCount} mujeres entre los ${totalFormatted} ${occupationPlural} de Pantheon.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `A pesar de vivir solo ${age} años, ${name} ocupa el puesto n.º ${rank} entre todos los ${occupationPlural} de la historia.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} es una de las ${count} figuras nacidas más temprano entre los ${occupationPlural} de Pantheon.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} comparte cumpleaños (${date}) con ${twinNames}.`,
        fallback: ({name, count, hpi}) =>
          `La biografía de ${name} abarca ${count} ediciones lingüísticas de Wikipedia y obtiene un Índice de Popularidad Histórica de ${hpi}.`,
      },
      metrics: {
        pageViews: "Visitas",
        past12Months: "Últimos 12 meses",
        hpi: "HPI",
        hpiDesc: "Índice de Popularidad Histórica",
        avgOf: ({label}) => `Prom. ${label}`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `Entre ${occupationPlural}, ${name} ocupa el puesto ${rankHtml} de ${totalFormatted}.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `Entre las personas nacidas en ${year}, ${name} ocupa el puesto ${rankHtml}.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `Entre las personas fallecidas en ${year}, ${name} ocupa el puesto ${rankHtml}.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `Entre las personas nacidas en ${countryHtml}, ${name} ocupa el puesto ${rankHtml} de ${totalFormatted}.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `Entre ${occupationPlural} nacidos en ${countryHtml}, ${name} ocupa el puesto ${rankHtml}.`,
        beforePeers: ({gender, count}) =>
          `Antes de ${gender === "M" ? "él" : gender === "F" ? "ella" : "ellos"} ${count === 1 ? "está" : "están"} `,
        afterPeers: ({gender, count}) =>
          `Después de ${gender === "M" ? "él" : gender === "F" ? "ella" : "ellos"} ${count === 1 ? "está" : "están"} `,
        notRankedIn: ({name, countryHtml}) => `${name} no está clasificado en ${countryHtml}`,
        mostPopularInWikipedia: ({occupationPlural}) => `${occupationPlural} más populares en Wikipedia`,
        othersBornInYear: ({year}) => `Otras personas nacidas en ${year}`,
        othersDeceasedInYear: ({year}) => `Otras personas fallecidas en ${year}`,
        othersBornInCountry: ({countryHtml}) => `Otras personas nacidas en ${countryHtml}`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym}`,
        goToAllRankings: "Ver todas las clasificaciones",
        and: " y ",
      },
      carousel: {
        present: "presente",
        hpiLabel: "HPI:",
        rankLabel: "Puesto:",
      },
      footer: {
        relatedProfiles: "Perfiles relacionados",
        individuals: ({countFormatted}) => `${countFormatted} personas`,
        rank: ({rankFormatted}) => `Puesto ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `VISITAS EN ${langCode}.WIKIPEDIA (PV)`,
        rankInLanguage: ({rank, language}) => `Puesto n.º ${rank} en ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `${count} ${count === 1 ? "día" : "días"} en tendencia`,
        less: "Menos",
        more: "Más",
        clickForDetails: "Haz clic para ver detalles",
        notTrending: "Sin tendencia",
        rankNum: ({rank}) => `Puesto n.º ${rank}`,
        viewAllTrendingNews: ({date}) => `Ver todas las noticias en tendencia del ${date}`,
      },
      pageViewsByLangChart: {
        languageEditions: "Ediciones lingüísticas",
        pageviewsByLanguageEdition: "Visitas por edición lingüística",
        cumulativeLanguageEditions: "Ediciones lingüísticas acumuladas",
        editionsWord: "ediciones",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} visitas`,
        andOthers: ({count}) => `(y ${count} más)`,
        summaryIntro: ({name}) => `Durante el último año, ${name} ha tenido más visitas en la `,
        wikipediaEdition: ({language}) => `edición de Wikipedia en ${language}`,
        withViewsFollowedBy: ({viewsFormatted}) => ` con ${viewsFormatted} visitas, seguida de `,
        growthIntro: ". En cuanto al crecimiento anual de visitas, las 3 principales ediciones de Wikipedia son ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) es una lengua ${familyName} de la familia ${primaryFamilyName}.`,
        families: {
          "Indo-European": "Indoeuropea",
          "Sino-Tibetan": "Sinotibetana",
          "Afro-Asiatic": "Afroasiática",
          "Altaic": "Altaica",
          "Dravidian": "Dravídica",
          "Austronesian": "Austronesia",
          "Uralic": "Urálica",
          "Caucasian": "Caucásica",
          "Niger-Kordofanian": "Níger-kordofana",
          "Creoles and pidgins": "Criollas y pidgins",
          "Amerindian": "Amerindia",
          "Tai": "Tai",
          "Other": "Otras",
          "Albanian": "Albanesa",
          "Algic": "Álgica",
          "Armenian": "Armenia",
          "Austro-Asiatic": "Austroasiática",
          "Baltic": "Báltica",
          "Basque": "Vasca",
          "Berber": "Bereber",
          "Celtic": "Celta",
          "Chadic": "Chádica",
          "Constructed": "Construida",
          "Creole (English)": "Criolla (inglés)",
          "Creole (French)": "Criolla (francés)",
          "Cushitic": "Cusítica",
          "Eskimo-Aleut": "Esquimo-aleutiana",
          "Germanic": "Germánica",
          "Greek": "Griega",
          "Indic": "Índica",
          "Iranian": "Irania",
          "Italic": "Itálica",
          "Japanese": "Japonesa",
          "Korean": "Coreana",
          "Malayo-Polynesian": "Malayo-polinesia",
          "Mongolian": "Mongólica",
          "Na-Dene": "Na-dené",
          "Nilo-Saharan": "Nilo-sahariana",
          "Quechuan": "Quechua",
          "Semitic": "Semítica",
          "Sinitic": "Sinítica",
          "Slavic": "Eslava",
          "Tibeto-Burman": "Tibetano-birmana",
          "Tupi": "Tupí",
          "Turkic": "Túrquica",
          "Uto-Aztecan": "Uto-azteca",
        },
      },
    },
    birthdayToast: ({name}) => `Hoy es el cumpleaños de ${name}`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank}) =>
      `${name} (${birthYear}–${deathYear}) es un/a ${occupation} ${demonym} en el puesto #${rank} mundial según el Índice de Popularidad Histórica de Pantheon. Explora su biografía, visitas y métricas.`,
    learnMoreRankless: "Más información sobre el impacto académico de {name} en Rankless",
    nav: {
      visualizations: "Visualizaciones",
      rankings: "Clasificaciones",
      profiles: "Perfiles",
      people: "Personas",
      bornOnThisDay: "Nacidos Hoy",
      places: "Lugares",
      countries: "Países",
      occupations: "Ocupaciones",
      occupationCountry: "Ocupación / País",
      eras: "Eras",
      deaths: "Muertes",
      about: "Acerca de",
      data: "Datos",
      permissions: "Permisos",
      download: "Descargar",
      api: "API",
      games: "Juegos",
      yearbook: "Anuario",
      birthle: "Birthle",
      trivia: "Trivia",
      news: "Noticias",
      search: "Buscar",
      home: "Inicio",
      giveFeedback: "Dar Retroalimentación",
      usageCitation: "Citación de Uso",
      newBadge: "¡nuevo!",
      explore: "Explorar",
      apps: "Aplicaciones",
      reportDataError: "Reportar Error de Datos",
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos de Servicio",
    },
    occupationCountry: {
      theMostFamous: "Los Más Famosos",
      from: "de",
      greatest: "Los Mejores",

      keepExploring: "Sigue explorando",
      trendingThisWeek: "En tendencia esta semana",
      trendScoreLabel: "Puntuación de tendencia",
      whyTrending: "¿Por qué está en tendencia?",
      clicksThisWeek: "Clics esta semana",
      impressionsThisWeek: "Impresiones esta semana",
      readMore: "Leer más",
      showLess: "Mostrar menos",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} persona${count === 1 ? "" : "s"} destacada${count === 1 ? "" : "s"}`,
      viewsLabel: "vistas",
      onDate: ({date}) => `el ${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `En tendencia ${occupationPlural} esta semana`;
        return hasFromPrefix
          ? `En tendencia ${occupationPlural} ${locationLabel} esta semana`
          : `En tendencia ${locationLabel} ${occupationPlural} esta semana`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Los 10 ${occupationPlural} con más tendencia en Wikipedia`;
        return hasFromPrefix
          ? `Los 10 ${occupationPlural} ${locationLabel} con más tendencia en Wikipedia`
          : `Los 10 ${locationLabel} ${occupationPlural} con más tendencia en Wikipedia`;
      },
      trendingIntroSuffix: "en los últimos 7 días, con una breve nota sobre qué impulsó el pico.",
      trendingThisWeekShort: "En tendencia esta semana",
      trendingThisWeekDefault: "En tendencia esta semana en Wikipedia",
      metaTitle: ({demonym, occupationPlural}) => `Los mejores ${occupationPlural} ${demonym} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `Descubre los ${countFormatted} ${occupationPlural} ${demonym} más famosos de la historia. Explora perfiles destacados de ${occupationSingular} de ${country} clasificados por relevancia histórica.`,
      birthDecadesTitle: "Personas por década de nacimiento",
      birthDecadesIntro: ({demonym, occupationPlural}) => `Explora ${occupationPlural} ${demonym} notables agrupados por década de nacimiento. Cada década muestra los 10 principales por HPI; expande para ver a todos.`,
      decadeLabel: ({decade}) => `Años ${decade}`,
      more: ({count}) => `+${count} más`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `Pantheon tiene ${totalCount} personas clasificadas como ${occupationPlural} ${demonym} nacidas entre ${oldestYear} y ${youngestYear}.`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `De estas ${totalCount}, ninguna sigue viva hoy.`;
        return `De estas ${totalCount}, ${aliveCountFormatted} (${aliveShare}) siguen vivas hoy.`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `Los ${occupationPlural} ${demonym} vivos más famosos incluyen `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `Los ${occupationPlural} ${demonym} fallecidos más famosos incluyen `,
      peopleNewAsOf: "abril de 2024",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `A partir de ${asOfLabel}, se han añadido a Pantheon ${countFormatted} nuevos ${occupationPlural} ${demonym}, incluyendo `,
      goToAllRankings: "Ir a todos los rankings",
      livingTitle: ({demonym, occupationPlural}) => `Vivos ${occupationPlural} ${demonym}`,
      deceasedTitle: ({demonym, occupationPlural}) => `Fallecidos ${occupationPlural} ${demonym}`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `Recién añadidos ${occupationPlural} ${demonym} (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for Spanish ordinals
        const formatSpanishOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          if (num === 1) return "primer";
          if (num === 3) return "tercer";
          return `${num}º`;
        };

        let text = `Esta página contiene una lista de los mejores ${occupationPlural} ${demonym}. `;
        text += `El conjunto de datos de Pantheon contiene ${totalCount} ${occupationPlural}, ${countryCount} de los cuales nacieron en ${country}. `;
        if (rank) {
          const spanishRank = formatSpanishOrdinal(rank);
          text += `Esto hace de ${country} el ${spanishRank} lugar de nacimiento del mayor número de ${occupationPlural}`;
          if (countriesBehind) {
            text += ` después de ${countriesBehind}.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "y",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `Las siguientes personas son consideradas por Pantheon como ${count === 10 ? "los 10" : ""} ${occupationPlural} ${demonym} más legendarios de todos los tiempos. Esta lista de ${occupationPlural} ${demonym} famosos está ordenada por HPI (Índice de Popularidad Histórica), una métrica que agrega información sobre la popularidad en línea de una biografía.`,
      visitRankings: "Visite la página de clasificaciones para ver la lista completa de",
      top: "Top",
      withHpi: ({hpi, name}) => `Con un HPI de ${hpi}, ${name}`,
      isMostFamous: ({demonym, occupation}) => `es ${demonym === demonym.toLowerCase() ? "el" : "la"} ${occupation} ${demonym} más famoso.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `es ${demonym === demonym.toLowerCase() ? "el" : "la"} ${rank} ${occupation} ${demonym} más famoso.`,
      biographyTranslated: ({possessive, count}) => `${possessive} biografía ha sido traducida a ${count} idiomas diferentes`,
      onWikipedia: "en Wikipedia",
    },
    selectPerson: {
      heading: "Explorar Personas Notables",
      subtitle: "Descubre las personas más influyentes de la historia en cada campo, país y época",
      metaDescription: "Explora más de 85.000 biografías de personas notables con presencia en Wikipedia en más de 15 idiomas.",
      searchPlaceholder: "Buscar personas, lugares y ocupaciones",
      randomPerson: "Persona Aleatoria",
      statPeople: "biografías",
      statLanguages: "ediciones de idiomas",
      description: "Pantheon rastrea biografías con presencia en al menos 15 ediciones lingüísticas de Wikipedia, clasificadas por ocupación y organizadas por país y ciudad de origen.",
      featuredPeople: "Personas Más Notables",
      trendingNow: "Tendencia Ahora",
      browseByField: "Explorar por Campo",
      domainSports: "Deportes",
      domainArts: "Artes y Entretenimiento",
      domainScience: "Ciencia y Tecnología",
      domainPolitics: "Política y Liderazgo",
      exploreMore: "Explorar Más",
      byOccupationCountry: "Por Ocupación y País",
      rankings: "Clasificaciones",
      byEra: "Por Época",
    },
    selectCountry: {
      heading: "Explorar Países",
      subtitle: "Descubre las personas más notables de cada país del mundo",
      metaDescription: "Explora personas notables de cada país. Navega biografías por país de nacimiento, visualiza mapas interactivos y descubre figuras históricas de todo el mundo.",
      totalCountries: "países",
      totalPeople: "personas notables",
      mapTitle: "Personas Notables por País",
      countryList: "Todos los Países",
      sortAlpha: "A–Z",
      sortPeople: "Más Personas",
      people: "personas",
      noPeopleData: "Sin datos disponibles",
      exploreMore: "Explorar Más",
      byPerson: "Personas Notables",
      byOccupation: "Por Ocupación y País",
      rankings: "Rankings",
    },
    selectPlace: {
      heading: "Explorar Lugares",
      subtitle: "Descubre las ciudades y pueblos que dieron forma a las personas más notables de la historia",
      metaDescription: "Explora los lugares de nacimiento de personas notables en todo el mundo. Navega ciudades por número de nacimientos notables y descubre puntos históricos.",
      totalPlaces: "lugares",
      totalPeople: "personas notables",
      mapTitle: "Lugares de Nacimiento de Personas Notables",
      placeList: "Principales Lugares",
      sortAlpha: "A–Z",
      sortPeople: "Más Personas",
      groupByCountry: "Por País",
      people: "personas",
      exploreMore: "Explorar Más",
      byPerson: "Personas Notables",
      byCountry: "Por País",
      rankings: "Rankings",
    },
    selectOccupation: {
      heading: "Explorar Ocupaciones",
      subtitle: "Descubre los campos y profesiones que dieron forma a las personas más notables de la historia",
      metaDescription: "Explora 101 ocupaciones de las personas más notables de la historia. Navega por profesión y descubre el número de individuos notables en cada campo.",
      totalOccupations: "ocupaciones",
      totalPeople: "personas notables",
      occupationList: "Todas las Ocupaciones",
      sortAlpha: "A–Z",
      sortPeople: "Más Personas",
      people: "personas",
      exploreMore: "Explorar Más",
      byPerson: "Personas Notables",
      byCountry: "Por País",
      rankings: "Rankings",
    },
    selectOccupationCountry: {
      heading: "Seleccione una ocupación y un país",
      pleaseSelect: "Seleccione una combinación de ocupación y país para ver las biografías más memorables",
      selectOccupation: "Seleccione una ocupación",
      selectCountry: "Seleccione un país",
      goToProfile: "Ir al perfil",
      whoAreTheMostFamous: "¿Quiénes son los más famosos...",
      trendingThisWeek: "Tendencias Esta Semana",
      browseByCountry: "Explorar por país",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
      }) => {
        let sentence = `Su biografía está disponible en ${l} idiomas en Wikipedia`;
        if (l_prev && l !== l_prev) {
          sentence += ` (${l > l_prev ? "aumentó" : "disminuyó"} de ${l_prev} en 2024)`;
        }
        sentence += ". ";

        // Use "ocupa el puesto X" or "se sitúa en el puesto X" - no ordinals
        const firstPhrase = occupationRank === 1 ? "ocupa el primer puesto" : `ocupa el puesto ${occupationRank.toLocaleString('es')}`;
        sentence += `${name} ${firstPhrase} entre los <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a> más populares`;
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          const change = occupationRank < occupationRankPrev ? "subió del puesto" : "bajó del puesto";
          sentence += ` (${change} ${occupationRankPrev.toLocaleString('es')} en 2024)`;
        }

        if (country) {
          const countryPhrase = bplaceCountryRank === 1 ? "el primer puesto" : `el puesto ${bplaceCountryRank.toLocaleString('es')}`;
          sentence += `, ${countryPhrase} entre las biografías más populares de <a href="/profile/place/${countrySlug}">${country}</a>`;
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            const change = bplaceCountryRank < bplaceCountryRankPrev ? "subió del puesto" : "bajó del puesto";
            sentence += ` (${change} ${bplaceCountryRankPrev.toLocaleString('es')} en 2019)`;
          }

          if (bplaceCountryOccupationRank) {
            const finalPhrase = bplaceCountryOccupationRank === 1 ? "el primer puesto" : `el puesto ${bplaceCountryOccupationRank.toLocaleString('es')}`;
            // Use nationality adjective for cleaner Spanish
            const nationalitySuffix = nationalityAdj || demonym;
            sentence += ` y ${finalPhrase} entre los <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} ${nationalitySuffix.toLowerCase()}</a> más populares`;
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "Visualizaciones",
      rankings: "Clasificaciones",
      profiles: "Perfiles",
      people: "Personas",
      bornOnThisDay: "Nacidos en Este Día",
      places: "Lugares",
      countries: "Países",
      occupations: "Ocupaciones",
      occupationCountry: "Ocupación / País",
      eras: "Épocas",
      deaths: "Fallecimientos",
      about: "Acerca de",
      data: "Datos",
      permissions: "Permisos",
      download: "Descargar",
      api: "API",
      games: "Juegos",
      yearbook: "Anuario",
      birthle: "Birthle",
      trivia: "Trivia",
      news: "Noticias",
      search: "Buscar",
      home: "Inicio",
      giveFeedback: "Dar opinión",
      usageCitation: "Cita de uso",
      newBadge: "¡nuevo!",
    },
    readMoreWikipedia: "Leer más en Wikipedia",
    home: {
      tagline: "¡Explora la memoria colectiva humana!",
      subtitle:
        "Pantheon te ayuda a descubrir la geografía y la dinámica de la historia de nuestro planeta.",
      explore: "Explorar",
      people: "Personas",
      places: "Lugares",
      occupations: "Ocupaciones",
      and: "y",
      eras: "Épocas",
      trendingProfiles: "Perfiles en Tendencia Hoy",
      topProfilesBy: "Perfiles principales por vistas de página para la",
      wikipediaEdition: "edición de wikipedia",
      about:
        "es un observatorio de memoria colectiva enfocado en biografías con presencia en al menos",
      languages: "idiomas",
      aboutContinued:
        "en Wikipedia. Tenemos datos de más de 85,000 biografías, organizadas por países, ciudades, ocupaciones y épocas. Explora estos datos para conocer los personajes que dan forma a la cultura humana.",
      aboutDeveloped:
        "comenzó como un proyecto en el grupo de Aprendizaje Colectivo del MIT. Hoy es desarrollado por",
      datawheel: "Datawheel",
      aboutDatawheel:
        ", una empresa especializada en la creación de soluciones de distribución y visualización de datos.",
      recentPassings: "Fallecimientos Recientes",
      notableDeaths: "Muertes Notables de 2025",
      notableDeathsText:
        "¿Quieres ver la lista completa de figuras notables que hemos perdido en 2025? Visita nuestra",
      notableDeathsLink: "Muertes Notables de 2025",
      notableDeathsContinued:
        "página para una colección completa de biografías con personalidades influyentes, incluyendo celebridades, artistas, líderes e íconos culturales que han fallecido este año.",
      trendingSingers: "Cantantes en Tendencia Hoy",
      trendingActors: "Actores en Tendencia Hoy",
      recentlyAdded: "Agregados Recientemente a Pantheon",
      searchPlaceholder: "Buscar personas, lugares y ocupaciones",
      isTrending: "es tendencia hoy",
      readFullStory: "Leer la historia completa",
      turningXToday: ({age}) => `¡Cumple ${age} hoy!`,
      wouldHaveBeenX: ({age}) => `Cumpliría ${age} hoy`,
      seeAllBirthdays: "Ver todos los cumpleaños",
      bornTodayTitle: "Personas Famosas Nacidas Hoy",
    },
    recentlyAdded: {
      title: "Agregados Recientemente a Pantheon",
      subtitle: "Descubre las biografías más recientes añadidas a la colección de Pantheon, ordenadas por fecha de incorporación.",
      addedOn: ({date}) => `Añadido el ${date}`,
      previous: "Anterior",
      next: "Siguiente",
      pageLabel: ({page}) => `Página ${page}`,
      viewMore: "Ver más personas agregadas recientemente",
      empty: "No se encontraron personas agregadas recientemente.",
    },
    news: {
      pageTitle: "¿Quién es tendencia hoy?",
      pageSubtitle: "Resúmenes diarios de figuras históricas (generado por IA)",
      trendingIn: "Tendencia en",
      selectDate: "Seleccione una fecha diferente",
      references: "Referencias:",
      noData: "No hay datos de tendencias disponibles para esta fecha.",
      previousDay: "Día Anterior",
      nextDay: "Día Siguiente",
      unknown: "Desconocido",
    },
    trending: {
      isTrendingToday: "¡{name} es tendencia hoy!",
      whyTrending: "¿Por qué {name} es tendencia?",
      references: "Fuentes:",
      viewMoreTrending: "Ver más personas en tendencia",
    },
    bornOnThisDay: {
      famousBirthdays: "Cumpleaños Famosos",
      bornOnThisDay: "Nacidos en Este Día",
      famousPeopleBornOnThisDay: ({count}) => `${count} ${count === 1 ? "persona famosa nacida" : "personas famosas nacidas"} en este día`,
      birthdayOf: ({displayDate, count}) => `El ${displayDate} es el cumpleaños de ${count} celebridades y ${count === 1 ? "persona históricamente significativa" : "personas históricamente significativas"} en la base de datos de Pantheon.`,
      mostFamousInclude: "Los más famosos incluyen",
      mostCommonOccupations: "Las ocupaciones más comunes de las personas nacidas en este día son",
      exploreAnotherDate: "Explorar Otra Fecha",
      go: "Ir",
      today: "Hoy",
      previousDay: "Día Anterior",
      nextDay: "Día Siguiente",
      famousPeopleBornOn: ({displayDate}) => `Personas Famosas Nacidas el ${displayDate}`,
      discoverRemarkable: ({displayDate}) => `Descubre las personas notables que comparten el ${displayDate} como su cumpleaños. Desde líderes mundiales y científicos revolucionarios hasta queridos artistas y atletas legendarios, este día ha visto el nacimiento de muchas figuras influyentes a lo largo de la historia.`,
      someNotableInclude: "Algunos de los más notables incluyen",
      stillLivingToday: ({total, living}) => `De las ${total} personas famosas nacidas en esta fecha, ${living} siguen vivas hoy.`,
      viewFullRankings: "Ver Clasificación Completa para Este Día",
      born: "Nacido",
      birthdaysByOccupation: "Cumpleaños por Ocupación",
      occupationIntro: ({displayDate}) => `Vea cómo las personas famosas nacidas el ${displayDate} se distribuyen en diferentes campos y ocupaciones. Haga clic en cualquier persona para conocer más sobre su vida y logros.`,
      showLess: "Mostrar menos",
      more: ({count}) => `+${count} más`,
      formatDate: ({month, day}) => {
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return `${day} de ${months[month - 1]}`;
      },
      metaTitle: ({displayDate}) => `Cumpleaños Famosos el ${displayDate} | ¿Quién Nació Hoy? | Pantheon`,
      metaDescription: ({displayDate}) => `Descubre las personas más famosas nacidas el ${displayDate} a lo largo de la historia. Explora los perfiles de celebridades, figuras históricas, científicos, artistas, atletas y más que comparten este cumpleaños.`,
      months: {
        january: "Enero",
        february: "Febrero",
        march: "Marzo",
        april: "Abril",
        may: "Mayo",
        june: "Junio",
        july: "Julio",
        august: "Agosto",
        september: "Septiembre",
        october: "Octubre",
        november: "Noviembre",
        december: "Diciembre",
      },
    },
  },
  fr: {
    stillAlive: "aujourd'hui",
    person: {
      loading: "Chargement...",
      metaTitle: ({name}) => `Biographie de ${name} | Pantheon`,
      sections: {
        trending: "Tendances",
        memorabilityMetrics: "Indicateurs de mémorabilité",
        trendingActivity: "Activité des tendances",
        notableWorks: "Œuvres notables",
        pageViewsByLang: ({name}) => `Pages vues de ${name} par langue`,
        amongOccupation: ({occupationPlural}) => `Parmi les ${occupationPlural}`,
        contemporaries: "Contemporains",
        inCountry: ({country}) => `En ${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `Parmi les ${occupationPlural} en ${country}`,
        filmography: "Filmographie",
        tvMovieRoles: "Rôles à la télévision et au cinéma",
        insights: "Faits marquants",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} occupe la première place parmi les ${totalFormatted} ${occupationPlural} recensés dans Pantheon à travers le monde.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} se classe n° ${rank} sur ${totalFormatted} ${occupationPlural} dans le monde — dans le top ${topPercent} % de la profession.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} arrive en tête des ${totalFormatted} personnalités de Pantheon nées en ${country}.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `Sur les ${count} ${occupationPlural} nés en ${country}, ${name} occupe la première place.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} est la personnalité la plus mémorable des ${count} personnes notables nées à ${city}, ${country}${peers ? `, devant ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} est la personnalité la plus mémorable des ${count} personnes notables nées à ${city}, dans ce qui est aujourd'hui ${country}${peers ? `, devant ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `Des ${count} personnes de Pantheon nées en ${year}, ${name} est la plus mémorable.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `La biographie de ${name} figure dans ${count} éditions linguistiques de Wikipédia — plus que ${percent} % de l'ensemble des ${occupationPlural}.`,
        newLangs: ({name, count}) =>
          `La biographie de ${name} a été ajoutée à ${count} nouvelles éditions linguistiques de Wikipédia au cours de l'année écoulée.`,
        nonEnglish: ({name, count}) =>
          `La biographie de ${name} a enregistré ${count} consultations sur des éditions de Wikipédia autres qu'anglophones au cours de l'année écoulée — une renommée qui dépasse largement le monde anglophone.`,
        enduringFame: ({name, centuries, rank}) =>
          `Plus de ${centuries} siècles après sa mort, ${name} occupe toujours le rang n° ${rank} parmi toutes les personnalités de Pantheon.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `Avec ${views} consultations sur Wikipédia au cours de l'année écoulée, ${name} est en tête des ${occupationPlural} les plus consultés.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `La page Wikipédia de ${name} a enregistré ${views} consultations au cours de l'année écoulée — ${multiple} fois la moyenne des ${occupationPlural}.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `${name} est l'une des ${womenCount} seules femmes parmi les ${totalFormatted} ${occupationPlural} de Pantheon.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `Malgré une vie de seulement ${age} ans, ${name} se classe n° ${rank} parmi tous les ${occupationPlural} de l'histoire.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} compte parmi les ${count} premiers ${occupationPlural} recensés dans Pantheon.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} partage sa date d'anniversaire (${date}) avec ${twinNames}.`,
        fallback: ({name, count, hpi}) =>
          `La biographie de ${name} couvre ${count} éditions linguistiques de Wikipédia et obtient un Indice de Popularité Historique de ${hpi}.`,
      },
      metrics: {
        pageViews: "Pages vues",
        past12Months: "12 derniers mois",
        hpi: "HPI",
        hpiDesc: "Indice de popularité historique",
        avgOf: ({label}) => `Moy. ${label}`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `Parmi les ${occupationPlural}, ${name} occupe le rang ${rankHtml} sur ${totalFormatted}.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `Parmi les personnes nées en ${year}, ${name} occupe le rang ${rankHtml}.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `Parmi les personnes décédées en ${year}, ${name} occupe le rang ${rankHtml}.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `Parmi les personnes nées en ${countryHtml}, ${name} occupe le rang ${rankHtml} sur ${totalFormatted}.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `Parmi les ${occupationPlural} nés en ${countryHtml}, ${name} occupe le rang ${rankHtml}.`,
        beforePeers: ({gender, count}) =>
          `Avant ${gender === "M" ? "lui" : gender === "F" ? "elle" : "eux"} ${count === 1 ? "vient" : "viennent"} `,
        afterPeers: ({gender, count}) =>
          `Après ${gender === "M" ? "lui" : gender === "F" ? "elle" : "eux"} ${count === 1 ? "vient" : "viennent"} `,
        notRankedIn: ({name, countryHtml}) => `${name} n'est pas classé en ${countryHtml}`,
        mostPopularInWikipedia: ({occupationPlural}) => `${occupationPlural} les plus populaires sur Wikipédia`,
        othersBornInYear: ({year}) => `Autres personnes nées en ${year}`,
        othersDeceasedInYear: ({year}) => `Autres personnes décédées en ${year}`,
        othersBornInCountry: ({countryHtml}) => `Autres personnes nées en ${countryHtml}`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym}`,
        goToAllRankings: "Voir tous les classements",
        and: " et ",
      },
      carousel: {
        present: "présent",
        hpiLabel: "HPI :",
        rankLabel: "Rang :",
      },
      footer: {
        relatedProfiles: "Profils associés",
        individuals: ({countFormatted}) => `${countFormatted} personnes`,
        rank: ({rankFormatted}) => `Rang ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `PAGES VUES SUR ${langCode}.WIKIPEDIA (PV)`,
        rankInLanguage: ({rank, language}) => `Rang n°${rank} en ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `${count} jour${count === 1 ? "" : "s"} en tendance`,
        less: "Moins",
        more: "Plus",
        clickForDetails: "Cliquez pour plus de détails",
        notTrending: "Pas en tendance",
        rankNum: ({rank}) => `Rang n°${rank}`,
        viewAllTrendingNews: ({date}) => `Voir toutes les actualités en tendance du ${date}`,
      },
      pageViewsByLangChart: {
        languageEditions: "Éditions linguistiques",
        pageviewsByLanguageEdition: "Pages vues par édition linguistique",
        cumulativeLanguageEditions: "Éditions linguistiques cumulées",
        editionsWord: "éditions",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} vues`,
        andOthers: ({count}) => `(et ${count} autres)`,
        summaryIntro: ({name}) => `Au cours de l'année écoulée, ${name} a enregistré le plus de pages vues sur l'`,
        wikipediaEdition: ({language}) => `édition Wikipédia en ${language}`,
        withViewsFollowedBy: ({viewsFormatted}) => ` avec ${viewsFormatted} vues, suivie de `,
        growthIntro: ". En termes de croissance annuelle des pages vues, les 3 premières éditions de Wikipédia sont ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) est une langue ${familyName} de la famille ${primaryFamilyName}.`,
        families: {
          "Indo-European": "Indo-européenne",
          "Sino-Tibetan": "Sino-tibétaine",
          "Afro-Asiatic": "Afro-asiatique",
          "Altaic": "Altaïque",
          "Dravidian": "Dravidienne",
          "Austronesian": "Austronésienne",
          "Uralic": "Ouralienne",
          "Caucasian": "Caucasienne",
          "Niger-Kordofanian": "Nigéro-kordofanienne",
          "Creoles and pidgins": "Créoles et pidgins",
          "Amerindian": "Amérindienne",
          "Tai": "Taï",
          "Other": "Autres",
          "Albanian": "Albanaise",
          "Algic": "Algique",
          "Armenian": "Arménienne",
          "Austro-Asiatic": "Austroasiatique",
          "Baltic": "Balte",
          "Basque": "Basque",
          "Berber": "Berbère",
          "Celtic": "Celtique",
          "Chadic": "Tchadique",
          "Constructed": "Construite",
          "Creole (English)": "Créole (anglais)",
          "Creole (French)": "Créole (français)",
          "Cushitic": "Couchitique",
          "Eskimo-Aleut": "Eskimo-aléoute",
          "Germanic": "Germanique",
          "Greek": "Grecque",
          "Indic": "Indienne",
          "Iranian": "Iranienne",
          "Italic": "Italique",
          "Japanese": "Japonaise",
          "Korean": "Coréenne",
          "Malayo-Polynesian": "Malayo-polynésienne",
          "Mongolian": "Mongole",
          "Na-Dene": "Na-déné",
          "Nilo-Saharan": "Nilo-saharienne",
          "Quechuan": "Quechua",
          "Semitic": "Sémitique",
          "Sinitic": "Sinitique",
          "Slavic": "Slave",
          "Tibeto-Burman": "Tibéto-birmane",
          "Tupi": "Tupi",
          "Turkic": "Turcique",
          "Uto-Aztecan": "Uto-aztèque",
        },
      },
    },
    birthdayToast: ({name}) => `Aujourd'hui, c'est l'anniversaire de ${name}`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank}) =>
      `${name} (${birthYear}–${deathYear}) est un(e) ${occupation} ${demonym} classé(e) #${rank} mondial par l'Indice de Popularité Historique de Pantheon. Explorez sa biographie, ses vues et ses métriques.`,
    learnMoreRankless: "En savoir plus sur l'impact académique de {name} sur Rankless",
    nav: {
      visualizations: "Visualisations",
      rankings: "Classements",
      profiles: "Profils",
      people: "Personnes",
      bornOnThisDay: "Nés Ce Jour",
      places: "Lieux",
      countries: "Pays",
      occupations: "Professions",
      occupationCountry: "Profession / Pays",
      eras: "Époques",
      deaths: "Décès",
      about: "À Propos",
      data: "Données",
      permissions: "Autorisations",
      download: "Télécharger",
      api: "API",
      games: "Jeux",
      yearbook: "Annuaire",
      birthle: "Birthle",
      trivia: "Anecdotes",
      news: "Actualités",
      search: "Rechercher",
      home: "Accueil",
      giveFeedback: "Donner Votre Avis",
      usageCitation: "Citation d'Utilisation",
      newBadge: "nouveau !",
      explore: "Explorer",
      apps: "Applications",
      reportDataError: "Signaler une Erreur de Données",
      privacyPolicy: "Politique de Confidentialité",
      termsOfService: "Conditions d'Utilisation",
    },
    occupationCountry: {
      theMostFamous: "Les Plus Célèbres",
      from: "de",
      greatest: "Les Meilleurs",

      keepExploring: "Continuer à explorer",
      trendingThisWeek: "Tendances de la semaine",
      trendScoreLabel: "Score de tendance",
      whyTrending: "Pourquoi est-ce en tendance ?",
      clicksThisWeek: "Clics cette semaine",
      impressionsThisWeek: "Impressions cette semaine",
      readMore: "Lire la suite",
      showLess: "Afficher moins",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} personne${count === 1 ? "" : "s"} notable${count === 1 ? "" : "s"}`,
      viewsLabel: "vues",
      onDate: ({date}) => `le ${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `En tendance ${occupationPlural} cette semaine`;
        return hasFromPrefix
          ? `En tendance ${occupationPlural} ${locationLabel} cette semaine`
          : `En tendance ${locationLabel} ${occupationPlural} cette semaine`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Les 10 ${occupationPlural} en tendance sur Wikipedia`;
        return hasFromPrefix
          ? `Les 10 ${occupationPlural} ${locationLabel} en tendance sur Wikipedia`
          : `Les 10 ${locationLabel} ${occupationPlural} en tendance sur Wikipedia`;
      },
      trendingIntroSuffix: "au cours des 7 derniers jours, avec une brève note sur la hausse.",
      trendingThisWeekShort: "En tendance cette semaine",
      trendingThisWeekDefault: "En tendance cette semaine sur Wikipedia",
      metaTitle: ({demonym, occupationPlural}) => `Les plus grands ${occupationPlural} ${demonym} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `Découvrez les ${countFormatted} ${occupationPlural} ${demonym} les plus célèbres de l'histoire. Explorez des profils remarquables de ${occupationSingular} de ${country}, classés par importance historique.`,
      birthDecadesTitle: "Personnes par décennie de naissance",
      birthDecadesIntro: ({demonym, occupationPlural}) => `Découvrez les ${occupationPlural} ${demonym} remarquables regroupés par décennie de naissance. Chaque décennie montre les 10 premiers par HPI ; développez pour tout voir.`,
      decadeLabel: ({decade}) => `Années ${decade}`,
      more: ({count}) => `+${count} de plus`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `Pantheon compte ${totalCount} personnes classées comme ${occupationPlural} ${demonym} nées entre ${oldestYear} et ${youngestYear}.`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `Parmi ces ${totalCount}, aucune n'est encore en vie aujourd'hui.`;
        return `Parmi ces ${totalCount}, ${aliveCountFormatted} (${aliveShare}) sont encore en vie aujourd'hui.`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `Les ${occupationPlural} ${demonym} vivants les plus célèbres incluent `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `Les ${occupationPlural} ${demonym} décédés les plus célèbres incluent `,
      peopleNewAsOf: "avril 2024",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `En ${asOfLabel}, ${countFormatted} nouveaux ${occupationPlural} ${demonym} ont été ajoutés à Pantheon, notamment `,
      goToAllRankings: "Voir tous les classements",
      livingTitle: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym} vivants`,
      deceasedTitle: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym} décédés`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `${occupationPlural} ${demonym} nouvellement ajoutés (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for French ordinals
        const formatFrenchOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          if (num === 1) return "premier";
          return `${num}e`;
        };

        let text = `Cette page contient une liste des plus grands ${occupationPlural} ${demonym}. `;
        text += `L'ensemble de données Pantheon contient ${totalCount} ${occupationPlural}, dont ${countryCount} sont nés en ${country}. `;
        if (rank) {
          const frenchRank = formatFrenchOrdinal(rank);
          text += `Cela fait de ${country} le ${frenchRank} lieu de naissance du plus grand nombre de ${occupationPlural}`;
          if (countriesBehind) {
            text += ` après ${countriesBehind}.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "et",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `Les personnes suivantes sont considérées par Pantheon comme ${count === 10 ? "les 10" : ""} ${occupationPlural} ${demonym} les plus légendaires de tous les temps. Cette liste de ${occupationPlural} ${demonym} célèbres est triée par HPI (Indice de Popularité Historique), une métrique qui agrège les informations sur la popularité en ligne d'une biographie.`,
      visitRankings: "Visitez la page de classements pour voir la liste complète de",
      top: "Top",
      withHpi: ({hpi, name}) => `Avec un HPI de ${hpi}, ${name}`,
      isMostFamous: ({demonym, occupation}) => `est le ${occupation} ${demonym} le plus célèbre.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `est le ${rank} ${occupation} ${demonym} le plus célèbre.`,
      biographyTranslated: ({possessive, count}) => `${possessive} biographie a été traduite en ${count} langues différentes`,
      onWikipedia: "sur Wikipédia",
    },
    selectPerson: {
      heading: "Explorer les Personnalités",
      subtitle: "Découvrez les personnes les plus influentes de l'histoire dans chaque domaine, pays et époque",
      metaDescription: "Parcourez plus de 85 000 biographies de personnalités avec une présence sur Wikipédia dans plus de 15 langues.",
      searchPlaceholder: "Rechercher des personnes, des lieux et des métiers",
      randomPerson: "Personne Aléatoire",
      statPeople: "biographies",
      statLanguages: "éditions linguistiques",
      description: "Pantheon suit les biographies présentes dans au moins 15 éditions linguistiques de Wikipédia, classées par occupation et organisées par pays et ville d'origine.",
      featuredPeople: "Personnalités les Plus Notables",
      trendingNow: "Tendances Actuelles",
      browseByField: "Parcourir par Domaine",
      domainSports: "Sports",
      domainArts: "Arts et Divertissement",
      domainScience: "Science et Technologie",
      domainPolitics: "Politique et Leadership",
      exploreMore: "Explorer Plus",
      byOccupationCountry: "Par Métier et Pays",
      rankings: "Classements",
      byEra: "Par Époque",
    },
    selectCountry: {
      heading: "Explorer les Pays",
      subtitle: "Découvrez les personnalités les plus remarquables de chaque pays du monde",
      metaDescription: "Explorez les personnalités remarquables de chaque pays. Parcourez les biographies par pays de naissance, consultez des cartes interactives et découvrez des figures historiques du monde entier.",
      totalCountries: "pays",
      totalPeople: "personnes notables",
      mapTitle: "Personnes Notables par Pays",
      countryList: "Tous les Pays",
      sortAlpha: "A–Z",
      sortPeople: "Plus de Personnes",
      people: "personnes",
      noPeopleData: "Aucune donnée disponible",
      exploreMore: "Explorer Plus",
      byPerson: "Personnes Notables",
      byOccupation: "Par Métier et Pays",
      rankings: "Classements",
    },
    selectPlace: {
      heading: "Explorer les Lieux",
      subtitle: "Découvrez les villes qui ont façonné les personnalités les plus remarquables de l'histoire",
      metaDescription: "Explorez les lieux de naissance des personnalités remarquables du monde entier. Parcourez les villes par nombre de naissances notables et découvrez les hauts lieux historiques.",
      totalPlaces: "lieux",
      totalPeople: "personnes notables",
      mapTitle: "Lieux de Naissance des Personnes Notables",
      placeList: "Principaux Lieux",
      sortAlpha: "A–Z",
      sortPeople: "Plus de Personnes",
      groupByCountry: "Par Pays",
      people: "personnes",
      exploreMore: "Explorer Plus",
      byPerson: "Personnes Notables",
      byCountry: "Par Pays",
      rankings: "Classements",
    },
    selectOccupation: {
      heading: "Explorer les Métiers",
      subtitle: "Découvrez les domaines et professions qui ont façonné les personnalités les plus remarquables de l'histoire",
      metaDescription: "Explorez 101 métiers des personnalités les plus remarquables de l'histoire. Parcourez par profession et découvrez le nombre de personnalités dans chaque domaine.",
      totalOccupations: "métiers",
      totalPeople: "personnes notables",
      occupationList: "Tous les Métiers",
      sortAlpha: "A–Z",
      sortPeople: "Plus de Personnes",
      people: "personnes",
      exploreMore: "Explorer Plus",
      byPerson: "Personnes Notables",
      byCountry: "Par Pays",
      rankings: "Classements",
    },
    selectOccupationCountry: {
      heading: "Sélectionnez une profession et un pays",
      pleaseSelect: "Veuillez sélectionner une combinaison de profession et de pays pour voir les biographies les plus mémorables",
      selectOccupation: "Sélectionnez une profession",
      selectCountry: "Sélectionnez un pays",
      goToProfile: "Aller au profil",
      whoAreTheMostFamous: "Qui sont les plus célèbres...",
      trendingThisWeek: "Tendances Cette Semaine",
      browseByCountry: "Parcourir par pays",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        fromCountry,
        formatOrdinal,
      }) => {
        let sentence = `Sa biographie est disponible en ${l} langues sur Wikipédia`;
        if (l_prev && l !== l_prev) {
          sentence += ` (${l > l_prev ? "en hausse par rapport à" : "en baisse par rapport à"} ${l_prev} en 2024)`;
        }
        sentence += ". ";

        // Use person's gender as proxy for occupation article (works for most cases like acteur/actrice)
        const article = gender === "F" ? "la" : "le";
        const plusPopulaire = article === "la" ? "la plus populaire" : "le plus populaire";

        // First clause: occupation ranking
        if (occupationRank === 1) {
          sentence += `${name} est ${article} <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a> ${plusPopulaire}`;
        } else {
          sentence += `${name} est ${article} ${formatOrdinal(occupationRank)} <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a> ${plusPopulaire}`;
        }
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          sentence += ` (${occupationRank < occupationRankPrev ? "en hausse" : "en baisse"} du ${formatOrdinal(occupationRankPrev)} en 2024)`;
        }

        if (country) {
          // Use fromCountry preposition if available (e.g., "d'Arabie saoudite"), otherwise default to "de "
          const countryPrep = fromCountry || `de ${country}`;

          // Second clause: country biography ranking - "biographie" is always feminine
          if (bplaceCountryRank === 1) {
            sentence += `, la biographie la plus populaire <a href="/profile/place/${countrySlug}">${countryPrep}</a>`;
          } else {
            sentence += `, la ${formatOrdinal(bplaceCountryRank)} biographie la plus populaire <a href="/profile/place/${countrySlug}">${countryPrep}</a>`;
          }
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            sentence += ` (${bplaceCountryRank < bplaceCountryRankPrev ? "en hausse" : "en baisse"} du ${formatOrdinal(bplaceCountryRankPrev)} en 2019)`;
          }

          // Third clause: occupation + country ranking
          if (bplaceCountryOccupationRank) {
            if (bplaceCountryOccupationRank === 1) {
              sentence += `, ainsi que ${article} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} ${countryPrep}</a> ${plusPopulaire}`;
            } else {
              sentence += `, ainsi que ${article} ${formatOrdinal(bplaceCountryOccupationRank)} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} ${countryPrep}</a> ${plusPopulaire}`;
            }
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "Visualisations",
      rankings: "Classements",
      profiles: "Profils",
      people: "Personnes",
      bornOnThisDay: "Nés Ce Jour",
      places: "Lieux",
      countries: "Pays",
      occupations: "Professions",
      occupationCountry: "Profession / Pays",
      eras: "Époques",
      deaths: "Décès",
      about: "À propos",
      data: "Données",
      permissions: "Autorisations",
      download: "Télécharger",
      api: "API",
      games: "Jeux",
      yearbook: "Annuaire",
      birthle: "Birthle",
      trivia: "Trivia",
      news: "Actualités",
      search: "Rechercher",
      home: "Accueil",
      giveFeedback: "Donner votre avis",
      usageCitation: "Citation d'usage",
      newBadge: "nouveau !",
    },
    readMoreWikipedia: "En savoir plus sur Wikipédia",
    home: {
      tagline: "Explorez la mémoire collective humaine !",
      subtitle:
        "Pantheon vous aide à découvrir la géographie et la dynamique de l'histoire de notre planète.",
      explore: "Explorer",
      people: "Personnes",
      places: "Lieux",
      occupations: "Professions",
      and: "et",
      eras: "Époques",
      trendingProfiles: "Profils Tendance Aujourd'hui",
      topProfilesBy: "Meilleurs profils par vues de page pour l'",
      wikipediaEdition: "édition de wikipédia",
      about:
        "est un observatoire de la mémoire collective axé sur les biographies présentes dans au moins",
      languages: "langues",
      aboutContinued:
        "sur Wikipédia. Nous disposons de données sur plus de 85 000 biographies, organisées par pays, villes, professions et époques. Explorez ces données pour en savoir plus sur les personnages qui façonnent la culture humaine.",
      aboutDeveloped:
        "a commencé comme un projet du groupe Collective Learning au MIT. Aujourd'hui, il est développé par",
      datawheel: "Datawheel",
      aboutDatawheel:
        ", une entreprise spécialisée dans la création de solutions de distribution et de visualisation de données.",
      recentPassings: "Décès Récents",
      notableDeaths: "Décès Notables de 2025",
      notableDeathsText:
        "Vous voulez voir la liste complète des personnalités notables que nous avons perdues en 2025 ? Visitez notre",
      notableDeathsLink: "Décès Notables de 2025",
      notableDeathsContinued:
        "page pour une collection complète de biographies présentant des personnalités influentes, y compris des célébrités, des artistes, des dirigeants et des icônes culturelles décédés cette année.",
      trendingSingers: "Chanteurs Tendance Aujourd'hui",
      trendingActors: "Acteurs Tendance Aujourd'hui",
      recentlyAdded: "Récemment Ajoutés à Pantheon",
      searchPlaceholder: "Rechercher des personnes, des lieux et des professions",
      isTrending: "est en tendance aujourd'hui",
      readFullStory: "Lire l'histoire complète",
      turningXToday: ({age}) => `${age} ans aujourd'hui !`,
      wouldHaveBeenX: ({age}) => `Aurait ${age} ans aujourd'hui`,
      seeAllBirthdays: "Voir tous les anniversaires",
      bornTodayTitle: "Personnes Célèbres Nées Aujourd'hui",
    },
    recentlyAdded: {
      title: "Récemment Ajoutés à Pantheon",
      subtitle: "Découvrez les biographies les plus récemment ajoutées à la collection de Pantheon, classées par date d'ajout.",
      addedOn: ({date}) => `Ajout : ${date}`,
      previous: "Précédent",
      next: "Suivant",
      pageLabel: ({page}) => `Page ${page}`,
      viewMore: "Voir plus de personnes récemment ajoutées",
      empty: "Aucune personne récemment ajoutée n'a été trouvée.",
    },
    news: {
      pageTitle: "Qui est en tendance aujourd'hui?",
      pageSubtitle:
        "Résumés quotidiens de personnages historiques (généré par IA)",
      trendingIn: "Tendance en",
      selectDate: "Sélectionner une date différente",
      references: "Références:",
      noData: "Aucune donnée de tendance disponible pour cette date.",
      previousDay: "Jour Précédent",
      nextDay: "Jour Suivant",
      unknown: "Inconnu",
    },
    trending: {
      isTrendingToday: "{name} est en tendance aujourd'hui !",
      whyTrending: "Pourquoi {name} est en tendance ?",
      references: "Sources :",
      viewMoreTrending: "Voir plus de personnes en tendance",
    },
    bornOnThisDay: {
      famousBirthdays: "Anniversaires Célèbres",
      bornOnThisDay: "Nés Ce Jour",
      famousPeopleBornOnThisDay: ({count}) => `${count} ${count === 1 ? "personne célèbre née" : "personnes célèbres nées"} ce jour`,
      birthdayOf: ({displayDate, count}) => `Le ${displayDate} est l'anniversaire de ${count} célébrités et ${count === 1 ? "personne historiquement importante" : "personnes historiquement importantes"} dans la base de données Pantheon.`,
      mostFamousInclude: "Les plus célèbres incluent",
      mostCommonOccupations: "Les professions les plus courantes pour les personnes nées ce jour sont",
      exploreAnotherDate: "Explorer une Autre Date",
      go: "Aller",
      today: "Aujourd'hui",
      previousDay: "Jour Précédent",
      nextDay: "Jour Suivant",
      famousPeopleBornOn: ({displayDate}) => `Personnes Célèbres Nées le ${displayDate}`,
      discoverRemarkable: ({displayDate}) => `Découvrez les personnalités remarquables qui partagent le ${displayDate} comme anniversaire. Des dirigeants mondiaux et scientifiques révolutionnaires aux artistes bien-aimés et athlètes légendaires, ce jour a vu la naissance de nombreuses figures influentes à travers l'histoire.`,
      someNotableInclude: "Parmi les plus notables, on trouve",
      stillLivingToday: ({total, living}) => `Sur les ${total} personnes célèbres nées à cette date, ${living} sont encore en vie aujourd'hui.`,
      viewFullRankings: "Voir le Classement Complet pour Ce Jour",
      born: "Né(e)",
      birthdaysByOccupation: "Anniversaires par Profession",
      occupationIntro: ({displayDate}) => `Découvrez comment les personnes célèbres nées le ${displayDate} sont réparties dans différents domaines et professions. Cliquez sur n'importe quelle personne pour en savoir plus sur sa vie et ses réalisations.`,
      showLess: "Afficher moins",
      more: ({count}) => `+${count} de plus`,
      formatDate: ({month, day}) => {
        const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        return `${day} ${months[month - 1]}`;
      },
      metaTitle: ({displayDate}) => `Anniversaires Célèbres le ${displayDate} | Qui Est Né Aujourd'hui ? | Pantheon`,
      metaDescription: ({displayDate}) => `Découvrez les personnalités les plus célèbres nées le ${displayDate} à travers l'histoire. Explorez les profils de célébrités, figures historiques, scientifiques, artistes, athlètes et plus encore qui partagent cet anniversaire.`,
      months: {
        january: "Janvier",
        february: "Février",
        march: "Mars",
        april: "Avril",
        may: "Mai",
        june: "Juin",
        july: "Juillet",
        august: "Août",
        september: "Septembre",
        october: "Octobre",
        november: "Novembre",
        december: "Décembre",
      },
    },
  },
  de: {
    stillAlive: "heute",
    person: {
      loading: "Wird geladen...",
      metaTitle: ({name}) => `${name} – Biografie | Pantheon`,
      sections: {
        trending: "Im Trend",
        memorabilityMetrics: "Bekanntheitsmetriken",
        trendingActivity: "Trend-Aktivität",
        notableWorks: "Bedeutende Werke",
        pageViewsByLang: ({name}) => `Seitenaufrufe von ${name} nach Sprache`,
        amongOccupation: ({occupationPlural}) => `Unter ${occupationPlural}`,
        contemporaries: "Zeitgenossen",
        inCountry: ({country}) => `In ${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `Unter ${occupationPlural} in ${country}`,
        filmography: "Filmografie",
        tvMovieRoles: "Fernseh- und Filmrollen",
        insights: "Daten-Einblicke",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} führt die Rangliste aller ${totalFormatted} ${occupationPlural} in Pantheon weltweit an.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} belegt Platz ${rank} von ${totalFormatted} ${occupationPlural} weltweit – unter den besten ${topPercent} % des Berufsstands.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} ist die bestplatzierte der ${totalFormatted} in ${country} geborenen Persönlichkeiten in Pantheon.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `Von den ${count} in ${country} geborenen ${occupationPlural} belegt ${name} den ersten Platz.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} ist die bekannteste der ${count} bedeutenden Persönlichkeiten, die in ${city}, ${country}, geboren wurden${peers ? ` — noch vor ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} ist die bekannteste der ${count} bedeutenden Persönlichkeiten, die in ${city}, im heutigen ${country}, geboren wurden${peers ? ` — noch vor ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `Von den ${count} im Jahr ${year} geborenen Menschen in Pantheon ist ${name} am bekanntesten.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `Die Biografie von ${name} erscheint in ${count} Sprachversionen der Wikipedia – mehr als bei ${percent} % aller ${occupationPlural}.`,
        newLangs: ({name, count}) =>
          `Die Biografie von ${name} kam im vergangenen Jahr in ${count} neuen Sprachversionen der Wikipedia hinzu.`,
        nonEnglish: ({name, count}) =>
          `Die Biografie von ${name} verzeichnete im vergangenen Jahr ${count} Aufrufe in nicht-englischen Sprachversionen der Wikipedia – eine Bekanntheit weit über den englischsprachigen Raum hinaus.`,
        enduringFame: ({name, centuries, rank}) =>
          `Mehr als ${centuries} Jahrhunderte nach dem Tod belegt ${name} noch immer Platz ${rank} unter allen Persönlichkeiten in Pantheon.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `Mit ${views} Wikipedia-Aufrufen im vergangenen Jahr war ${name} die meistbesuchte Person unter allen ${occupationPlural}.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `Die Wikipedia-Seite von ${name} verzeichnete im vergangenen Jahr ${views} Aufrufe – das ${multiple}-Fache des Durchschnitts aller ${occupationPlural}.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `${name} ist eine von nur ${womenCount} Frauen unter den ${totalFormatted} ${occupationPlural} in Pantheon.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `Trotz eines Lebens von nur ${age} Jahren belegt ${name} Platz ${rank} unter allen ${occupationPlural} der Geschichte.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} gehört zu den ${count} am frühesten geborenen ${occupationPlural} in ganz Pantheon.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} hat am selben Tag Geburtstag (${date}) wie ${twinNames}.`,
        fallback: ({name, count, hpi}) =>
          `Die Biografie von ${name} umfasst ${count} Sprachversionen der Wikipedia und erreicht einen Historischen Popularitätsindex von ${hpi}.`,
      },
      metrics: {
        pageViews: "Seitenaufrufe",
        past12Months: "Letzte 12 Monate",
        hpi: "HPI",
        hpiDesc: "Historischer Popularitätsindex",
        avgOf: ({label}) => `Ø ${label}`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `Unter ${occupationPlural} belegt ${name} Rang ${rankHtml} von ${totalFormatted}.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `Unter den im Jahr ${year} Geborenen belegt ${name} Rang ${rankHtml}.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `Unter den im Jahr ${year} Verstorbenen belegt ${name} Rang ${rankHtml}.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `Unter den in ${countryHtml} Geborenen belegt ${name} Rang ${rankHtml} von ${totalFormatted}.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `Unter den in ${countryHtml} geborenen ${occupationPlural} belegt ${name} Rang ${rankHtml}.`,
        beforePeers: ({gender, count}) =>
          `Vor ${gender === "M" ? "ihm" : gender === "F" ? "ihr" : "ihnen"} ${count === 1 ? "steht" : "stehen"} `,
        afterPeers: ({gender, count}) =>
          `Nach ${gender === "M" ? "ihm" : gender === "F" ? "ihr" : "ihnen"} ${count === 1 ? "folgt" : "folgen"} `,
        notRankedIn: ({name, countryHtml}) => `${name} ist in ${countryHtml} nicht platziert`,
        mostPopularInWikipedia: ({occupationPlural}) => `Die beliebtesten ${occupationPlural} auf Wikipedia`,
        othersBornInYear: ({year}) => `Weitere im Jahr ${year} Geborene`,
        othersDeceasedInYear: ({year}) => `Weitere im Jahr ${year} Verstorbene`,
        othersBornInCountry: ({countryHtml}) => `Weitere in ${countryHtml} geborene Personen`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${demonym} ${occupationPlural}`,
        goToAllRankings: "Zu allen Ranglisten",
        and: " und ",
      },
      carousel: {
        present: "heute",
        hpiLabel: "HPI:",
        rankLabel: "Rang:",
      },
      footer: {
        relatedProfiles: "Ähnliche Profile",
        individuals: ({countFormatted}) => `${countFormatted} Personen`,
        rank: ({rankFormatted}) => `Rang ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `${langCode}.WIKIPEDIA-SEITENAUFRUFE (PV)`,
        rankInLanguage: ({rank, language}) => `Rang ${rank} auf ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `${count} Trend-Tag${count === 1 ? "" : "e"}`,
        less: "Weniger",
        more: "Mehr",
        clickForDetails: "Für Details klicken",
        notTrending: "Kein Trend",
        rankNum: ({rank}) => `Rang ${rank}`,
        viewAllTrendingNews: ({date}) => `Alle Trend-Nachrichten vom ${date} ansehen`,
      },
      pageViewsByLangChart: {
        languageEditions: "Sprachversionen",
        pageviewsByLanguageEdition: "Seitenaufrufe nach Sprachversion",
        cumulativeLanguageEditions: "Kumulierte Sprachversionen",
        editionsWord: "Sprachversionen",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} Aufrufe`,
        andOthers: ({count}) => `(und ${count} weitere)`,
        summaryIntro: ({name}) => `Im vergangenen Jahr hatte ${name} die meisten Seitenaufrufe in der `,
        wikipediaEdition: ({language}) => `${language}-Wikipedia-Ausgabe`,
        withViewsFollowedBy: ({viewsFormatted}) => ` mit ${viewsFormatted} Aufrufen, gefolgt von `,
        growthIntro: ". Beim jährlichen Zuwachs der Seitenaufrufe sind die Top-3-Wikipedia-Ausgaben ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) ist eine Sprache der Gruppe ${familyName} aus der Familie ${primaryFamilyName}.`,
        families: {
          "Indo-European": "Indogermanisch",
          "Sino-Tibetan": "Sinotibetisch",
          "Afro-Asiatic": "Afroasiatisch",
          "Altaic": "Altaisch",
          "Dravidian": "Dravidisch",
          "Austronesian": "Austronesisch",
          "Uralic": "Uralisch",
          "Caucasian": "Kaukasisch",
          "Niger-Kordofanian": "Niger-Kordofanisch",
          "Creoles and pidgins": "Kreol- und Pidginsprachen",
          "Amerindian": "Amerindisch",
          "Tai": "Tai",
          "Other": "Sonstige",
          "Albanian": "Albanisch",
          "Algic": "Algisch",
          "Armenian": "Armenisch",
          "Austro-Asiatic": "Austroasiatisch",
          "Baltic": "Baltisch",
          "Basque": "Baskisch",
          "Berber": "Berberisch",
          "Celtic": "Keltisch",
          "Chadic": "Tschadisch",
          "Constructed": "Konstruiert",
          "Creole (English)": "Kreolisch (Englisch)",
          "Creole (French)": "Kreolisch (Französisch)",
          "Cushitic": "Kuschitisch",
          "Eskimo-Aleut": "Eskimo-aleutisch",
          "Germanic": "Germanisch",
          "Greek": "Griechisch",
          "Indic": "Indisch",
          "Iranian": "Iranisch",
          "Italic": "Italisch",
          "Japanese": "Japanisch",
          "Korean": "Koreanisch",
          "Malayo-Polynesian": "Malayo-polynesisch",
          "Mongolian": "Mongolisch",
          "Na-Dene": "Na-Dené",
          "Nilo-Saharan": "Nilosaharanisch",
          "Quechuan": "Quechua",
          "Semitic": "Semitisch",
          "Sinitic": "Sinitisch",
          "Slavic": "Slawisch",
          "Tibeto-Burman": "Tibeto-birmanisch",
          "Tupi": "Tupi",
          "Turkic": "Turksprachen",
          "Uto-Aztecan": "Uto-aztekisch",
        },
      },
    },
    birthdayToast: ({name}) => `Heute ist der Geburtstag von ${name}`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank}) =>
      `${name} (${birthYear}–${deathYear}) ist ein(e) ${demonym}(r) ${occupation} auf Platz #${rank} weltweit im Historischen Popularitätsindex von Pantheon. Entdecken Sie Biografie, Seitenaufrufe und Kennzahlen.`,
    learnMoreRankless: "Erfahren Sie mehr über {name}s akademischen Einfluss bei Rankless",
    nav: {
      visualizations: "Visualisierungen",
      rankings: "Ranglisten",
      profiles: "Profile",
      people: "Personen",
      bornOnThisDay: "Heute Geboren",
      places: "Orte",
      countries: "Länder",
      occupations: "Berufe",
      occupationCountry: "Beruf / Land",
      eras: "Epochen",
      deaths: "Todesfälle",
      about: "Über",
      data: "Daten",
      permissions: "Berechtigungen",
      download: "Herunterladen",
      api: "API",
      games: "Spiele",
      yearbook: "Jahrbuch",
      birthle: "Birthle",
      trivia: "Wissenswertes",
      news: "Nachrichten",
      search: "Suchen",
      home: "Startseite",
      giveFeedback: "Feedback Geben",
      usageCitation: "Nutzungszitat",
      newBadge: "neu!",
      explore: "Erkunden",
      apps: "Apps",
      reportDataError: "Datenfehler Melden",
      privacyPolicy: "Datenschutzrichtlinie",
      termsOfService: "Nutzungsbedingungen",
    },
    occupationCountry: {
      theMostFamous: "Die Berühmtesten",
      from: "aus",
      greatest: "Die Größten",

      keepExploring: "Weiter erkunden",
      trendingThisWeek: "Diese Woche im Trend",
      trendScoreLabel: "Trend-Score",
      whyTrending: "Warum ist das im Trend?",
      clicksThisWeek: "Klicks diese Woche",
      impressionsThisWeek: "Impressionen diese Woche",
      readMore: "Mehr lesen",
      showLess: "Weniger anzeigen",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} bemerkenswerte Person${count === 1 ? "" : "en"}`,
      viewsLabel: "Aufrufe",
      onDate: ({date}) => `am ${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Im Trend ${occupationPlural} diese Woche`;
        return hasFromPrefix
          ? `Im Trend ${occupationPlural} ${locationLabel} diese Woche`
          : `Im Trend ${locationLabel} ${occupationPlural} diese Woche`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Die Top 10 ${occupationPlural} im Trend auf Wikipedia`;
        return hasFromPrefix
          ? `Die Top 10 ${occupationPlural} ${locationLabel} im Trend auf Wikipedia`
          : `Die Top 10 ${locationLabel} ${occupationPlural} im Trend auf Wikipedia`;
      },
      trendingIntroSuffix: "in den letzten 7 Tagen, mit einer kurzen Erklärung.",
      trendingThisWeekShort: "Diese Woche im Trend",
      trendingThisWeekDefault: "Diese Woche im Trend auf Wikipedia",
      metaTitle: ({demonym, occupationPlural}) => `Die größten ${demonym} ${occupationPlural} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `Entdecken Sie die ${countFormatted} berühmtesten ${demonym} ${occupationPlural} der Geschichte. Erkunden Sie bemerkenswerte ${occupationSingular}-Profile aus ${country}, geordnet nach historischer Bedeutung.`,
      birthDecadesTitle: "Personen nach Geburtsjahrzehnt",
      birthDecadesIntro: ({demonym, occupationPlural}) => `Durchsuchen Sie bemerkenswerte ${demonym} ${occupationPlural}, gruppiert nach Geburtsjahrzehnt. Jede Dekade zeigt die Top 10 nach HPI; zum Anzeigen aller erweitern.`,
      decadeLabel: ({decade}) => `${decade}er`,
      more: ({count}) => `+${count} weitere`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `Pantheon hat ${totalCount} Personen, die als ${demonym} ${occupationPlural} eingestuft sind und zwischen ${oldestYear} und ${youngestYear} geboren wurden.`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `Davon ist heute niemand mehr am Leben.`;
        return `Davon sind ${aliveCountFormatted} (${aliveShare}) heute noch am Leben.`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `Die bekanntesten lebenden ${demonym} ${occupationPlural} sind `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `Die bekanntesten verstorbenen ${demonym} ${occupationPlural} sind `,
      peopleNewAsOf: "April 2024",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `Seit ${asOfLabel} wurden ${countFormatted} neue ${demonym} ${occupationPlural} zu Pantheon hinzugefügt, darunter `,
      goToAllRankings: "Alle Rankings ansehen",
      livingTitle: ({demonym, occupationPlural}) => `Lebende ${demonym} ${occupationPlural}`,
      deceasedTitle: ({demonym, occupationPlural}) => `Verstorbene ${demonym} ${occupationPlural}`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `Neu hinzugefügte ${demonym} ${occupationPlural} (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for German ordinals
        const formatGermanOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          return `${num}.`;
        };

        let text = `Diese Seite enthält eine Liste der größten ${demonym} ${occupationPlural}. `;
        text += `Der Pantheon-Datensatz enthält ${totalCount} ${occupationPlural}, von denen ${countryCount} in ${country} geboren wurden. `;
        if (rank) {
          const germanRank = formatGermanOrdinal(rank);
          text += `Dies macht ${country} zum ${germanRank} Geburtsort der größten Anzahl von ${occupationPlural}`;
          if (countriesBehind) {
            text += ` nach ${countriesBehind}.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "und",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `Die folgenden Personen werden von Pantheon als ${count === 10 ? "die 10" : ""} legendärsten ${demonym} ${occupationPlural} aller Zeiten angesehen. Diese Liste berühmter ${demonym} ${occupationPlural} ist nach HPI (Historical Popularity Index) sortiert, einer Metrik, die Informationen über die Online-Popularität einer Biografie aggregiert.`,
      visitRankings: "Besuchen Sie die Ranking-Seite, um die vollständige Liste der",
      top: "Top",
      withHpi: ({hpi, name}) => `Mit einem HPI von ${hpi} ist ${name}`,
      isMostFamous: ({demonym, occupation}) => `der berühmteste ${demonym} ${occupation}.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `der ${rank} berühmteste ${demonym} ${occupation}.`,
      biographyTranslated: ({possessive, count}) => `${possessive} Biografie wurde in ${count} verschiedene Sprachen übersetzt`,
      onWikipedia: "auf Wikipedia",
    },
    selectPerson: {
      heading: "Bedeutende Persönlichkeiten Entdecken",
      subtitle: "Entdecken Sie die einflussreichsten Personen der Geschichte aus jedem Bereich, Land und jeder Epoche",
      metaDescription: "Durchsuchen Sie über 85.000 Biografien bedeutender Persönlichkeiten mit Wikipedia-Präsenz in über 15 Sprachen.",
      searchPlaceholder: "Personen, Orte und Berufe suchen",
      randomPerson: "Zufällige Person",
      statPeople: "Biografien",
      statLanguages: "Sprachausgaben",
      description: "Pantheon verfolgt Biografien mit Präsenz in mindestens 15 Wikipedia-Sprachausgaben, klassifiziert nach Beruf und organisiert nach Herkunftsland und -stadt.",
      featuredPeople: "Bedeutendste Persönlichkeiten",
      trendingNow: "Gerade im Trend",
      browseByField: "Nach Bereich Durchsuchen",
      domainSports: "Sport",
      domainArts: "Kunst und Unterhaltung",
      domainScience: "Wissenschaft und Technologie",
      domainPolitics: "Politik und Führung",
      exploreMore: "Mehr Entdecken",
      byOccupationCountry: "Nach Beruf und Land",
      rankings: "Ranglisten",
      byEra: "Nach Epoche",
    },
    selectCountry: {
      heading: "Länder Entdecken",
      subtitle: "Entdecken Sie die bedeutendsten Persönlichkeiten aus jedem Land der Welt",
      metaDescription: "Entdecken Sie bedeutende Persönlichkeiten aus jedem Land. Durchsuchen Sie Biografien nach Geburtsland, betrachten Sie interaktive Karten und entdecken Sie historische Persönlichkeiten aus aller Welt.",
      totalCountries: "Länder",
      totalPeople: "bedeutende Persönlichkeiten",
      mapTitle: "Bedeutende Persönlichkeiten nach Land",
      countryList: "Alle Länder",
      sortAlpha: "A–Z",
      sortPeople: "Meiste Personen",
      people: "Personen",
      noPeopleData: "Keine Daten verfügbar",
      exploreMore: "Mehr Entdecken",
      byPerson: "Bedeutende Persönlichkeiten",
      byOccupation: "Nach Beruf & Land",
      rankings: "Ranglisten",
    },
    selectPlace: {
      heading: "Orte Entdecken",
      subtitle: "Entdecken Sie die Städte, die die bedeutendsten Persönlichkeiten der Geschichte hervorgebracht haben",
      metaDescription: "Entdecken Sie die Geburtsorte bedeutender Persönlichkeiten weltweit. Durchsuchen Sie Städte nach Anzahl bedeutender Geburten und entdecken Sie historische Zentren.",
      totalPlaces: "Orte",
      totalPeople: "bedeutende Persönlichkeiten",
      mapTitle: "Geburtsorte Bedeutender Persönlichkeiten",
      placeList: "Top-Orte",
      sortAlpha: "A–Z",
      sortPeople: "Meiste Personen",
      groupByCountry: "Nach Land",
      people: "Personen",
      exploreMore: "Mehr Entdecken",
      byPerson: "Bedeutende Persönlichkeiten",
      byCountry: "Nach Land",
      rankings: "Ranglisten",
    },
    selectOccupation: {
      heading: "Berufe Entdecken",
      subtitle: "Entdecken Sie die Bereiche und Berufe, die die bedeutendsten Persönlichkeiten der Geschichte hervorgebracht haben",
      metaDescription: "Entdecken Sie 101 Berufe der bedeutendsten Persönlichkeiten der Geschichte. Durchsuchen Sie nach Beruf und Anzahl bedeutender Persönlichkeiten.",
      totalOccupations: "Berufe",
      totalPeople: "bedeutende Persönlichkeiten",
      occupationList: "Alle Berufe",
      sortAlpha: "A–Z",
      sortPeople: "Meiste Personen",
      people: "Personen",
      exploreMore: "Mehr Entdecken",
      byPerson: "Bedeutende Persönlichkeiten",
      byCountry: "Nach Land",
      rankings: "Ranglisten",
    },
    selectOccupationCountry: {
      heading: "Wählen Sie einen Beruf und ein Land",
      pleaseSelect: "Bitte wählen Sie eine Kombination aus Beruf und Land, um die denkwürdigsten Biografien zu sehen",
      selectOccupation: "Wählen Sie einen Beruf",
      selectCountry: "Wählen Sie ein Land",
      goToProfile: "Zum Profil gehen",
      whoAreTheMostFamous: "Wer sind die berühmtesten...",
      trendingThisWeek: "Trends Diese Woche",
      browseByCountry: "Nach Land durchsuchen",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
      }) => {
        const possessive = gender === "M" ? "Seine" : gender === "F" ? "Ihre" : "Die";

        let sentence = `${possessive} Biografie ist in ${l} verschiedenen Sprachen auf Wikipedia verfügbar`;
        if (l_prev && l !== l_prev) {
          sentence += ` (${l > l_prev ? "gestiegen" : "gesunken"} von ${l_prev} im Jahr 2024)`;
        }
        sentence += ". ";

        const article = gender === "F" ? "die" : "der";
        sentence += `${name} ist ${article} ${occupationRank === 1 ? "" : formatOrdinal(occupationRank)} beliebteste <a href="/profile/occupation/${occupationSlug}">${occupation}</a>`;
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          sentence += ` (${occupationRank < occupationRankPrev ? "gestiegen" : "gesunken"} vom ${formatOrdinal(occupationRankPrev)} im Jahr 2024)`;
        }

        if (country) {
          sentence += `, die ${bplaceCountryRank !== 1 ? formatOrdinal(bplaceCountryRank) : ""} beliebteste Biografie aus <a href="/profile/place/${countrySlug}">${country}</a>`;
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            sentence += ` (${bplaceCountryRank < bplaceCountryRankPrev ? "gestiegen" : "gesunken"} vom ${formatOrdinal(bplaceCountryRankPrev)} im Jahr 2019)`;
          }

          if (bplaceCountryOccupationRank) {
            sentence += ` und ${article} ${bplaceCountryOccupationRank !== 1 ? formatOrdinal(bplaceCountryOccupationRank) : ""} beliebteste <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${demonym} ${occupation}</a>`;
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "Visualisierungen",
      rankings: "Ranglisten",
      profiles: "Profile",
      people: "Personen",
      bornOnThisDay: "Heute Geboren",
      places: "Orte",
      countries: "Länder",
      occupations: "Berufe",
      occupationCountry: "Beruf / Land",
      eras: "Epochen",
      deaths: "Todesfälle",
      about: "Über uns",
      data: "Daten",
      permissions: "Berechtigungen",
      download: "Herunterladen",
      api: "API",
      games: "Spiele",
      yearbook: "Jahrbuch",
      birthle: "Birthle",
      trivia: "Trivia",
      news: "Nachrichten",
      search: "Suchen",
      home: "Startseite",
      giveFeedback: "Feedback geben",
      usageCitation: "Zitatangabe",
      newBadge: "neu!",
    },
    readMoreWikipedia: "Mehr auf Wikipedia lesen",
    home: {
      tagline: "Erkunden Sie das kollektive Gedächtnis der Menschheit!",
      subtitle:
        "Pantheon hilft Ihnen, die Geografie und Dynamik der Geschichte unseres Planeten zu entdecken.",
      explore: "Erkunden",
      people: "Personen",
      places: "Orte",
      occupations: "Berufe",
      and: "und",
      eras: "Epochen",
      trendingProfiles: "Heute im Trend",
      topProfilesBy: "Top-Profile nach Seitenaufrufen für die",
      wikipediaEdition: "Wikipedia-Ausgabe",
      about:
        "ist ein Observatorium des kollektiven Gedächtnisses, das sich auf Biografien mit Präsenz in mindestens",
      languages: "Sprachen",
      aboutContinued:
        "in Wikipedia konzentriert. Wir haben Daten von mehr als 85.000 Biografien, organisiert nach Ländern, Städten, Berufen und Epochen. Erkunden Sie diese Daten, um mehr über die Persönlichkeiten zu erfahren, die die menschliche Kultur prägen.",
      aboutDeveloped:
        "begann als Projekt der Collective Learning-Gruppe am MIT. Heute wird es entwickelt von",
      datawheel: "Datawheel",
      aboutDatawheel:
        ", einem Unternehmen, das sich auf die Erstellung von Datenvertriebs- und Visualisierungslösungen spezialisiert hat.",
      recentPassings: "Kürzliche Todesfälle",
      notableDeaths: "Bedeutende Todesfälle von 2025",
      notableDeathsText:
        "Möchten Sie die vollständige Liste der bemerkenswerten Persönlichkeiten sehen, die wir 2025 verloren haben? Besuchen Sie unsere",
      notableDeathsLink: "Bedeutende Todesfälle von 2025",
      notableDeathsContinued:
        "Seite für eine umfassende Sammlung von Biografien einflussreicher Persönlichkeiten, darunter Prominente, Künstler, Führungspersönlichkeiten und kulturelle Ikonen, die dieses Jahr verstorben sind.",
      trendingSingers: "Sänger im Trend Heute",
      trendingActors: "Schauspieler im Trend Heute",
      recentlyAdded: "Kürzlich zu Pantheon Hinzugefügt",
      searchPlaceholder: "Personen, Orte und Berufe suchen",
      isTrending: "ist heute im Trend",
      readFullStory: "Vollständige Geschichte lesen",
      turningXToday: ({age}) => `Wird heute ${age}!`,
      wouldHaveBeenX: ({age}) => `Wäre heute ${age}`,
      seeAllBirthdays: "Alle Geburtstage anzeigen",
      bornTodayTitle: "Berühmte Personen Heute Geboren",
    },
    recentlyAdded: {
      title: "Kürzlich zu Pantheon Hinzugefügt",
      subtitle: "Entdecke die neuesten Biografien in Pantheons Sammlung, sortiert nach ihrem Hinzufügungsdatum.",
      addedOn: ({date}) => `Hinzugefügt am ${date}`,
      previous: "Zurück",
      next: "Weiter",
      pageLabel: ({page}) => `Seite ${page}`,
      viewMore: "Weitere kürzlich hinzugefügte Personen ansehen",
      empty: "Keine kürzlich hinzugefügten Personen gefunden.",
    },
    news: {
      pageTitle: "Wer ist heute im Trend?",
      pageSubtitle:
        "Tägliche Zusammenfassungen historischer Persönlichkeiten (von KI generiert)",
      trendingIn: "Im Trend in",
      selectDate: "Wählen Sie ein anderes Datum",
      references: "Referenzen:",
      noData: "Keine Trenddaten für dieses Datum verfügbar.",
      previousDay: "Vorheriger Tag",
      nextDay: "Nächster Tag",
      unknown: "Unbekannt",
    },
    trending: {
      isTrendingToday: "{name} ist heute im Trend!",
      whyTrending: "Warum {name} im Trend ist:",
      references: "Quellen:",
      viewMoreTrending: "Weitere Trendpersonen ansehen",
    },
    bornOnThisDay: {
      famousBirthdays: "Berühmte Geburtstage",
      bornOnThisDay: "Heute Geboren",
      famousPeopleBornOnThisDay: ({count}) => `${count} berühmte ${count === 1 ? "Person" : "Personen"}, die heute geboren ${count === 1 ? "wurde" : "wurden"}`,
      birthdayOf: ({displayDate, count}) => `Der ${displayDate} ist der Geburtstag von ${count} Berühmtheiten und historisch bedeutsamen ${count === 1 ? "Person" : "Personen"} in der Pantheon-Datenbank.`,
      mostFamousInclude: "Zu den berühmtesten gehören",
      mostCommonOccupations: "Die häufigsten Berufe für an diesem Tag geborene Personen sind",
      exploreAnotherDate: "Ein anderes Datum erkunden",
      go: "Los",
      today: "Heute",
      previousDay: "Vorheriger Tag",
      nextDay: "Nächster Tag",
      famousPeopleBornOn: ({displayDate}) => `Berühmte Personen, die am ${displayDate} geboren wurden`,
      discoverRemarkable: ({displayDate}) => `Entdecken Sie die bemerkenswerten Persönlichkeiten, die den ${displayDate} als ihren Geburtstag teilen. Von Weltführern und bahnbrechenden Wissenschaftlern bis hin zu beliebten Entertainern und legendären Athleten – dieser Tag hat die Geburt vieler einflussreicher Persönlichkeiten in der Geschichte erlebt.`,
      someNotableInclude: "Zu den bemerkenswertesten gehören",
      stillLivingToday: ({total, living}) => `Von den ${total} berühmten Personen, die an diesem Datum geboren wurden, leben ${living} heute noch.`,
      viewFullRankings: "Vollständige Rangliste für diesen Tag anzeigen",
      born: "Geboren",
      birthdaysByOccupation: "Geburtstage nach Beruf",
      occupationIntro: ({displayDate}) => `Sehen Sie, wie die berühmten Personen, die am ${displayDate} geboren wurden, auf verschiedene Bereiche und Berufe verteilt sind. Klicken Sie auf eine Person, um mehr über ihr Leben und ihre Erfolge zu erfahren.`,
      showLess: "Weniger anzeigen",
      more: ({count}) => `+${count} weitere`,
      formatDate: ({month, day}) => {
        const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        return `${day}. ${months[month - 1]}`;
      },
      metaTitle: ({displayDate}) => `Berühmte Geburtstage am ${displayDate} | Wer Wurde Heute Geboren? | Pantheon`,
      metaDescription: ({displayDate}) => `Entdecken Sie die berühmtesten Menschen, die am ${displayDate} in der Geschichte geboren wurden. Erkunden Sie Geburtstagsprofile von Prominenten, historischen Persönlichkeiten, Wissenschaftlern, Künstlern, Sportlern und mehr.`,
      months: {
        january: "Januar",
        february: "Februar",
        march: "März",
        april: "April",
        may: "Mai",
        june: "Juni",
        july: "Juli",
        august: "August",
        september: "September",
        october: "Oktober",
        november: "November",
        december: "Dezember",
      },
    },
  },
  ru: {
    stillAlive: "настоящее время",
    person: {
      loading: "Загрузка...",
      metaTitle: ({name}) => `${name} — биография | Pantheon`,
      sections: {
        trending: "В тренде",
        memorabilityMetrics: "Метрики памятности",
        trendingActivity: "Трендовая активность",
        notableWorks: "Известные работы",
        pageViewsByLang: ({name}) => `Просмотры страницы ${name} по языкам`,
        amongOccupation: ({occupationPlural}) => `Среди представителей профессии «${occupationPlural}»`,
        contemporaries: "Современники",
        inCountry: ({country}) => `В стране ${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `Среди представителей профессии «${occupationPlural}» в стране ${country}`,
        filmography: "Фильмография",
        tvMovieRoles: "Роли в кино и на телевидении",
        insights: "Интересные факты",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} занимает первое место среди всех ${totalFormatted} ${occupationPlural} в Pantheon по всему миру.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} занимает ${rank}-е место среди ${totalFormatted} ${occupationPlural} мира — в числе ${topPercent} % лучших в профессии.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} — самая высокоранговая из ${totalFormatted} личностей Pantheon, родившихся в стране ${country}.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `Из ${count} ${occupationPlural}, родившихся в стране ${country}, ${name} занимает первое место.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} — самая известная из ${count} значимых личностей, родившихся в городе ${city} (${country})${peers ? `, опережая таких, как ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} — самая известная из ${count} значимых личностей, родившихся в городе ${city}, на территории современного государства ${country}${peers ? `, опережая таких, как ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `Из ${count} личностей Pantheon, родившихся в ${year} году, ${name} — самая известная.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `Биография ${name} представлена в ${count} языковых разделах Википедии — больше, чем у ${percent} % всех ${occupationPlural}.`,
        newLangs: ({name, count}) =>
          `За последний год биография ${name} появилась в ${count} новых языковых разделах Википедии.`,
        nonEnglish: ({name, count}) =>
          `За последний год страница ${name} набрала ${count} просмотров в неанглоязычных разделах Википедии — известность далеко за пределами англоязычного мира.`,
        enduringFame: ({name, centuries, rank}) =>
          `Спустя более ${centuries} веков после смерти ${name} по-прежнему занимает ${rank}-е место среди всех личностей в Pantheon.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `Набрав ${views} просмотров в Википедии за последний год, ${name} лидирует по посещаемости среди всех ${occupationPlural}.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `Страница ${name} в Википедии набрала ${views} просмотров за последний год — в ${multiple} раз больше среднего среди ${occupationPlural}.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `${name} — одна из всего лишь ${womenCount} женщин среди ${totalFormatted} ${occupationPlural} в Pantheon.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `Прожив всего ${age} лет, ${name} занимает ${rank}-е место среди всех ${occupationPlural} в истории.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} входит в число ${count} самых ранних по году рождения ${occupationPlural} в Pantheon.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} отмечает день рождения (${date}) в один день с ${twinNames}.`,
        fallback: ({name, count, hpi}) =>
          `Биография ${name} представлена в ${count} языковых разделах Википедии, а Индекс исторической популярности составляет ${hpi}.`,
      },
      metrics: {
        pageViews: "Просмотры страниц",
        past12Months: "За последние 12 месяцев",
        hpi: "HPI",
        hpiDesc: "Индекс исторической популярности",
        avgOf: ({label}) => `Средн. ${label}`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `Среди представителей профессии «${occupationPlural}» ${name} занимает ${rankHtml}-е место из ${totalFormatted}.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `Среди людей, родившихся в ${year} году, ${name} занимает ${rankHtml}-е место.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `Среди людей, умерших в ${year} году, ${name} занимает ${rankHtml}-е место.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `Среди людей, родившихся в стране ${countryHtml}, ${name} занимает ${rankHtml}-е место из ${totalFormatted}.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `Среди представителей профессии «${occupationPlural}», родившихся в стране ${countryHtml}, ${name} занимает ${rankHtml}-е место.`,
        beforePeers: ({gender, count}) =>
          `Перед ${gender === "M" ? "ним" : gender === "F" ? "ней" : "ними"} ${count === 1 ? "идёт" : "идут"} `,
        afterPeers: ({gender, count}) =>
          `После ${gender === "M" ? "него" : gender === "F" ? "неё" : "них"} ${count === 1 ? "идёт" : "идут"} `,
        notRankedIn: ({name, countryHtml}) => `${name} не входит в рейтинг страны ${countryHtml}`,
        mostPopularInWikipedia: ({occupationPlural}) => `Самые популярные в Википедии: ${occupationPlural}`,
        othersBornInYear: ({year}) => `Другие люди, родившиеся в ${year} году`,
        othersDeceasedInYear: ({year}) => `Другие люди, умершие в ${year} году`,
        othersBornInCountry: ({countryHtml}) => `Другие люди, родившиеся в стране ${countryHtml}`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${demonym}: ${occupationPlural}`,
        goToAllRankings: "Все рейтинги",
        and: " и ",
      },
      carousel: {
        present: "наст. время",
        hpiLabel: "HPI:",
        rankLabel: "Место:",
      },
      footer: {
        relatedProfiles: "Похожие профили",
        individuals: ({countFormatted}) => `${countFormatted} чел.`,
        rank: ({rankFormatted}) => `Место ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `ПРОСМОТРЫ ${langCode}.WIKIPEDIA (PV)`,
        rankInLanguage: ({rank, language}) => `Место №${rank} — ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `Дней в тренде: ${count}`,
        less: "Меньше",
        more: "Больше",
        clickForDetails: "Нажмите для подробностей",
        notTrending: "Не в тренде",
        rankNum: ({rank}) => `Место №${rank}`,
        viewAllTrendingNews: ({date}) => `Все трендовые новости за ${date}`,
      },
      pageViewsByLangChart: {
        languageEditions: "Языковые версии",
        pageviewsByLanguageEdition: "Просмотры по языковым версиям",
        cumulativeLanguageEditions: "Языковые версии (накопительно)",
        editionsWord: "версий",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} просмотров`,
        andOthers: ({count}) => `(и ещё ${count})`,
        summaryIntro: ({name}) => `За последний год больше всего просмотров страницы ${name} было в `,
        wikipediaEdition: ({language}) => `разделе Википедии на языке «${language}»`,
        withViewsFollowedBy: ({viewsFormatted}) => ` — ${viewsFormatted} просмотров; далее следуют `,
        growthIntro: ". По годовому росту просмотров тройка ведущих разделов Википедии: ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) — язык группы «${familyName}» семьи «${primaryFamilyName}».`,
        families: {
          "Indo-European": "Индоевропейская",
          "Sino-Tibetan": "Сино-тибетская",
          "Afro-Asiatic": "Афразийская",
          "Altaic": "Алтайская",
          "Dravidian": "Дравидийская",
          "Austronesian": "Австронезийская",
          "Uralic": "Уральская",
          "Caucasian": "Кавказская",
          "Niger-Kordofanian": "Нигеро-кордофанская",
          "Creoles and pidgins": "Креольские и пиджины",
          "Amerindian": "Америндская",
          "Tai": "Тайская",
          "Other": "Другие",
          "Albanian": "Албанская",
          "Algic": "Алгская",
          "Armenian": "Армянская",
          "Austro-Asiatic": "Австроазиатская",
          "Baltic": "Балтийская",
          "Basque": "Баскская",
          "Berber": "Берберская",
          "Celtic": "Кельтская",
          "Chadic": "Чадская",
          "Constructed": "Искусственная",
          "Creole (English)": "Креольская (английская)",
          "Creole (French)": "Креольская (французская)",
          "Cushitic": "Кушитская",
          "Eskimo-Aleut": "Эскимосско-алеутская",
          "Germanic": "Германская",
          "Greek": "Греческая",
          "Indic": "Индийская",
          "Iranian": "Иранская",
          "Italic": "Италийская",
          "Japanese": "Японская",
          "Korean": "Корейская",
          "Malayo-Polynesian": "Малайско-полинезийская",
          "Mongolian": "Монгольская",
          "Na-Dene": "На-дене",
          "Nilo-Saharan": "Нило-сахарская",
          "Quechuan": "Кечуанская",
          "Semitic": "Семитская",
          "Sinitic": "Синитская",
          "Slavic": "Славянская",
          "Tibeto-Burman": "Тибето-бирманская",
          "Tupi": "Тупи",
          "Turkic": "Тюркская",
          "Uto-Aztecan": "Юто-ацтекская",
        },
      },
    },
    birthdayToast: ({name}) => `Сегодня день рождения ${name}`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank}) =>
      `${name} (${birthYear}–${deathYear}) — ${demonym} ${occupation}, занимающий #${rank} место в мире по Индексу Исторической Популярности Pantheon. Исследуйте биографию, просмотры и метрики.`,
    learnMoreRankless: "Узнайте больше о академическом влиянии {name} на Rankless",
    nav: {
      visualizations: "Визуализации",
      rankings: "Рейтинги",
      profiles: "Профили",
      people: "Люди",
      bornOnThisDay: "Родились в Этот День",
      places: "Места",
      countries: "Страны",
      occupations: "Профессии",
      occupationCountry: "Профессия / Страна",
      eras: "Эпохи",
      deaths: "Смерти",
      about: "О Проекте",
      data: "Данные",
      permissions: "Разрешения",
      download: "Скачать",
      api: "API",
      games: "Игры",
      yearbook: "Ежегодник",
      birthle: "Birthle",
      trivia: "Викторина",
      news: "Новости",
      search: "Поиск",
      home: "Главная",
      giveFeedback: "Оставить Отзыв",
      usageCitation: "Цитирование Использования",
      newBadge: "новое!",
      explore: "Исследовать",
      apps: "Приложения",
      reportDataError: "Сообщить об Ошибке в Данных",
      privacyPolicy: "Политика Конфиденциальности",
      termsOfService: "Условия Использования",
    },
    occupationCountry: {
      theMostFamous: "Самые Известные",
      from: "из",
      greatest: "Лучшие",

      keepExploring: "Продолжить исследование",
      trendingThisWeek: "В тренде на этой неделе",
      trendScoreLabel: "Оценка тренда",
      whyTrending: "Почему это в тренде?",
      clicksThisWeek: "Клики за неделю",
      impressionsThisWeek: "Показы за неделю",
      readMore: "Читать далее",
      showLess: "Скрыть",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} ${count === 1 ? "заметная персона" : "заметных персон"}`,
      viewsLabel: "просмотров",
      onDate: ({date}) => `на ${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `В тренде ${occupationPlural} на этой неделе`;
        return hasFromPrefix
          ? `В тренде ${occupationPlural} ${locationLabel} на этой неделе`
          : `В тренде ${locationLabel} ${occupationPlural} на этой неделе`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Топ‑10 ${occupationPlural} в тренде на Wikipedia`;
        return hasFromPrefix
          ? `Топ‑10 ${occupationPlural} ${locationLabel} в тренде на Wikipedia`
          : `Топ‑10 ${locationLabel} ${occupationPlural} в тренде на Wikipedia`;
      },
      trendingIntroSuffix: "за последние 7 дней, с кратким объяснением причины всплеска.",
      trendingThisWeekShort: "В тренде на этой неделе",
      trendingThisWeekDefault: "В тренде на этой неделе на Wikipedia",
      metaTitle: ({demonym, occupationPlural}) => `Самые известные ${demonym} ${occupationPlural} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `Откройте для себя ${countFormatted} самых известных ${demonym} ${occupationPlural} в истории. Посмотрите выдающиеся профили ${occupationSingular} из ${country}, ранжированные по исторической значимости.`,
      birthDecadesTitle: "Люди по десятилетиям рождения",
      birthDecadesIntro: ({demonym, occupationPlural}) => `Просматривайте известных ${demonym} ${occupationPlural}, сгруппированных по десятилетиям рождения. Каждое десятилетие показывает топ-10 по HPI; раскройте, чтобы увидеть всех.`,
      decadeLabel: ({decade}) => `${decade}-е`,
      more: ({count}) => `+${count} ещё`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `В Pantheon ${totalCount} персон, классифицированных как ${demonym} ${occupationPlural}, родившихся между ${oldestYear} и ${youngestYear}.`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `Из них никто больше не жив.`;
        return `Из них ${aliveCountFormatted} (${aliveShare}) всё ещё живы.`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `Среди самых известных живущих ${demonym} ${occupationPlural}: `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `Среди самых известных умерших ${demonym} ${occupationPlural}: `,
      peopleNewAsOf: "апрель 2024",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `По состоянию на ${asOfLabel} в Pantheon добавлено ${countFormatted} новых ${demonym} ${occupationPlural}, включая `,
      goToAllRankings: "Посмотреть все рейтинги",
      livingTitle: ({demonym, occupationPlural}) => `Живые ${demonym} ${occupationPlural}`,
      deceasedTitle: ({demonym, occupationPlural}) => `Умершие ${demonym} ${occupationPlural}`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `Недавно добавленные ${demonym} ${occupationPlural} (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for Russian ordinals
        const formatRussianOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          return `${num}-м`;
        };

        let text = `Эта страница содержит список величайших ${demonym} ${occupationPlural}. `;
        text += `Набор данных Pantheon содержит ${totalCount} ${occupationPlural}, ${countryCount} из которых родились в ${country}. `;
        if (rank) {
          const russianRank = formatRussianOrdinal(rank);
          text += `Это делает ${country} ${russianRank} местом рождения наибольшего числа ${occupationPlural}`;
          if (countriesBehind) {
            text += ` после ${countriesBehind}.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "и",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `Следующие люди считаются Pantheon ${count === 10 ? "10" : ""} самыми легендарными ${demonym} ${occupationPlural} всех времен. Этот список знаменитых ${demonym} ${occupationPlural} отсортирован по HPI (Индекс исторической популярности), метрике, которая агрегирует информацию об онлайн-популярности биографии.`,
      visitRankings: "Посетите страницу рейтингов, чтобы просмотреть полный список",
      top: "Топ",
      withHpi: ({hpi, name}) => `С HPI ${hpi}, ${name}`,
      isMostFamous: ({demonym, occupation}) => `является самым известным ${demonym} ${occupation}.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `является ${rank} самым известным ${demonym} ${occupation}.`,
      biographyTranslated: ({possessive, count}) => `${possessive} биография была переведена на ${count} различных языков`,
      onWikipedia: "в Википедии",
    },
    selectPerson: {
      heading: "Исследуйте Выдающихся Людей",
      subtitle: "Откройте для себя самых влиятельных людей в истории из всех областей, стран и эпох",
      metaDescription: "Просмотрите более 85 000 биографий выдающихся людей с присутствием в Википедии на более чем 15 языках.",
      searchPlaceholder: "Поиск людей, мест и профессий",
      randomPerson: "Случайная Персона",
      statPeople: "биографий",
      statLanguages: "языковых изданий",
      description: "Pantheon отслеживает биографии, присутствующие как минимум в 15 языковых изданиях Википедии, классифицированные по профессиям и организованные по странам и городам происхождения.",
      featuredPeople: "Самые Известные Люди",
      trendingNow: "Сейчас в Тренде",
      browseByField: "Обзор по Области",
      domainSports: "Спорт",
      domainArts: "Искусство и Развлечения",
      domainScience: "Наука и Технологии",
      domainPolitics: "Политика и Лидерство",
      exploreMore: "Узнать Больше",
      byOccupationCountry: "По Профессии и Стране",
      rankings: "Рейтинги",
      byEra: "По Эпохе",
    },
    selectCountry: {
      heading: "Исследовать Страны",
      subtitle: "Откройте для себя самых выдающихся людей из каждой страны мира",
      metaDescription: "Исследуйте выдающихся людей из каждой страны. Просматривайте биографии по стране рождения, интерактивные карты и исторических деятелей со всего мира.",
      totalCountries: "стран",
      totalPeople: "выдающихся людей",
      mapTitle: "Выдающиеся Люди по Странам",
      countryList: "Все Страны",
      sortAlpha: "А–Я",
      sortPeople: "Больше Людей",
      people: "человек",
      noPeopleData: "Данные недоступны",
      exploreMore: "Узнать Больше",
      byPerson: "Выдающиеся Люди",
      byOccupation: "По Профессии и Стране",
      rankings: "Рейтинги",
    },
    selectPlace: {
      heading: "Исследовать Места",
      subtitle: "Откройте для себя города, которые сформировали самых выдающихся людей истории",
      metaDescription: "Исследуйте места рождения выдающихся людей со всего мира. Просматривайте города по количеству рождений и открывайте исторические центры.",
      totalPlaces: "мест",
      totalPeople: "выдающихся людей",
      mapTitle: "Места Рождения Выдающихся Людей",
      placeList: "Лучшие Места",
      sortAlpha: "А–Я",
      sortPeople: "Больше Людей",
      groupByCountry: "По Стране",
      people: "человек",
      exploreMore: "Узнать Больше",
      byPerson: "Выдающиеся Люди",
      byCountry: "По Стране",
      rankings: "Рейтинги",
    },
    selectOccupation: {
      heading: "Исследовать Профессии",
      subtitle: "Откройте для себя области и профессии, которые сформировали самых выдающихся людей истории",
      metaDescription: "Исследуйте 101 профессию самых выдающихся людей истории. Просматривайте по профессии и количеству выдающихся людей.",
      totalOccupations: "профессий",
      totalPeople: "выдающихся людей",
      occupationList: "Все Профессии",
      sortAlpha: "А–Я",
      sortPeople: "Больше Людей",
      people: "человек",
      exploreMore: "Узнать Больше",
      byPerson: "Выдающиеся Люди",
      byCountry: "По Стране",
      rankings: "Рейтинги",
    },
    selectOccupationCountry: {
      heading: "Выберите профессию и страну",
      pleaseSelect: "Пожалуйста, выберите комбинацию профессии и страны, чтобы увидеть самые запоминающиеся биографии",
      selectOccupation: "Выберите профессию",
      selectCountry: "Выберите страну",
      goToProfile: "Перейти к профилю",
      whoAreTheMostFamous: "Кто самые известные...",
      trendingThisWeek: "Тренды Этой Недели",
      browseByCountry: "Просмотр по странам",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
        fromCountry,
      }) => {
        // Helper function for Russian ordinals (use -е/-й for nominative, -м for locative)
        // Returns "1-е место", "2-е место", "3-е место", etc.
        const russianOrdinal = (num, useLocative = false) => {
          if (num === 1) return useLocative ? "1-м" : "1-е";
          if (num === 3) return useLocative ? "3-м" : "3-е";
          return useLocative ? `${num}-м` : `${num}-е`;
        };

        const possessive = gender === "M" ? "Его" : gender === "F" ? "Её" : "Их";

        let sentence = `${possessive} биография доступна на ${l} различных языках в Википедии`;
        if (l_prev && l !== l_prev) {
          sentence += ` (${l > l_prev ? "рост" : "снижение"} с ${l_prev} в 2024 году)`;
        }
        sentence += ". ";

        // First clause: occupation ranking - use "занимает X-е место среди..." structure
        if (occupationRank === 1) {
          sentence += `${name} занимает 1-е место среди самых популярных <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a>`;
        } else {
          sentence += `${name} занимает ${russianOrdinal(occupationRank)} место среди самых популярных <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a>`;
        }
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          sentence += ` (${occupationRank < occupationRankPrev ? "рост" : "снижение"} с ${russianOrdinal(occupationRankPrev)} места в 2024 году)`;
        }

        if (country) {
          // Second clause: country biography ranking
          // Use from_country from database if available, otherwise use "из {country}"
          const countryPrep = fromCountry || `из ${country}`;

          if (bplaceCountryRank === 1) {
            sentence += `, занимает 1-е место среди самых популярных биографий <a href="/profile/place/${countrySlug}">${countryPrep}</a>`;
          } else {
            sentence += `, занимает ${russianOrdinal(bplaceCountryRank)} место среди самых популярных биографий <a href="/profile/place/${countrySlug}">${countryPrep}</a>`;
          }
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            sentence += ` (${bplaceCountryRank < bplaceCountryRankPrev ? "рост" : "снижение"} с ${russianOrdinal(bplaceCountryRankPrev)} места в 2019 году)`;
          }

          // Third clause: occupation + country ranking - proper Russian word order
          if (bplaceCountryOccupationRank) {
            if (bplaceCountryOccupationRank === 1) {
              sentence += ` и занимает 1-е место среди <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} ${country}</a>`;
            } else {
              sentence += ` и занимает ${russianOrdinal(bplaceCountryOccupationRank)} место среди <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} ${country}</a>`;
            }
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "Визуализации",
      rankings: "Рейтинги",
      profiles: "Профили",
      people: "Люди",
      bornOnThisDay: "Родились в Этот День",
      places: "Места",
      countries: "Страны",
      occupations: "Профессии",
      occupationCountry: "Профессия / Страна",
      eras: "Эпохи",
      deaths: "Смерти",
      about: "О проекте",
      data: "Данные",
      permissions: "Разрешения",
      download: "Скачать",
      api: "API",
      games: "Игры",
      yearbook: "Ежегодник",
      birthle: "Birthle",
      trivia: "Викторина",
      news: "Новости",
      search: "Поиск",
      home: "Главная",
      giveFeedback: "Оставить отзыв",
      usageCitation: "Цитирование",
      newBadge: "новое!",
    },
    readMoreWikipedia: "Подробнее в Википедии",
    home: {
      tagline: "Исследуйте коллективную память человечества!",
      subtitle:
        "Pantheon помогает вам открыть географию и динамику истории нашей планеты.",
      explore: "Исследовать",
      people: "Люди",
      places: "Места",
      occupations: "Профессии",
      and: "и",
      eras: "Эпохи",
      trendingProfiles: "Популярные Профили Сегодня",
      topProfilesBy: "Лучшие профили по просмотрам страниц для",
      wikipediaEdition: "издания Википедии",
      about:
        "это обсерватория коллективной памяти, сосредоточенная на биографиях, присутствующих как минимум в",
      languages: "языках",
      aboutContinued:
        "в Википедии. У нас есть данные о более чем 85 000 биографий, организованных по странам, городам, профессиям и эпохам. Исследуйте эти данные, чтобы узнать о персонажах, которые формируют человеческую культуру.",
      aboutDeveloped:
        "начался как проект группы Collective Learning в MIT. Сегодня он разрабатывается",
      datawheel: "Datawheel",
      aboutDatawheel:
        ", компанией, специализирующейся на создании решений для распространения и визуализации данных.",
      recentPassings: "Недавние Уходы",
      notableDeaths: "Известные Смерти 2025 Года",
      notableDeathsText:
        "Хотите увидеть полный список известных личностей, которых мы потеряли в 2025 году? Посетите нашу",
      notableDeathsLink: "Известные Смерти 2025 Года",
      notableDeathsContinued:
        "страницу для полной коллекции биографий влиятельных личностей, включая знаменитостей, артистов, лидеров и культурных икон, которые скончались в этом году.",
      trendingSingers: "Популярные Певцы Сегодня",
      trendingActors: "Популярные Актеры Сегодня",
      recentlyAdded: "Недавно Добавлены в Pantheon",
      searchPlaceholder: "Поиск людей, мест и профессий",
      isTrending: "в тренде сегодня",
      readFullStory: "Читать полную историю",
      turningXToday: ({age}) => `Исполняется ${age} сегодня!`,
      wouldHaveBeenX: ({age}) => `Было бы ${age} сегодня`,
      seeAllBirthdays: "Смотреть все дни рождения",
      bornTodayTitle: "Известные Люди Родившиеся Сегодня",
    },
    recentlyAdded: {
      title: "Недавно Добавлены в Pantheon",
      subtitle: "Откройте для себя новые биографии в коллекции Pantheon, отсортированные по дате добавления.",
      addedOn: ({date}) => `Добавлено: ${date}`,
      previous: "Назад",
      next: "Далее",
      pageLabel: ({page}) => `Страница ${page}`,
      viewMore: "Посмотреть больше недавно добавленных людей",
      empty: "Недавно добавленные люди не найдены.",
    },
    news: {
      pageTitle: "Кто в тренде сегодня?",
      pageSubtitle:
        "Ежедневные сводки о исторических личностях (сгенерировано ИИ)",
      trendingIn: "В тренде в",
      selectDate: "Выберите другую дату",
      references: "Ссылки:",
      noData: "Нет данных о трендах для этой даты.",
      previousDay: "Предыдущий День",
      nextDay: "Следующий День",
      unknown: "Неизвестно",
    },
    trending: {
      isTrendingToday: "{name} сегодня в тренде!",
      whyTrending: "Почему {name} в тренде:",
      references: "Источники:",
      viewMoreTrending: "Показать больше людей в тренде",
    },
    bornOnThisDay: {
      famousBirthdays: "Знаменитые Дни Рождения",
      bornOnThisDay: "Родились в Этот День",
      famousPeopleBornOnThisDay: ({count}) => `${count} ${count === 1 ? "знаменитый человек, родившийся" : "знаменитых людей, родившихся"} в этот день`,
      birthdayOf: ({displayDate, count}) => `${displayDate} — день рождения ${count} знаменитостей и исторически значимых личностей в базе данных Pantheon.`,
      mostFamousInclude: "Среди самых известных",
      mostCommonOccupations: "Наиболее распространённые профессии для людей, родившихся в этот день",
      exploreAnotherDate: "Исследовать Другую Дату",
      go: "Перейти",
      today: "Сегодня",
      previousDay: "Предыдущий День",
      nextDay: "Следующий День",
      famousPeopleBornOn: ({displayDate}) => `Знаменитые Люди, Родившиеся ${displayDate}`,
      discoverRemarkable: ({displayDate}) => `Откройте для себя выдающихся личностей, которые разделяют ${displayDate} как день своего рождения. От мировых лидеров и новаторских учёных до любимых артистов и легендарных спортсменов — этот день стал свидетелем рождения многих влиятельных фигур на протяжении истории.`,
      someNotableInclude: "Среди наиболее выдающихся",
      stillLivingToday: ({total, living}) => `Из ${total} знаменитых людей, родившихся в этот день, ${living} живы сегодня.`,
      viewFullRankings: "Посмотреть Полный Рейтинг за Этот День",
      born: "Родился",
      birthdaysByOccupation: "Дни Рождения по Профессиям",
      occupationIntro: ({displayDate}) => `Посмотрите, как знаменитые люди, родившиеся ${displayDate}, распределены по различным областям и профессиям. Нажмите на любого человека, чтобы узнать больше о его жизни и достижениях.`,
      showLess: "Показать меньше",
      more: ({count}) => `+${count} ещё`,
      formatDate: ({month, day}) => {
        const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        return `${day} ${months[month - 1]}`;
      },
      metaTitle: ({displayDate}) => `Знаменитые Дни Рождения ${displayDate} | Кто Родился Сегодня? | Pantheon`,
      metaDescription: ({displayDate}) => `Откройте для себя самых известных людей, родившихся ${displayDate} в истории. Исследуйте профили знаменитостей, исторических личностей, учёных, художников, спортсменов и многих других.`,
      months: {
        january: "Январь",
        february: "Февраль",
        march: "Март",
        april: "Апрель",
        may: "Май",
        june: "Июнь",
        july: "Июль",
        august: "Август",
        september: "Сентябрь",
        october: "Октябрь",
        november: "Ноябрь",
        december: "Декабрь",
      },
    },
  },
  zh: {
    stillAlive: "至今",
    person: {
      loading: "加载中...",
      metaTitle: ({name}) => `${name}传记 | Pantheon`,
      sections: {
        trending: "热门动态",
        memorabilityMetrics: "知名度指标",
        trendingActivity: "热门活动",
        notableWorks: "著名作品",
        pageViewsByLang: ({name}) => `${name}的各语言页面浏览量`,
        amongOccupation: ({occupationPlural}) => `在${occupationPlural}中`,
        contemporaries: "同时代人物",
        inCountry: ({country}) => `在${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `在${country}的${occupationPlural}中`,
        filmography: "电影作品",
        tvMovieRoles: "影视角色",
        insights: "数据洞察",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `在 Pantheon 收录的全球 ${totalFormatted} 位${occupationPlural}中，${name}排名第一。`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name}在全球 ${totalFormatted} 位${occupationPlural}中排名第 ${rank}，位居该职业前 ${topPercent}%。`,
        topCountry: ({name, country, totalFormatted}) =>
          `在 Pantheon 收录的 ${totalFormatted} 位出生于${country}的人物中，${name}排名最高。`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `在${country}出生的 ${count} 位${occupationPlural}中，${name}排名第一。`,
        topCity: ({name, city, country, count, peers}) =>
          `${name}是出生于${country}${city}的 ${count} 位知名人物中最著名的一位${peers ? `，知名度领先于${peers}` : ""}。`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name}是出生于${city}（今属${country}）的 ${count} 位知名人物中最著名的一位${peers ? `，知名度领先于${peers}` : ""}。`,
        topBirthyear: ({name, year, count}) =>
          `在 Pantheon 收录的 ${count} 位 ${year} 年出生的人物中，${name}最为著名。`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `${name}的传记出现在 ${count} 个维基百科语言版本中——超过 ${percent}% 的${occupationPlural}。`,
        newLangs: ({name, count}) =>
          `过去一年中，${name}的传记新增了 ${count} 个维基百科语言版本。`,
        nonEnglish: ({name, count}) =>
          `过去一年，${name}的传记在非英语维基百科版本中获得了 ${count} 次浏览——其影响力远超英语世界。`,
        enduringFame: ({name, centuries, rank}) =>
          `逝世 ${centuries} 个多世纪后，${name}在 Pantheon 全部人物中仍排名第 ${rank}。`,
        mostViewed: ({name, views, occupationPlural}) =>
          `过去一年，${name}的维基百科页面获得 ${views} 次浏览，是所有${occupationPlural}中浏览量最高的。`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `过去一年，${name}的维基百科页面获得 ${views} 次浏览，是${occupationPlural}平均水平的 ${multiple} 倍。`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `在 Pantheon 收录的 ${totalFormatted} 位${occupationPlural}中，女性仅有 ${womenCount} 位，${name}是其中之一。`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `${name}虽然只活了 ${age} 岁，却在历史上所有${occupationPlural}中排名第 ${rank}。`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name}是 Pantheon 中出生最早的 ${count} 位${occupationPlural}之一。`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name}与${twinNames}同一天生日（${date}）。`,
        fallback: ({name, count, hpi}) =>
          `${name}的传记涵盖 ${count} 个维基百科语言版本，历史知名度指数为 ${hpi}。`,
      },
      metrics: {
        pageViews: "页面浏览量",
        past12Months: "过去12个月",
        hpi: "HPI",
        hpiDesc: "历史知名度指数",
        avgOf: ({label}) => `${label}平均值`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `在${occupationPlural}中，${name}排名第${rankHtml}位（共${totalFormatted}人）。`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `在${year}年出生的人中，${name}排名第${rankHtml}位。`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `在${year}年去世的人中，${name}排名第${rankHtml}位。`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `在出生于${countryHtml}的人中，${name}排名第${rankHtml}位（共${totalFormatted}人）。`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `在出生于${countryHtml}的${occupationPlural}中，${name}排名第${rankHtml}位。`,
        beforePeers: ({gender, count}) =>
          `排在${gender === "M" ? "他" : gender === "F" ? "她" : "他们"}之前的有：`,
        afterPeers: ({gender, count}) =>
          `排在${gender === "M" ? "他" : gender === "F" ? "她" : "他们"}之后的有：`,
        notRankedIn: ({name, countryHtml}) => `${name}未进入${countryHtml}的排名`,
        mostPopularInWikipedia: ({occupationPlural}) => `维基百科上最受欢迎的${occupationPlural}`,
        othersBornInYear: ({year}) => `其他${year}年出生的人`,
        othersDeceasedInYear: ({year}) => `其他${year}年去世的人`,
        othersBornInCountry: ({countryHtml}) => `其他出生于${countryHtml}的人`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${demonym}${occupationPlural}`,
        goToAllRankings: "查看全部排名",
        and: "和",
      },
      carousel: {
        present: "至今",
        hpiLabel: "HPI：",
        rankLabel: "排名：",
      },
      footer: {
        relatedProfiles: "相关人物",
        individuals: ({countFormatted}) => `${countFormatted}人`,
        rank: ({rankFormatted}) => `排名 ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `${langCode}.WIKIPEDIA 页面浏览量 (PV)`,
        rankInLanguage: ({rank, language}) => `${language}排名第${rank}位`,
      },
      heatmap: {
        trendingDays: ({count}) => `${count}个热门日`,
        less: "少",
        more: "多",
        clickForDetails: "点击查看详情",
        notTrending: "未上榜",
        rankNum: ({rank}) => `第${rank}名`,
        viewAllTrendingNews: ({date}) => `查看${date}的全部热门新闻`,
      },
      pageViewsByLangChart: {
        languageEditions: "语言版本",
        pageviewsByLanguageEdition: "各语言版本页面浏览量",
        cumulativeLanguageEditions: "累计语言版本数",
        editionsWord: "个版本",
        viewsAnnotation: ({countFormatted}) => `${countFormatted}次浏览`,
        andOthers: ({count}) => `（另有${count}个）`,
        summaryIntro: ({name}) => `过去一年，${name}的页面浏览量最高的是`,
        wikipediaEdition: ({language}) => `${language}维基百科`,
        withViewsFollowedBy: ({viewsFormatted}) => `，共${viewsFormatted}次浏览，其次是`,
        growthIntro: "。按页面浏览量的年增长率计算，排名前三的维基百科语言版本为",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language}（${languageLocal}）属于${primaryFamilyName}的${familyName}语言。`,
        families: {
          "Indo-European": "印欧语系",
          "Sino-Tibetan": "汉藏语系",
          "Afro-Asiatic": "亚非语系",
          "Altaic": "阿尔泰语系",
          "Dravidian": "达罗毗荼语系",
          "Austronesian": "南岛语系",
          "Uralic": "乌拉尔语系",
          "Caucasian": "高加索语系",
          "Niger-Kordofanian": "尼日尔-科尔多凡语系",
          "Creoles and pidgins": "克里奥尔语和皮钦语",
          "Amerindian": "美洲原住民语言",
          "Tai": "台语",
          "Other": "其他",
          "Albanian": "阿尔巴尼亚语族",
          "Algic": "阿尔吉克语系",
          "Armenian": "亚美尼亚语族",
          "Austro-Asiatic": "南亚语系",
          "Baltic": "波罗的语族",
          "Basque": "巴斯克语",
          "Berber": "柏柏尔语族",
          "Celtic": "凯尔特语族",
          "Chadic": "乍得语族",
          "Constructed": "人工语言",
          "Creole (English)": "克里奥尔语（英语）",
          "Creole (French)": "克里奥尔语（法语）",
          "Cushitic": "库希特语族",
          "Eskimo-Aleut": "爱斯基摩-阿留申语系",
          "Germanic": "日耳曼语族",
          "Greek": "希腊语族",
          "Indic": "印度语族",
          "Iranian": "伊朗语族",
          "Italic": "意大利语族",
          "Japanese": "日语",
          "Korean": "朝鲜语",
          "Malayo-Polynesian": "马来-波利尼西亚语族",
          "Mongolian": "蒙古语族",
          "Na-Dene": "纳-德内语系",
          "Nilo-Saharan": "尼罗-撒哈拉语系",
          "Quechuan": "克丘亚语系",
          "Semitic": "闪米特语族",
          "Sinitic": "汉语族",
          "Slavic": "斯拉夫语族",
          "Tibeto-Burman": "藏缅语族",
          "Tupi": "图皮语系",
          "Turkic": "突厥语族",
          "Uto-Aztecan": "犹他-阿兹特克语系",
        },
      },
    },
    birthdayToast: ({name}) => `今天是${name}的生日`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank}) =>
      `${name}（${birthYear}–${deathYear}）是${demonym}${occupation}，在Pantheon历史知名度指数中排名全球第${rank}位。探索其传记、页面浏览量和知名度指标。`,
    learnMoreRankless: "在Rankless上了解更多关于{name}的学术影响",
    nav: {
      visualizations: "可视化",
      rankings: "排名",
      profiles: "档案",
      people: "人物",
      bornOnThisDay: "今日出生",
      places: "地点",
      countries: "国家",
      occupations: "职业",
      occupationCountry: "职业 / 国家",
      eras: "时代",
      deaths: "逝世",
      about: "关于",
      data: "数据",
      permissions: "权限",
      download: "下载",
      api: "API",
      games: "游戏",
      yearbook: "年鉴",
      birthle: "Birthle",
      trivia: "冷知识",
      news: "新闻",
      search: "搜索",
      home: "首页",
      giveFeedback: "提供反馈",
      usageCitation: "使用引用",
      newBadge: "新！",
      explore: "探索",
      apps: "应用",
      reportDataError: "报告数据错误",
      privacyPolicy: "隐私政策",
      termsOfService: "服务条款",
    },
    occupationCountry: {
      theMostFamous: "最著名的",
      from: "来自",
      greatest: "最伟大的",

      keepExploring: "继续探索",
      trendingThisWeek: "本周热门",
      trendScoreLabel: "热度分数",
      whyTrending: "为什么会热门？",
      clicksThisWeek: "本周点击",
      impressionsThisWeek: "本周展示",
      readMore: "阅读更多",
      showLess: "收起",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} 位知名人物`,
      viewsLabel: "次浏览",
      onDate: ({date}) => `${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `本周热门${occupationPlural}`;
        return `${locationLabel}${occupationPlural}本周热门`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `维基百科上热门的前10名${occupationPlural}`;
        return `${locationLabel}${occupationPlural}在维基百科热门前10名`;
      },
      trendingIntroSuffix: "过去7天，附上简短原因说明。",
      trendingThisWeekShort: "本周热门",
      trendingThisWeekDefault: "本周在维基百科热门",
      metaTitle: ({demonym, occupationPlural}) => `最著名的${demonym}${occupationPlural} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `探索历史上最著名的${countFormatted}位${demonym}${occupationPlural}。查看来自${country}的著名${occupationSingular}人物档案，按历史影响力排名。`,
      birthDecadesTitle: "按出生年代划分的人物",
      birthDecadesIntro: ({demonym, occupationPlural}) => `按出生年代浏览${demonym}${occupationPlural}。每个年代显示 HPI 前 10 名；展开可查看全部。`,
      decadeLabel: ({decade}) => `${decade}年代`,
      more: ({count}) => `+${count} 更多`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `Pantheon 收录了 ${totalCount} 位被归类为${demonym}${occupationPlural}的人，出生于 ${oldestYear} 到 ${youngestYear} 之间。`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `其中无人仍在世。`;
        return `其中 ${aliveCountFormatted} 位（${aliveShare}）仍在世。`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `最著名的在世${demonym}${occupationPlural}包括 `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `最著名的已故${demonym}${occupationPlural}包括 `,
      peopleNewAsOf: "2024年4月",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `截至${asOfLabel}，Pantheon 新增了 ${countFormatted} 位${demonym}${occupationPlural}，包括 `,
      goToAllRankings: "查看所有排名",
      livingTitle: ({demonym, occupationPlural}) => `${demonym}${occupationPlural}（在世）`,
      deceasedTitle: ({demonym, occupationPlural}) => `${demonym}${occupationPlural}（已故）`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `${demonym}${occupationPlural}（新增，${yearLabel}）`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for Chinese ordinals (use 第X)
        const formatChineseOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          return `第${num}`;
        };

        let text = `本页面包含了最伟大的${country}${occupationPlural}名单。`;
        text += `Pantheon数据集包含${totalCount}名${occupationPlural}，其中${countryCount}人出生在${country}。`;
        if (rank) {
          const chineseRank = formatChineseOrdinal(rank);
          text += `这使${country}成为${chineseRank}多${occupationPlural}的出生地`;
          if (countriesBehind) {
            text += `，仅次于${countriesBehind}。`;
          } else {
            text += `。`;
          }
        }
        return text;
      },
      and: "和",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `以下人物被Pantheon认为是有史以来${count === 10 ? "十大" : ""}最具传奇色彩的${demonym}${occupationPlural}。这份著名的${demonym}${occupationPlural}名单按HPI（历史流行度指数）排序，该指标汇总了传记在线流行度的信息。`,
      visitRankings: "访问排名页面查看完整列表",
      top: "前",
      withHpi: ({hpi, name}) => `${name}的HPI为${hpi}，`,
      isMostFamous: ({demonym, occupation}) => `是最著名的${demonym}${occupation}。`,
      isRankMostFamous: ({rank, demonym, occupation}) => `是${rank}最著名的${demonym}${occupation}。`,
      biographyTranslated: ({possessive, count}) => `${possessive}传记已被翻译成${count}种不同语言`,
      onWikipedia: "在维基百科上",
    },
    selectPerson: {
      heading: "探索杰出人物",
      subtitle: "发现人类历史上各个领域、国家和时代最具影响力的人物",
      metaDescription: "浏览超过85,000位杰出人物的传记，涵盖15种以上维基百科语言版本。",
      searchPlaceholder: "搜索人物、地点和职业",
      randomPerson: "随机人物",
      statPeople: "传记",
      statLanguages: "语言版本",
      description: "Pantheon追踪至少在15个维基百科语言版本中出现的传记，按职业分类，按来源国家和城市组织。",
      featuredPeople: "最杰出的人物",
      trendingNow: "当前热门",
      browseByField: "按领域浏览",
      domainSports: "体育",
      domainArts: "艺术与娱乐",
      domainScience: "科学与技术",
      domainPolitics: "政治与领导",
      exploreMore: "探索更多",
      byOccupationCountry: "按职业和国家",
      rankings: "排名",
      byEra: "按时代",
    },
    selectCountry: {
      heading: "探索国家",
      subtitle: "发现世界各国最杰出的人物",
      metaDescription: "探索各国的杰出人物。按出生国家浏览传记，查看互动地图，发现世界各地的历史人物。",
      totalCountries: "个国家",
      totalPeople: "位杰出人物",
      mapTitle: "各国杰出人物",
      countryList: "所有国家",
      sortAlpha: "A–Z",
      sortPeople: "最多人物",
      people: "人",
      noPeopleData: "暂无数据",
      exploreMore: "探索更多",
      byPerson: "杰出人物",
      byOccupation: "按职业与国家",
      rankings: "排名",
    },
    selectPlace: {
      heading: "探索地点",
      subtitle: "发现孕育了历史上最杰出人物的城市和乡镇",
      metaDescription: "探索世界各地杰出人物的出生地。按出生人数浏览城市，查看互动地图，发现历史热点。",
      totalPlaces: "个地点",
      totalPeople: "位杰出人物",
      mapTitle: "杰出人物出生地",
      placeList: "热门地点",
      sortAlpha: "A–Z",
      sortPeople: "最多人物",
      groupByCountry: "按国家",
      people: "人",
      exploreMore: "探索更多",
      byPerson: "杰出人物",
      byCountry: "按国家",
      rankings: "排名",
    },
    selectOccupation: {
      heading: "探索职业",
      subtitle: "发现塑造了历史上最杰出人物的领域和职业",
      metaDescription: "探索历史上最杰出人物的101种职业。按职业浏览，查看每个领域的杰出人数。",
      totalOccupations: "种职业",
      totalPeople: "位杰出人物",
      occupationList: "所有职业",
      sortAlpha: "A–Z",
      sortPeople: "最多人物",
      people: "人",
      exploreMore: "探索更多",
      byPerson: "杰出人物",
      byCountry: "按国家",
      rankings: "排名",
    },
    selectOccupationCountry: {
      heading: "选择职业和国家",
      pleaseSelect: "请选择职业和国家组合以查看最令人难忘的传记",
      selectOccupation: "选择职业",
      selectCountry: "选择国家",
      goToProfile: "前往个人资料",
      whoAreTheMostFamous: "谁是最著名的...",
      trendingThisWeek: "本周热门",
      browseByCountry: "按国家浏览",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
      }) => {
        const possessive = gender === "M" ? "他" : gender === "F" ? "她" : "他们";

        let sentence = `${possessive}的传记在维基百科上提供 ${l} 种语言版本`;
        if (l_prev && l !== l_prev) {
          sentence += `（较 2024 年的 ${l_prev} 种${l > l_prev ? "增加" : "减少"}）`;
        }
        sentence += "。";

        // Chinese uses "在...中排名第X位" structure, not "第X最受欢迎"
        // Remove commas from numbers and don't use English ordinals
        const rankNum = occupationRank.toString().replace(/,/g, '');
        sentence += `${name}在最受欢迎的<a href="/profile/occupation/${occupationSlug}">${occupation}</a>中排名第${rankNum}位`;
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          const prevNum = occupationRankPrev.toString().replace(/,/g, '');
          sentence += `（较 2024 年的第${prevNum}位${occupationRank < occupationRankPrev ? "上升" : "下降"}）`;
        }

        if (country) {
          const countryRankNum = bplaceCountryRank.toString().replace(/,/g, '');
          // Use "人物传记" instead of just "传记" for better clarity
          sentence += `，在<a href="/profile/place/${countrySlug}">${country}</a>人物传记中排名第${countryRankNum}位`;
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            const prevNum = bplaceCountryRankPrev.toString().replace(/,/g, '');
            sentence += `（较 2019 年的第${prevNum}位${bplaceCountryRank < bplaceCountryRankPrev ? "上升" : "下降"}）`;
          }

          if (bplaceCountryOccupationRank) {
            const finalRankNum = bplaceCountryOccupationRank.toString().replace(/,/g, '');
            // Use nationality adjective but remove trailing 的 to avoid double 的
            let countryPrefix = nationalityAdj || country;
            if (countryPrefix && countryPrefix.endsWith('的')) {
              countryPrefix = countryPrefix.slice(0, -1);
            }
            sentence += `，并在最受欢迎的<a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${countryPrefix}${occupation}</a>中排名第${finalRankNum}位`;
          }
        }

        sentence += "。";
        return sentence;
      },
    },
    nav: {
      visualizations: "可视化",
      rankings: "排名",
      profiles: "档案",
      people: "人物",
      bornOnThisDay: "今日出生",
      places: "地点",
      countries: "国家",
      occupations: "职业",
      occupationCountry: "职业 / 国家",
      eras: "时代",
      deaths: "逝世",
      about: "关于",
      data: "数据",
      permissions: "权限",
      download: "下载",
      api: "API",
      games: "游戏",
      yearbook: "年鉴",
      birthle: "Birthle",
      trivia: "问答",
      news: "新闻",
      search: "搜索",
      home: "首页",
      giveFeedback: "提供反馈",
      usageCitation: "引用说明",
      newBadge: "新！",
    },
    readMoreWikipedia: "在维基百科上阅读更多",
    home: {
      tagline: "探索人类集体记忆！",
      subtitle: "Pantheon帮助您发现我们星球历史的地理和动态。",
      explore: "探索",
      people: "人物",
      places: "地点",
      occupations: "职业",
      and: "和",
      eras: "时代",
      trendingProfiles: "今日热门人物",
      topProfilesBy: "按页面浏览量排名的热门人物",
      wikipediaEdition: "维基百科版本",
      about: "是一个专注于集体记忆的观测站，关注至少在",
      languages: "种语言",
      aboutContinued:
        "的维基百科中出现的传记。我们拥有超过85,000个传记的数据，按国家、城市、职业和时代组织。探索这些数据，了解塑造人类文化的人物。",
      aboutDeveloped: "最初是麻省理工学院集体学习小组的一个项目。今天它由",
      datawheel: "Datawheel",
      aboutDatawheel: "开发，这是一家专门从事数据分发和可视化解决方案的公司。",
      recentPassings: "最近去世",
      notableDeaths: "2025年著名人物逝世",
      notableDeathsText:
        "想查看我们在2025年失去的著名人物的完整名单吗？访问我们的",
      notableDeathsLink: "2025年著名人物逝世",
      notableDeathsContinued:
        "页面，查看包括名人、艺术家、领导者和文化偶像在内的今年去世的有影响力人物的全面传记集。",
      trendingSingers: "今日热门歌手",
      trendingActors: "今日热门演员",
      recentlyAdded: "最近添加到Pantheon",
      searchPlaceholder: "搜索人物、地点和职业",
      isTrending: "今日热门",
      readFullStory: "阅读完整故事",
      turningXToday: ({age}) => `今天${age}岁！`,
      wouldHaveBeenX: ({age}) => `今天本应${age}岁`,
      seeAllBirthdays: "查看所有生日",
      bornTodayTitle: "今日出生的名人",
    },
    recentlyAdded: {
      title: "最近添加到 Pantheon",
      subtitle: "探索 Pantheon 收藏中最新添加的传记，并按添加日期排序。",
      addedOn: ({date}) => `添加于 ${date}`,
      previous: "上一页",
      next: "下一页",
      pageLabel: ({page}) => `第 ${page} 页`,
      viewMore: "查看更多最近添加的人物",
      empty: "未找到最近添加的人物。",
    },
    news: {
      pageTitle: "今日热门人物",
      pageSubtitle: "历史人物每日摘要（由AI生成）",
      trendingIn: "热门于",
      selectDate: "选择其他日期",
      references: "参考资料：",
      noData: "此日期无趋势数据。",
      previousDay: "前一天",
      nextDay: "后一天",
      unknown: "未知",
    },
    trending: {
      isTrendingToday: "{name} 今天正在流行！",
      whyTrending: "{name} 为何走红：",
      references: "来源: ",
      viewMoreTrending: "查看更多热门人物",
    },
    bornOnThisDay: {
      famousBirthdays: "名人生日",
      bornOnThisDay: "今日出生",
      famousPeopleBornOnThisDay: ({count}) => `${count}位名人在今天出生`,
      birthdayOf: ({displayDate, count}) => `${displayDate}是Pantheon数据库中${count}位名人和历史重要人物的生日。`,
      mostFamousInclude: "最著名的包括",
      mostCommonOccupations: "今日出生者最常见的职业是",
      exploreAnotherDate: "探索其他日期",
      go: "前往",
      today: "今天",
      previousDay: "前一天",
      nextDay: "后一天",
      famousPeopleBornOn: ({displayDate}) => `${displayDate}出生的名人`,
      discoverRemarkable: ({displayDate}) => `发现在${displayDate}出生的杰出人物。从世界领袖和开创性科学家到备受喜爱的艺人和传奇运动员，这一天见证了历史上许多有影响力人物的诞生。`,
      someNotableInclude: "其中最著名的包括",
      stillLivingToday: ({total, living}) => `在这一天出生的${total}位名人中，${living}位今天仍然在世。`,
      viewFullRankings: "查看今日完整排名",
      born: "出生",
      birthdaysByOccupation: "按职业分类的生日",
      occupationIntro: ({displayDate}) => `查看${displayDate}出生的名人在不同领域和职业中的分布。点击任何人物以了解更多关于他们的生平和成就。`,
      showLess: "收起",
      more: ({count}) => `+${count}更多`,
      formatDate: ({month, day}) => `${month}月${day}日`,
      metaTitle: ({displayDate}) => `${displayDate}出生的名人 | 今天谁生日？| Pantheon`,
      metaDescription: ({displayDate}) => `探索历史上${displayDate}出生的最著名人物。浏览名人、历史人物、科学家、艺术家、运动员等的生日档案。`,
      months: {
        january: "一月",
        february: "二月",
        march: "三月",
        april: "四月",
        may: "五月",
        june: "六月",
        july: "七月",
        august: "八月",
        september: "九月",
        october: "十月",
        november: "十一月",
        december: "十二月",
      },
    },
  },
  ja: {
    stillAlive: "現在",
    person: {
      loading: "読み込み中...",
      metaTitle: ({name}) => `${name}の経歴 | Pantheon`,
      sections: {
        trending: "トレンド",
        memorabilityMetrics: "知名度指標",
        trendingActivity: "トレンド活動",
        notableWorks: "代表作",
        pageViewsByLang: ({name}) => `${name}の言語別ページビュー`,
        amongOccupation: ({occupationPlural}) => `${occupationPlural}の中で`,
        contemporaries: "同時代の人物",
        inCountry: ({country}) => `${country}の中で`,
        amongOccupationInCountry: ({occupationPlural, country}) => `${country}の${occupationPlural}の中で`,
        filmography: "フィルモグラフィー",
        tvMovieRoles: "テレビ・映画出演",
        insights: "データインサイト",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name}は、Pantheonに収録された世界${totalFormatted}人の${occupationPlural}の中で第1位です。`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name}は世界${totalFormatted}人の${occupationPlural}の中で第${rank}位、職業全体の上位${topPercent}%に入ります。`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name}は、Pantheonに収録された${country}生まれの${totalFormatted}人の中で最高位です。`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `${country}生まれの${count}人の${occupationPlural}の中で、${name}は第1位です。`,
        topCity: ({name, city, country, count, peers}) =>
          `${name}は、${country}の${city}生まれの著名人${count}人の中で最も著名${peers ? `で、${peers}を上回ります` : "です"}。`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name}は、${city}（現在の${country}）生まれの著名人${count}人の中で最も著名${peers ? `で、${peers}を上回ります` : "です"}。`,
        topBirthyear: ({name, year, count}) =>
          `Pantheonに収録された${year}年生まれの${count}人の中で、${name}は最も著名です。`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `${name}の伝記はウィキペディアの${count}言語版に掲載されており、${occupationPlural}全体の${percent}%を上回っています。`,
        newLangs: ({name, count}) =>
          `${name}の伝記は過去1年間で${count}の新しいウィキペディア言語版に追加されました。`,
        nonEnglish: ({name, count}) =>
          `${name}の伝記は過去1年間に英語以外のウィキペディア版で${count}回閲覧されており、その知名度は英語圏をはるかに超えています。`,
        enduringFame: ({name, centuries, rank}) =>
          `没後${centuries}世紀以上を経た今も、${name}はPantheonの全人物中第${rank}位を保っています。`,
        mostViewed: ({name, views, occupationPlural}) =>
          `${name}のウィキペディアページは過去1年間に${views}回閲覧され、${occupationPlural}の中で最も閲覧数が多い人物です。`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `${name}のウィキペディアページは過去1年間に${views}回閲覧されました。これは${occupationPlural}の平均の${multiple}倍です。`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `Pantheonに収録された${totalFormatted}人の${occupationPlural}のうち女性はわずか${womenCount}人で、${name}はその一人です。`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `${name}はわずか${age}歳で亡くなりましたが、歴史上のすべての${occupationPlural}の中で第${rank}位に位置しています。`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name}は、Pantheonで最も早く生まれた${count}人の${occupationPlural}の一人です。`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name}は${twinNames}と同じ${date}生まれです。`,
        fallback: ({name, count, hpi}) =>
          `${name}の伝記はウィキペディアの${count}言語版に掲載され、歴史的人気指数は${hpi}です。`,
      },
      metrics: {
        pageViews: "ページビュー",
        past12Months: "過去12か月",
        hpi: "HPI",
        hpiDesc: "歴史的人気指数",
        avgOf: ({label}) => `${label}平均`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `${occupationPlural}の中で、${name}は${totalFormatted}人中${rankHtml}位です。`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `${year}年生まれの人の中で、${name}は${rankHtml}位です。`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `${year}年に亡くなった人の中で、${name}は${rankHtml}位です。`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `${countryHtml}生まれの人の中で、${name}は${totalFormatted}人中${rankHtml}位です。`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `${countryHtml}生まれの${occupationPlural}の中で、${name}は${rankHtml}位です。`,
        beforePeers: ({gender, count}) =>
          `${gender === "M" ? "彼" : gender === "F" ? "彼女" : "この人物"}より上位：`,
        afterPeers: ({gender, count}) =>
          `${gender === "M" ? "彼" : gender === "F" ? "彼女" : "この人物"}より下位：`,
        notRankedIn: ({name, countryHtml}) => `${name}は${countryHtml}のランキングに入っていません`,
        mostPopularInWikipedia: ({occupationPlural}) => `ウィキペディアで最も人気のある${occupationPlural}`,
        othersBornInYear: ({year}) => `${year}年生まれのその他の人物`,
        othersDeceasedInYear: ({year}) => `${year}年に亡くなったその他の人物`,
        othersBornInCountry: ({countryHtml}) => `${countryHtml}生まれのその他の人物`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${demonym}の${occupationPlural}`,
        goToAllRankings: "すべてのランキングを見る",
        and: "、",
      },
      carousel: {
        present: "現在",
        hpiLabel: "HPI：",
        rankLabel: "順位：",
      },
      footer: {
        relatedProfiles: "関連プロフィール",
        individuals: ({countFormatted}) => `${countFormatted}人`,
        rank: ({rankFormatted}) => `順位 ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `${langCode}.WIKIPEDIA ページビュー (PV)`,
        rankInLanguage: ({rank, language}) => `${language}で${rank}位`,
      },
      heatmap: {
        trendingDays: ({count}) => `トレンド入り${count}日`,
        less: "少",
        more: "多",
        clickForDetails: "クリックして詳細を表示",
        notTrending: "トレンド外",
        rankNum: ({rank}) => `${rank}位`,
        viewAllTrendingNews: ({date}) => `${date}のトレンドニュースをすべて見る`,
      },
      pageViewsByLangChart: {
        languageEditions: "言語版",
        pageviewsByLanguageEdition: "言語版別ページビュー",
        cumulativeLanguageEditions: "累計言語版数",
        editionsWord: "版",
        viewsAnnotation: ({countFormatted}) => `${countFormatted}ビュー`,
        andOthers: ({count}) => `（他${count}件）`,
        summaryIntro: ({name}) => `過去1年間で${name}のページビューが最も多かったのは`,
        wikipediaEdition: ({language}) => `${language}版ウィキペディア`,
        withViewsFollowedBy: ({viewsFormatted}) => `（${viewsFormatted}ビュー）で、次いで`,
        growthIntro: "です。年間のページビュー増加率では、上位3つのウィキペディア版は",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language}（${languageLocal}）は${primaryFamilyName}に属する${familyName}の言語です。`,
        families: {
          "Indo-European": "インド・ヨーロッパ語族",
          "Sino-Tibetan": "シナ・チベット語族",
          "Afro-Asiatic": "アフロ・アジア語族",
          "Altaic": "アルタイ語族",
          "Dravidian": "ドラヴィダ語族",
          "Austronesian": "オーストロネシア語族",
          "Uralic": "ウラル語族",
          "Caucasian": "カフカス語族",
          "Niger-Kordofanian": "ニジェール・コルドファン語族",
          "Creoles and pidgins": "クレオール語・ピジン語",
          "Amerindian": "アメリカ先住民語",
          "Tai": "タイ語族",
          "Other": "その他",
          "Albanian": "アルバニア語派",
          "Algic": "アルギック語族",
          "Armenian": "アルメニア語派",
          "Austro-Asiatic": "オーストロアジア語族",
          "Baltic": "バルト語派",
          "Basque": "バスク語",
          "Berber": "ベルベル語派",
          "Celtic": "ケルト語派",
          "Chadic": "チャド語派",
          "Constructed": "人工言語",
          "Creole (English)": "クレオール語（英語系）",
          "Creole (French)": "クレオール語（フランス語系）",
          "Cushitic": "クシ語派",
          "Eskimo-Aleut": "エスキモー・アレウト語族",
          "Germanic": "ゲルマン語派",
          "Greek": "ギリシャ語派",
          "Indic": "インド語派",
          "Iranian": "イラン語派",
          "Italic": "イタリック語派",
          "Japanese": "日本語",
          "Korean": "朝鮮語",
          "Malayo-Polynesian": "マレー・ポリネシア語派",
          "Mongolian": "モンゴル語族",
          "Na-Dene": "ナ・デネ語族",
          "Nilo-Saharan": "ナイル・サハラ語族",
          "Quechuan": "ケチュア語族",
          "Semitic": "セム語派",
          "Sinitic": "シナ語派",
          "Slavic": "スラヴ語派",
          "Tibeto-Burman": "チベット・ビルマ語派",
          "Tupi": "トゥピ語族",
          "Turkic": "テュルク語族",
          "Uto-Aztecan": "ユト・アステカ語族",
        },
      },
    },
    birthdayToast: ({name}) => `今日は${name}の誕生日です`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank}) =>
      `${name}（${birthYear}–${deathYear}）は${demonym}の${occupation}で、Pantheonの歴史的知名度指数で世界第${rank}位にランクされています。経歴、ページビュー、知名度指標をご覧ください。`,
    learnMoreRankless: "Ranklessで{name}の学術的影響について詳しく知る",
    nav: {
      visualizations: "視覚化",
      rankings: "ランキング",
      profiles: "プロフィール",
      people: "人物",
      bornOnThisDay: "今日生まれた人",
      places: "場所",
      countries: "国",
      occupations: "職業",
      occupationCountry: "職業 / 国",
      eras: "時代",
      deaths: "死亡",
      about: "について",
      data: "データ",
      permissions: "許可",
      download: "ダウンロード",
      api: "API",
      games: "ゲーム",
      yearbook: "年鑑",
      birthle: "Birthle",
      trivia: "トリビア",
      news: "ニュース",
      search: "検索",
      home: "ホーム",
      giveFeedback: "フィードバックを送る",
      usageCitation: "使用と引用",
      newBadge: "新着！",
      explore: "探索",
      apps: "アプリ",
      reportDataError: "データエラーを報告",
      privacyPolicy: "プライバシーポリシー",
      termsOfService: "利用規約",
    },
    occupationCountry: {
      theMostFamous: "最も有名な",
      from: "出身の",
      greatest: "最も偉大な",

      keepExploring: "さらに探索",
      trendingThisWeek: "今週のトレンド",
      trendScoreLabel: "トレンドスコア",
      whyTrending: "なぜトレンド？",
      clicksThisWeek: "今週のクリック数",
      impressionsThisWeek: "今週の表示回数",
      readMore: "もっと読む",
      showLess: "折りたたむ",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} 人の著名人`,
      viewsLabel: "回表示",
      onDate: ({date}) => `${date}に`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `${occupationPlural}の今週のトレンド`;
        return `${locationLabel}${occupationPlural}の今週のトレンド`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `ウィキペディアでトレンドの${occupationPlural}トップ10`;
        return `${locationLabel}${occupationPlural}のウィキペディアトレンドトップ10`;
      },
      trendingIntroSuffix: "過去7日間の動向と簡単な理由を添えています。",
      trendingThisWeekShort: "今週のトレンド",
      trendingThisWeekDefault: "今週ウィキペディアでトレンド",
      metaTitle: ({demonym, occupationPlural}) => `最も有名な${demonym}${occupationPlural} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `歴史上最も有名な${demonym}${occupationPlural} ${countFormatted}人を紹介。${country}出身の著名な${occupationSingular}のプロフィールを歴史的重要性でランキング。`,
      birthDecadesTitle: "出生年代別の人物",
      birthDecadesIntro: ({demonym, occupationPlural}) => `${demonym}${occupationPlural}を出生年代別に表示します。各年代はHPI上位10人を表示し、展開で全員を確認できます。`,
      decadeLabel: ({decade}) => `${decade}年代`,
      more: ({count}) => `+${count} 人`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `Pantheonには、${oldestYear}から${youngestYear}の間に生まれた${demonym}${occupationPlural}として分類される人物が${totalCount}人います。`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `そのうち現在存命の人はいません。`;
        return `そのうち${aliveCountFormatted}人（${aliveShare}）が現在も存命です。`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `最も有名な存命の${demonym}${occupationPlural}は `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `最も有名な故${demonym}${occupationPlural}は `,
      peopleNewAsOf: "2024年4月",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `${asOfLabel}時点で、Pantheonには${countFormatted}人の新しい${demonym}${occupationPlural}が追加され、`,
      goToAllRankings: "すべてのランキングを見る",
      livingTitle: ({demonym, occupationPlural}) => `存命の${demonym}${occupationPlural}`,
      deceasedTitle: ({demonym, occupationPlural}) => `故人の${demonym}${occupationPlural}`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `新規追加の${demonym}${occupationPlural}（${yearLabel}）`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for Japanese ordinals (use 第X位)
        const formatJapaneseOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          return `第${num}位`;
        };

        let text = `このページには、最も偉大な${country}の${occupationPlural}のリストが含まれています。`;
        text += `Pantheonデータセットには${totalCount}人の${occupationPlural}が含まれており、そのうち${countryCount}人が${country}で生まれました。`;
        if (rank) {
          const japaneseRank = formatJapaneseOrdinal(rank);
          text += `これにより、${country}は${occupationPlural}の出生地として${japaneseRank}となります`;
          if (countriesBehind) {
            text += `（${countriesBehind}に次ぐ）。`;
          } else {
            text += `。`;
          }
        }
        return text;
      },
      and: "と",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `以下の人々は、Pantheonによって史上${count === 10 ? "トップ10" : ""}最も伝説的な${demonym}${occupationPlural}と見なされています。この有名な${demonym}${occupationPlural}のリストは、HPI（歴史的人気度指数）でソートされています。これは伝記のオンライン人気度に関する情報を集約する指標です。`,
      visitRankings: "ランキングページにアクセスして、完全なリストを表示してください",
      top: "トップ",
      withHpi: ({hpi, name}) => `HPIが${hpi}の${name}は、`,
      isMostFamous: ({demonym, occupation}) => `最も有名な${demonym}${occupation}です。`,
      isRankMostFamous: ({rank, demonym, occupation}) => `${rank}最も有名な${demonym}${occupation}です。`,
      biographyTranslated: ({possessive, count}) => `${possessive}伝記は${count}の異なる言語に翻訳されています`,
      onWikipedia: "ウィキペディアで",
    },
    selectPerson: {
      heading: "著名人を探索",
      subtitle: "あらゆる分野、国、時代における歴史上最も影響力のある人物を発見",
      metaDescription: "15以上の言語のウィキペディアに掲載されている85,000人以上の著名人の伝記を閲覧。",
      searchPlaceholder: "人物、場所、職業を検索",
      randomPerson: "ランダムな人物",
      statPeople: "伝記",
      statLanguages: "言語版",
      description: "Pantheonは少なくとも15のウィキペディア言語版に存在する伝記を追跡し、職業別に分類し、出身国と都市別に整理しています。",
      featuredPeople: "最も著名な人物",
      trendingNow: "現在のトレンド",
      browseByField: "分野別に閲覧",
      domainSports: "スポーツ",
      domainArts: "芸術とエンターテインメント",
      domainScience: "科学と技術",
      domainPolitics: "政治とリーダーシップ",
      exploreMore: "もっと探索",
      byOccupationCountry: "職業と国別",
      rankings: "ランキング",
      byEra: "時代別",
    },
    selectCountry: {
      heading: "国を探索",
      subtitle: "世界各国の最も著名な人物を発見",
      metaDescription: "各国の著名人を探索。出生国別の伝記を閲覧し、インタラクティブマップで世界中の歴史的人物を発見。",
      totalCountries: "カ国",
      totalPeople: "著名人",
      mapTitle: "国別著名人",
      countryList: "すべての国",
      sortAlpha: "A–Z",
      sortPeople: "人数順",
      people: "人",
      noPeopleData: "データなし",
      exploreMore: "さらに探索",
      byPerson: "著名人",
      byOccupation: "職業と国別",
      rankings: "ランキング",
    },
    selectPlace: {
      heading: "場所を探索",
      subtitle: "歴史上最も著名な人物を輩出した都市や町を発見",
      metaDescription: "世界中の著名人の出生地を探索。著名人の出生数で都市を閲覧し、歴史的な中心地を発見。",
      totalPlaces: "カ所",
      totalPeople: "著名人",
      mapTitle: "著名人の出生地",
      placeList: "トップの場所",
      sortAlpha: "A–Z",
      sortPeople: "人数順",
      groupByCountry: "国別",
      people: "人",
      exploreMore: "さらに探索",
      byPerson: "著名人",
      byCountry: "国別",
      rankings: "ランキング",
    },
    selectOccupation: {
      heading: "職業を探索",
      subtitle: "歴史上最も著名な人物を輩出した分野と職業を発見",
      metaDescription: "歴史上最も著名な人物の101の職業を探索。職業別に閲覧し、各分野の著名人数を確認。",
      totalOccupations: "種の職業",
      totalPeople: "著名人",
      occupationList: "すべての職業",
      sortAlpha: "A–Z",
      sortPeople: "人数順",
      people: "人",
      exploreMore: "さらに探索",
      byPerson: "著名人",
      byCountry: "国別",
      rankings: "ランキング",
    },
    selectOccupationCountry: {
      heading: "職業と国を選択",
      pleaseSelect: "最も記憶に残る伝記を表示するには、職業と国の組み合わせを選択してください",
      selectOccupation: "職業を選択",
      selectCountry: "国を選択",
      goToProfile: "プロフィールに移動",
      whoAreTheMostFamous: "最も有名なのは誰...",
      trendingThisWeek: "今週のトレンド",
      browseByCountry: "国別に閲覧",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
      }) => {
        const possessive = gender === "M" ? "彼" : gender === "F" ? "彼女" : "その人物";

        let sentence = `${possessive}の伝記はウィキペディアで${l}言語で利用可能です`;
        if (l_prev && l !== l_prev) {
          sentence += `（2024年の${l_prev}言語から${l > l_prev ? "増加" : "減少"}）`;
        }
        sentence += "。";

        // First clause: occupation ranking with proper Japanese structure
        // Use "最も人気のある〜の中で第X位" pattern
        if (occupationRank === 1) {
          sentence += `${name}は、最も人気のある<a href="/profile/occupation/${occupationSlug}">${occupation}</a>の中で第1位`;
        } else {
          sentence += `${name}は、最も人気のある<a href="/profile/occupation/${occupationSlug}">${occupation}</a>の中で第${occupationRank}位`;
        }
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          sentence += `（2024年の第${occupationRankPrev}位から${occupationRank < occupationRankPrev ? "順位を上げ" : "順位を下げ"}）`;
        }

        if (country) {
          // Second clause: country biography ranking
          if (bplaceCountryRank === 1) {
            sentence += `、<a href="/profile/place/${countrySlug}">${country}</a>人物の伝記の中で第1位`;
          } else {
            sentence += `、<a href="/profile/place/${countrySlug}">${country}</a>人物の伝記の中で第${bplaceCountryRank}位`;
          }
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            sentence += `（2019年の第${bplaceCountryRankPrev}位から${bplaceCountryRank < bplaceCountryRankPrev ? "順位を上げ" : "順位を下げ"}）`;
          }

          // Third clause: occupation + country ranking
          if (bplaceCountryOccupationRank) {
            if (bplaceCountryOccupationRank === 1) {
              sentence += `、また最も人気のある<a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${country}人${occupation}</a>の中で第1位に位置しています`;
            } else {
              sentence += `、また最も人気のある<a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${country}人${occupation}</a>の中で第${bplaceCountryOccupationRank}位に位置しています`;
            }
          } else {
            sentence += "に位置しています";
          }
        } else {
          sentence += "に位置しています";
        }

        sentence += "。";
        return sentence;
      },
    },
    nav: {
      visualizations: "可視化",
      rankings: "ランキング",
      profiles: "プロフィール",
      people: "人物",
      bornOnThisDay: "今日生まれた人",
      places: "場所",
      countries: "国",
      occupations: "職業",
      occupationCountry: "職業 / 国",
      eras: "時代",
      deaths: "死去",
      about: "概要",
      data: "データ",
      permissions: "許可",
      download: "ダウンロード",
      api: "API",
      games: "ゲーム",
      yearbook: "年鑑",
      birthle: "Birthle",
      trivia: "トリビア",
      news: "ニュース",
      search: "検索",
      home: "ホーム",
      giveFeedback: "フィードバック",
      usageCitation: "引用方法",
      newBadge: "新着！",
    },
    readMoreWikipedia: "ウィキペディアで詳細を読む",
    home: {
      tagline: "人類の集合的記憶を探求しよう！",
      subtitle:
        "Pantheonは、私たちの惑星の歴史の地理と動態を発見するのに役立ちます。",
      explore: "探索",
      people: "人物",
      places: "場所",
      occupations: "職業",
      and: "と",
      eras: "時代",
      trendingProfiles: "本日のトレンド人物",
      topProfilesBy: "ページビューによるトッププロフィール",
      wikipediaEdition: "ウィキペディア版",
      about: "は、少なくとも",
      languages: "言語",
      aboutContinued:
        "のウィキペディアに存在する伝記に焦点を当てた集合的記憶の観測所です。私たちは、国、都市、職業、時代別に整理された85,000以上の伝記のデータを持っています。このデータを探索して、人間文化を形作る人物について学びましょう。",
      aboutDeveloped:
        "は、MITのCollective Learningグループのプロジェクトとして始まりました。今日、それは",
      datawheel: "Datawheel",
      aboutDatawheel:
        "によって開発されています。これは、データ配信と可視化ソリューションの作成を専門とする会社です。",
      recentPassings: "最近の訃報",
      notableDeaths: "2025年の著名人の死",
      notableDeathsText:
        "2025年に失った著名人の完全なリストを見たいですか？私たちの",
      notableDeathsLink: "2025年の著名人の死",
      notableDeathsContinued:
        "ページにアクセスして、今年亡くなった有名人、芸術家、指導者、文化的アイコンなど、影響力のある人物の伝記の包括的なコレクションをご覧ください。",
      trendingSingers: "本日のトレンド歌手",
      trendingActors: "本日のトレンド俳優",
      recentlyAdded: "最近Pantheonに追加",
      searchPlaceholder: "人物、場所、職業を検索",
      isTrending: "は本日のトレンドです",
      readFullStory: "全文を読む",
      turningXToday: ({age}) => `本日${age}歳！`,
      wouldHaveBeenX: ({age}) => `今日で${age}歳`,
      seeAllBirthdays: "すべての誕生日を見る",
      bornTodayTitle: "今日生まれた有名人",
    },
    recentlyAdded: {
      title: "最近 Pantheon に追加",
      subtitle: "Pantheon のコレクションに最近追加された人物を、追加日順に紹介します。",
      addedOn: ({date}) => `${date}に追加`,
      previous: "前へ",
      next: "次へ",
      pageLabel: ({page}) => `${page} ページ`,
      viewMore: "最近追加された人物をもっと見る",
      empty: "最近追加された人物は見つかりませんでした。",
    },
    news: {
      pageTitle: "今日のトレンド人物",
      pageSubtitle: "歴史上の人物の毎日のサマリー（AI生成）",
      trendingIn: "トレンド：",
      selectDate: "別の日付を選択",
      references: "参考文献：",
      noData: "この日付の トレンドデータはありません。",
      previousDay: "前日",
      nextDay: "翌日",
      unknown: "不明",
    },
    trending: {
      isTrendingToday: "{name} が今日のトレンドです！",
      whyTrending: "{name} がトレンドの理由",
      references: "出典：",
      viewMoreTrending: "他のトレンド人物を見る",
    },
    bornOnThisDay: {
      famousBirthdays: "有名人の誕生日",
      bornOnThisDay: "今日生まれた人",
      famousPeopleBornOnThisDay: ({count}) => `今日生まれた${count}人の有名人`,
      birthdayOf: ({displayDate, count}) => `${displayDate}はPantheonデータベースに登録されている${count}人の有名人および歴史的に重要な人物の誕生日です。`,
      mostFamousInclude: "最も有名な人物には",
      mostCommonOccupations: "この日に生まれた人の最も一般的な職業は",
      exploreAnotherDate: "別の日付を探索",
      go: "移動",
      today: "今日",
      previousDay: "前日",
      nextDay: "翌日",
      famousPeopleBornOn: ({displayDate}) => `${displayDate}に生まれた有名人`,
      discoverRemarkable: ({displayDate}) => `${displayDate}を誕生日として共有する注目すべき人物を発見してください。世界のリーダーや画期的な科学者から、愛されるエンターテイナーや伝説的なアスリートまで、この日は歴史を通じて多くの影響力のある人物の誕生を見てきました。`,
      someNotableInclude: "最も注目すべき人物には",
      stillLivingToday: ({total, living}) => `この日に生まれた${total}人の有名人のうち、${living}人が現在も生存しています。`,
      viewFullRankings: "この日の完全なランキングを表示",
      born: "生誕",
      birthdaysByOccupation: "職業別の誕生日",
      occupationIntro: ({displayDate}) => `${displayDate}に生まれた有名人が、さまざまな分野や職業にどのように分布しているかをご覧ください。人物をクリックして、その人生と業績について詳しく学びましょう。`,
      showLess: "表示を減らす",
      more: ({count}) => `+${count}件`,
      formatDate: ({month, day}) => `${month}月${day}日`,
      metaTitle: ({displayDate}) => `${displayDate}生まれの有名人 | 今日は誰の誕生日？| Pantheon`,
      metaDescription: ({displayDate}) => `歴史上${displayDate}に生まれた最も有名な人物を発見してください。有名人、歴史的人物、科学者、アーティスト、アスリートなどの誕生日プロフィールを探索しましょう。`,
      months: {
        january: "1月",
        february: "2月",
        march: "3月",
        april: "4月",
        may: "5月",
        june: "6月",
        july: "7月",
        august: "8月",
        september: "9月",
        october: "10月",
        november: "11月",
        december: "12月",
      },
    },
  },
  ar: {
    stillAlive: "حتى اليوم",
    person: {
      loading: "جارٍ التحميل...",
      metaTitle: ({name}) => `سيرة ${name} | Pantheon`,
      sections: {
        trending: "رائج",
        memorabilityMetrics: "مقاييس الشهرة",
        trendingActivity: "نشاط الرواج",
        notableWorks: "أعمال بارزة",
        pageViewsByLang: ({name}) => `مشاهدات صفحة ${name} حسب اللغة`,
        amongOccupation: ({occupationPlural}) => `من بين ${occupationPlural}`,
        contemporaries: "معاصرون",
        inCountry: ({country}) => `في ${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `من بين ${occupationPlural} في ${country}`,
        filmography: "الأعمال السينمائية",
        tvMovieRoles: "أدوار تلفزيونية وسينمائية",
        insights: "رؤى من البيانات",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} في المرتبة الأولى بين ${totalFormatted} من ${occupationPlural} المدرجين في بانثيون حول العالم.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} في المرتبة ${rank} من بين ${totalFormatted} من ${occupationPlural} حول العالم — ضمن أفضل ${topPercent}٪ في المهنة.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} أعلى الشخصيات تصنيفًا من بين ${totalFormatted} شخصية في بانثيون وُلدت في ${country}.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `${name} في المرتبة الأولى بين ${count} من ${occupationPlural} المولودين في ${country}.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} أشهر شخصية من بين ${count} شخصية بارزة وُلدت في ${city}، ${country}${peers ? `، متقدّمةً على ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} أشهر شخصية من بين ${count} شخصية بارزة وُلدت في ${city}، فيما يُعرف اليوم بدولة ${country}${peers ? `، متقدّمةً على ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `${name} الشخصية الأبرز من بين ${count} شخصية في بانثيون من مواليد عام ${year}.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `تظهر سيرة ${name} في ${count} نسخة لغوية من ويكيبيديا — أكثر من ${percent}٪ من جميع ${occupationPlural}.`,
        newLangs: ({name, count}) =>
          `أُضيفت سيرة ${name} إلى ${count} نسخ لغوية جديدة من ويكيبيديا خلال العام الماضي.`,
        nonEnglish: ({name, count}) =>
          `حصدت سيرة ${name} ${count} مشاهدة من نسخ ويكيبيديا غير الإنجليزية خلال العام الماضي — شهرة تتجاوز العالم الناطق بالإنجليزية بكثير.`,
        enduringFame: ({name, centuries, rank}) =>
          `بعد أكثر من ${centuries} قرون على الوفاة، لا يزال ${name} في المرتبة ${rank} بين جميع الشخصيات في بانثيون.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `بتحقيق ${views} مشاهدة على ويكيبيديا خلال العام الماضي، كانت صفحة ${name} الأكثر مشاهدة بين جميع ${occupationPlural}.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `حصدت صفحة ${name} على ويكيبيديا ${views} مشاهدة خلال العام الماضي — أي ${multiple} أضعاف متوسط ${occupationPlural}.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `${name} واحدة من ${womenCount} امرأة فقط من بين ${totalFormatted} من ${occupationPlural} في بانثيون.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `رغم حياة لم تتجاوز ${age} عامًا، فإن ${name} في المرتبة ${rank} بين جميع ${occupationPlural} عبر التاريخ.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} من أوائل ${occupationPlural} في بانثيون — ضمن أقدم ${count} ميلادًا.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} يشارك ${twinNames} يوم الميلاد نفسه (${date}).`,
        fallback: ({name, count, hpi}) =>
          `تمتد سيرة ${name} عبر ${count} نسخة لغوية من ويكيبيديا وتبلغ قيمة مؤشر الشعبية التاريخية ${hpi}.`,
      },
      metrics: {
        pageViews: "مشاهدات الصفحة",
        past12Months: "آخر 12 شهرًا",
        hpi: "HPI",
        hpiDesc: "مؤشر الشعبية التاريخية",
        avgOf: ({label}) => `متوسط ${label}`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `من بين ${occupationPlural}، يحتل ${name} المرتبة ${rankHtml} من أصل ${totalFormatted}.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `من بين المولودين في عام ${year}، يحتل ${name} المرتبة ${rankHtml}.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `من بين المتوفين في عام ${year}، يحتل ${name} المرتبة ${rankHtml}.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `من بين المولودين في ${countryHtml}، يحتل ${name} المرتبة ${rankHtml} من أصل ${totalFormatted}.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `من بين ${occupationPlural} المولودين في ${countryHtml}، يحتل ${name} المرتبة ${rankHtml}.`,
        beforePeers: ({gender, count}) =>
          `${gender === "M" ? "قبله" : gender === "F" ? "قبلها" : "قبلهم"} يأتي `,
        afterPeers: ({gender, count}) =>
          `${gender === "M" ? "بعده" : gender === "F" ? "بعدها" : "بعدهم"} يأتي `,
        notRankedIn: ({name, countryHtml}) => `${name} غير مصنف في ${countryHtml}`,
        mostPopularInWikipedia: ({occupationPlural}) => `أشهر ${occupationPlural} على ويكيبيديا`,
        othersBornInYear: ({year}) => `آخرون وُلدوا في عام ${year}`,
        othersDeceasedInYear: ({year}) => `آخرون توفوا في عام ${year}`,
        othersBornInCountry: ({countryHtml}) => `آخرون وُلدوا في ${countryHtml}`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym}`,
        goToAllRankings: "عرض جميع التصنيفات",
        and: " و",
      },
      carousel: {
        present: "حتى الآن",
        hpiLabel: "HPI:",
        rankLabel: "المرتبة:",
      },
      footer: {
        relatedProfiles: "ملفات ذات صلة",
        individuals: ({countFormatted}) => `${countFormatted} شخصًا`,
        rank: ({rankFormatted}) => `المرتبة ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `مشاهدات ${langCode}.WIKIPEDIA (PV)`,
        rankInLanguage: ({rank, language}) => `المرتبة ${rank} في ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `أيام الرواج: ${count}`,
        less: "أقل",
        more: "أكثر",
        clickForDetails: "انقر للتفاصيل",
        notTrending: "غير رائج",
        rankNum: ({rank}) => `المرتبة ${rank}`,
        viewAllTrendingNews: ({date}) => `عرض جميع الأخبار الرائجة ليوم ${date}`,
      },
      pageViewsByLangChart: {
        languageEditions: "الإصدارات اللغوية",
        pageviewsByLanguageEdition: "المشاهدات حسب الإصدار اللغوي",
        cumulativeLanguageEditions: "الإصدارات اللغوية التراكمية",
        editionsWord: "إصدارًا",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} مشاهدة`,
        andOthers: ({count}) => `(و${count} أخرى)`,
        summaryIntro: ({name}) => `خلال العام الماضي حصل ${name} على أكبر عدد من مشاهدات الصفحة في `,
        wikipediaEdition: ({language}) => `نسخة ويكيبيديا باللغة ${language}`,
        withViewsFollowedBy: ({viewsFormatted}) => ` بواقع ${viewsFormatted} مشاهدة، تليها `,
        growthIntro: ". ومن حيث النمو السنوي للمشاهدات، فإن أفضل 3 نسخ من ويكيبيديا هي ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) لغة ${familyName} من عائلة ${primaryFamilyName}.`,
        families: {
          "Indo-European": "الهندية الأوروبية",
          "Sino-Tibetan": "الصينية التبتية",
          "Afro-Asiatic": "الأفروآسيوية",
          "Altaic": "الألطية",
          "Dravidian": "الدرافيدية",
          "Austronesian": "الأسترونيزية",
          "Uralic": "الأورالية",
          "Caucasian": "القوقازية",
          "Niger-Kordofanian": "النيجرية الكردفانية",
          "Creoles and pidgins": "الكريولية والهجينة",
          "Amerindian": "الأمريكية الأصلية",
          "Tai": "التاي",
          "Other": "أخرى",
          "Albanian": "الألبانية",
          "Algic": "الألجيّة",
          "Armenian": "الأرمنية",
          "Austro-Asiatic": "الأسترو-آسيوية",
          "Baltic": "البلطيقية",
          "Basque": "الباسكية",
          "Berber": "الأمازيغية",
          "Celtic": "الكلتية",
          "Chadic": "التشادية",
          "Constructed": "اللغات المصطنعة",
          "Creole (English)": "الكريولية (إنجليزية)",
          "Creole (French)": "الكريولية (فرنسية)",
          "Cushitic": "الكوشية",
          "Eskimo-Aleut": "الإسكيمو-ألوتية",
          "Germanic": "الجرمانية",
          "Greek": "اليونانية",
          "Indic": "الهندية",
          "Iranian": "الإيرانية",
          "Italic": "الإيطاليقية",
          "Japanese": "اليابانية",
          "Korean": "الكورية",
          "Malayo-Polynesian": "الملايو-بولينيزية",
          "Mongolian": "المنغولية",
          "Na-Dene": "النا-دينية",
          "Nilo-Saharan": "النيلية الصحراوية",
          "Quechuan": "الكيتشوا",
          "Semitic": "السامية",
          "Sinitic": "الصينية",
          "Slavic": "السلافية",
          "Tibeto-Burman": "التبتية البورمية",
          "Tupi": "التوبي",
          "Turkic": "التركية",
          "Uto-Aztecan": "اليوتو-أزتيكية",
        },
      },
    },
    birthdayToast: ({name}) => `اليوم عيد ميلاد ${name}`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank}) =>
      `${name} (${birthYear}–${deathYear}) هو/هي ${occupation} ${demonym} في المرتبة #${rank} عالمياً حسب مؤشر الشهرة التاريخية في Pantheon. استكشف السيرة الذاتية ومشاهدات الصفحة والمقاييس.`,
    learnMoreRankless: "تعرف على المزيد حول التأثير الأكاديمي لـ {name} في Rankless",
    nav: {
      visualizations: "التصورات",
      rankings: "التصنيفات",
      profiles: "الملفات الشخصية",
      people: "الأشخاص",
      bornOnThisDay: "ولدوا في هذا اليوم",
      places: "الأماكن",
      countries: "البلدان",
      occupations: "المهن",
      occupationCountry: "المهنة / البلد",
      eras: "العصور",
      deaths: "الوفيات",
      about: "حول",
      data: "البيانات",
      permissions: "الأذونات",
      download: "تحميل",
      api: "API",
      games: "الألعاب",
      yearbook: "كتاب السنة",
      birthle: "Birthle",
      trivia: "معلومات عامة",
      news: "الأخبار",
      search: "بحث",
      home: "الرئيسية",
      giveFeedback: "إعطاء رأيك",
      usageCitation: "الاستخدام والاقتباس",
      newBadge: "جديد!",
      explore: "استكشاف",
      apps: "التطبيقات",
      reportDataError: "الإبلاغ عن خطأ في البيانات",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
    },
    occupationCountry: {
      theMostFamous: "الأكثر شهرة",
      from: "من",
      greatest: "الأعظم",

      keepExploring: "واصل الاستكشاف",
      trendingThisWeek: "الرائج هذا الأسبوع",
      trendScoreLabel: "درجة الرواج",
      whyTrending: "لماذا هذا رائج؟",
      clicksThisWeek: "النقرات هذا الأسبوع",
      impressionsThisWeek: "مرات الظهور هذا الأسبوع",
      readMore: "اقرأ المزيد",
      showLess: "عرض أقل",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} شخصية بارزة`,
      viewsLabel: "مشاهدة",
      onDate: ({date}) => `في ${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `الرائج ${occupationPlural} هذا الأسبوع`;
        return hasFromPrefix
          ? `الرائج ${occupationPlural} ${locationLabel} هذا الأسبوع`
          : `الرائج ${locationLabel} ${occupationPlural} هذا الأسبوع`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `أفضل 10 ${occupationPlural} رائجين على ويكيبيديا`;
        return hasFromPrefix
          ? `أفضل 10 ${occupationPlural} ${locationLabel} رائجين على ويكيبيديا`
          : `أفضل 10 ${locationLabel} ${occupationPlural} رائجين على ويكيبيديا`;
      },
      trendingIntroSuffix: "خلال آخر 7 أيام، مع ملاحظة قصيرة حول سبب الارتفاع.",
      trendingThisWeekShort: "الرائج هذا الأسبوع",
      trendingThisWeekDefault: "الرائج هذا الأسبوع على ويكيبيديا",
      metaTitle: ({demonym, occupationPlural}) => `أشهر ${occupationPlural} ${demonym} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `اكتشف ${countFormatted} من أشهر ${occupationPlural} ${demonym} في التاريخ. استكشف ملفات ${occupationSingular} البارزة من ${country} مرتبة حسب الأهمية التاريخية.`,
      birthDecadesTitle: "الأشخاص حسب عقد الميلاد",
      birthDecadesIntro: ({demonym, occupationPlural}) => `تصفح ${occupationPlural} ${demonym} البارزين حسب عقد الميلاد. يعرض كل عقد أفضل 10 وفق HPI؛ وسّع لرؤية الجميع.`,
      decadeLabel: ({decade}) => `عقد ${decade}`,
      more: ({count}) => `+${count} المزيد`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `يضم بانثيون ${totalCount} شخصية مصنفة كـ ${occupationPlural} ${demonym} وُلدوا بين ${oldestYear} و ${youngestYear}.`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `ومن بين هؤلاء، لا أحد لا يزال على قيد الحياة اليوم.`;
        return `ومن بين هؤلاء، لا يزال ${aliveCountFormatted} (${aliveShare}) على قيد الحياة اليوم.`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `أشهر ${occupationPlural} ${demonym} الأحياء يشملون `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `أشهر ${occupationPlural} ${demonym} المتوفين يشملون `,
      peopleNewAsOf: "أبريل 2024",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `اعتبارًا من ${asOfLabel}، تمت إضافة ${countFormatted} ${occupationPlural} ${demonym} جديدة إلى بانثيون بما في ذلك `,
      goToAllRankings: "عرض جميع التصنيفات",
      livingTitle: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym} الأحياء`,
      deceasedTitle: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym} المتوفون`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `${occupationPlural} ${demonym} المضافة حديثًا (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for Arabic ordinals (keep the number as-is)
        const formatArabicOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          return `${num}`;
        };

        let text = `تحتوي هذه الصفحة على قائمة بأعظم ${occupationPlural} ${demonym}. `;
        text += `تحتوي مجموعة بيانات Pantheon على ${totalCount} ${occupationPlural}، ولد منهم ${countryCount} في ${country}. `;
        if (rank) {
          const arabicRank = formatArabicOrdinal(rank);
          text += `وهذا يجعل ${country} مسقط رأس ${arabicRank} أكبر عدد من ${occupationPlural}`;
          if (countriesBehind) {
            text += ` بعد ${countriesBehind}.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "و",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `يعتبر Pantheon الأشخاص التاليين ${count === 10 ? "أفضل 10" : ""} ${occupationPlural} ${demonym} الأكثر أسطورية على الإطلاق. يتم ترتيب هذه القائمة من ${occupationPlural} ${demonym} المشهورين حسب HPI (مؤشر الشعبية التاريخية)، وهو مقياس يجمع المعلومات حول شعبية السيرة الذاتية عبر الإنترنت.`,
      visitRankings: "قم بزيارة صفحة التصنيفات لعرض القائمة الكاملة لـ",
      top: "أفضل",
      withHpi: ({hpi, name}) => `بـ HPI ${hpi}، ${name}`,
      isMostFamous: ({demonym, occupation}) => `هو ${occupation} ${demonym} الأكثر شهرة.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `هو ${rank} ${occupation} ${demonym} الأكثر شهرة.`,
      biographyTranslated: ({possessive, count}) => `تمت ترجمة ${possessive} سيرته الذاتية إلى ${count} لغة مختلفة`,
      onWikipedia: "في ويكيبيديا",
    },
    selectPerson: {
      heading: "استكشف الشخصيات البارزة",
      subtitle: "اكتشف أكثر الأشخاص تأثيرًا في التاريخ عبر كل مجال وبلد وعصر",
      metaDescription: "تصفح أكثر من 85,000 سيرة ذاتية لشخصيات بارزة بحضور في ويكيبيديا بأكثر من 15 لغة.",
      searchPlaceholder: "البحث عن الأشخاص والأماكن والمهن",
      randomPerson: "شخص عشوائي",
      statPeople: "سيرة ذاتية",
      statLanguages: "إصدارات لغوية",
      description: "يتتبع Pantheon السير الذاتية الموجودة في 15 إصدارًا لغويًا على الأقل من ويكيبيديا، مصنفة حسب المهنة ومنظمة حسب بلد ومدينة المنشأ.",
      featuredPeople: "أبرز الشخصيات",
      trendingNow: "الرائج الآن",
      browseByField: "تصفح حسب المجال",
      domainSports: "الرياضة",
      domainArts: "الفنون والترفيه",
      domainScience: "العلوم والتكنولوجيا",
      domainPolitics: "السياسة والقيادة",
      exploreMore: "استكشف المزيد",
      byOccupationCountry: "حسب المهنة والبلد",
      rankings: "التصنيفات",
      byEra: "حسب العصر",
    },
    selectCountry: {
      heading: "استكشاف الدول",
      subtitle: "اكتشف أبرز الشخصيات من كل دولة في العالم",
      metaDescription: "استكشف الشخصيات البارزة من كل دولة. تصفح السير الذاتية حسب بلد الميلاد، واستعرض الخرائط التفاعلية، واكتشف الشخصيات التاريخية من جميع أنحاء العالم.",
      totalCountries: "دولة",
      totalPeople: "شخصية بارزة",
      mapTitle: "الشخصيات البارزة حسب الدولة",
      countryList: "جميع الدول",
      sortAlpha: "أ–ي",
      sortPeople: "الأكثر أشخاصاً",
      people: "شخص",
      noPeopleData: "لا تتوفر بيانات",
      exploreMore: "استكشاف المزيد",
      byPerson: "شخصيات بارزة",
      byOccupation: "حسب المهنة والدولة",
      rankings: "التصنيفات",
    },
    selectPlace: {
      heading: "استكشاف الأماكن",
      subtitle: "اكتشف المدن والبلدات التي شكّلت أبرز شخصيات التاريخ",
      metaDescription: "استكشف أماكن ولادة الشخصيات البارزة حول العالم. تصفح المدن حسب عدد المواليد البارزين واكتشف المراكز التاريخية.",
      totalPlaces: "مكان",
      totalPeople: "شخصية بارزة",
      mapTitle: "أماكن ولادة الشخصيات البارزة",
      placeList: "أهم الأماكن",
      sortAlpha: "أ–ي",
      sortPeople: "الأكثر أشخاصاً",
      groupByCountry: "حسب الدولة",
      people: "شخص",
      exploreMore: "استكشاف المزيد",
      byPerson: "شخصيات بارزة",
      byCountry: "حسب الدولة",
      rankings: "التصنيفات",
    },
    selectOccupation: {
      heading: "استكشاف المهن",
      subtitle: "اكتشف المجالات والمهن التي شكّلت أبرز شخصيات التاريخ",
      metaDescription: "استكشف 101 مهنة لأبرز شخصيات التاريخ. تصفح حسب المهنة واكتشف عدد الشخصيات البارزة في كل مجال.",
      totalOccupations: "مهنة",
      totalPeople: "شخصية بارزة",
      occupationList: "جميع المهن",
      sortAlpha: "أ–ي",
      sortPeople: "الأكثر أشخاصاً",
      people: "شخص",
      exploreMore: "استكشاف المزيد",
      byPerson: "شخصيات بارزة",
      byCountry: "حسب الدولة",
      rankings: "التصنيفات",
    },
    selectOccupationCountry: {
      heading: "اختر مهنة وبلد",
      pleaseSelect: "يرجى اختيار مزيج من المهنة والبلد لرؤية السير الذاتية الأكثر تميزًا",
      selectOccupation: "اختر مهنة",
      selectCountry: "اختر بلد",
      goToProfile: "الذهاب إلى الملف الشخصي",
      whoAreTheMostFamous: "من هم الأكثر شهرة...",
      trendingThisWeek: "الرائج هذا الأسبوع",
      browseByCountry: "تصفح حسب البلد",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
      }) => {
        const biographyWord = gender === "F" ? "سيرتها الذاتية" : "سيرته الذاتية";

        let sentence = `${biographyWord} متاحة بـ${l.toLocaleString('ar')} لغة مختلفة على ويكيبيديا`;
        if (l_prev && l !== l_prev) {
          const change = l > l_prev ? "زيادة" : "انخفاض";
          sentence += ` (${change} من ${l_prev.toLocaleString('ar')} في 2024)`;
        }
        sentence += ". ";

        // Main ranking - "يحتل [name] المرتبة [rank] بين أكثر [occupation plural] شعبيةً"
        // NOTE: occupation should be in PLURAL form in database for Arabic (e.g., "فناني القصص المصوّرة" not "فنان قصص مصورة")
        sentence += `يحتل ${name} المرتبة ${occupationRank === 1 ? "الأولى" : occupationRank.toLocaleString('ar')} بين أكثر <a href="/profile/occupation/${occupationSlug}">${occupation}</a> شعبيةً`;
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          const change = occupationRank < occupationRankPrev ? "تقدمًا" : "تراجعًا";
          sentence += ` (${change} من ${occupationRankPrev.toLocaleString('ar')} في 2024)`;
        }

        if (country) {
          sentence += `، والمرتبة ${bplaceCountryRank !== 1 ? bplaceCountryRank.toLocaleString('ar') : "الأولى"} بين أكثر السير الذاتية شعبيةً في <a href="/profile/place/${countrySlug}">${country}</a>`;
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            const change = bplaceCountryRank < bplaceCountryRankPrev ? "تقدمًا" : "تراجعًا";
            sentence += ` (${change} من ${bplaceCountryRankPrev.toLocaleString('ar')} في 2019)`;
          }

          if (bplaceCountryOccupationRank) {
            // Use nationality adjective (plural masculine) for cleaner grammar: "فناني القصص المصوّرة الأمريكيين"
            const nationalitySuffix = nationalityAdj || demonym;
            sentence += `، كما يحتل المرتبة ${bplaceCountryOccupationRank !== 1 ? bplaceCountryOccupationRank.toLocaleString('ar') : "الأولى"} بين أكثر <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation} ${nationalitySuffix}</a> شعبيةً`;
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "التصورات",
      rankings: "التصنيفات",
      profiles: "الملفات الشخصية",
      people: "الأشخاص",
      bornOnThisDay: "ولدوا في هذا اليوم",
      places: "الأماكن",
      countries: "البلدان",
      occupations: "المهن",
      occupationCountry: "المهنة / البلد",
      eras: "العصور",
      deaths: "الوفيات",
      about: "حول",
      data: "البيانات",
      permissions: "الأذونات",
      download: "تحميل",
      api: "API",
      games: "الألعاب",
      yearbook: "الكتاب السنوي",
      birthle: "Birthle",
      trivia: "أسئلة ثقافية",
      news: "الأخبار",
      search: "بحث",
      home: "الرئيسية",
      giveFeedback: "إرسال ملاحظات",
      usageCitation: "الاستشهاد",
      newBadge: "جديد!",
    },
    readMoreWikipedia: "اقرأ المزيد على ويكيبيديا",
    home: {
      tagline: "استكشف الذاكرة الجماعية للبشرية!",
      subtitle: "يساعدك Pantheon على اكتشاف جغرافية وديناميكية تاريخ كوكبنا.",
      explore: "استكشف",
      people: "أشخاص",
      places: "أماكن",
      occupations: "مهن",
      and: "و",
      eras: "عصور",
      trendingProfiles: "الملفات الشخصية الرائجة اليوم",
      topProfilesBy: "أفضل الملفات الشخصية حسب مشاهدات الصفحة لـ",
      wikipediaEdition: "إصدار ويكيبيديا",
      about: "هو مرصد للذاكرة الجماعية يركز على السير الذاتية الموجودة في",
      languages: "لغة على الأقل",
      aboutContinued:
        "في ويكيبيديا. لدينا بيانات عن أكثر من 85,000 سيرة ذاتية، منظمة حسب البلدان والمدن والمهن والعصور. استكشف هذه البيانات للتعرف على الشخصيات التي تشكل الثقافة الإنسانية.",
      aboutDeveloped:
        "بدأ كمشروع في مجموعة التعلم الجماعي في معهد ماساتشوستس للتكنولوجيا. اليوم تم تطويره بواسطة",
      datawheel: "Datawheel",
      aboutDatawheel: "، وهي شركة متخصصة في إنشاء حلول توزيع وتصور البيانات.",
      recentPassings: "الوفيات الأخيرة",
      notableDeaths: "الوفيات البارزة لعام 2025",
      notableDeathsText:
        "هل تريد رؤية القائمة الكاملة للشخصيات البارزة التي فقدناها في عام 2025؟ قم بزيارة",
      notableDeathsLink: "الوفيات البارزة لعام 2025",
      notableDeathsContinued:
        "صفحتنا للحصول على مجموعة شاملة من السير الذاتية للشخصيات المؤثرة، بما في ذلك المشاهير والفنانين والقادة والأيقونات الثقافية الذين توفوا هذا العام.",
      trendingSingers: "المطربون الرائجون اليوم",
      trendingActors: "الممثلون الرائجون اليوم",
      recentlyAdded: "أضيف مؤخراً إلى Pantheon",
      searchPlaceholder: "البحث عن الأشخاص والأماكن والمهن",
      isTrending: "رائج اليوم",
      readFullStory: "اقرأ القصة الكاملة",
      turningXToday: ({age}) => `يبلغ ${age} اليوم!`,
      wouldHaveBeenX: ({age}) => `كان سيبلغ ${age} اليوم`,
      seeAllBirthdays: "عرض جميع أعياد الميلاد",
      bornTodayTitle: "أشخاص مشهورون ولدوا اليوم",
    },
    recentlyAdded: {
      title: "أضيف مؤخراً إلى Pantheon",
      subtitle: "اكتشف أحدث السير الذاتية المضافة إلى مجموعة Pantheon، مرتبة حسب تاريخ الإضافة.",
      addedOn: ({date}) => `أضيف في ${date}`,
      previous: "السابق",
      next: "التالي",
      pageLabel: ({page}) => `الصفحة ${page}`,
      viewMore: "عرض المزيد من الأشخاص المضافين مؤخراً",
      empty: "لم يتم العثور على أشخاص مضافين مؤخراً.",
    },
    news: {
      pageTitle: "من هو في الموضة اليوم؟",
      pageSubtitle:
        "ملخصات يومية للشخصيات التاريخية (تم إنشاؤها بواسطة الذكاء الاصطناعي)",
      trendingIn: "رائج في",
      selectDate: "اختر تاريخًا مختلفًا",
      references: "المراجع:",
      noData: "لا تتوفر بيانات الاتجاهات لهذا التاريخ.",
      previousDay: "اليوم السابق",
      nextDay: "اليوم التالي",
      unknown: "غير معروف",
    },
    trending: {
      isTrendingToday: "{name} رائج اليوم!",
      whyTrending: "لماذا {name} رائج:",
      references: "المصادر:",
      viewMoreTrending: "عرض المزيد من الأشخاص الرائجين",
    },
    bornOnThisDay: {
      famousBirthdays: "أعياد ميلاد المشاهير",
      bornOnThisDay: "ولدوا في هذا اليوم",
      famousPeopleBornOnThisDay: ({count}) => `${count} ${count === 1 ? "شخص مشهور ولد" : "أشخاص مشهورين ولدوا"} في هذا اليوم`,
      birthdayOf: ({displayDate, count}) => `${displayDate} هو عيد ميلاد ${count} من المشاهير والشخصيات التاريخية المهمة في قاعدة بيانات Pantheon.`,
      mostFamousInclude: "من أشهرهم",
      mostCommonOccupations: "المهن الأكثر شيوعًا للأشخاص المولودين في هذا اليوم هي",
      exploreAnotherDate: "استكشاف تاريخ آخر",
      go: "انتقال",
      today: "اليوم",
      previousDay: "اليوم السابق",
      nextDay: "اليوم التالي",
      famousPeopleBornOn: ({displayDate}) => `أشخاص مشهورون ولدوا في ${displayDate}`,
      discoverRemarkable: ({displayDate}) => `اكتشف الشخصيات البارزة التي تشترك في ${displayDate} كعيد ميلادهم. من قادة العالم والعلماء الرائدين إلى الفنانين المحبوبين والرياضيين الأسطوريين، شهد هذا اليوم ولادة العديد من الشخصيات المؤثرة عبر التاريخ.`,
      someNotableInclude: "من أبرز الشخصيات",
      stillLivingToday: ({total, living}) => `من بين ${total} شخصًا مشهورًا ولدوا في هذا التاريخ، ${living} لا يزالون على قيد الحياة اليوم.`,
      viewFullRankings: "عرض التصنيف الكامل لهذا اليوم",
      born: "ولد",
      birthdaysByOccupation: "أعياد الميلاد حسب المهنة",
      occupationIntro: ({displayDate}) => `شاهد كيف يتوزع الأشخاص المشهورون المولودون في ${displayDate} عبر مختلف المجالات والمهن. انقر على أي شخص لمعرفة المزيد عن حياته وإنجازاته.`,
      showLess: "عرض أقل",
      more: ({count}) => `+${count} المزيد`,
      formatDate: ({month, day}) => {
        const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        return `${day} ${months[month - 1]}`;
      },
      metaTitle: ({displayDate}) => `مشاهير مولودون في ${displayDate} | من ولد اليوم؟ | Pantheon`,
      metaDescription: ({displayDate}) => `اكتشف أشهر الأشخاص المولودين في ${displayDate} عبر التاريخ. استكشف ملفات تعريف المشاهير والشخصيات التاريخية والعلماء والفنانين والرياضيين وغيرهم.`,
      months: {
        january: "يناير",
        february: "فبراير",
        march: "مارس",
        april: "أبريل",
        may: "مايو",
        june: "يونيو",
        july: "يوليو",
        august: "أغسطس",
        september: "سبتمبر",
        october: "أكتوبر",
        november: "نوفمبر",
        december: "ديسمبر",
      },
    },
  },
  it: {
    stillAlive: "presente",
    person: {
      loading: "Caricamento...",
      metaTitle: ({name}) => `Biografia di ${name} | Pantheon`,
      sections: {
        trending: "Di tendenza",
        memorabilityMetrics: "Metriche di memorabilità",
        trendingActivity: "Attività di tendenza",
        notableWorks: "Opere principali",
        pageViewsByLang: ({name}) => `Visualizzazioni della pagina di ${name} per lingua`,
        amongOccupation: ({occupationPlural}) => `Tra ${occupationPlural}`,
        contemporaries: "Contemporanei",
        inCountry: ({country}) => `In ${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `Tra ${occupationPlural} in ${country}`,
        filmography: "Filmografia",
        tvMovieRoles: "Ruoli televisivi e cinematografici",
        insights: "Dati in evidenza",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} è al primo posto tra tutti i ${totalFormatted} ${occupationPlural} presenti in Pantheon nel mondo.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} occupa la posizione n. ${rank} su ${totalFormatted} ${occupationPlural} al mondo — nel ${topPercent}% più alto della professione.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} è la personalità con il miglior posizionamento tra le ${totalFormatted} persone di Pantheon nate in ${country}.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `Dei ${count} ${occupationPlural} nati in ${country}, ${name} è al primo posto.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} è la personalità più memorabile tra le ${count} persone illustri nate a ${city}, ${country}${peers ? `, davanti a ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} è la personalità più memorabile tra le ${count} persone illustri nate a ${city}, in quella che è oggi ${country}${peers ? `, davanti a ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `Delle ${count} persone di Pantheon nate nel ${year}, ${name} è la più memorabile.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `La biografia di ${name} compare in ${count} edizioni linguistiche di Wikipedia — più del ${percent}% di tutti i ${occupationPlural}.`,
        newLangs: ({name, count}) =>
          `Nell'ultimo anno la biografia di ${name} è stata aggiunta a ${count} nuove edizioni linguistiche di Wikipedia.`,
        nonEnglish: ({name, count}) =>
          `Nell'ultimo anno la biografia di ${name} ha registrato ${count} visualizzazioni nelle edizioni di Wikipedia non in inglese — una fama che va ben oltre il mondo anglofono.`,
        enduringFame: ({name, centuries, rank}) =>
          `A oltre ${centuries} secoli dalla morte, ${name} occupa ancora la posizione n. ${rank} tra tutte le personalità di Pantheon.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `Con ${views} visualizzazioni su Wikipedia nell'ultimo anno, ${name} è la persona più vista tra tutti i ${occupationPlural}.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `La pagina Wikipedia di ${name} ha registrato ${views} visualizzazioni nell'ultimo anno — ${multiple} volte la media dei ${occupationPlural}.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `${name} è una delle sole ${womenCount} donne tra i ${totalFormatted} ${occupationPlural} di Pantheon.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `Nonostante una vita di soli ${age} anni, ${name} occupa la posizione n. ${rank} tra tutti i ${occupationPlural} della storia.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} è tra i ${count} ${occupationPlural} nati più anticamente in tutto Pantheon.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} condivide il compleanno (${date}) con ${twinNames}.`,
        fallback: ({name, count, hpi}) =>
          `La biografia di ${name} copre ${count} edizioni linguistiche di Wikipedia e ottiene un Indice di Popolarità Storica di ${hpi}.`,
      },
      metrics: {
        pageViews: "Visualizzazioni",
        past12Months: "Ultimi 12 mesi",
        hpi: "HPI",
        hpiDesc: "Indice di popolarità storica",
        avgOf: ({label}) => `Media ${label}`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `Tra ${occupationPlural}, ${name} occupa la posizione ${rankHtml} su ${totalFormatted}.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `Tra le persone nate nel ${year}, ${name} occupa la posizione ${rankHtml}.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `Tra le persone decedute nel ${year}, ${name} occupa la posizione ${rankHtml}.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `Tra le persone nate in ${countryHtml}, ${name} occupa la posizione ${rankHtml} su ${totalFormatted}.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `Tra ${occupationPlural} nati in ${countryHtml}, ${name} occupa la posizione ${rankHtml}.`,
        beforePeers: ({gender, count}) =>
          `Prima di ${gender === "M" ? "lui" : gender === "F" ? "lei" : "loro"} ${count === 1 ? "c'è" : "ci sono"} `,
        afterPeers: ({gender, count}) =>
          `Dopo di ${gender === "M" ? "lui" : gender === "F" ? "lei" : "loro"} ${count === 1 ? "c'è" : "ci sono"} `,
        notRankedIn: ({name, countryHtml}) => `${name} non è classificato in ${countryHtml}`,
        mostPopularInWikipedia: ({occupationPlural}) => `${occupationPlural} più popolari su Wikipedia`,
        othersBornInYear: ({year}) => `Altre persone nate nel ${year}`,
        othersDeceasedInYear: ({year}) => `Altre persone decedute nel ${year}`,
        othersBornInCountry: ({countryHtml}) => `Altre persone nate in ${countryHtml}`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym}`,
        goToAllRankings: "Vai a tutte le classifiche",
        and: " e ",
      },
      carousel: {
        present: "presente",
        hpiLabel: "HPI:",
        rankLabel: "Posizione:",
      },
      footer: {
        relatedProfiles: "Profili correlati",
        individuals: ({countFormatted}) => `${countFormatted} persone`,
        rank: ({rankFormatted}) => `Posizione ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `VISUALIZZAZIONI SU ${langCode}.WIKIPEDIA (PV)`,
        rankInLanguage: ({rank, language}) => `Posizione n. ${rank} in ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `${count} giorn${count === 1 ? "o" : "i"} di tendenza`,
        less: "Meno",
        more: "Più",
        clickForDetails: "Clicca per i dettagli",
        notTrending: "Non di tendenza",
        rankNum: ({rank}) => `Posizione n. ${rank}`,
        viewAllTrendingNews: ({date}) => `Vedi tutte le notizie di tendenza del ${date}`,
      },
      pageViewsByLangChart: {
        languageEditions: "Edizioni linguistiche",
        pageviewsByLanguageEdition: "Visualizzazioni per edizione linguistica",
        cumulativeLanguageEditions: "Edizioni linguistiche cumulative",
        editionsWord: "edizioni",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} visualizzazioni`,
        andOthers: ({count}) => `(e altre ${count})`,
        summaryIntro: ({name}) => `Nell'ultimo anno ${name} ha avuto il maggior numero di visualizzazioni nell'`,
        wikipediaEdition: ({language}) => `edizione di Wikipedia in ${language}`,
        withViewsFollowedBy: ({viewsFormatted}) => ` con ${viewsFormatted} visualizzazioni, seguita da `,
        growthIntro: ". In termini di crescita annua delle visualizzazioni, le 3 principali edizioni di Wikipedia sono ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) è una lingua ${familyName} della famiglia ${primaryFamilyName}.`,
        families: {
          "Indo-European": "Indoeuropea",
          "Sino-Tibetan": "Sino-tibetana",
          "Afro-Asiatic": "Afroasiatica",
          "Altaic": "Altaica",
          "Dravidian": "Dravidica",
          "Austronesian": "Austronesiana",
          "Uralic": "Uralica",
          "Caucasian": "Caucasica",
          "Niger-Kordofanian": "Niger-kordofaniana",
          "Creoles and pidgins": "Creole e pidgin",
          "Amerindian": "Amerindia",
          "Tai": "Tai",
          "Other": "Altre",
          "Albanian": "Albanese",
          "Algic": "Algica",
          "Armenian": "Armena",
          "Austro-Asiatic": "Austroasiatica",
          "Baltic": "Baltica",
          "Basque": "Basca",
          "Berber": "Berbera",
          "Celtic": "Celtica",
          "Chadic": "Ciadica",
          "Constructed": "Artificiale",
          "Creole (English)": "Creola (inglese)",
          "Creole (French)": "Creola (francese)",
          "Cushitic": "Cuscitica",
          "Eskimo-Aleut": "Eschimo-aleutina",
          "Germanic": "Germanica",
          "Greek": "Greca",
          "Indic": "Indiana",
          "Iranian": "Iranica",
          "Italic": "Italica",
          "Japanese": "Giapponese",
          "Korean": "Coreana",
          "Malayo-Polynesian": "Maleo-polinesiaca",
          "Mongolian": "Mongolica",
          "Na-Dene": "Na-Dene",
          "Nilo-Saharan": "Nilo-sahariana",
          "Quechuan": "Quechua",
          "Semitic": "Semitica",
          "Sinitic": "Sinitica",
          "Slavic": "Slava",
          "Tibeto-Burman": "Tibeto-birmana",
          "Tupi": "Tupi",
          "Turkic": "Turcica",
          "Uto-Aztecan": "Uto-azteca",
        },
      },
    },
    birthdayToast: ({name}) => `Oggi è il compleanno di ${name}`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank}) =>
      `${name} (${birthYear}–${deathYear}) è un/una ${occupation} ${demonym} al #${rank} posto mondiale nell'Indice di Popolarità Storica di Pantheon. Esplora biografia, visualizzazioni e metriche.`,
    learnMoreRankless: "Scopri di più sull'impatto accademico di {name} su Rankless",
    nav: {
      visualizations: "Visualizzazioni",
      rankings: "Classifiche",
      profiles: "Profili",
      people: "Persone",
      bornOnThisDay: "Nati Oggi",
      places: "Luoghi",
      countries: "Paesi",
      occupations: "Professioni",
      occupationCountry: "Professione / Paese",
      eras: "Epoche",
      deaths: "Decessi",
      about: "Chi Siamo",
      data: "Dati",
      permissions: "Permessi",
      download: "Scarica",
      api: "API",
      games: "Giochi",
      yearbook: "Annuario",
      birthle: "Birthle",
      trivia: "Curiosità",
      news: "Notizie",
      search: "Cerca",
      home: "Home",
      giveFeedback: "Lascia un Feedback",
      usageCitation: "Citazione d'Uso",
      newBadge: "nuovo!",
      explore: "Esplora",
      apps: "App",
      reportDataError: "Segnala Errore nei Dati",
      privacyPolicy: "Informativa sulla Privacy",
      termsOfService: "Termini di Servizio",
    },
    occupationCountry: {
      theMostFamous: "I Più Famosi",
      from: "di",
      greatest: "I Migliori",

      keepExploring: "Continua a esplorare",
      trendingThisWeek: "Di tendenza questa settimana",
      trendScoreLabel: "Punteggio trend",
      whyTrending: "Perché è di tendenza?",
      clicksThisWeek: "Clic questa settimana",
      impressionsThisWeek: "Impressioni questa settimana",
      readMore: "Leggi di più",
      showLess: "Mostra meno",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} persona${count === 1 ? "" : "e"} notevole${count === 1 ? "" : "i"}`,
      viewsLabel: "visualizzazioni",
      onDate: ({date}) => `il ${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Di tendenza ${occupationPlural} questa settimana`;
        return hasFromPrefix
          ? `Di tendenza ${occupationPlural} ${locationLabel} questa settimana`
          : `Di tendenza ${locationLabel} ${occupationPlural} questa settimana`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `I 10 ${occupationPlural} di tendenza su Wikipedia`;
        return hasFromPrefix
          ? `I 10 ${occupationPlural} ${locationLabel} di tendenza su Wikipedia`
          : `I 10 ${locationLabel} ${occupationPlural} di tendenza su Wikipedia`;
      },
      trendingIntroSuffix: "negli ultimi 7 giorni, con una breve nota sul motivo del picco.",
      trendingThisWeekShort: "Di tendenza questa settimana",
      trendingThisWeekDefault: "Di tendenza questa settimana su Wikipedia",
      metaTitle: ({demonym, occupationPlural}) => `I più grandi ${occupationPlural} ${demonym} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `Scopri i ${countFormatted} ${occupationPlural} ${demonym} più famosi della storia. Esplora i profili notevoli di ${occupationSingular} da ${country} classificati per importanza storica.`,
      birthDecadesTitle: "Persone per decennio di nascita",
      birthDecadesIntro: ({demonym, occupationPlural}) => `Esplora ${occupationPlural} ${demonym} notevoli raggruppati per decennio di nascita. Ogni decennio mostra i primi 10 per HPI; espandi per vedere tutti.`,
      decadeLabel: ({decade}) => `Anni ${decade}`,
      more: ({count}) => `+${count} altri`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `Pantheon include ${totalCount} persone classificate come ${occupationPlural} ${demonym} nate tra ${oldestYear} e ${youngestYear}.`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `Di queste ${totalCount}, nessuno è ancora in vita.`;
        return `Di queste ${totalCount}, ${aliveCountFormatted} (${aliveShare}) sono ancora in vita.`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `I ${occupationPlural} ${demonym} viventi più famosi includono `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `I ${occupationPlural} ${demonym} deceduti più famosi includono `,
      peopleNewAsOf: "aprile 2024",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `A ${asOfLabel}, ${countFormatted} nuovi ${occupationPlural} ${demonym} sono stati aggiunti a Pantheon, tra cui `,
      goToAllRankings: "Vai a tutte le classifiche",
      livingTitle: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym} viventi`,
      deceasedTitle: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym} deceduti`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `${occupationPlural} ${demonym} aggiunti di recente (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for Italian ordinals (use ° for masculine)
        const formatItalianOrdinal = (rankStr) => {
          // Extract number from rank string like "10th"
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          if (num === 1) return "primo";
          return `${num}°`;
        };

        let text = `Questa pagina contiene un elenco dei più grandi ${occupationPlural} ${demonym}. `;
        text += `Il dataset Pantheon contiene ${totalCount} ${occupationPlural}, ${countryCount} dei quali sono nati in ${country}. `;
        if (rank) {
          const italianRank = formatItalianOrdinal(rank);
          text += `Questo fa della ${country} il ${italianRank} luogo di nascita del maggior numero di ${occupationPlural}`;
          if (countriesBehind) {
            text += `, dopo ${countriesBehind}.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "e",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `Le seguenti persone sono considerate da Pantheon ${count === 10 ? "i 10" : ""} ${occupationPlural} ${demonym} più leggendari di tutti i tempi. Questo elenco di famosi ${occupationPlural} ${demonym} è ordinato per HPI (Indice di Popolarità Storica), una metrica che aggrega informazioni sulla popolarità online di una biografia.`,
      visitRankings: "Visita la pagina delle classifiche per visualizzare l'elenco completo di",
      top: "Top",
      withHpi: ({hpi, name}) => `Con un HPI di ${hpi}, ${name}`,
      isMostFamous: ({demonym, occupation}) => `è il ${occupation} ${demonym} più famoso.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `è il ${rank} ${occupation} ${demonym} più famoso.`,
      biographyTranslated: ({possessive, count}) => `${possessive} sua biografia è stata tradotta in ${count} lingue diverse`,
      onWikipedia: "su Wikipedia",
    },
    selectPerson: {
      heading: "Esplora Persone Notevoli",
      subtitle: "Scopri le persone più influenti della storia in ogni campo, paese ed epoca",
      metaDescription: "Esplora oltre 85.000 biografie di persone notevoli con presenza su Wikipedia in oltre 15 lingue.",
      searchPlaceholder: "Cerca persone, luoghi e professioni",
      randomPerson: "Persona Casuale",
      statPeople: "biografie",
      statLanguages: "edizioni linguistiche",
      description: "Pantheon traccia le biografie presenti in almeno 15 edizioni linguistiche di Wikipedia, classificate per occupazione e organizzate per paese e città di origine.",
      featuredPeople: "Persone Più Notevoli",
      trendingNow: "Di Tendenza Ora",
      browseByField: "Esplora per Campo",
      domainSports: "Sport",
      domainArts: "Arti e Intrattenimento",
      domainScience: "Scienza e Tecnologia",
      domainPolitics: "Politica e Leadership",
      exploreMore: "Esplora Altro",
      byOccupationCountry: "Per Professione e Paese",
      rankings: "Classifiche",
      byEra: "Per Epoca",
    },
    selectCountry: {
      heading: "Esplora i Paesi",
      subtitle: "Scopri le personalità più notevoli di ogni paese del mondo",
      metaDescription: "Esplora le personalità notevoli di ogni paese. Sfoglia le biografie per paese di nascita, consulta mappe interattive e scopri figure storiche da tutto il mondo.",
      totalCountries: "paesi",
      totalPeople: "persone notevoli",
      mapTitle: "Persone Notevoli per Paese",
      countryList: "Tutti i Paesi",
      sortAlpha: "A–Z",
      sortPeople: "Più Persone",
      people: "persone",
      noPeopleData: "Nessun dato disponibile",
      exploreMore: "Esplora Altro",
      byPerson: "Persone Notevoli",
      byOccupation: "Per Professione e Paese",
      rankings: "Classifiche",
    },
    selectPlace: {
      heading: "Esplora i Luoghi",
      subtitle: "Scopri le città che hanno dato i natali alle personalità più notevoli della storia",
      metaDescription: "Esplora i luoghi di nascita delle personalità notevoli di tutto il mondo. Sfoglia le città per numero di nascite notevoli e scopri i centri storici.",
      totalPlaces: "luoghi",
      totalPeople: "persone notevoli",
      mapTitle: "Luoghi di Nascita delle Persone Notevoli",
      placeList: "Luoghi Principali",
      sortAlpha: "A–Z",
      sortPeople: "Più Persone",
      groupByCountry: "Per Paese",
      people: "persone",
      exploreMore: "Esplora Altro",
      byPerson: "Persone Notevoli",
      byCountry: "Per Paese",
      rankings: "Classifiche",
    },
    selectOccupation: {
      heading: "Esplora le Professioni",
      subtitle: "Scopri i campi e le professioni che hanno dato forma alle personalità più notevoli della storia",
      metaDescription: "Esplora 101 professioni delle personalità più notevoli della storia. Sfoglia per professione e scopri il numero di personalità in ogni campo.",
      totalOccupations: "professioni",
      totalPeople: "persone notevoli",
      occupationList: "Tutte le Professioni",
      sortAlpha: "A–Z",
      sortPeople: "Più Persone",
      people: "persone",
      exploreMore: "Esplora Altro",
      byPerson: "Persone Notevoli",
      byCountry: "Per Paese",
      rankings: "Classifiche",
    },
    selectOccupationCountry: {
      heading: "Seleziona una professione e un paese",
      pleaseSelect: "Seleziona una combinazione di professione e paese per vedere le biografie più memorabili",
      selectOccupation: "Seleziona una professione",
      selectCountry: "Seleziona un paese",
      goToProfile: "Vai al profilo",
      whoAreTheMostFamous: "Chi sono i più famosi...",
      trendingThisWeek: "Tendenze Questa Settimana",
      browseByCountry: "Esplora per paese",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
      }) => {
        // Helper function for Italian ordinals (use ° for masculine, ª for feminine)
        const italianOrdinal = (num, isFeminine = false) => {
          if (num === 1) return isFeminine ? "prima" : "primo";
          return `${num}${isFeminine ? 'ª' : '°'}`;
        };

        // Helper function to get correct article + preposition for country
        const getCountryPreposition = (countryName) => {
          // Check if country starts with vowel
          const firstChar = countryName.charAt(0).toUpperCase();
          if (['A', 'E', 'I', 'O', 'U'].includes(firstChar)) {
            return "dell'";
          }
          // Default to della for most countries (feminine in Italian)
          return "della ";
        };

        let sentence = `La sua biografia è disponibile in ${l} lingue su Wikipedia`;
        if (l_prev && l !== l_prev) {
          sentence += ` (${l > l_prev ? "in aumento rispetto a" : "in calo rispetto a"} ${l_prev} nel 2024)`;
        }
        sentence += ". ";

        const article = gender === "F" ? "la" : "il";

        // First clause: occupation ranking
        if (occupationRank === 1) {
          sentence += `${name} è ${article} <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a> più ${gender === "F" ? "popolare" : "popolare"}`;
        } else {
          const rankStr = italianOrdinal(occupationRank, gender === "F");
          sentence += `${name} è ${article} ${rankStr} <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a> più ${gender === "F" ? "popolare" : "popolare"}`;
        }
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          const prevRankStr = italianOrdinal(occupationRankPrev, gender === "F");
          sentence += ` (${occupationRank < occupationRankPrev ? "in aumento dal" : "in calo dal"} ${prevRankStr} nel 2024)`;
        }

        if (country) {
          const countryPrep = getCountryPreposition(country);

          // Second clause: country biography ranking - "biografia" is feminine
          if (bplaceCountryRank === 1) {
            sentence += `, la biografia più popolare <a href="/profile/place/${countrySlug}">${countryPrep}${country}</a>`;
          } else {
            const rankStr = italianOrdinal(bplaceCountryRank, true);
            sentence += `, la ${rankStr} biografia più popolare <a href="/profile/place/${countrySlug}">${countryPrep}${country}</a>`;
          }
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            const prevRankStr = italianOrdinal(bplaceCountryRankPrev, true);
            sentence += ` (${bplaceCountryRank < bplaceCountryRankPrev ? "in aumento dal" : "in calo dal"} ${prevRankStr} nel 2019)`;
          }

          // Third clause: occupation + country ranking - correct word order
          if (bplaceCountryOccupationRank) {
            if (bplaceCountryOccupationRank === 1) {
              sentence += ` e ${article} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} più ${gender === "F" ? "popolare" : "popolare"} ${countryPrep}${country}</a>`;
            } else {
              const rankStr = italianOrdinal(bplaceCountryOccupationRank, gender === "F");
              sentence += ` e ${article} ${rankStr} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} più ${gender === "F" ? "popolare" : "popolare"} ${countryPrep}${country}</a>`;
            }
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "Visualizzazioni",
      rankings: "Classifiche",
      profiles: "Profili",
      people: "Persone",
      bornOnThisDay: "Nati Oggi",
      places: "Luoghi",
      countries: "Paesi",
      occupations: "Professioni",
      occupationCountry: "Professione / Paese",
      eras: "Ere",
      deaths: "Decessi",
      about: "Informazioni",
      data: "Dati",
      permissions: "Permessi",
      download: "Scarica",
      api: "API",
      games: "Giochi",
      yearbook: "Annuario",
      birthle: "Birthle",
      trivia: "Trivia",
      news: "Notizie",
      search: "Cerca",
      home: "Home",
      giveFeedback: "Lascia un feedback",
      usageCitation: "Citazione d'uso",
      newBadge: "nuovo!",
    },
    readMoreWikipedia: "Leggi di più su Wikipedia",
    home: {
      tagline: "Esplora la memoria collettiva umana!",
      subtitle:
        "Pantheon ti aiuta a scoprire la geografia e le dinamiche della storia del nostro pianeta.",
      explore: "Esplora",
      people: "Persone",
      places: "Luoghi",
      occupations: "Professioni",
      and: "e",
      eras: "Ere",
      trendingProfiles: "Profili di Tendenza Oggi",
      topProfilesBy: "Profili principali per visualizzazioni di pagina per l'",
      wikipediaEdition: "edizione di wikipedia",
      about:
        "è un osservatorio della memoria collettiva focalizzato su biografie con presenza in almeno",
      languages: "lingue",
      aboutContinued:
        "su Wikipedia. Abbiamo dati su oltre 85.000 biografie, organizzate per paesi, città, professioni ed ere. Esplora questi dati per conoscere i personaggi che plasmano la cultura umana.",
      aboutDeveloped:
        "è iniziato come progetto del gruppo Collective Learning al MIT. Oggi è sviluppato da",
      datawheel: "Datawheel",
      aboutDatawheel:
        ", un'azienda specializzata nella creazione di soluzioni di distribuzione e visualizzazione dati.",
      recentPassings: "Scomparse Recenti",
      notableDeaths: "Morti Notevoli del 2025",
      notableDeathsText:
        "Vuoi vedere l'elenco completo delle figure notevoli che abbiamo perso nel 2025? Visita la nostra",
      notableDeathsLink: "Morti Notevoli del 2025",
      notableDeathsContinued:
        "pagina per una raccolta completa di biografie di personalità influenti, tra cui celebrità, artisti, leader e icone culturali scomparse quest'anno.",
      trendingSingers: "Cantanti di Tendenza Oggi",
      trendingActors: "Attori di Tendenza Oggi",
      recentlyAdded: "Aggiunti di Recente a Pantheon",
      searchPlaceholder: "Cerca persone, luoghi e professioni",
      isTrending: "è di tendenza oggi",
      readFullStory: "Leggi la storia completa",
      turningXToday: ({age}) => `Compie ${age} anni oggi!`,
      wouldHaveBeenX: ({age}) => `Avrebbe ${age} anni oggi`,
      seeAllBirthdays: "Vedi tutti i compleanni",
      bornTodayTitle: "Personaggi Famosi Nati Oggi",
    },
    recentlyAdded: {
      title: "Aggiunti di Recente a Pantheon",
      subtitle: "Scopri le biografie aggiunte più di recente alla collezione di Pantheon, ordinate per data di inserimento.",
      addedOn: ({date}) => `Aggiunto il ${date}`,
      previous: "Precedente",
      next: "Successivo",
      pageLabel: ({page}) => `Pagina ${page}`,
      viewMore: "Vedi altre persone aggiunte di recente",
      empty: "Nessuna persona aggiunta di recente trovata.",
    },
    news: {
      pageTitle: "Chi è di tendenza oggi?",
      pageSubtitle:
        "Riassunti quotidiani di personaggi storici (generato da IA)",
      trendingIn: "Di tendenza in",
      selectDate: "Seleziona una data diversa",
      references: "Riferimenti:",
      noData: "Nessun dato di tendenza disponibile per questa data.",
      previousDay: "Giorno Precedente",
      nextDay: "Giorno Successivo",
      unknown: "Sconosciuto",
    },
    trending: {
      isTrendingToday: "{name} è di tendenza oggi!",
      whyTrending: "Perché {name} è di tendenza:",
      references: "Fonti:",
      viewMoreTrending: "Vedi altre persone di tendenza",
    },
    bornOnThisDay: {
      famousBirthdays: "Compleanni Famosi",
      bornOnThisDay: "Nati Oggi",
      famousPeopleBornOnThisDay: ({count}) => `${count} ${count === 1 ? "persona famosa nata" : "persone famose nate"} oggi`,
      birthdayOf: ({displayDate, count}) => `Il ${displayDate} è il compleanno di ${count} celebrità e ${count === 1 ? "persona storicamente significativa" : "persone storicamente significative"} nel database di Pantheon.`,
      mostFamousInclude: "I più famosi includono",
      mostCommonOccupations: "Le professioni più comuni per le persone nate in questo giorno sono",
      exploreAnotherDate: "Esplora un'Altra Data",
      go: "Vai",
      today: "Oggi",
      previousDay: "Giorno Precedente",
      nextDay: "Giorno Successivo",
      famousPeopleBornOn: ({displayDate}) => `Persone Famose Nate il ${displayDate}`,
      discoverRemarkable: ({displayDate}) => `Scopri le personalità straordinarie che condividono il ${displayDate} come loro compleanno. Dai leader mondiali e scienziati rivoluzionari agli amati intrattenitori e atleti leggendari, questo giorno ha visto la nascita di molte figure influenti nel corso della storia.`,
      someNotableInclude: "Tra i più notabili ci sono",
      stillLivingToday: ({total, living}) => `Delle ${total} persone famose nate in questa data, ${living} sono ancora in vita oggi.`,
      viewFullRankings: "Vedi la Classifica Completa per Questo Giorno",
      born: "Nato/a",
      birthdaysByOccupation: "Compleanni per Professione",
      occupationIntro: ({displayDate}) => `Scopri come le persone famose nate il ${displayDate} sono distribuite tra diversi campi e professioni. Clicca su qualsiasi persona per saperne di più sulla sua vita e i suoi successi.`,
      showLess: "Mostra meno",
      more: ({count}) => `+${count} altri`,
      formatDate: ({month, day}) => {
        const months = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
        return `${day} ${months[month - 1]}`;
      },
      metaTitle: ({displayDate}) => `Compleanni Famosi il ${displayDate} | Chi È Nato Oggi? | Pantheon`,
      metaDescription: ({displayDate}) => `Scopri le persone più famose nate il ${displayDate} nella storia. Esplora i profili di celebrità, figure storiche, scienziati, artisti, atleti e altri che condividono questo compleanno.`,
      months: {
        january: "Gennaio",
        february: "Febbraio",
        march: "Marzo",
        april: "Aprile",
        may: "Maggio",
        june: "Giugno",
        july: "Luglio",
        august: "Agosto",
        september: "Settembre",
        october: "Ottobre",
        november: "Novembre",
        december: "Dicembre",
      },
    },
  },
  pt: {
    stillAlive: "presente",
    person: {
      loading: "Carregando...",
      metaTitle: ({name}) => `Biografia de ${name} | Pantheon`,
      sections: {
        trending: "Em alta",
        memorabilityMetrics: "Métricas de memorabilidade",
        trendingActivity: "Atividade de tendências",
        notableWorks: "Obras notáveis",
        pageViewsByLang: ({name}) => `Visualizações da página de ${name} por idioma`,
        amongOccupation: ({occupationPlural}) => `Entre ${occupationPlural}`,
        contemporaries: "Contemporâneos",
        inCountry: ({country}) => `Em ${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `Entre ${occupationPlural} em ${country}`,
        filmography: "Filmografia",
        tvMovieRoles: "Papéis na TV e no cinema",
        insights: "Destaques dos dados",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} ocupa o primeiro lugar entre todos os ${totalFormatted} ${occupationPlural} do Pantheon no mundo.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} ocupa a posição nº ${rank} entre ${totalFormatted} ${occupationPlural} no mundo — entre os ${topPercent}% melhores da profissão.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} é a personalidade mais bem classificada entre as ${totalFormatted} pessoas do Pantheon nascidas em ${country}.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `Dos ${count} ${occupationPlural} nascidos em ${country}, ${name} ocupa o primeiro lugar.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} é a personalidade mais memorável entre as ${count} pessoas notáveis nascidas em ${city}, ${country}${peers ? `, à frente de ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} é a personalidade mais memorável entre as ${count} pessoas notáveis nascidas em ${city}, no que hoje é ${country}${peers ? `, à frente de ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `Das ${count} pessoas do Pantheon nascidas em ${year}, ${name} é a mais memorável.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `A biografia de ${name} aparece em ${count} edições de idiomas da Wikipédia — mais do que ${percent}% de todos os ${occupationPlural}.`,
        newLangs: ({name, count}) =>
          `A biografia de ${name} foi adicionada a ${count} novas edições de idiomas da Wikipédia no último ano.`,
        nonEnglish: ({name, count}) =>
          `A biografia de ${name} recebeu ${count} visualizações em edições da Wikipédia em idiomas diferentes do inglês no último ano — uma fama que vai muito além do mundo anglófono.`,
        enduringFame: ({name, centuries, rank}) =>
          `Mais de ${centuries} séculos após a morte, ${name} ainda ocupa a posição nº ${rank} entre todas as personalidades do Pantheon.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `Com ${views} visualizações na Wikipédia no último ano, ${name} foi quem mais visualizações recebeu entre os ${occupationPlural}.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `A página de ${name} na Wikipédia recebeu ${views} visualizações no último ano — ${multiple} vezes a média dos ${occupationPlural}.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `${name} é uma das apenas ${womenCount} mulheres entre os ${totalFormatted} ${occupationPlural} do Pantheon.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `Apesar de ter vivido apenas ${age} anos, ${name} ocupa a posição nº ${rank} entre todos os ${occupationPlural} da história.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} está entre os ${count} ${occupationPlural} de nascimento mais antigo em todo o Pantheon.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} faz aniversário no mesmo dia (${date}) que ${twinNames}.`,
        fallback: ({name, count, hpi}) =>
          `A biografia de ${name} abrange ${count} edições de idiomas da Wikipédia e alcança um Índice de Popularidade Histórica de ${hpi}.`,
      },
      metrics: {
        pageViews: "Visualizações",
        past12Months: "Últimos 12 meses",
        hpi: "HPI",
        hpiDesc: "Índice de Popularidade Histórica",
        avgOf: ({label}) => `Média ${label}`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `Entre ${occupationPlural}, ${name} ocupa a posição ${rankHtml} de ${totalFormatted}.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `Entre as pessoas nascidas em ${year}, ${name} ocupa a posição ${rankHtml}.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `Entre as pessoas falecidas em ${year}, ${name} ocupa a posição ${rankHtml}.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `Entre as pessoas nascidas em ${countryHtml}, ${name} ocupa a posição ${rankHtml} de ${totalFormatted}.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `Entre ${occupationPlural} nascidos em ${countryHtml}, ${name} ocupa a posição ${rankHtml}.`,
        beforePeers: ({gender, count}) =>
          `Antes ${gender === "M" ? "dele" : gender === "F" ? "dela" : "deles"} ${count === 1 ? "vem" : "vêm"} `,
        afterPeers: ({gender, count}) =>
          `Depois ${gender === "M" ? "dele" : gender === "F" ? "dela" : "deles"} ${count === 1 ? "vem" : "vêm"} `,
        notRankedIn: ({name, countryHtml}) => `${name} não está classificado em ${countryHtml}`,
        mostPopularInWikipedia: ({occupationPlural}) => `${occupationPlural} mais populares na Wikipédia`,
        othersBornInYear: ({year}) => `Outras pessoas nascidas em ${year}`,
        othersDeceasedInYear: ({year}) => `Outras pessoas falecidas em ${year}`,
        othersBornInCountry: ({countryHtml}) => `Outras pessoas nascidas em ${countryHtml}`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym}`,
        goToAllRankings: "Ver todas as classificações",
        and: " e ",
      },
      carousel: {
        present: "presente",
        hpiLabel: "HPI:",
        rankLabel: "Posição:",
      },
      footer: {
        relatedProfiles: "Perfis relacionados",
        individuals: ({countFormatted}) => `${countFormatted} pessoas`,
        rank: ({rankFormatted}) => `Posição ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `VISUALIZAÇÕES EM ${langCode}.WIKIPEDIA (PV)`,
        rankInLanguage: ({rank, language}) => `Posição nº ${rank} em ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `${count} dia${count === 1 ? "" : "s"} em alta`,
        less: "Menos",
        more: "Mais",
        clickForDetails: "Clique para ver detalhes",
        notTrending: "Fora das tendências",
        rankNum: ({rank}) => `Posição nº ${rank}`,
        viewAllTrendingNews: ({date}) => `Ver todas as notícias em alta de ${date}`,
      },
      pageViewsByLangChart: {
        languageEditions: "Edições em idiomas",
        pageviewsByLanguageEdition: "Visualizações por edição de idioma",
        cumulativeLanguageEditions: "Edições de idiomas acumuladas",
        editionsWord: "edições",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} visualizações`,
        andOthers: ({count}) => `(e mais ${count})`,
        summaryIntro: ({name}) => `No último ano, ${name} teve o maior número de visualizações na `,
        wikipediaEdition: ({language}) => `edição da Wikipédia em ${language}`,
        withViewsFollowedBy: ({viewsFormatted}) => ` com ${viewsFormatted} visualizações, seguida de `,
        growthIntro: ". Em termos de crescimento anual de visualizações, as 3 principais edições da Wikipédia são ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) é uma língua ${familyName} da família ${primaryFamilyName}.`,
        families: {
          "Indo-European": "Indo-europeia",
          "Sino-Tibetan": "Sino-tibetana",
          "Afro-Asiatic": "Afro-asiática",
          "Altaic": "Altaica",
          "Dravidian": "Dravídica",
          "Austronesian": "Austronésia",
          "Uralic": "Urálica",
          "Caucasian": "Caucasiana",
          "Niger-Kordofanian": "Nígero-cordofaniana",
          "Creoles and pidgins": "Crioulas e pidgins",
          "Amerindian": "Ameríndia",
          "Tai": "Tai",
          "Other": "Outras",
          "Albanian": "Albanesa",
          "Algic": "Álgica",
          "Armenian": "Armênia",
          "Austro-Asiatic": "Austro-asiática",
          "Baltic": "Báltica",
          "Basque": "Basca",
          "Berber": "Berbere",
          "Celtic": "Celta",
          "Chadic": "Chádica",
          "Constructed": "Construída",
          "Creole (English)": "Crioula (inglês)",
          "Creole (French)": "Crioula (francês)",
          "Cushitic": "Cuxítica",
          "Eskimo-Aleut": "Esquimó-aleúte",
          "Germanic": "Germânica",
          "Greek": "Grega",
          "Indic": "Índica",
          "Iranian": "Irânica",
          "Italic": "Itálica",
          "Japanese": "Japonesa",
          "Korean": "Coreana",
          "Malayo-Polynesian": "Malaio-polinésia",
          "Mongolian": "Mongólica",
          "Na-Dene": "Na-dené",
          "Nilo-Saharan": "Nilo-saariana",
          "Quechuan": "Quíchua",
          "Semitic": "Semítica",
          "Sinitic": "Sinítica",
          "Slavic": "Eslava",
          "Tibeto-Burman": "Tibeto-birmanesa",
          "Tupi": "Tupi",
          "Turkic": "Túrquica",
          "Uto-Aztecan": "Uto-asteca",
        },
      },
    },
    birthdayToast: ({name}) => `Hoje é o aniversário de ${name}`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank}) =>
      `${name} (${birthYear}–${deathYear}) é um(a) ${occupation} ${demonym} classificado(a) em #${rank} no mundo pelo Índice de Popularidade Histórica do Pantheon. Explore biografia, visualizações e métricas.`,
    learnMoreRankless: "Saiba mais sobre o impacto acadêmico de {name} no Rankless",
    nav: {
      visualizations: "Visualizações",
      rankings: "Classificações",
      profiles: "Perfis",
      people: "Pessoas",
      bornOnThisDay: "Nascidos Neste Dia",
      places: "Lugares",
      countries: "Países",
      occupations: "Profissões",
      occupationCountry: "Profissão / País",
      eras: "Eras",
      deaths: "Mortes",
      about: "Sobre",
      data: "Dados",
      permissions: "Permissões",
      download: "Baixar",
      api: "API",
      games: "Jogos",
      yearbook: "Anuário",
      birthle: "Birthle",
      trivia: "Curiosidades",
      news: "Notícias",
      search: "Pesquisar",
      home: "Início",
      giveFeedback: "Dar Feedback",
      usageCitation: "Citação de Uso",
      newBadge: "novo!",
      explore: "Explorar",
      apps: "Aplicativos",
      reportDataError: "Relatar Erro de Dados",
      privacyPolicy: "Política de Privacidade",
      termsOfService: "Termos de Serviço",
    },
    occupationCountry: {
      theMostFamous: "Os Mais Famosos",
      from: "de",
      greatest: "Os Melhores",

      keepExploring: "Continuar explorando",
      trendingThisWeek: "Em alta esta semana",
      trendScoreLabel: "Pontuação de tendência",
      whyTrending: "Por que está em alta?",
      clicksThisWeek: "Cliques esta semana",
      impressionsThisWeek: "Impressões esta semana",
      readMore: "Leia mais",
      showLess: "Mostrar menos",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} pessoa${count === 1 ? "" : "s"} notável${count === 1 ? "" : "eis"}`,
      viewsLabel: "visualizações",
      onDate: ({date}) => `em ${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Em alta ${occupationPlural} esta semana`;
        return hasFromPrefix
          ? `Em alta ${occupationPlural} ${locationLabel} esta semana`
          : `Em alta ${locationLabel} ${occupationPlural} esta semana`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Os 10 ${occupationPlural} em alta na Wikipédia`;
        return hasFromPrefix
          ? `Os 10 ${occupationPlural} ${locationLabel} em alta na Wikipédia`
          : `Os 10 ${locationLabel} ${occupationPlural} em alta na Wikipédia`;
      },
      trendingIntroSuffix: "nos últimos 7 dias, com uma breve nota sobre o motivo do pico.",
      trendingThisWeekShort: "Em alta esta semana",
      trendingThisWeekDefault: "Em alta esta semana na Wikipédia",
      metaTitle: ({demonym, occupationPlural}) => `Os melhores ${occupationPlural} ${demonym} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `Descubra os ${countFormatted} ${occupationPlural} ${demonym} mais famosos da história. Explore perfis notáveis de ${occupationSingular} de ${country} classificados por relevância histórica.`,
      birthDecadesTitle: "Pessoas por década de nascimento",
      birthDecadesIntro: ({demonym, occupationPlural}) => `Explore ${occupationPlural} ${demonym} notáveis agrupados por década de nascimento. Cada década mostra os 10 principais por HPI; expanda para ver todos.`,
      decadeLabel: ({decade}) => `Anos ${decade}`,
      more: ({count}) => `+${count} a mais`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `Pantheon tem ${totalCount} pessoas classificadas como ${occupationPlural} ${demonym} nascidas entre ${oldestYear} e ${youngestYear}.`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `Dessas ${totalCount}, nenhuma ainda está viva.`;
        return `Dessas ${totalCount}, ${aliveCountFormatted} (${aliveShare}) ainda estão vivas.`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `Os ${occupationPlural} ${demonym} vivos mais famosos incluem `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `Os ${occupationPlural} ${demonym} falecidos mais famosos incluem `,
      peopleNewAsOf: "abril de 2024",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `Em ${asOfLabel}, ${countFormatted} novos ${occupationPlural} ${demonym} foram adicionados ao Pantheon, incluindo `,
      goToAllRankings: "Ver todos os rankings",
      livingTitle: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym} vivos`,
      deceasedTitle: ({demonym, occupationPlural}) => `${occupationPlural} ${demonym} falecidos`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `${occupationPlural} ${demonym} recém-adicionados (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for Portuguese ordinals (use º for masculine)
        const formatPortugueseOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          if (num === 1) return "1º";
          return `${num}º`;
        };

        let text = `Esta página contém uma lista dos maiores ${occupationPlural} ${demonym}. `;
        text += `O conjunto de dados Pantheon contém ${totalCount} ${occupationPlural}, ${countryCount} dos quais nasceram em ${country}. `;
        if (rank) {
          const portugueseRank = formatPortugueseOrdinal(rank);
          text += `Isso faz de ${country} o ${portugueseRank} lugar de nascimento do maior número de ${occupationPlural}`;
          if (countriesBehind) {
            text += `, depois de ${countriesBehind}.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "e",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `As seguintes pessoas são consideradas pela Pantheon como ${count === 10 ? "os 10" : ""} ${occupationPlural} ${demonym} mais lendários de todos os tempos. Esta lista de ${occupationPlural} ${demonym} famosos está ordenada por HPI (Índice de Popularidade Histórica), uma métrica que agrega informações sobre a popularidade online de uma biografia.`,
      visitRankings: "Visite a página de classificações para ver a lista completa de",
      top: "Top",
      withHpi: ({hpi, name}) => `Com um HPI de ${hpi}, ${name}`,
      isMostFamous: ({demonym, occupation}) => `é o ${occupation} ${demonym} mais famoso.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `é o ${rank} ${occupation} ${demonym} mais famoso.`,
      biographyTranslated: ({possessive, count}) => `${possessive} biografia foi traduzida para ${count} idiomas diferentes`,
      onWikipedia: "na Wikipédia",
    },
    selectPerson: {
      heading: "Explorar Pessoas Notáveis",
      subtitle: "Descubra as pessoas mais influentes da história em cada campo, país e época",
      metaDescription: "Explore mais de 85.000 biografias de pessoas notáveis com presença na Wikipédia em mais de 15 idiomas.",
      searchPlaceholder: "Pesquisar pessoas, lugares e ocupações",
      randomPerson: "Pessoa Aleatória",
      statPeople: "biografias",
      statLanguages: "edições linguísticas",
      description: "O Pantheon rastreia biografias com presença em pelo menos 15 edições linguísticas da Wikipédia, classificadas por ocupação e organizadas por país e cidade de origem.",
      featuredPeople: "Pessoas Mais Notáveis",
      trendingNow: "Em Alta Agora",
      browseByField: "Explorar por Campo",
      domainSports: "Esportes",
      domainArts: "Artes e Entretenimento",
      domainScience: "Ciência e Tecnologia",
      domainPolitics: "Política e Liderança",
      exploreMore: "Explorar Mais",
      byOccupationCountry: "Por Profissão e País",
      rankings: "Classificações",
      byEra: "Por Época",
    },
    selectCountry: {
      heading: "Explorar Países",
      subtitle: "Descubra as personalidades mais notáveis de cada país do mundo",
      metaDescription: "Explore personalidades notáveis de cada país. Navegue biografias por país de nascimento, veja mapas interativos e descubra figuras históricas de todo o mundo.",
      totalCountries: "países",
      totalPeople: "pessoas notáveis",
      mapTitle: "Pessoas Notáveis por País",
      countryList: "Todos os Países",
      sortAlpha: "A–Z",
      sortPeople: "Mais Pessoas",
      people: "pessoas",
      noPeopleData: "Sem dados disponíveis",
      exploreMore: "Explorar Mais",
      byPerson: "Pessoas Notáveis",
      byOccupation: "Por Profissão e País",
      rankings: "Rankings",
    },
    selectPlace: {
      heading: "Explorar Lugares",
      subtitle: "Descubra as cidades que moldaram as personalidades mais notáveis da história",
      metaDescription: "Explore os locais de nascimento de personalidades notáveis em todo o mundo. Navegue cidades por número de nascimentos notáveis e descubra centros históricos.",
      totalPlaces: "lugares",
      totalPeople: "pessoas notáveis",
      mapTitle: "Locais de Nascimento de Pessoas Notáveis",
      placeList: "Principais Lugares",
      sortAlpha: "A–Z",
      sortPeople: "Mais Pessoas",
      groupByCountry: "Por País",
      people: "pessoas",
      exploreMore: "Explorar Mais",
      byPerson: "Pessoas Notáveis",
      byCountry: "Por País",
      rankings: "Rankings",
    },
    selectOccupation: {
      heading: "Explorar Profissões",
      subtitle: "Descubra os campos e profissões que moldaram as personalidades mais notáveis da história",
      metaDescription: "Explore 101 profissões das personalidades mais notáveis da história. Navegue por profissão e descubra o número de personalidades em cada campo.",
      totalOccupations: "profissões",
      totalPeople: "pessoas notáveis",
      occupationList: "Todas as Profissões",
      sortAlpha: "A–Z",
      sortPeople: "Mais Pessoas",
      people: "pessoas",
      exploreMore: "Explorar Mais",
      byPerson: "Pessoas Notáveis",
      byCountry: "Por País",
      rankings: "Rankings",
    },
    selectOccupationCountry: {
      heading: "Selecione uma profissão e um país",
      pleaseSelect: "Selecione uma combinação de profissão e país para ver as biografias mais memoráveis",
      selectOccupation: "Selecione uma profissão",
      selectCountry: "Selecione um país",
      goToProfile: "Ir para o perfil",
      whoAreTheMostFamous: "Quem são os mais famosos...",
      trendingThisWeek: "Tendências Esta Semana",
      browseByCountry: "Explorar por país",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        fromCountry,
        formatOrdinal,
      }) => {
        // Helper function for Portuguese ordinals (use º for masculine, ª for feminine)
        const portugueseOrdinal = (num, isFeminine = false) => {
          if (num === 1) return isFeminine ? "1ª" : "1º";
          return `${num}${isFeminine ? 'ª' : 'º'}`;
        };

        let sentence = `Sua biografia está disponível em ${l} idiomas na Wikipédia`;
        if (l_prev && l !== l_prev) {
          sentence += ` (${l > l_prev ? "aumento em relação a" : "redução em relação a"} ${l_prev} em 2024)`;
        }
        sentence += ". ";

        const article = gender === "F" ? "a" : "o";

        // First clause: occupation ranking
        if (occupationRank === 1) {
          sentence += `${name} é ${article} <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a> mais ${gender === "F" ? "popular" : "popular"}`;
        } else {
          const rankStr = portugueseOrdinal(occupationRank, gender === "F");
          sentence += `${name} é ${article} ${rankStr} <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a> mais ${gender === "F" ? "popular" : "popular"}`;
        }
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          const prevRankStr = portugueseOrdinal(occupationRankPrev, gender === "F");
          sentence += ` (${occupationRank < occupationRankPrev ? "subiu do" : "caiu do"} ${prevRankStr} em 2024)`;
        }

        if (country) {
          // Use from_country from database (e.g., "da Grécia") instead of guessing
          const countryPrep = fromCountry || `de ${country}`;

          // Second clause: country biography ranking - "biografia" is feminine
          if (bplaceCountryRank === 1) {
            sentence += `, a biografia mais popular <a href="/profile/place/${countrySlug}">${countryPrep}</a>`;
          } else {
            const rankStr = portugueseOrdinal(bplaceCountryRank, true);
            sentence += `, a ${rankStr} biografia mais popular <a href="/profile/place/${countrySlug}">${countryPrep}</a>`;
          }
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            const prevRankStr = portugueseOrdinal(bplaceCountryRankPrev, true);
            sentence += ` (${bplaceCountryRank < bplaceCountryRankPrev ? "subiu do" : "caiu do"} ${prevRankStr} em 2019)`;
          }

          // Third clause: occupation + country ranking - correct word order
          if (bplaceCountryOccupationRank) {
            if (bplaceCountryOccupationRank === 1) {
              sentence += ` e ${article} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} mais ${gender === "F" ? "popular" : "popular"} ${countryPrep}</a>`;
            } else {
              const rankStr = portugueseOrdinal(bplaceCountryOccupationRank, gender === "F");
              sentence += ` e ${article} ${rankStr} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} mais ${gender === "F" ? "popular" : "popular"} ${countryPrep}</a>`;
            }
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "Visualizações",
      rankings: "Classificações",
      profiles: "Perfis",
      people: "Pessoas",
      bornOnThisDay: "Nascidos Neste Dia",
      places: "Lugares",
      countries: "Países",
      occupations: "Profissões",
      occupationCountry: "Profissão / País",
      eras: "Eras",
      deaths: "Falecimentos",
      about: "Sobre",
      data: "Dados",
      permissions: "Permissões",
      download: "Baixar",
      api: "API",
      games: "Jogos",
      yearbook: "Anuário",
      birthle: "Birthle",
      trivia: "Trivia",
      news: "Notícias",
      search: "Pesquisar",
      home: "Início",
      giveFeedback: "Enviar feedback",
      usageCitation: "Citação de uso",
      newBadge: "novo!",
    },
    readMoreWikipedia: "Leia mais na Wikipédia",
    home: {
      tagline: "Explore a memória coletiva humana!",
      subtitle:
        "Pantheon ajuda você a descobrir a geografia e a dinâmica da história do nosso planeta.",
      explore: "Explorar",
      people: "Pessoas",
      places: "Lugares",
      occupations: "Ocupações",
      and: "e",
      eras: "Eras",
      trendingProfiles: "Perfis em Alta Hoje",
      topProfilesBy: "Principais perfis por visualizações de página para a",
      wikipediaEdition: "edição da wikipédia",
      about:
        "é um observatório da memória coletiva focado em biografias com presença em pelo menos",
      languages: "idiomas",
      aboutContinued:
        "na Wikipédia. Temos dados sobre mais de 85.000 biografias, organizadas por países, cidades, ocupações e eras. Explore esses dados para conhecer os personagens que moldam a cultura humana.",
      aboutDeveloped:
        "começou como um projeto no grupo Collective Learning do MIT. Hoje é desenvolvido pela",
      datawheel: "Datawheel",
      aboutDatawheel:
        ", uma empresa especializada na criação de soluções de distribuição e visualização de dados.",
      recentPassings: "Falecimentos Recentes",
      notableDeaths: "Mortes Notáveis de 2025",
      notableDeathsText:
        "Quer ver a lista completa de figuras notáveis que perdemos em 2025? Visite nossa",
      notableDeathsLink: "Mortes Notáveis de 2025",
      notableDeathsContinued:
        "página para uma coleção abrangente de biografias de personalidades influentes, incluindo celebridades, artistas, líderes e ícones culturais que faleceram este ano.",
      trendingSingers: "Cantores em Alta Hoje",
      trendingActors: "Atores em Alta Hoje",
      recentlyAdded: "Adicionados Recentemente ao Pantheon",
      searchPlaceholder: "Pesquisar pessoas, lugares e profissões",
      isTrending: "está em alta hoje",
      readFullStory: "Ler história completa",
      turningXToday: ({age}) => `Completa ${age} anos hoje!`,
      wouldHaveBeenX: ({age}) => `Faria ${age} anos hoje`,
      seeAllBirthdays: "Ver todos os aniversários",
      bornTodayTitle: "Pessoas Famosas Nascidas Hoje",
    },
    recentlyAdded: {
      title: "Adicionados Recentemente ao Pantheon",
      subtitle: "Descubra as biografias adicionadas mais recentemente à coleção do Pantheon, ordenadas pela data de inclusão.",
      addedOn: ({date}) => `Adicionado em ${date}`,
      previous: "Anterior",
      next: "Próxima",
      pageLabel: ({page}) => `Página ${page}`,
      viewMore: "Ver mais pessoas adicionadas recentemente",
      empty: "Nenhuma pessoa adicionada recentemente foi encontrada.",
    },
    news: {
      pageTitle: "Quem está em alta hoje?",
      pageSubtitle: "Resumos diários de figuras históricas (gerado por IA)",
      trendingIn: "Em alta em",
      selectDate: "Selecione uma data diferente",
      references: "Referências:",
      noData: "Nenhum dado de tendência disponível para esta data.",
      previousDay: "Dia Anterior",
      nextDay: "Dia Seguinte",
      unknown: "Desconhecido",
    },
    trending: {
      isTrendingToday: "{name} está em alta hoje!",
      whyTrending: "Por que {name} está em alta?",
      references: "Referências:",
      viewMoreTrending: "Ver mais pessoas em alta",
    },
    bornOnThisDay: {
      famousBirthdays: "Aniversários Famosos",
      bornOnThisDay: "Nascidos Neste Dia",
      famousPeopleBornOnThisDay: ({count}) => `${count} ${count === 1 ? "pessoa famosa nascida" : "pessoas famosas nascidas"} neste dia`,
      birthdayOf: ({displayDate, count}) => `${displayDate} é o aniversário de ${count} celebridades e ${count === 1 ? "pessoa historicamente significativa" : "pessoas historicamente significativas"} na base de dados do Pantheon.`,
      mostFamousInclude: "Os mais famosos incluem",
      mostCommonOccupations: "As profissões mais comuns para pessoas nascidas neste dia são",
      exploreAnotherDate: "Explorar Outra Data",
      go: "Ir",
      today: "Hoje",
      previousDay: "Dia Anterior",
      nextDay: "Dia Seguinte",
      famousPeopleBornOn: ({displayDate}) => `Pessoas Famosas Nascidas em ${displayDate}`,
      discoverRemarkable: ({displayDate}) => `Descubra as personalidades notáveis que compartilham ${displayDate} como seu aniversário. De líderes mundiais e cientistas revolucionários a artistas amados e atletas lendários, este dia viu o nascimento de muitas figuras influentes ao longo da história.`,
      someNotableInclude: "Alguns dos mais notáveis incluem",
      stillLivingToday: ({total, living}) => `Das ${total} pessoas famosas nascidas nesta data, ${living} ainda estão vivas hoje.`,
      viewFullRankings: "Ver Classificação Completa para Este Dia",
      born: "Nascido/a",
      birthdaysByOccupation: "Aniversários por Profissão",
      occupationIntro: ({displayDate}) => `Veja como as pessoas famosas nascidas em ${displayDate} estão distribuídas em diferentes campos e profissões. Clique em qualquer pessoa para saber mais sobre sua vida e conquistas.`,
      showLess: "Mostrar menos",
      more: ({count}) => `+${count} mais`,
      formatDate: ({month, day}) => {
        const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        return `${day} de ${months[month - 1]}`;
      },
      metaTitle: ({displayDate}) => `Aniversários Famosos em ${displayDate} | Quem Nasceu Hoje? | Pantheon`,
      metaDescription: ({displayDate}) => `Descubra as pessoas mais famosas nascidas em ${displayDate} ao longo da história. Explore perfis de celebridades, figuras históricas, cientistas, artistas, atletas e muito mais.`,
      months: {
        january: "Janeiro",
        february: "Fevereiro",
        march: "Março",
        april: "Abril",
        may: "Maio",
        june: "Junho",
        july: "Julho",
        august: "Agosto",
        september: "Setembro",
        october: "Outubro",
        november: "Novembro",
        december: "Dezembro",
      },
    },
  },
  hu: {
    stillAlive: "napjainkig",
    person: {
      loading: "Betöltés...",
      metaTitle: ({name}) => `${name} életrajza | Pantheon`,
      sections: {
        trending: "Felkapott",
        memorabilityMetrics: "Ismertségi mutatók",
        trendingActivity: "Felkapottsági aktivitás",
        notableWorks: "Jelentős művek",
        pageViewsByLang: ({name}) => `${name} oldalmegtekintései nyelvenként`,
        amongOccupation: ({occupationPlural}) => `A(z) ${occupationPlural} között`,
        contemporaries: "Kortársak",
        inCountry: ({country}) => `A(z) ${country} rangsorában`,
        amongOccupationInCountry: ({occupationPlural, country}) => `A(z) ${occupationPlural} között – ${country}`,
        filmography: "Filmográfia",
        tvMovieRoles: "Televíziós és filmszerepek",
        insights: "Adatérdekességek",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} az első helyen áll a Pantheonban szereplő ${totalFormatted} ${occupationPlural} között világszerte.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} a(z) ${rank}. helyen áll a világ ${totalFormatted} ${occupationPlural} között — a szakma legjobb ${topPercent}%-ában.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} a legmagasabban rangsorolt a Pantheonban szereplő, ${country} területén született ${totalFormatted} személy közül.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `A(z) ${country} területén született ${count} ${occupationPlural} között ${name} az első helyen áll.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} a legemlékezetesebb a(z) ${city} (${country}) városában született ${count} nevezetes személy közül${peers ? `, megelőzve olyan neveket, mint ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} a legemlékezetesebb a(z) ${city} városában — a mai ${country} területén — született ${count} nevezetes személy közül${peers ? `, megelőzve olyan neveket, mint ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `A(z) ${year}. évben született ${count} pantheonbeli személy közül ${name} a legemlékezetesebb.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `${name} életrajza a Wikipédia ${count} nyelvi változatában szerepel — több nyelven, mint a(z) ${occupationPlural} ${percent}%-a esetében.`,
        newLangs: ({name, count}) =>
          `${name} életrajza az elmúlt évben ${count} új Wikipédia-nyelvi változattal bővült.`,
        nonEnglish: ({name, count}) =>
          `${name} életrajza az elmúlt évben ${count} megtekintést kapott a Wikipédia nem angol nyelvű változataiban — hírneve messze túlmutat az angol nyelvterületen.`,
        enduringFame: ({name, centuries, rank}) =>
          `Több mint ${centuries} évszázaddal a halála után ${name} még mindig a(z) ${rank}. helyen áll a Pantheon összes személyisége között.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `${name} Wikipédia-oldala ${views} megtekintést kapott az elmúlt évben — a legtöbbet a(z) ${occupationPlural} közül.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `${name} Wikipédia-oldala ${views} megtekintést kapott az elmúlt évben — ${multiple}× annyi, mint a(z) ${occupationPlural} átlaga.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `A Pantheonban szereplő ${totalFormatted} ${occupationPlural} között mindössze ${womenCount} nő van — ${name} egyikük.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `Bár ${name} csupán ${age} évet élt, a történelem összes ${occupationPlural} között a(z) ${rank}. helyen áll.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} a Pantheon ${count} legkorábban született ${occupationPlural} egyike.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} ugyanazon a napon (${date}) ünnepli születésnapját, mint ${twinNames}.`,
        fallback: ({name, count, hpi}) =>
          `${name} életrajza a Wikipédia ${count} nyelvi változatában érhető el, történelmi népszerűségi indexe ${hpi}.`,
      },
      metrics: {
        pageViews: "Oldalmegtekintések",
        past12Months: "Elmúlt 12 hónap",
        hpi: "HPI",
        hpiDesc: "Történelmi népszerűségi index",
        avgOf: ({label}) => `Átlag: ${label}`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `A(z) ${occupationPlural} között ${name} a(z) ${rankHtml}. helyen áll ${totalFormatted} közül.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `A(z) ${year}. évben születettek között ${name} a(z) ${rankHtml}. helyen áll.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `A(z) ${year}. évben elhunytak között ${name} a(z) ${rankHtml}. helyen áll.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `A(z) ${countryHtml} területén születettek között ${name} a(z) ${rankHtml}. helyen áll ${totalFormatted} közül.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `A(z) ${countryHtml} területén született ${occupationPlural} között ${name} a(z) ${rankHtml}. helyen áll.`,
        beforePeers: ({gender, count}) =>
          `Előtte áll${count === 1 ? "" : "nak"}: `,
        afterPeers: ({gender, count}) =>
          `Utána következ${count === 1 ? "ik" : "nek"}: `,
        notRankedIn: ({name, countryHtml}) => `${name} nem szerepel ${countryHtml} rangsorában`,
        mostPopularInWikipedia: ({occupationPlural}) => `A legnépszerűbb ${occupationPlural} a Wikipédián`,
        othersBornInYear: ({year}) => `További személyek, akik a(z) ${year}. évben születtek`,
        othersDeceasedInYear: ({year}) => `További személyek, akik a(z) ${year}. évben hunytak el`,
        othersBornInCountry: ({countryHtml}) => `További személyek, akik ${countryHtml} területén születtek`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${demonym} ${occupationPlural}`,
        goToAllRankings: "Összes rangsor megtekintése",
        and: " és ",
      },
      carousel: {
        present: "napjainkig",
        hpiLabel: "HPI:",
        rankLabel: "Helyezés:",
      },
      footer: {
        relatedProfiles: "Kapcsolódó profilok",
        individuals: ({countFormatted}) => `${countFormatted} személy`,
        rank: ({rankFormatted}) => `${rankFormatted}. hely`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `${langCode}.WIKIPEDIA OLDALMEGTEKINTÉSEK (PV)`,
        rankInLanguage: ({rank, language}) => `${rank}. hely – ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `${count} felkapott nap`,
        less: "Kevesebb",
        more: "Több",
        clickForDetails: "Kattintson a részletekért",
        notTrending: "Nem felkapott",
        rankNum: ({rank}) => `${rank}. hely`,
        viewAllTrendingNews: ({date}) => `Az összes felkapott hír megtekintése: ${date}`,
      },
      pageViewsByLangChart: {
        languageEditions: "Nyelvi kiadások",
        pageviewsByLanguageEdition: "Oldalmegtekintések nyelvi kiadásonként",
        cumulativeLanguageEditions: "Halmozott nyelvi kiadások",
        editionsWord: "kiadás",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} megtekintés`,
        andOthers: ({count}) => `(és további ${count})`,
        summaryIntro: ({name}) => `Az elmúlt évben ${name} oldalát a(z) `,
        wikipediaEdition: ({language}) => `${language} nyelvű Wikipédián`,
        withViewsFollowedBy: ({viewsFormatted}) => ` nézték meg a legtöbben (${viewsFormatted} megtekintés), ezt követi: `,
        growthIntro: ". Az oldalmegtekintések éves növekedése alapján a 3 vezető Wikipédia-kiadás: ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) a(z) ${primaryFamilyName} családba tartozó, ${familyName} csoportbeli nyelv.`,
        families: {
          "Indo-European": "Indoeurópai",
          "Sino-Tibetan": "Sino-tibeti",
          "Afro-Asiatic": "Afroázsiai",
          "Altaic": "Altaji",
          "Dravidian": "Dravida",
          "Austronesian": "Ausztronéz",
          "Uralic": "Uráli",
          "Caucasian": "Kaukázusi",
          "Niger-Kordofanian": "Niger-kordofáni",
          "Creoles and pidgins": "Kreol és pidzsin",
          "Amerindian": "Amerindián",
          "Tai": "Tai",
          "Other": "Egyéb",
          "Albanian": "Albán",
          "Algic": "Algikus",
          "Armenian": "Örmény",
          "Austro-Asiatic": "Ausztroázsiai",
          "Baltic": "Balti",
          "Basque": "Baszk",
          "Berber": "Berber",
          "Celtic": "Kelta",
          "Chadic": "Csádi",
          "Constructed": "Mesterséges",
          "Creole (English)": "Kreol (angol)",
          "Creole (French)": "Kreol (francia)",
          "Cushitic": "Kusita",
          "Eskimo-Aleut": "Eszkimó-aleut",
          "Germanic": "Germán",
          "Greek": "Görög",
          "Indic": "Ind",
          "Iranian": "Iráni",
          "Italic": "Itáliai",
          "Japanese": "Japán",
          "Korean": "Koreai",
          "Malayo-Polynesian": "Maláj-polinéz",
          "Mongolian": "Mongol",
          "Na-Dene": "Na-dené",
          "Nilo-Saharan": "Nílusi-szaharai",
          "Quechuan": "Kecsua",
          "Semitic": "Sémi",
          "Sinitic": "Szinita",
          "Slavic": "Szláv",
          "Tibeto-Burman": "Tibeto-burmai",
          "Tupi": "Tupi",
          "Turkic": "Türk",
          "Uto-Aztecan": "Uto-azték",
        },
      },
    },
    birthdayToast: ({name}) => `Ma van ${name} születésnapja`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank, possessiveName}) =>
      `${name} (${birthYear}–${deathYear}) ${demonym} ${occupation}, a Pantheon Történelmi Népszerűségi Indexe szerint világszinten #${rank}. Fedezze fel ${name} életrajzát, oldalmegtekintéseit, emlékezetességi mutatóit és összehasonlításait.`,
    learnMoreRankless: "Tudjon meg többet {name} akadémiai hatásáról a Rankless-en",
    nav: {
      visualizations: "Vizualizációk",
      rankings: "Rangsorok",
      profiles: "Profilok",
      people: "Emberek",
      bornOnThisDay: "Ma Születettek",
      places: "Helyek",
      countries: "Országok",
      occupations: "Foglalkozások",
      occupationCountry: "Foglalkozás / Ország",
      eras: "Korszakok",
      deaths: "Halálozások",
      about: "Rólunk",
      data: "Adatok",
      permissions: "Engedélyek",
      download: "Letöltés",
      api: "API",
      games: "Játékok",
      yearbook: "Évkönyv",
      birthle: "Birthle",
      trivia: "Kvíz",
      news: "Hírek",
      search: "Keresés",
      home: "Kezdőlap",
      giveFeedback: "Visszajelzés Küldése",
      usageCitation: "Használati Idézet",
      newBadge: "új!",
      explore: "Felfedezés",
      apps: "Alkalmazások",
      reportDataError: "Adathiba Jelentése",
      privacyPolicy: "Adatvédelmi Irányelvek",
      termsOfService: "Szolgáltatási Feltételek",
    },
    occupationCountry: {
      theMostFamous: "A Leghíresebbek",
      from: "országából",
      greatest: "A Legnagyobbak",
      goToAllRankings: "Az összes rangsor megtekintése",
      livingTitle: ({demonym, occupationPlural}) => `Élő ${demonym} ${occupationPlural}`,
      deceasedTitle: ({demonym, occupationPlural}) => `Elhunyt ${demonym} ${occupationPlural}`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `Újonnan hozzáadott ${demonym} ${occupationPlural} (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for Hungarian ordinals (use period)
        const formatHungarianOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          return `${num}.`;
        };

        let text = `Ez az oldal a legnagyobb ${demonym} ${occupationPlural} listáját tartalmazza. `;
        text += `A Pantheon adatkészlet ${totalCount} ${occupationPlural} adatait tartalmazza, ebből ${countryCount} született ${country} országában. `;
        if (rank) {
          const hungarianRank = formatHungarianOrdinal(rank);
          text += `Ez teszi ${country} országát a ${hungarianRank} legtöbb ${occupationPlural} szülőhelyévé`;
          if (countriesBehind) {
            text += ` ${countriesBehind} után.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "és",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `A következő személyeket a Pantheon ${count === 10 ? "a 10" : ""} leglegendásabb ${demonym} ${occupationPlural} között tartja számon minden idők. Ez a híres ${demonym} ${occupationPlural} lista HPI (Történelmi Népszerűségi Index) szerint van rendezve, amely egy biográfia online népszerűségéről összesíti az információkat.`,
      visitRankings: "Látogassa meg a ranglisták oldalát a teljes lista megtekintéséhez",
      top: "Top",
      withHpi: ({hpi, name}) => `${hpi} HPI-vel ${name}`,
      isMostFamous: ({demonym, occupation}) => `a leghíresebb ${demonym} ${occupation}.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `a ${rank} leghíresebb ${demonym} ${occupation}.`,
      biographyTranslated: ({possessive, count}) => `${possessive} életrajza ${count} különböző nyelvre lett lefordítva`,
      onWikipedia: "a Wikipédián",
      readMore: "Olvass tovább",
      showLess: "Kevesebb",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} híres személy`,
      viewsLabel: "megtekintés",
      onDate: ({date}) => `${date}-án`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Felkapott ${occupationPlural} ezen a héten`;
        return hasFromPrefix
          ? `Felkapott ${occupationPlural} ${locationLabel} ezen a héten`
          : `Felkapott ${locationLabel} ${occupationPlural} ezen a héten`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `A Wikipédia top 10 felkapott ${occupationPlural}`;
        return hasFromPrefix
          ? `A top 10 ${occupationPlural} ${locationLabel} a Wikipédián`
          : `A top 10 ${locationLabel} ${occupationPlural} a Wikipédián`;
      },
      trendingIntroSuffix: "az elmúlt 7 napban, rövid magyarázattal a kiugrás okáról.",
      trendingThisWeekShort: "Felkapott ezen a héten",
      trendingThisWeekDefault: "Felkapott ezen a héten a Wikipédián.",
      metaTitle: ({demonym, occupationPlural}) => `A legnagyobb ${demonym} ${occupationPlural} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `Fedezze fel a történelem ${countFormatted} leghíresebb ${demonym} ${occupationPlural} személyét. Ismerje meg ${country} nevezetes ${occupationSingular} profiljait, történelmi jelentőség szerint rangsorolva.`,
      birthDecadesTitle: "Születési évtizedek szerint",
      birthDecadesIntro: ({demonym, occupationPlural}) => `Böngéssze a nevezetes ${demonym} ${occupationPlural} személyeket születési évtizedek szerint. Minden évtized a HPI szerinti top 10-et mutatja; bontsa ki az összeshez.`,
      decadeLabel: ({decade}) => `${decade}-es évek`,
      more: ({count}) => `+${count} további`,
    },
    selectCountry: {
      heading: "Országok Felfedezése",
      subtitle: "Fedezze fel a világ minden országának legkiemelkedőbb személyiségeit",
      metaDescription: "Fedezze fel a világ országainak kiemelkedő személyiségeit. Böngésszen életrajzok között születési ország szerint, tekintse meg az interaktív térképeket.",
      totalCountries: "ország",
      totalPeople: "híres személy",
      mapTitle: "Híres Személyek Országonként",
      countryList: "Összes Ország",
      sortAlpha: "A–Z",
      sortPeople: "Legtöbb Személy",
      people: "személy",
      noPeopleData: "Nincs adat",
      exploreMore: "További Felfedezés",
      byPerson: "Híres Személyek",
      byOccupation: "Foglalkozás és Ország Szerint",
      rankings: "Rangsorok",
    },
    selectPlace: {
      heading: "Helyek Felfedezése",
      subtitle: "Fedezze fel azokat a városokat, amelyek a történelem legkiemelkedőbb személyiségeit adták",
      metaDescription: "Fedezze fel a világ kiemelkedő személyiségeinek születési helyeit. Böngésszen városok között a születések száma alapján.",
      totalPlaces: "hely",
      totalPeople: "híres személy",
      mapTitle: "Híres Személyek Születési Helyei",
      placeList: "Legjobb Helyek",
      sortAlpha: "A–Z",
      sortPeople: "Legtöbb Személy",
      groupByCountry: "Ország Szerint",
      people: "személy",
      exploreMore: "További Felfedezés",
      byPerson: "Híres Személyek",
      byCountry: "Ország Szerint",
      rankings: "Rangsorok",
    },
    selectOccupation: {
      heading: "Foglalkozások Felfedezése",
      subtitle: "Fedezze fel azokat a területeket és foglalkozásokat, amelyek a történelem legkiemelkedőbb személyiségeit adták",
      metaDescription: "Fedezze fel a történelem legkiemelkedőbb személyiségeinek 101 foglalkozását. Böngésszen foglalkozás szerint és ismerje meg a kiemelkedő személyiségek számát.",
      totalOccupations: "foglalkozás",
      totalPeople: "híres személy",
      occupationList: "Összes Foglalkozás",
      sortAlpha: "A–Z",
      sortPeople: "Legtöbb Személy",
      people: "személy",
      exploreMore: "További Felfedezés",
      byPerson: "Híres Személyek",
      byCountry: "Ország Szerint",
      rankings: "Rangsorok",
    },
    selectOccupationCountry: {
      heading: "Válasszon foglalkozást és országot",
      pleaseSelect: "Kérjük, válasszon egy foglalkozás és ország kombinációt a legmaradandóbb életrajzok megtekintéséhez",
      selectOccupation: "Válasszon foglalkozást",
      selectCountry: "Válasszon országot",
      goToProfile: "Ugrás a profilhoz",
      whoAreTheMostFamous: "Kik a leghíresebbek...",
      trendingThisWeek: "Trendek Ezen a Héten",
      browseByCountry: "Böngészés ország szerint",
    },
    selectPerson: {
      heading: "Híres Személyek Felfedezése",
      subtitle: "Böngésszen a történelem legemlékezetesebb életrajzai között",
      randomPerson: "Véletlenszerű személy",
      statPeople: "életrajz",
      statLanguages: "nyelv",
      description: "A Pantheon összegyűjti és rangsorolja a történelem leghíresebb személyiségeinek életrajzait, több mint 85 000 egyénnel, akik kulturális jelentőségük alapján vannak rangsorolva.",
      featuredPeople: "Kiemelt Személyek",
      trendingNow: "Most Felkapott",
      browseByField: "Böngészés Terület Szerint",
      domainSports: "Sport",
      domainArts: "Művészetek",
      domainScience: "Tudomány",
      domainPolitics: "Politika",
      exploreMore: "További Felfedezés",
      byOccupationCountry: "Foglalkozás és Ország Szerint",
      rankings: "Rangsorok",
      byEra: "Korszak Szerint",
      metaDescription: "Fedezze fel a történelem leghíresebb személyiségeit. Böngésszen 85 000+ életrajz között foglalkozás, ország és korszak szerint.",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
      }) => {
        let sentence = `Életrajza ${l} különböző nyelven érhető el a Wikipédián`;
        if (l_prev && l !== l_prev) {
          sentence += ` (${l > l_prev ? "növekedés" : "csökkenés"} ${l_prev}-ről 2024-ben)`;
        }
        sentence += ". ";

        sentence += `${name} a ${occupationRank === 1 ? "" : formatOrdinal(occupationRank)} legnépszerűbb <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a>`;
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          sentence += ` (${occupationRank < occupationRankPrev ? "növekedés" : "csökkenés"} a ${formatOrdinal(occupationRankPrev)}-ről 2024-ben)`;
        }

        if (country) {
          sentence += `, a ${bplaceCountryRank !== 1 ? formatOrdinal(bplaceCountryRank) : ""} legnépszerűbb életrajz <a href="/profile/place/${countrySlug}">${country}</a> országából`;
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            sentence += ` (${bplaceCountryRank < bplaceCountryRankPrev ? "növekedés" : "csökkenés"} a ${formatOrdinal(bplaceCountryRankPrev)}-ről 2019-ben)`;
          }

          if (bplaceCountryOccupationRank) {
            sentence += ` és a ${bplaceCountryOccupationRank !== 1 ? formatOrdinal(bplaceCountryOccupationRank) : ""} legnépszerűbb <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${demonym} ${occupation?.toLowerCase() ?? ""}</a>`;
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "Vizualizációk",
      rankings: "Rangsorok",
      profiles: "Profilok",
      people: "Személyek",
      bornOnThisDay: "Ma Születettek",
      places: "Helyek",
      countries: "Országok",
      occupations: "Foglalkozások",
      occupationCountry: "Foglalkozás / Ország",
      eras: "Korszakok",
      deaths: "Halálozások",
      about: "Rólunk",
      data: "Adatok",
      permissions: "Engedélyek",
      download: "Letöltés",
      api: "API",
      games: "Játékok",
      yearbook: "Évkönyv",
      birthle: "Birthle",
      trivia: "Kvíz",
      news: "Hírek",
      search: "Keresés",
      home: "Kezdőlap",
      giveFeedback: "Visszajelzés küldése",
      usageCitation: "Hivatkozás",
      newBadge: "új!",
    },
    readMoreWikipedia: "Bővebben a Wikipédián",
    home: {
      tagline: "Fedezze fel az emberiség kollektív emlékezetét!",
      subtitle:
        "A Pantheon segít felfedezni bolygónk történetének földrajzát és dinamikáját.",
      explore: "Felfedezés",
      people: "Emberek",
      places: "Helyek",
      occupations: "Foglalkozások",
      and: "és",
      eras: "Korszakok",
      trendingProfiles: "Ma Felkapott Profilok",
      topProfilesBy: "Legjobb profilok oldalmegtekintések alapján a",
      wikipediaEdition: "wikipédia kiadáshoz",
      about: "a kollektív memória megfigyelője, amely legalább",
      languages: "nyelven",
      aboutContinued:
        "jelenlévő életrajzokra összpontosít a Wikipédián. Több mint 85 000 életrajz adataival rendelkezünk, országok, városok, foglalkozások és korszakok szerint rendszerezve. Fedezze fel ezeket az adatokat, hogy megismerje az emberi kultúrát formáló személyiségeket.",
      aboutDeveloped:
        "az MIT Collective Learning csoportjának projektjeként indult. Ma a",
      datawheel: "Datawheel",
      aboutDatawheel:
        " fejleszti, egy adatterjesztési és vizualizációs megoldások létrehozására szakosodott vállalat.",
      recentPassings: "Közelmúltbeli Elhunytak",
      notableDeaths: "2025 Kiemelkedő Halálozásai",
      notableDeathsText:
        "Szeretné látni a 2025-ben elvesztett kiemelkedő személyiségek teljes listáját? Látogassa meg a",
      notableDeathsLink: "2025 Kiemelkedő Halálozásai",
      notableDeathsContinued:
        "oldalunkat a befolyásos személyiségek átfogó életrajzi gyűjteményéért, beleértve a hírességeket, művészeket, vezetőket és kulturális ikonokat, akik idén hunytak el.",
      trendingSingers: "Ma Felkapott Énekesek",
      trendingActors: "Ma Felkapott Színészek",
      recentlyAdded: "Nemrég Hozzáadva a Pantheonhoz",
      searchPlaceholder: "Személyek, helyek és foglalkozások keresése",
      isTrending: "ma felkapott",
      readFullStory: "Teljes történet elolvasása",
      turningXToday: ({age}) => `Ma ${age} éves!`,
      wouldHaveBeenX: ({age}) => `Ma ${age} éves lenne`,
      seeAllBirthdays: "Összes születésnap megtekintése",
      bornTodayTitle: "Híres Emberek Ma Születtek",
    },
    recentlyAdded: {
      title: "Nemrég Hozzáadva a Pantheonhoz",
      subtitle: "Fedezd fel a Pantheon gyűjteményéhez legutóbb hozzáadott életrajzokat, a hozzáadás dátuma szerint rendezve.",
      addedOn: ({date}) => `Hozzáadva: ${date}`,
      previous: "Előző",
      next: "Következő",
      pageLabel: ({page}) => `${page}. oldal`,
      viewMore: "További nemrég hozzáadott személyek",
      empty: "Nem találhatók nemrég hozzáadott személyek.",
    },
    news: {
      pageTitle: "Ki a felkapott ma?",
      pageSubtitle:
        "Történelmi személyiségek napi összefoglalói (AI által generálva)",
      trendingIn: "Felkapott:",
      selectDate: "Válasszon más dátumot",
      references: "Hivatkozások:",
      noData: "Nincs elérhető trendinformáció ehhez a dátumhoz.",
      previousDay: "Előző Nap",
      nextDay: "Következő Nap",
      unknown: "Ismeretlen",
    },
    trending: {
      isTrendingToday: "{name} ma felkapott!",
      whyTrending: "Miért felkapott {name}:",
      references: "Hivatkozások:",
      viewMoreTrending: "További felkapott személyek",
    },
    bornOnThisDay: {
      famousBirthdays: "Híres Születésnapok",
      bornOnThisDay: "Ma Születettek",
      famousPeopleBornOnThisDay: ({count}) => `${count} híres ${count === 1 ? "személy született" : "személy született"} ezen a napon`,
      birthdayOf: ({displayDate, count}) => `${displayDate} a születésnapja ${count} hírességnek és történelmileg jelentős személyiségnek a Pantheon adatbázisában.`,
      mostFamousInclude: "A leghíresebbek közé tartoznak",
      mostCommonOccupations: "Az ezen a napon született személyek leggyakoribb foglalkozásai",
      exploreAnotherDate: "Másik Dátum Felfedezése",
      go: "Ugrás",
      today: "Ma",
      previousDay: "Előző Nap",
      nextDay: "Következő Nap",
      famousPeopleBornOn: ({displayDate}) => `${displayDate}-én Született Híres Személyiségek`,
      discoverRemarkable: ({displayDate}) => `Fedezze fel azokat a figyelemre méltó személyiségeket, akik ${displayDate}-t osztják születésnapjukként. A világvezetőktől és úttörő tudósoktól a szeretett szórakoztatókig és legendás sportolókig, ez a nap sok befolyásos személyiség születését látta a történelem során.`,
      someNotableInclude: "A legjelentősebbek közé tartoznak",
      stillLivingToday: ({total, living}) => `Az ezen a napon született ${total} híres személyből ${living} ma is él.`,
      viewFullRankings: "Teljes Rangsor Megtekintése Erre a Napra",
      born: "Született",
      birthdaysByOccupation: "Születésnapok Foglalkozás Szerint",
      occupationIntro: ({displayDate}) => `Nézze meg, hogyan oszlanak el a ${displayDate}-én született híres személyiségek a különböző területeken és foglalkozásokban. Kattintson bármelyik személyre, hogy többet tudjon meg életéről és eredményeiről.`,
      showLess: "Kevesebb mutatása",
      more: ({count}) => `+${count} további`,
      formatDate: ({month, day}) => {
        const months = ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"];
        return `${months[month - 1]} ${day}.`;
      },
      metaTitle: ({displayDate}) => `Híres Születésnapok ${displayDate} | Ki Született Ma? | Pantheon`,
      metaDescription: ({displayDate}) => `Fedezze fel a leghíresebb embereket, akik ${displayDate} születtek a történelem során. Böngésszen hírességek, történelmi személyiségek, tudósok, művészek, sportolók és mások profiljai között.`,
      months: {
        january: "Január",
        february: "Február",
        march: "Március",
        april: "Április",
        may: "Május",
        june: "Június",
        july: "Július",
        august: "Augusztus",
        september: "Szeptember",
        october: "Október",
        november: "November",
        december: "December",
      },
    },
  },
  nl: {
    stillAlive: "heden",
    person: {
      loading: "Laden...",
      metaTitle: ({name}) => `Biografie van ${name} | Pantheon`,
      sections: {
        trending: "Trending",
        memorabilityMetrics: "Bekendheidsstatistieken",
        trendingActivity: "Trendactiviteit",
        notableWorks: "Bekende werken",
        pageViewsByLang: ({name}) => `Paginaweergaven van ${name} per taal`,
        amongOccupation: ({occupationPlural}) => `Onder ${occupationPlural}`,
        contemporaries: "Tijdgenoten",
        inCountry: ({country}) => `In ${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `Onder ${occupationPlural} in ${country}`,
        filmography: "Filmografie",
        tvMovieRoles: "Televisie- en filmrollen",
        insights: "Data-inzichten",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} staat op de eerste plaats van alle ${totalFormatted} ${occupationPlural} in Pantheon wereldwijd.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} staat op plaats ${rank} van ${totalFormatted} ${occupationPlural} wereldwijd — bij de beste ${topPercent}% van het vak.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} is de hoogst gerangschikte van de ${totalFormatted} personen in Pantheon die in ${country} zijn geboren.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `Van de ${count} ${occupationPlural} geboren in ${country} staat ${name} op de eerste plaats.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} is de meest memorabele van de ${count} opmerkelijke personen geboren in ${city}, ${country}${peers ? `, vóór ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} is de meest memorabele van de ${count} opmerkelijke personen geboren in ${city}, in het huidige ${country}${peers ? `, vóór ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `Van de ${count} personen in Pantheon geboren in ${year} is ${name} het meest memorabel.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `De biografie van ${name} verschijnt in ${count} taalversies van Wikipedia — meer dan bij ${percent}% van alle ${occupationPlural}.`,
        newLangs: ({name, count}) =>
          `De biografie van ${name} is het afgelopen jaar aan ${count} nieuwe taalversies van Wikipedia toegevoegd.`,
        nonEnglish: ({name, count}) =>
          `De biografie van ${name} kreeg het afgelopen jaar ${count} weergaven in niet-Engelstalige versies van Wikipedia — faam die ver voorbij de Engelstalige wereld reikt.`,
        enduringFame: ({name, centuries, rank}) =>
          `Meer dan ${centuries} eeuwen na de dood staat ${name} nog altijd op plaats ${rank} van alle personen in Pantheon.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `Met ${views} Wikipedia-weergaven in het afgelopen jaar was ${name} de meest bekeken van alle ${occupationPlural}.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `De Wikipedia-pagina van ${name} kreeg ${views} weergaven in het afgelopen jaar — ${multiple}× het gemiddelde van alle ${occupationPlural}.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `${name} is een van de slechts ${womenCount} vrouwen onder de ${totalFormatted} ${occupationPlural} in Pantheon.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `Ondanks een leven van slechts ${age} jaar staat ${name} op plaats ${rank} van alle ${occupationPlural} in de geschiedenis.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} behoort tot de ${count} vroegst geboren ${occupationPlural} in heel Pantheon.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} is jarig op dezelfde dag (${date}) als ${twinNames}.`,
        fallback: ({name, count, hpi}) =>
          `De biografie van ${name} beslaat ${count} taalversies van Wikipedia en behaalt een Historische Populariteitsindex van ${hpi}.`,
      },
      metrics: {
        pageViews: "Paginaweergaven",
        past12Months: "Afgelopen 12 maanden",
        hpi: "HPI",
        hpiDesc: "Historische populariteitsindex",
        avgOf: ({label}) => `Gem. ${label}`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `Onder ${occupationPlural} staat ${name} op plaats ${rankHtml} van ${totalFormatted}.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `Onder de mensen geboren in ${year} staat ${name} op plaats ${rankHtml}.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `Onder de mensen overleden in ${year} staat ${name} op plaats ${rankHtml}.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `Onder de mensen geboren in ${countryHtml} staat ${name} op plaats ${rankHtml} van ${totalFormatted}.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `Onder ${occupationPlural} geboren in ${countryHtml} staat ${name} op plaats ${rankHtml}.`,
        beforePeers: ({gender, count}) =>
          `Vóór ${gender === "M" ? "hem" : gender === "F" ? "haar" : "hen"} ${count === 1 ? "staat" : "staan"} `,
        afterPeers: ({gender, count}) =>
          `Na ${gender === "M" ? "hem" : gender === "F" ? "haar" : "hen"} ${count === 1 ? "komt" : "komen"} `,
        notRankedIn: ({name, countryHtml}) => `${name} is niet gerangschikt in ${countryHtml}`,
        mostPopularInWikipedia: ({occupationPlural}) => `Populairste ${occupationPlural} op Wikipedia`,
        othersBornInYear: ({year}) => `Anderen geboren in ${year}`,
        othersDeceasedInYear: ({year}) => `Anderen overleden in ${year}`,
        othersBornInCountry: ({countryHtml}) => `Anderen geboren in ${countryHtml}`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${demonym} ${occupationPlural}`,
        goToAllRankings: "Naar alle ranglijsten",
        and: " en ",
      },
      carousel: {
        present: "heden",
        hpiLabel: "HPI:",
        rankLabel: "Plaats:",
      },
      footer: {
        relatedProfiles: "Gerelateerde profielen",
        individuals: ({countFormatted}) => `${countFormatted} personen`,
        rank: ({rankFormatted}) => `Plaats ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `${langCode}.WIKIPEDIA-PAGINAWEERGAVEN (PV)`,
        rankInLanguage: ({rank, language}) => `Plaats ${rank} – ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `${count} trending dag${count === 1 ? "" : "en"}`,
        less: "Minder",
        more: "Meer",
        clickForDetails: "Klik voor details",
        notTrending: "Niet trending",
        rankNum: ({rank}) => `Plaats ${rank}`,
        viewAllTrendingNews: ({date}) => `Bekijk al het trending nieuws van ${date}`,
      },
      pageViewsByLangChart: {
        languageEditions: "Taalversies",
        pageviewsByLanguageEdition: "Paginaweergaven per taalversie",
        cumulativeLanguageEditions: "Cumulatieve taalversies",
        editionsWord: "versies",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} weergaven`,
        andOthers: ({count}) => `(en ${count} andere)`,
        summaryIntro: ({name}) => `Het afgelopen jaar had ${name} de meeste paginaweergaven in de `,
        wikipediaEdition: ({language}) => `Wikipedia-editie in het ${language}`,
        withViewsFollowedBy: ({viewsFormatted}) => ` met ${viewsFormatted} weergaven, gevolgd door `,
        growthIntro: ". Qua jaarlijkse groei van paginaweergaven zijn de top 3 Wikipedia-edities ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) is een ${familyName} taal uit de familie ${primaryFamilyName}.`,
        families: {
          "Indo-European": "Indo-Europees",
          "Sino-Tibetan": "Sino-Tibetaans",
          "Afro-Asiatic": "Afro-Aziatisch",
          "Altaic": "Altaïsch",
          "Dravidian": "Dravidisch",
          "Austronesian": "Austronesisch",
          "Uralic": "Oeraals",
          "Caucasian": "Kaukasisch",
          "Niger-Kordofanian": "Niger-Kordofaans",
          "Creoles and pidgins": "Creools en pidgin",
          "Amerindian": "Amerindisch",
          "Tai": "Tai",
          "Other": "Overige",
          "Albanian": "Albanees",
          "Algic": "Algisch",
          "Armenian": "Armeens",
          "Austro-Asiatic": "Austroaziatisch",
          "Baltic": "Baltisch",
          "Basque": "Baskisch",
          "Berber": "Berbers",
          "Celtic": "Keltisch",
          "Chadic": "Tsjadisch",
          "Constructed": "Kunsttaal",
          "Creole (English)": "Creools (Engels)",
          "Creole (French)": "Creools (Frans)",
          "Cushitic": "Koesjitisch",
          "Eskimo-Aleut": "Eskimo-Aleoetisch",
          "Germanic": "Germaans",
          "Greek": "Grieks",
          "Indic": "Indisch",
          "Iranian": "Iraans",
          "Italic": "Italisch",
          "Japanese": "Japans",
          "Korean": "Koreaans",
          "Malayo-Polynesian": "Maleis-Polynesisch",
          "Mongolian": "Mongools",
          "Na-Dene": "Na-Dené",
          "Nilo-Saharan": "Nilo-Saharaans",
          "Quechuan": "Quechua",
          "Semitic": "Semitisch",
          "Sinitic": "Sinitisch",
          "Slavic": "Slavisch",
          "Tibeto-Burman": "Tibeto-Birmaans",
          "Tupi": "Tupi",
          "Turkic": "Turks",
          "Uto-Aztecan": "Uto-Azteeks",
        },
      },
    },
    birthdayToast: ({name}) => `Vandaag is ${name} jarig`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank, possessiveName}) =>
      `${name} (${birthYear}–${deathYear}) is een ${demonym} ${occupation}, wereldwijd gerangschikt op #${rank} volgens Pantheon's Historische Populariteitsindex. Ontdek de biografie, paginaweergaven, herdenkingsmaatstaven en vergelijkingen van ${name}.`,
    learnMoreRankless: "Meer informatie over de academische impact van {name} op Rankless",
    nav: {
      visualizations: "Visualisaties",
      rankings: "Ranglijsten",
      profiles: "Profielen",
      people: "Mensen",
      bornOnThisDay: "Vandaag Geboren",
      places: "Plaatsen",
      countries: "Landen",
      occupations: "Beroepen",
      occupationCountry: "Beroep / Land",
      eras: "Tijdperken",
      deaths: "Overlijdens",
      about: "Over",
      data: "Gegevens",
      permissions: "Toestemmingen",
      download: "Downloaden",
      api: "API",
      games: "Spellen",
      yearbook: "Jaarboek",
      birthle: "Birthle",
      trivia: "Weetjes",
      news: "Nieuws",
      search: "Zoeken",
      home: "Home",
      giveFeedback: "Geef Feedback",
      usageCitation: "Gebruikscitaat",
      newBadge: "nieuw!",
      explore: "Verkennen",
      apps: "Apps",
      reportDataError: "Gegevensfout Melden",
      privacyPolicy: "Privacybeleid",
      termsOfService: "Gebruiksvoorwaarden",
    },
    occupationCountry: {
      theMostFamous: "De Beroemdste",
      from: "uit",
      greatest: "De Grootste",

      keepExploring: "Blijf ontdekken",
      trendingThisWeek: "Trending deze week",
      trendScoreLabel: "Trendscore",
      whyTrending: "Waarom is dit trending?",
      clicksThisWeek: "Kliks deze week",
      impressionsThisWeek: "Impressies deze week",
      readMore: "Lees meer",
      showLess: "Toon minder",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} opvallende persoon${count === 1 ? "" : "en"}`,
      viewsLabel: "weergaven",
      onDate: ({date}) => `op ${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Trending ${occupationPlural} deze week`;
        return hasFromPrefix
          ? `Trending ${occupationPlural} ${locationLabel} deze week`
          : `Trending ${locationLabel} ${occupationPlural} deze week`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `De top 10 ${occupationPlural} trending op Wikipedia`;
        return hasFromPrefix
          ? `De top 10 ${occupationPlural} ${locationLabel} trending op Wikipedia`
          : `De top 10 ${locationLabel} ${occupationPlural} trending op Wikipedia`;
      },
      trendingIntroSuffix: "in de afgelopen 7 dagen, met een korte toelichting.",
      trendingThisWeekShort: "Trending deze week",
      trendingThisWeekDefault: "Trending deze week op Wikipedia",
      metaTitle: ({demonym, occupationPlural}) => `De grootste ${demonym} ${occupationPlural} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `Ontdek de ${countFormatted} beroemdste ${demonym} ${occupationPlural} uit de geschiedenis. Bekijk opmerkelijke ${occupationSingular}-profielen uit ${country}, gerangschikt op historische betekenis.`,
      birthDecadesTitle: "Personen per geboortedecennium",
      birthDecadesIntro: ({demonym, occupationPlural}) => `Bekijk opmerkelijke ${demonym} ${occupationPlural} gegroepeerd per geboortedecennium. Elk decennium toont de top 10 op HPI; vouw uit om iedereen te zien.`,
      decadeLabel: ({decade}) => `Jaren ${decade}`,
      more: ({count}) => `+${count} meer`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `Pantheon heeft ${totalCount} personen die zijn geclassificeerd als ${demonym} ${occupationPlural}, geboren tussen ${oldestYear} en ${youngestYear}.`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `Van deze ${totalCount} is niemand meer in leven.`;
        return `Van deze ${totalCount} zijn ${aliveCountFormatted} (${aliveShare}) nog in leven.`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `De bekendste levende ${demonym} ${occupationPlural} zijn `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `De bekendste overleden ${demonym} ${occupationPlural} zijn `,
      peopleNewAsOf: "april 2024",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `Sinds ${asOfLabel} zijn ${countFormatted} nieuwe ${demonym} ${occupationPlural} toegevoegd aan Pantheon, waaronder `,
      goToAllRankings: "Bekijk alle ranglijsten",
      livingTitle: ({demonym, occupationPlural}) => `Levende ${demonym} ${occupationPlural}`,
      deceasedTitle: ({demonym, occupationPlural}) => `Overleden ${demonym} ${occupationPlural}`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `Nieuw toegevoegde ${demonym} ${occupationPlural} (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for Dutch ordinals (use -e or -de)
        const formatDutchOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          return `${num}e`;
        };

        let text = `Deze pagina bevat een lijst van de grootste ${demonym} ${occupationPlural}. `;
        text += `De Pantheon-dataset bevat ${totalCount} ${occupationPlural}, waarvan ${countryCount} geboren zijn in ${country}. `;
        if (rank) {
          const dutchRank = formatDutchOrdinal(rank);
          text += `Dit maakt ${country} de ${dutchRank} geboorteplaats van het grootste aantal ${occupationPlural}`;
          if (countriesBehind) {
            text += ` na ${countriesBehind}.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "en",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `De volgende personen worden door Pantheon beschouwd als ${count === 10 ? "de 10" : ""} meest legendarische ${demonym} ${occupationPlural} aller tijden. Deze lijst van beroemde ${demonym} ${occupationPlural} is gesorteerd op HPI (Historical Popularity Index), een metriek die informatie over de online populariteit van een biografie aggregeert.`,
      visitRankings: "Bezoek de ranglijstpagina om de volledige lijst te bekijken van",
      top: "Top",
      withHpi: ({hpi, name}) => `Met een HPI van ${hpi} is ${name}`,
      isMostFamous: ({demonym, occupation}) => `de beroemdste ${demonym} ${occupation}.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `de ${rank} beroemdste ${demonym} ${occupation}.`,
      biographyTranslated: ({possessive, count}) => `${possessive} biografie is vertaald in ${count} verschillende talen`,
      onWikipedia: "op Wikipedia",
    },
    selectCountry: {
      heading: "Landen Verkennen",
      subtitle: "Ontdek de meest opmerkelijke personen uit elk land ter wereld",
      metaDescription: "Verken opmerkelijke personen uit elk land. Blader door biografieën op geboorteland, bekijk interactieve kaarten en ontdek historische figuren van over de hele wereld.",
      totalCountries: "landen",
      totalPeople: "opmerkelijke personen",
      mapTitle: "Opmerkelijke Personen per Land",
      countryList: "Alle Landen",
      sortAlpha: "A–Z",
      sortPeople: "Meeste Personen",
      people: "personen",
      noPeopleData: "Geen gegevens beschikbaar",
      exploreMore: "Ontdek Meer",
      byPerson: "Opmerkelijke Personen",
      byOccupation: "Op Beroep & Land",
      rankings: "Ranglijsten",
    },
    selectPlace: {
      heading: "Plaatsen Verkennen",
      subtitle: "Ontdek de steden die de meest opmerkelijke personen uit de geschiedenis hebben voortgebracht",
      metaDescription: "Verken de geboorteplaatsen van opmerkelijke personen wereldwijd. Blader door steden op aantal opmerkelijke geboorten en ontdek historische centra.",
      totalPlaces: "plaatsen",
      totalPeople: "opmerkelijke personen",
      mapTitle: "Geboorteplaatsen van Opmerkelijke Personen",
      placeList: "Topplaatsen",
      sortAlpha: "A–Z",
      sortPeople: "Meeste Personen",
      groupByCountry: "Per Land",
      people: "personen",
      exploreMore: "Ontdek Meer",
      byPerson: "Opmerkelijke Personen",
      byCountry: "Op Land",
      rankings: "Ranglijsten",
    },
    selectOccupation: {
      heading: "Beroepen Verkennen",
      subtitle: "Ontdek de vakgebieden en beroepen die de meest opmerkelijke personen uit de geschiedenis hebben voortgebracht",
      metaDescription: "Verken 101 beroepen van de meest opmerkelijke personen uit de geschiedenis. Blader op beroep en ontdek het aantal opmerkelijke personen per vakgebied.",
      totalOccupations: "beroepen",
      totalPeople: "opmerkelijke personen",
      occupationList: "Alle Beroepen",
      sortAlpha: "A–Z",
      sortPeople: "Meeste Personen",
      people: "personen",
      exploreMore: "Ontdek Meer",
      byPerson: "Opmerkelijke Personen",
      byCountry: "Op Land",
      rankings: "Ranglijsten",
    },
    selectOccupationCountry: {
      heading: "Selecteer een beroep en land",
      pleaseSelect: "Selecteer een combinatie van beroep en land om de meest gedenkwaardige biografieën te zien",
      selectOccupation: "Selecteer een beroep",
      selectCountry: "Selecteer een land",
      goToProfile: "Ga naar profiel",
      whoAreTheMostFamous: "Wie zijn de beroemdste...",
      trendingThisWeek: "Trending Deze Week",
      browseByCountry: "Bladeren op land",
    },
    selectPerson: {
      heading: "Ontdek Beroemde Personen",
      subtitle: "Verken de meest memorabele biografieën uit de geschiedenis",
      randomPerson: "Willekeurige persoon",
      statPeople: "biografieën",
      statLanguages: "talen",
      description: "Pantheon verzamelt en rangschikt de biografieën van de beroemdste personen in de geschiedenis, met meer dan 85.000 individuen gerangschikt op culturele betekenis.",
      featuredPeople: "Uitgelichte Personen",
      trendingNow: "Nu Trending",
      browseByField: "Bladeren op Vakgebied",
      domainSports: "Sport",
      domainArts: "Kunst",
      domainScience: "Wetenschap",
      domainPolitics: "Politiek",
      exploreMore: "Ontdek Meer",
      byOccupationCountry: "Op Beroep & Land",
      rankings: "Ranglijsten",
      byEra: "Op Tijdperk",
      metaDescription: "Ontdek de beroemdste personen in de geschiedenis. Blader door 85.000+ biografieën op beroep, land en tijdperk.",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
      }) => {
        const possessive = gender === "M" ? "Zijn" : gender === "F" ? "Haar" : "Hun";

        let sentence = `${possessive} biografie is beschikbaar in ${l} verschillende talen op Wikipedia`;
        if (l_prev && l !== l_prev) {
          sentence += ` (${l > l_prev ? "toegenomen" : "afgenomen"} van ${l_prev} in 2024)`;
        }
        sentence += ". ";

        // Dutch uses "staat op plaats X onder de meest populaire..." with "onder" not "van"
        // NOTE: occupation should be in PLURAL form in the database for Dutch
        const rankStr = occupationRank === 1 ? "eerste" : occupationRank.toLocaleString('nl');
        const placePhrase = occupationRank === 1 ? "de eerste plaats" : `plaats ${rankStr}`;
        sentence += `${name} staat op ${placePhrase} onder de meest populaire <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a>`;
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          const prevStr = occupationRankPrev.toLocaleString('nl');
          sentence += ` (${occupationRank < occupationRankPrev ? "gestegen" : "gedaald"} van plaats ${prevStr} in 2024)`;
        }

        if (country) {
          const countryRankStr = bplaceCountryRank === 1 ? "eerste" : bplaceCountryRank.toLocaleString('nl');
          const countryPlacePhrase = bplaceCountryRank === 1 ? "de eerste plaats" : `plaats ${countryRankStr}`;
          sentence += `, ${countryPlacePhrase} onder de meest populaire biografieën uit <a href="/profile/place/${countrySlug}">${country}</a>`;
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            const prevStr = bplaceCountryRankPrev.toLocaleString('nl');
            sentence += ` (${bplaceCountryRank < bplaceCountryRankPrev ? "gestegen" : "gedaald"} van plaats ${prevStr} in 2019)`;
          }

          if (bplaceCountryOccupationRank) {
            const finalRankStr = bplaceCountryOccupationRank === 1 ? "eerste" : bplaceCountryOccupationRank.toLocaleString('nl');
            const finalPlacePhrase = bplaceCountryOccupationRank === 1 ? "de eerste plaats" : `plaats ${finalRankStr}`;
            // Dutch word order: "op [plaats] onder de populairste [occupation] uit [country]"
            sentence += ` en op ${finalPlacePhrase} onder de populairste <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} uit ${country}</a>`;
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "Visualisaties",
      rankings: "Rankings",
      profiles: "Profielen",
      people: "Personen",
      bornOnThisDay: "Vandaag Geboren",
      places: "Plaatsen",
      countries: "Landen",
      occupations: "Beroepen",
      occupationCountry: "Beroep / Land",
      eras: "Tijdperken",
      deaths: "Overledenen",
      about: "Over",
      data: "Gegevens",
      permissions: "Toestemmingen",
      download: "Downloaden",
      api: "API",
      games: "Spellen",
      yearbook: "Jaarboek",
      birthle: "Birthle",
      trivia: "Trivia",
      news: "Nieuws",
      search: "Zoeken",
      home: "Home",
      giveFeedback: "Feedback geven",
      usageCitation: "Citatie voor gebruik",
      newBadge: "nieuw!",
    },
    readMoreWikipedia: "Lees meer op Wikipedia",
    home: {
      tagline: "Verken het collectieve geheugen van de mensheid!",
      subtitle:
        "Pantheon helpt je de geografie en dynamiek van de geschiedenis van onze planeet te ontdekken.",
      explore: "Verkennen",
      people: "Mensen",
      places: "Plaatsen",
      occupations: "Beroepen",
      and: "en",
      eras: "Tijdperken",
      trendingProfiles: "Trending Profielen Vandaag",
      topProfilesBy: "Topprofielen op basis van paginaweergaven voor de",
      wikipediaEdition: "wikipedia-editie",
      about:
        "is een observatorium van collectief geheugen gericht op biografieën met aanwezigheid in minstens",
      languages: "talen",
      aboutContinued:
        "op Wikipedia. We hebben gegevens over meer dan 85.000 biografieën, georganiseerd per land, stad, beroep en tijdperk. Verken deze gegevens om meer te leren over de karakters die de menselijke cultuur vormgeven.",
      aboutDeveloped:
        "begon als een project bij de Collective Learning-groep aan MIT. Vandaag wordt het ontwikkeld door",
      datawheel: "Datawheel",
      aboutDatawheel:
        ", een bedrijf gespecialiseerd in het creëren van datadistributie- en visualisatieoplossingen.",
      recentPassings: "Recente Overlijdens",
      notableDeaths: "Opmerkelijke Sterfgevallen van 2025",
      notableDeathsText:
        "Wil je de volledige lijst zien van opmerkelijke figuren die we in 2025 verloren hebben? Bezoek onze",
      notableDeathsLink: "Opmerkelijke Sterfgevallen van 2025",
      notableDeathsContinued:
        "pagina voor een uitgebreide verzameling biografieën van invloedrijke persoonlijkheden, waaronder beroemdheden, artiesten, leiders en culturele iconen die dit jaar zijn overleden.",
      trendingSingers: "Trending Zangers Vandaag",
      trendingActors: "Trending Acteurs Vandaag",
      recentlyAdded: "Recent Toegevoegd aan Pantheon",
      searchPlaceholder: "Zoek personen, plaatsen en beroepen",
      isTrending: "is vandaag trending",
      readFullStory: "Lees het volledige verhaal",
      turningXToday: ({age}) => `Wordt vandaag ${age}!`,
      wouldHaveBeenX: ({age}) => `Zou vandaag ${age} zijn`,
      seeAllBirthdays: "Bekijk alle verjaardagen",
      bornTodayTitle: "Beroemde Mensen Vandaag Geboren",
    },
    recentlyAdded: {
      title: "Recent Toegevoegd aan Pantheon",
      subtitle: "Ontdek de nieuwste biografieën in de collectie van Pantheon, gesorteerd op toevoegingsdatum.",
      addedOn: ({date}) => `Toegevoegd op ${date}`,
      previous: "Vorige",
      next: "Volgende",
      pageLabel: ({page}) => `Pagina ${page}`,
      viewMore: "Meer recent toegevoegde personen bekijken",
      empty: "Geen recent toegevoegde personen gevonden.",
    },
    news: {
      pageTitle: "Wie is vandaag trending?",
      pageSubtitle:
        "Dagelijkse samenvattingen van historische figuren (gegenereerd door AI)",
      trendingIn: "Trending in",
      selectDate: "Selecteer een andere datum",
      references: "Referenties:",
      noData: "Geen trendgegevens beschikbaar voor deze datum.",
      previousDay: "Vorige Dag",
      nextDay: "Volgende Dag",
      unknown: "Onbekend",
    },
    trending: {
      isTrendingToday: "{name} is vandaag trending!",
      whyTrending: "Waarom {name} trending is:",
      references: "Referenties:",
      viewMoreTrending: "Meer trending mensen bekijken",
    },
    bornOnThisDay: {
      famousBirthdays: "Beroemde Verjaardagen",
      bornOnThisDay: "Vandaag Geboren",
      famousPeopleBornOnThisDay: ({count}) => `${count} beroemde ${count === 1 ? "persoon geboren" : "personen geboren"} op deze dag`,
      birthdayOf: ({displayDate, count}) => `${displayDate} is de verjaardag van ${count} beroemdheden en historisch belangrijke ${count === 1 ? "persoon" : "personen"} in de Pantheon-database.`,
      mostFamousInclude: "De beroemdsten zijn onder andere",
      mostCommonOccupations: "De meest voorkomende beroepen voor mensen die op deze dag zijn geboren zijn",
      exploreAnotherDate: "Verken een Andere Datum",
      go: "Ga",
      today: "Vandaag",
      previousDay: "Vorige Dag",
      nextDay: "Volgende Dag",
      famousPeopleBornOn: ({displayDate}) => `Beroemde Mensen Geboren op ${displayDate}`,
      discoverRemarkable: ({displayDate}) => `Ontdek de opmerkelijke personen die ${displayDate} delen als hun verjaardag. Van wereldleiders en baanbrekende wetenschappers tot geliefde entertainers en legendarische atleten, deze dag heeft de geboorte gezien van vele invloedrijke figuren door de geschiedenis heen.`,
      someNotableInclude: "Enkele van de meest opmerkelijke zijn",
      stillLivingToday: ({total, living}) => `Van de ${total} beroemde mensen die op deze datum zijn geboren, zijn er ${living} nog in leven.`,
      viewFullRankings: "Bekijk Volledige Ranglijst voor Deze Dag",
      born: "Geboren",
      birthdaysByOccupation: "Verjaardagen per Beroep",
      occupationIntro: ({displayDate}) => `Bekijk hoe de beroemde mensen die op ${displayDate} zijn geboren, verdeeld zijn over verschillende vakgebieden en beroepen. Klik op een persoon om meer te leren over hun leven en prestaties.`,
      showLess: "Minder tonen",
      more: ({count}) => `+${count} meer`,
      formatDate: ({month, day}) => {
        const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
        return `${day} ${months[month - 1]}`;
      },
      metaTitle: ({displayDate}) => `Beroemde Verjaardagen op ${displayDate} | Wie Is Vandaag Jarig? | Pantheon`,
      metaDescription: ({displayDate}) => `Ontdek de beroemdste mensen die op ${displayDate} zijn geboren door de geschiedenis heen. Verken profielen van beroemdheden, historische figuren, wetenschappers, artiesten, atleten en meer.`,
      months: {
        january: "Januari",
        february: "Februari",
        march: "Maart",
        april: "April",
        may: "Mei",
        june: "Juni",
        july: "Juli",
        august: "Augustus",
        september: "September",
        october: "Oktober",
        november: "November",
        december: "December",
      },
    },
  },
  pl: {
    stillAlive: "obecnie",
    person: {
      loading: "Ładowanie...",
      metaTitle: ({name}) => `Biografia: ${name} | Pantheon`,
      sections: {
        trending: "Na czasie",
        memorabilityMetrics: "Wskaźniki rozpoznawalności",
        trendingActivity: "Aktywność trendów",
        notableWorks: "Znane dzieła",
        pageViewsByLang: ({name}) => `Wyświetlenia strony ${name} według języka`,
        amongOccupation: ({occupationPlural}) => `Wśród przedstawicieli zawodu ${occupationPlural}`,
        contemporaries: "Współcześni",
        inCountry: ({country}) => `W kraju ${country}`,
        amongOccupationInCountry: ({occupationPlural, country}) => `Wśród przedstawicieli zawodu ${occupationPlural} w kraju ${country}`,
        filmography: "Filmografia",
        tvMovieRoles: "Role telewizyjne i filmowe",
        insights: "Ciekawostki z danych",
      },
      insights: {
        topOccupation: ({name, occupationPlural, totalFormatted}) =>
          `${name} zajmuje pierwsze miejsce wśród ${totalFormatted} ${occupationPlural} na świecie w rankingu Pantheonu.`,
        topOccupationRank: ({name, rank, occupationPlural, totalFormatted, topPercent}) =>
          `${name} zajmuje ${rank}. miejsce wśród ${totalFormatted} ${occupationPlural} na świecie — w najlepszych ${topPercent}% profesji.`,
        topCountry: ({name, country, totalFormatted}) =>
          `${name} to najwyżej sklasyfikowana z ${totalFormatted} postaci w Pantheonie urodzonych w kraju ${country}.`,
        topCountryOccupation: ({name, occupationPlural, country, count}) =>
          `Wśród ${count} ${occupationPlural} urodzonych w kraju ${country} ${name} zajmuje pierwsze miejsce.`,
        topCity: ({name, city, country, count, peers}) =>
          `${name} to najbardziej znana z ${count} wybitnych postaci urodzonych w mieście ${city} (${country})${peers ? `, wyprzedzając takie postacie jak ${peers}` : ""}.`,
        topCityHistorical: ({name, city, country, count, peers}) =>
          `${name} to najbardziej znana z ${count} wybitnych postaci urodzonych w mieście ${city}, na terenie dzisiejszego państwa ${country}${peers ? `, wyprzedzając takie postacie jak ${peers}` : ""}.`,
        topBirthyear: ({name, year, count}) =>
          `Spośród ${count} postaci w Pantheonie urodzonych w roku ${year} najbardziej znaną jest ${name}.`,
        globalLangs: ({name, count, percent, occupationPlural}) =>
          `Biografia postaci ${name} występuje w ${count} wersjach językowych Wikipedii — w większej liczbie niż u ${percent}% wszystkich ${occupationPlural}.`,
        newLangs: ({name, count}) =>
          `W ciągu ostatniego roku biografia postaci ${name} pojawiła się w ${count} nowych wersjach językowych Wikipedii.`,
        nonEnglish: ({name, count}) =>
          `W ciągu ostatniego roku biografia postaci ${name} zanotowała ${count} wyświetleń w nieanglojęzycznych wersjach Wikipedii — to sława sięgająca daleko poza świat anglojęzyczny.`,
        enduringFame: ({name, centuries, rank}) =>
          `Ponad ${centuries} wieków po śmierci ${name} wciąż zajmuje ${rank}. miejsce wśród wszystkich postaci w Pantheonie.`,
        mostViewed: ({name, views, occupationPlural}) =>
          `Z ${views} wyświetleń w Wikipedii w ciągu ostatniego roku strona postaci ${name} była najczęściej odwiedzana wśród wszystkich ${occupationPlural}.`,
        viewsMultiple: ({name, views, multiple, occupationPlural}) =>
          `Strona postaci ${name} w Wikipedii zanotowała ${views} wyświetleń w ciągu ostatniego roku — ${multiple} razy więcej niż średnia wśród ${occupationPlural}.`,
        womenPioneer: ({name, womenCount, totalFormatted, occupationPlural}) =>
          `${name} jest jedną z zaledwie ${womenCount} kobiet wśród ${totalFormatted} ${occupationPlural} w Pantheonie.`,
        shortLife: ({name, age, rank, occupationPlural}) =>
          `Mimo życia trwającego zaledwie ${age} lat ${name} zajmuje ${rank}. miejsce wśród wszystkich ${occupationPlural} w historii.`,
        earliestBorn: ({name, count, occupationPlural}) =>
          `${name} należy do ${count} najwcześniej urodzonych ${occupationPlural} w całym Pantheonie.`,
        birthdayTwin: ({name, date, twinNames}) =>
          `${name} obchodzi urodziny tego samego dnia (${date}) co ${twinNames}.`,
        fallback: ({name, count, hpi}) =>
          `Biografia postaci ${name} obejmuje ${count} wersji językowych Wikipedii, a jej Historyczny Indeks Popularności wynosi ${hpi}.`,
      },
      metrics: {
        pageViews: "Wyświetlenia strony",
        past12Months: "Ostatnie 12 miesięcy",
        hpi: "HPI",
        hpiDesc: "Indeks historycznej popularności",
        avgOf: ({label}) => `Śr. ${label}`,
      },
      ranking: {
        amongOccupationRanks: ({occupationPlural, name, rankHtml, totalFormatted}) =>
          `Wśród przedstawicieli zawodu „${occupationPlural}” ${name} zajmuje ${rankHtml}. miejsce na ${totalFormatted}.`,
        amongBornYearRanks: ({year, name, rankHtml}) =>
          `Wśród osób urodzonych w ${year} roku ${name} zajmuje ${rankHtml}. miejsce.`,
        amongDeceasedYearRanks: ({year, name, rankHtml}) =>
          `Wśród osób zmarłych w ${year} roku ${name} zajmuje ${rankHtml}. miejsce.`,
        amongBornCountryRanks: ({countryHtml, name, rankHtml, totalFormatted}) =>
          `Wśród osób urodzonych w kraju ${countryHtml} ${name} zajmuje ${rankHtml}. miejsce na ${totalFormatted}.`,
        amongOccupationBornCountryRanks: ({occupationPlural, countryHtml, name, rankHtml}) =>
          `Wśród przedstawicieli zawodu „${occupationPlural}” urodzonych w kraju ${countryHtml} ${name} zajmuje ${rankHtml}. miejsce.`,
        beforePeers: ({gender, count}) =>
          `Przed ${gender === "M" ? "nim" : gender === "F" ? "nią" : "nimi"} ${count === 1 ? "jest" : "są"} `,
        afterPeers: ({gender, count}) =>
          `Po ${gender === "M" ? "nim" : gender === "F" ? "niej" : "nich"} ${count === 1 ? "jest" : "są"} `,
        notRankedIn: ({name, countryHtml}) => `${name} nie znajduje się w rankingu kraju ${countryHtml}`,
        mostPopularInWikipedia: ({occupationPlural}) => `Najpopularniejsi w Wikipedii: ${occupationPlural}`,
        othersBornInYear: ({year}) => `Inne osoby urodzone w ${year} roku`,
        othersDeceasedInYear: ({year}) => `Inne osoby zmarłe w ${year} roku`,
        othersBornInCountry: ({countryHtml}) => `Inne osoby urodzone w kraju ${countryHtml}`,
        demonymBornOccupations: ({demonym, occupationPlural}) => `${occupationPlural} – ${demonym}`,
        goToAllRankings: "Zobacz wszystkie rankingi",
        and: " i ",
      },
      carousel: {
        present: "obecnie",
        hpiLabel: "HPI:",
        rankLabel: "Miejsce:",
      },
      footer: {
        relatedProfiles: "Powiązane profile",
        individuals: ({countFormatted}) => `Liczba osób: ${countFormatted}`,
        rank: ({rankFormatted}) => `Miejsce ${rankFormatted}`,
      },
      header: {
        wikipediaPageViews: ({langCode}) => `WYŚWIETLENIA ${langCode}.WIKIPEDIA (PV)`,
        rankInLanguage: ({rank, language}) => `Miejsce ${rank} – ${language}`,
      },
      heatmap: {
        trendingDays: ({count}) => `Dni na czasie: ${count}`,
        less: "Mniej",
        more: "Więcej",
        clickForDetails: "Kliknij, aby zobaczyć szczegóły",
        notTrending: "Poza trendami",
        rankNum: ({rank}) => `Miejsce ${rank}`,
        viewAllTrendingNews: ({date}) => `Zobacz wszystkie popularne wiadomości z ${date}`,
      },
      pageViewsByLangChart: {
        languageEditions: "Wersje językowe",
        pageviewsByLanguageEdition: "Wyświetlenia według wersji językowej",
        cumulativeLanguageEditions: "Skumulowane wersje językowe",
        editionsWord: "wersji",
        viewsAnnotation: ({countFormatted}) => `${countFormatted} wyświetleń`,
        andOthers: ({count}) => `(i ${count} innych)`,
        summaryIntro: ({name}) => `W ciągu ostatniego roku ${name} miał najwięcej wyświetleń w `,
        wikipediaEdition: ({language}) => `edycji Wikipedii w języku: ${language}`,
        withViewsFollowedBy: ({viewsFormatted}) => ` z liczbą ${viewsFormatted} wyświetleń, a następnie `,
        growthIntro: ". Pod względem rocznego wzrostu wyświetleń 3 czołowe edycje Wikipedii to ",
        languageFamilyTooltip: ({language, languageLocal, familyName, primaryFamilyName}) =>
          `${language} (${languageLocal}) to język z grupy ${familyName}, należący do rodziny ${primaryFamilyName}.`,
        families: {
          "Indo-European": "Indoeuropejska",
          "Sino-Tibetan": "Chińsko-tybetańska",
          "Afro-Asiatic": "Afroazjatycka",
          "Altaic": "Ałtajska",
          "Dravidian": "Drawidyjska",
          "Austronesian": "Austronezyjska",
          "Uralic": "Uralska",
          "Caucasian": "Kaukaska",
          "Niger-Kordofanian": "Nigero-kordofańska",
          "Creoles and pidgins": "Kreolskie i pidżyny",
          "Amerindian": "Indiańska",
          "Tai": "Tajska",
          "Other": "Inne",
          "Albanian": "Albańska",
          "Algic": "Algijska",
          "Armenian": "Ormiańska",
          "Austro-Asiatic": "Austroazjatycka",
          "Baltic": "Bałtycka",
          "Basque": "Baskijska",
          "Berber": "Berberyjska",
          "Celtic": "Celtycka",
          "Chadic": "Czadyjska",
          "Constructed": "Sztuczna",
          "Creole (English)": "Kreolska (angielska)",
          "Creole (French)": "Kreolska (francuska)",
          "Cushitic": "Kuszycka",
          "Eskimo-Aleut": "Eskimo-aleucka",
          "Germanic": "Germańska",
          "Greek": "Grecka",
          "Indic": "Indyjska",
          "Iranian": "Irańska",
          "Italic": "Italska",
          "Japanese": "Japońska",
          "Korean": "Koreańska",
          "Malayo-Polynesian": "Malajsko-polinezyjska",
          "Mongolian": "Mongolska",
          "Na-Dene": "Na-dene",
          "Nilo-Saharan": "Nilo-saharyjska",
          "Quechuan": "Keczua",
          "Semitic": "Semicka",
          "Sinitic": "Sinicka",
          "Slavic": "Słowiańska",
          "Tibeto-Burman": "Tybeto-birmańska",
          "Tupi": "Tupi",
          "Turkic": "Turkijska",
          "Uto-Aztecan": "Uto-aztecka",
        },
      },
    },
    birthdayToast: ({name}) => `Dziś są urodziny ${name}`,
    personMetaDescription: ({name, birthYear, deathYear, demonym, occupation, rank, possessiveName}) =>
      `${name} (${birthYear}–${deathYear}) to ${demonym} ${occupation}, zajmujący #${rank} miejsce na świecie w Historycznym Indeksie Popularności Pantheonu. Poznaj biografię, wyświetlenia stron, wskaźniki pamięci i porównania ${name}.`,
    learnMoreRankless: "Dowiedz się więcej o akademickim wpływie {name} na Rankless",
    nav: {
      visualizations: "Wizualizacje",
      rankings: "Rankingi",
      profiles: "Profile",
      people: "Ludzie",
      bornOnThisDay: "Urodzeni Tego Dnia",
      places: "Miejsca",
      countries: "Kraje",
      occupations: "Zawody",
      occupationCountry: "Zawód / Kraj",
      eras: "Epoki",
      deaths: "Zgony",
      about: "O Nas",
      data: "Dane",
      permissions: "Uprawnienia",
      download: "Pobierz",
      api: "API",
      games: "Gry",
      yearbook: "Rocznik",
      birthle: "Birthle",
      trivia: "Ciekawostki",
      news: "Aktualności",
      search: "Szukaj",
      home: "Strona Główna",
      giveFeedback: "Prześlij Opinię",
      usageCitation: "Cytowanie Użycia",
      newBadge: "nowe!",
      explore: "Odkrywaj",
      apps: "Aplikacje",
      reportDataError: "Zgłoś Błąd w Danych",
      privacyPolicy: "Polityka Prywatności",
      termsOfService: "Warunki Usługi",
    },
    occupationCountry: {
      theMostFamous: "Najsławniejsi",
      from: "z",
      greatest: "Najwięksi",

      keepExploring: "Odkrywaj dalej",
      trendingThisWeek: "Trendy w tym tygodniu",
      trendScoreLabel: "Wynik trendu",
      whyTrending: "Dlaczego jest w trendach?",
      clicksThisWeek: "Kliknięcia w tym tygodniu",
      impressionsThisWeek: "Wyświetlenia w tym tygodniu",
      readMore: "Czytaj więcej",
      showLess: "Pokaż mniej",
      notablePeople: ({count, countFormatted}) => `${countFormatted || count} ${count === 1 ? "znana osoba" : "znanych osób"}`,
      viewsLabel: "wyświetleń",
      onDate: ({date}) => `dnia ${date}`,
      trendingTitle: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `W trendach ${occupationPlural} w tym tygodniu`;
        return hasFromPrefix
          ? `W trendach ${occupationPlural} ${locationLabel} w tym tygodniu`
          : `W trendach ${locationLabel} ${occupationPlural} w tym tygodniu`;
      },
      trendingIntro: ({locationLabel, occupationPlural, hasFromPrefix}) => {
        if (!locationLabel) return `Top 10 ${occupationPlural} w trendach na Wikipedii`;
        return hasFromPrefix
          ? `Top 10 ${occupationPlural} ${locationLabel} w trendach na Wikipedii`
          : `Top 10 ${locationLabel} ${occupationPlural} w trendach na Wikipedii`;
      },
      trendingIntroSuffix: "z ostatnich 7 dni, z krótkim wyjaśnieniem.",
      trendingThisWeekShort: "W trendach w tym tygodniu",
      trendingThisWeekDefault: "W trendach w tym tygodniu na Wikipedii",
      metaTitle: ({demonym, occupationPlural}) => `Najbardziej znani ${demonym} ${occupationPlural} | Pantheon`,
      metaDescription: ({countFormatted, demonym, occupationPlural, occupationSingular, country}) => `Odkryj ${countFormatted} najbardziej znanych ${demonym} ${occupationPlural} w historii. Poznaj wybitne profile ${occupationSingular} z ${country}, uporządkowane według znaczenia historycznego.`,
      birthDecadesTitle: "Osoby według dekady urodzenia",
      birthDecadesIntro: ({demonym, occupationPlural}) => `Przeglądaj znanych ${demonym} ${occupationPlural} pogrupowanych według dekady urodzenia. Każda dekada pokazuje top 10 wg HPI; rozwiń, aby zobaczyć wszystkich.`,
      decadeLabel: ({decade}) => `Lata ${decade}`,
      more: ({count}) => `+${count} więcej`,

      peopleBase: ({totalCount, demonym, occupationPlural, oldestYear, youngestYear}) => `Pantheon zawiera ${totalCount} osób sklasyfikowanych jako ${demonym} ${occupationPlural}, urodzonych między ${oldestYear} a ${youngestYear}.`,
      peopleAlive: ({totalCount, aliveCount, aliveCountFormatted, aliveShare}) => {
        if (!aliveCount) return `Z tych ${totalCount} osób nikt już nie żyje.`;
        return `Z tych ${totalCount} osób ${aliveCountFormatted} (${aliveShare}) wciąż żyje.`;
      },
      peopleLivingIntro: ({demonym, occupationPlural}) => `Najbardziej znani żyjący ${demonym} ${occupationPlural} to `,
      peopleDeceasedIntro: ({demonym, occupationPlural}) => `Najbardziej znani zmarli ${demonym} ${occupationPlural} to `,
      peopleNewAsOf: "kwiecień 2024",
      peopleNewIntro: ({asOfLabel, countFormatted, demonym, occupationPlural}) => `Od ${asOfLabel} do Pantheon dodano ${countFormatted} nowych ${demonym} ${occupationPlural}, w tym `,
      goToAllRankings: "Zobacz wszystkie rankingi",
      livingTitle: ({demonym, occupationPlural}) => `Żyjący ${demonym} ${occupationPlural}`,
      deceasedTitle: ({demonym, occupationPlural}) => `Zmarli ${demonym} ${occupationPlural}`,
      newlyAddedTitle: ({demonym, occupationPlural, yearLabel}) => `Nowo dodani ${demonym} ${occupationPlural} (${yearLabel})`,
      introText: ({demonym, occupationPlural, totalCount, countryCount, country, rank, countriesBehind}) => {
        // Helper function for Polish ordinals (use period)
        const formatPolishOrdinal = (rankStr) => {
          const num = parseInt(rankStr);
          if (isNaN(num)) return rankStr;
          return `${num}.`;
        };

        let text = `Ta strona zawiera listę największych ${demonym} ${occupationPlural}. `;
        text += `Zbiór danych Pantheon zawiera ${totalCount} ${occupationPlural}, z których ${countryCount} urodziło się w ${country}. `;
        if (rank) {
          const polishRank = formatPolishOrdinal(rank);
          text += `To sprawia, że ${country} jest ${polishRank} miejscem urodzenia największej liczby ${occupationPlural}`;
          if (countriesBehind) {
            text += ` po ${countriesBehind}.`;
          } else {
            text += `.`;
          }
        }
        return text;
      },
      and: "i",
      topTenIntro: ({count, demonym, occupationPlural}) =>
        `Następujące osoby są uważane przez Pantheon za ${count === 10 ? "10" : ""} najbardziej legendarnych ${demonym} ${occupationPlural} wszech czasów. Ta lista słynnych ${demonym} ${occupationPlural} jest posortowana według HPI (Historyczny Indeks Popularności), metryki, która agreguje informacje o popularności biografii w Internecie.`,
      visitRankings: "Odwiedź stronę rankingów, aby zobaczyć pełną listę",
      top: "Top",
      withHpi: ({hpi, name}) => `Z HPI ${hpi}, ${name}`,
      isMostFamous: ({demonym, occupation}) => `jest najbardziej znanym ${demonym} ${occupation}.`,
      isRankMostFamous: ({rank, demonym, occupation}) => `jest ${rank} najbardziej znanym ${demonym} ${occupation}.`,
      biographyTranslated: ({possessive, count}) => `${possessive} biografia została przetłumaczona na ${count} różnych języków`,
      onWikipedia: "w Wikipedii",
    },
    selectCountry: {
      heading: "Odkryj Kraje",
      subtitle: "Poznaj najwybitniejsze osoby z każdego kraju na świecie",
      metaDescription: "Odkryj wybitne osoby z każdego kraju. Przeglądaj biografie według kraju urodzenia, interaktywne mapy i postacie historyczne z całego świata.",
      totalCountries: "krajów",
      totalPeople: "wybitnych osób",
      mapTitle: "Wybitne Osoby według Kraju",
      countryList: "Wszystkie Kraje",
      sortAlpha: "A–Z",
      sortPeople: "Najwięcej Osób",
      people: "osób",
      noPeopleData: "Brak danych",
      exploreMore: "Odkryj Więcej",
      byPerson: "Wybitne Osoby",
      byOccupation: "Według Zawodu i Kraju",
      rankings: "Rankingi",
    },
    selectPlace: {
      heading: "Odkryj Miejsca",
      subtitle: "Poznaj miasta, które ukształtowały najwybitniejsze osoby w historii",
      metaDescription: "Odkryj miejsca urodzenia wybitnych osób z całego świata. Przeglądaj miasta według liczby urodzin wybitnych osób i odkryj historyczne centra.",
      totalPlaces: "miejsc",
      totalPeople: "wybitnych osób",
      mapTitle: "Miejsca Urodzenia Wybitnych Osób",
      placeList: "Najważniejsze Miejsca",
      sortAlpha: "A–Z",
      sortPeople: "Najwięcej Osób",
      groupByCountry: "Według Kraju",
      people: "osób",
      exploreMore: "Odkryj Więcej",
      byPerson: "Wybitne Osoby",
      byCountry: "Według Kraju",
      rankings: "Rankingi",
    },
    selectOccupation: {
      heading: "Odkryj Zawody",
      subtitle: "Poznaj dziedziny i zawody, które ukształtowały najwybitniejsze osoby w historii",
      metaDescription: "Odkryj 101 zawodów najwybitniejszych osób w historii. Przeglądaj według zawodu i poznaj liczbę wybitnych osób w każdej dziedzinie.",
      totalOccupations: "zawodów",
      totalPeople: "wybitnych osób",
      occupationList: "Wszystkie Zawody",
      sortAlpha: "A–Z",
      sortPeople: "Najwięcej Osób",
      people: "osób",
      exploreMore: "Odkryj Więcej",
      byPerson: "Wybitne Osoby",
      byCountry: "Według Kraju",
      rankings: "Rankingi",
    },
    selectOccupationCountry: {
      heading: "Wybierz zawód i kraj",
      pleaseSelect: "Wybierz kombinację zawodu i kraju, aby zobaczyć najbardziej niezapomniane biografie",
      selectOccupation: "Wybierz zawód",
      selectCountry: "Wybierz kraj",
      goToProfile: "Przejdź do profilu",
      whoAreTheMostFamous: "Kto jest najbardziej znany...",
      trendingThisWeek: "Trendy w Tym Tygodniu",
      browseByCountry: "Przeglądaj według kraju",
    },
    selectPerson: {
      heading: "Odkryj Znane Osoby",
      subtitle: "Przeglądaj najbardziej pamiętne biografie w historii",
      randomPerson: "Losowa osoba",
      statPeople: "biografii",
      statLanguages: "języków",
      description: "Pantheon gromadzi i klasyfikuje biografie najsłynniejszych osób w historii, z ponad 85 000 osobami uszeregowanymi według znaczenia kulturowego.",
      featuredPeople: "Wyróżnione Osoby",
      trendingNow: "Popularne Teraz",
      browseByField: "Przeglądaj Według Dziedziny",
      domainSports: "Sport",
      domainArts: "Sztuka",
      domainScience: "Nauka",
      domainPolitics: "Polityka",
      exploreMore: "Odkryj Więcej",
      byOccupationCountry: "Według Zawodu i Kraju",
      rankings: "Rankingi",
      byEra: "Według Epoki",
      metaDescription: "Odkryj najsłynniejsze osoby w historii. Przeglądaj ponad 85 000 biografii według zawodu, kraju i epoki.",
    },
    intro: {
      rankingSentence: ({
        name,
        gender,
        l,
        l_prev,
        occupationRank,
        occupationRankPrev,
        occupation,
        occupationSlug,
        bplaceCountryRank,
        bplaceCountryRankPrev,
        country,
        countrySlug,
        bplaceCountryOccupationRank,
        demonym,
        nationalityAdj,
        formatOrdinal,
      }) => {
        // Helper function for Polish ordinals (use period: 6., 5., 4.)
        const polishOrdinal = (num) => {
          if (num === 1) return "1.";
          return `${num}.`;
        };

        const possessive = gender === "M" ? "Jego" : gender === "F" ? "Jej" : "Ich";

        let sentence = `${possessive} biografia jest dostępna w ${l} różnych językach w Wikipedii`;
        if (l_prev && l !== l_prev) {
          sentence += ` (${l > l_prev ? "wzrost" : "spadek"} z ${l_prev} w 2024 roku)`;
        }
        sentence += ". ";

        // First clause: occupation ranking
        // NOTE: occupation should be in INSTRUMENTAL case in database for Polish (e.g., "filozofem" not "filozof")
        if (occupationRank === 1) {
          sentence += `${name} jest najpopularniejszym <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a>`;
        } else {
          sentence += `${name} jest ${polishOrdinal(occupationRank)} najpopularniejszym <a href="/profile/occupation/${occupationSlug}">${occupation?.toLowerCase() ?? ""}</a>`;
        }
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          sentence += ` (${occupationRank < occupationRankPrev ? "wzrost" : "spadek"} z ${polishOrdinal(occupationRankPrev)} w 2024 roku)`;
        }

        if (country) {
          // Second clause: country biography ranking
          // NOTE: country should be in GENITIVE case in database for Polish (e.g., "Grecji" not "Grecja")
          if (bplaceCountryRank === 1) {
            sentence += `, najpopularniejszą biografią <a href="/profile/place/${countrySlug}">${country}</a>`;
          } else {
            sentence += `, ${polishOrdinal(bplaceCountryRank)} najpopularniejszą biografią <a href="/profile/place/${countrySlug}">${country}</a>`;
          }
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            sentence += ` (${bplaceCountryRank < bplaceCountryRankPrev ? "wzrost" : "spadek"} z ${polishOrdinal(bplaceCountryRankPrev)} w 2019 roku)`;
          }

          // Third clause: occupation + country ranking
          // Correct Polish word order: "X. najpopularniejszym filozofem Grecji"
          if (bplaceCountryOccupationRank) {
            if (bplaceCountryOccupationRank === 1) {
              sentence += ` oraz najpopularniejszym <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} ${country}</a>`;
            } else {
              sentence += ` oraz ${polishOrdinal(bplaceCountryOccupationRank)} najpopularniejszym <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation?.toLowerCase() ?? ""} ${country}</a>`;
            }
          }
        }

        sentence += ".";
        return sentence;
      },
    },
    nav: {
      visualizations: "Wizualizacje",
      rankings: "Rankingi",
      profiles: "Profile",
      people: "Osoby",
      bornOnThisDay: "Urodzeni Tego Dnia",
      places: "Miejsca",
      countries: "Kraje",
      occupations: "Zawody",
      occupationCountry: "Zawód / Kraj",
      eras: "Epoki",
      deaths: "Zgony",
      about: "O nas",
      data: "Dane",
      permissions: "Uprawnienia",
      download: "Pobierz",
      api: "API",
      games: "Gry",
      yearbook: "Rocznik",
      birthle: "Birthle",
      trivia: "Trivia",
      news: "Aktualności",
      search: "Szukaj",
      home: "Strona główna",
      giveFeedback: "Prześlij opinię",
      usageCitation: "Cytowanie",
      newBadge: "nowość!",
    },
    readMoreWikipedia: "Czytaj więcej w Wikipedii",
    home: {
      tagline: "Odkryj zbiorową pamięć ludzkości!",
      subtitle:
        "Pantheon pomaga odkryć geografię i dynamikę historii naszej planety.",
      explore: "Odkrywaj",
      people: "Ludzie",
      places: "Miejsca",
      occupations: "Zawody",
      and: "i",
      eras: "Epoki",
      trendingProfiles: "Profile w Trendach Dzisiaj",
      topProfilesBy: "Najlepsze profile według wyświetleń strony dla",
      wikipediaEdition: "edycji wikipedii",
      about:
        "to obserwatorium pamięci zbiorowej skupione na biografiach obecnych w co najmniej",
      languages: "językach",
      aboutContinued:
        "w Wikipedii. Mamy dane dotyczące ponad 85 000 biografii, zorganizowanych według krajów, miast, zawodów i epok. Odkrywaj te dane, aby poznać postacie kształtujące kulturę ludzką.",
      aboutDeveloped:
        "rozpoczął się jako projekt grupy Collective Learning na MIT. Dziś jest rozwijany przez",
      datawheel: "Datawheel",
      aboutDatawheel:
        ", firmę specjalizującą się w tworzeniu rozwiązań dystrybucji i wizualizacji danych.",
      recentPassings: "Niedawne Zgony",
      notableDeaths: "Znaczące Zgony 2025",
      notableDeathsText:
        "Chcesz zobaczyć pełną listę znaczących postaci, które straciliśmy w 2025 roku? Odwiedź naszą",
      notableDeathsLink: "Znaczące Zgony 2025",
      notableDeathsContinued:
        "stronę, aby uzyskać obszerną kolekcję biografii wpływowych osobistości, w tym celebrytów, artystów, liderów i ikon kulturowych, którzy zmarli w tym roku.",
      trendingSingers: "Piosenkarze w Trendach Dzisiaj",
      trendingActors: "Aktorzy w Trendach Dzisiaj",
      recentlyAdded: "Ostatnio Dodane do Pantheon",
      searchPlaceholder: "Szukaj osób, miejsc i zawodów",
      isTrending: "jest dzisiaj w trendach",
      readFullStory: "Przeczytaj pełną historię",
      turningXToday: ({age}) => `Kończy dziś ${age} lat!`,
      wouldHaveBeenX: ({age}) => `Miałby dziś ${age} lat`,
      seeAllBirthdays: "Zobacz wszystkie urodziny",
      bornTodayTitle: "Sławni Ludzie Urodzeni Dziś",
    },
    recentlyAdded: {
      title: "Ostatnio Dodane do Pantheon",
      subtitle: "Odkryj najnowsze biografie dodane do kolekcji Pantheon, uporządkowane według daty dodania.",
      addedOn: ({date}) => `Dodano ${date}`,
      previous: "Poprzednia",
      next: "Następna",
      pageLabel: ({page}) => `Strona ${page}`,
      viewMore: "Zobacz więcej ostatnio dodanych osób",
      empty: "Nie znaleziono ostatnio dodanych osób.",
    },
    news: {
      pageTitle: "Kto jest dziś w trendach?",
      pageSubtitle:
        "Codzienne podsumowania postaci historycznych (wygenerowane przez AI)",
      trendingIn: "W trendach w",
      selectDate: "Wybierz inną datę",
      references: "Odniesienia:",
      noData: "Brak danych o trendach dla tej daty.",
      previousDay: "Poprzedni Dzień",
      nextDay: "Następny Dzień",
      unknown: "Nieznany",
    },
    trending: {
      isTrendingToday: "{name} jest dziś w trendach!",
      whyTrending: "Dlaczego {name} jest w trendach:",
      references: "Źródła:",
      viewMoreTrending: "Zobacz więcej osób w trendach",
    },
    bornOnThisDay: {
      famousBirthdays: "Słynne Urodziny",
      bornOnThisDay: "Urodzeni Tego Dnia",
      famousPeopleBornOnThisDay: ({count}) => `${count} ${count === 1 ? "słynna osoba urodzona" : "słynnych osób urodzonych"} tego dnia`,
      birthdayOf: ({displayDate, count}) => `${displayDate} to urodziny ${count} celebrytów i historycznie ważnych osobistości w bazie danych Pantheon.`,
      mostFamousInclude: "Do najbardziej znanych należą",
      mostCommonOccupations: "Najczęstsze zawody osób urodzonych tego dnia to",
      exploreAnotherDate: "Odkryj Inną Datę",
      go: "Idź",
      today: "Dzisiaj",
      previousDay: "Poprzedni Dzień",
      nextDay: "Następny Dzień",
      famousPeopleBornOn: ({displayDate}) => `Słynne Osoby Urodzone ${displayDate}`,
      discoverRemarkable: ({displayDate}) => `Odkryj niezwykłe osobistości, które dzielą ${displayDate} jako swoje urodziny. Od przywódców światowych i przełomowych naukowców po ukochanych artystów i legendarnych sportowców, ten dzień był świadkiem narodzin wielu wpływowych postaci w historii.`,
      someNotableInclude: "Wśród najbardziej znanych są",
      stillLivingToday: ({total, living}) => `Spośród ${total} słynnych osób urodzonych tego dnia, ${living} żyje do dziś.`,
      viewFullRankings: "Zobacz Pełny Ranking na Ten Dzień",
      born: "Urodzony/a",
      birthdaysByOccupation: "Urodziny według Zawodu",
      occupationIntro: ({displayDate}) => `Zobacz, jak słynne osoby urodzone ${displayDate} są rozłożone w różnych dziedzinach i zawodach. Kliknij dowolną osobę, aby dowiedzieć się więcej o jej życiu i osiągnięciach.`,
      showLess: "Pokaż mniej",
      more: ({count}) => `+${count} więcej`,
      formatDate: ({month, day}) => {
        const months = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
        return `${day} ${months[month - 1]}`;
      },
      metaTitle: ({displayDate}) => `Słynne Urodziny ${displayDate} | Kto Urodził Się Dziś? | Pantheon`,
      metaDescription: ({displayDate}) => `Odkryj najsłynniejsze osoby urodzone ${displayDate} w historii. Przeglądaj profile celebrytów, postaci historycznych, naukowców, artystów, sportowców i innych.`,
      months: {
        january: "Styczeń",
        february: "Luty",
        march: "Marzec",
        april: "Kwiecień",
        may: "Maj",
        june: "Czerwiec",
        july: "Lipiec",
        august: "Sierpień",
        september: "Wrzesień",
        october: "Październik",
        november: "Listopad",
        december: "Grudzień",
      },
    },
  },
};

// Helper function to get translations for a specific locale
export function getTranslations(locale, defaultLocale = "en") {
  return translations[locale] || translations[defaultLocale];
}
