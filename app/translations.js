// UI translations for different languages
export const translations = {
  en: {
    stillAlive: "today",
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
