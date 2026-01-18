// UI translations for different languages
export const translations = {
  en: {
    stillAlive: "today",
    occupationCountry: {
      theMostFamous: "The Most Famous",
      from: "from",
      greatest: "Greatest",
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
    selectOccupationCountry: {
      heading: "Select an occupation and country",
      pleaseSelect: "Please select an occupation and country combination to see the most memorable biographies",
      selectOccupation: "Select an occupation",
      selectCountry: "Select a country",
      goToProfile: "Go to profile",
      whoAreTheMostFamous: "Who are the most famous...",
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

        sentence += `${name} is the ${occupationRank === 1 ? "" : formatOrdinal(occupationRank)} most popular <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a>`;
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
      notableDeaths: "Notable Deaths of 2025",
      notableDeathsText:
        "Want to see the complete list of notable figures we've lost in 2025? Visit our",
      notableDeathsLink: "Notable Deaths of 2025",
      notableDeathsContinued:
        "page for a comprehensive collection of biographies featuring influential personalities, including celebrities, artists, leaders, and cultural icons who have passed away this year.",
      trendingSingers: "Trending Singers Today",
      trendingActors: "Trending Actors Today",
      searchPlaceholder: "Search people, places, & occupations",
    },
    news: {
      pageTitle: "Who is Trending Today?",
      pageSubtitle: "Daily summaries of historical figures (generated by AI)",
      trendingIn: "Trending in",
      selectDate: "Select a different date",
      references: "References:",
      noData: "No trending data available for this date.",
      unknown: "Unknown",
    },
    trending: {
      isTrendingToday: "{name} is trending today!",
      whyTrending: "Why {name} is Trending:",
      references: "References:",
      viewMoreTrending: "View more trending people",
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
    selectOccupationCountry: {
      heading: "Seleccione una ocupación y un país",
      pleaseSelect: "Seleccione una combinación de ocupación y país para ver las biografías más memorables",
      selectOccupation: "Seleccione una ocupación",
      selectCountry: "Seleccione un país",
      goToProfile: "Ir al perfil",
      whoAreTheMostFamous: "¿Quiénes son los más famosos...",
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
        sentence += `${name} ${firstPhrase} entre los <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a> más populares`;
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
            sentence += ` y ${finalPhrase} entre los <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} ${nationalitySuffix.toLowerCase()}</a> más populares`;
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
      searchPlaceholder: "Buscar personas, lugares y ocupaciones",
    },
    news: {
      pageTitle: "¿Quién es tendencia hoy?",
      pageSubtitle: "Resúmenes diarios de figuras históricas (generado por IA)",
      trendingIn: "Tendencia en",
      selectDate: "Seleccione una fecha diferente",
      references: "Referencias:",
      noData: "No hay datos de tendencias disponibles para esta fecha.",
      unknown: "Desconocido",
    },
    trending: {
      isTrendingToday: "¡{name} es tendencia hoy!",
      whyTrending: "¿Por qué {name} es tendencia?",
      references: "Fuentes:",
      viewMoreTrending: "Ver más personas en tendencia",
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
    selectOccupationCountry: {
      heading: "Sélectionnez une profession et un pays",
      pleaseSelect: "Veuillez sélectionner une combinaison de profession et de pays pour voir les biographies les plus mémorables",
      selectOccupation: "Sélectionnez une profession",
      selectCountry: "Sélectionnez un pays",
      goToProfile: "Aller au profil",
      whoAreTheMostFamous: "Qui sont les plus célèbres...",
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
          sentence += `${name} est ${article} <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a> ${plusPopulaire}`;
        } else {
          sentence += `${name} est ${article} ${formatOrdinal(occupationRank)} <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a> ${plusPopulaire}`;
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
              sentence += `, ainsi que ${article} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} ${countryPrep}</a> ${plusPopulaire}`;
            } else {
              sentence += `, ainsi que ${article} ${formatOrdinal(bplaceCountryOccupationRank)} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} ${countryPrep}</a> ${plusPopulaire}`;
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
      searchPlaceholder: "Rechercher des personnes, des lieux et des professions",
    },
    news: {
      pageTitle: "Qui est en tendance aujourd'hui?",
      pageSubtitle:
        "Résumés quotidiens de personnages historiques (généré par IA)",
      trendingIn: "Tendance en",
      selectDate: "Sélectionner une date différente",
      references: "Références:",
      noData: "Aucune donnée de tendance disponible pour cette date.",
      unknown: "Inconnu",
    },
    trending: {
      isTrendingToday: "{name} est en tendance aujourd'hui !",
      whyTrending: "Pourquoi {name} est en tendance ?",
      references: "Sources :",
      viewMoreTrending: "Voir plus de personnes en tendance",
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
    selectOccupationCountry: {
      heading: "Wählen Sie einen Beruf und ein Land",
      pleaseSelect: "Bitte wählen Sie eine Kombination aus Beruf und Land, um die denkwürdigsten Biografien zu sehen",
      selectOccupation: "Wählen Sie einen Beruf",
      selectCountry: "Wählen Sie ein Land",
      goToProfile: "Zum Profil gehen",
      whoAreTheMostFamous: "Wer sind die berühmtesten...",
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
      searchPlaceholder: "Personen, Orte und Berufe suchen",
    },
    news: {
      pageTitle: "Wer ist heute im Trend?",
      pageSubtitle:
        "Tägliche Zusammenfassungen historischer Persönlichkeiten (von KI generiert)",
      trendingIn: "Im Trend in",
      selectDate: "Wählen Sie ein anderes Datum",
      references: "Referenzen:",
      noData: "Keine Trenddaten für dieses Datum verfügbar.",
      unknown: "Unbekannt",
    },
    trending: {
      isTrendingToday: "{name} ist heute im Trend!",
      whyTrending: "Warum {name} im Trend ist:",
      references: "Quellen:",
      viewMoreTrending: "Weitere Trendpersonen ansehen",
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
    selectOccupationCountry: {
      heading: "Выберите профессию и страну",
      pleaseSelect: "Пожалуйста, выберите комбинацию профессии и страны, чтобы увидеть самые запоминающиеся биографии",
      selectOccupation: "Выберите профессию",
      selectCountry: "Выберите страну",
      goToProfile: "Перейти к профилю",
      whoAreTheMostFamous: "Кто самые известные...",
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
          sentence += `${name} занимает 1-е место среди самых популярных <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a>`;
        } else {
          sentence += `${name} занимает ${russianOrdinal(occupationRank)} место среди самых популярных <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a>`;
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
              sentence += ` и занимает 1-е место среди <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} ${country}</a>`;
            } else {
              sentence += ` и занимает ${russianOrdinal(bplaceCountryOccupationRank)} место среди <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} ${country}</a>`;
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
      searchPlaceholder: "Поиск людей, мест и профессий",
    },
    news: {
      pageTitle: "Кто в тренде сегодня?",
      pageSubtitle:
        "Ежедневные сводки о исторических личностях (сгенерировано ИИ)",
      trendingIn: "В тренде в",
      selectDate: "Выберите другую дату",
      references: "Ссылки:",
      noData: "Нет данных о трендах для этой даты.",
      unknown: "Неизвестно",
    },
    trending: {
      isTrendingToday: "{name} сегодня в тренде!",
      whyTrending: "Почему {name} в тренде:",
      references: "Источники:",
      viewMoreTrending: "Показать больше людей в тренде",
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
    selectOccupationCountry: {
      heading: "选择职业和国家",
      pleaseSelect: "请选择职业和国家组合以查看最令人难忘的传记",
      selectOccupation: "选择职业",
      selectCountry: "选择国家",
      goToProfile: "前往个人资料",
      whoAreTheMostFamous: "谁是最著名的...",
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
      searchPlaceholder: "搜索人物、地点和职业",
    },
    news: {
      pageTitle: "今日热门人物",
      pageSubtitle: "历史人物每日摘要（由AI生成）",
      trendingIn: "热门于",
      selectDate: "选择其他日期",
      references: "参考资料：",
      noData: "此日期无趋势数据。",
      unknown: "未知",
    },
    trending: {
      isTrendingToday: "{name} 今天正在流行！",
      whyTrending: "{name} 为何走红：",
      references: "来源: ",
      viewMoreTrending: "查看更多热门人物",
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
    selectOccupationCountry: {
      heading: "職業と国を選択",
      pleaseSelect: "最も記憶に残る伝記を表示するには、職業と国の組み合わせを選択してください",
      selectOccupation: "職業を選択",
      selectCountry: "国を選択",
      goToProfile: "プロフィールに移動",
      whoAreTheMostFamous: "最も有名なのは誰...",
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
      searchPlaceholder: "人物、場所、職業を検索",
    },
    news: {
      pageTitle: "今日のトレンド人物",
      pageSubtitle: "歴史上の人物の毎日のサマリー（AI生成）",
      trendingIn: "トレンド：",
      selectDate: "別の日付を選択",
      references: "参考文献：",
      noData: "この日付の トレンドデータはありません。",
      unknown: "不明",
    },
    trending: {
      isTrendingToday: "{name} が今日のトレンドです！",
      whyTrending: "{name} がトレンドの理由",
      references: "出典：",
      viewMoreTrending: "他のトレンド人物を見る",
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
    selectOccupationCountry: {
      heading: "اختر مهنة وبلد",
      pleaseSelect: "يرجى اختيار مزيج من المهنة والبلد لرؤية السير الذاتية الأكثر تميزًا",
      selectOccupation: "اختر مهنة",
      selectCountry: "اختر بلد",
      goToProfile: "الذهاب إلى الملف الشخصي",
      whoAreTheMostFamous: "من هم الأكثر شهرة...",
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
      searchPlaceholder: "البحث عن الأشخاص والأماكن والمهن",
    },
    news: {
      pageTitle: "من هو في الموضة اليوم؟",
      pageSubtitle:
        "ملخصات يومية للشخصيات التاريخية (تم إنشاؤها بواسطة الذكاء الاصطناعي)",
      trendingIn: "رائج في",
      selectDate: "اختر تاريخًا مختلفًا",
      references: "المراجع:",
      noData: "لا تتوفر بيانات الاتجاهات لهذا التاريخ.",
      unknown: "غير معروف",
    },
    trending: {
      isTrendingToday: "{name} رائج اليوم!",
      whyTrending: "لماذا {name} رائج:",
      references: "المصادر:",
      viewMoreTrending: "عرض المزيد من الأشخاص الرائجين",
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
    selectOccupationCountry: {
      heading: "Seleziona una professione e un paese",
      pleaseSelect: "Seleziona una combinazione di professione e paese per vedere le biografie più memorabili",
      selectOccupation: "Seleziona una professione",
      selectCountry: "Seleziona un paese",
      goToProfile: "Vai al profilo",
      whoAreTheMostFamous: "Chi sono i più famosi...",
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
          sentence += `${name} è ${article} <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a> più ${gender === "F" ? "popolare" : "popolare"}`;
        } else {
          const rankStr = italianOrdinal(occupationRank, gender === "F");
          sentence += `${name} è ${article} ${rankStr} <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a> più ${gender === "F" ? "popolare" : "popolare"}`;
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
              sentence += ` e ${article} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} più ${gender === "F" ? "popolare" : "popolare"} ${countryPrep}${country}</a>`;
            } else {
              const rankStr = italianOrdinal(bplaceCountryOccupationRank, gender === "F");
              sentence += ` e ${article} ${rankStr} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} più ${gender === "F" ? "popolare" : "popolare"} ${countryPrep}${country}</a>`;
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
      searchPlaceholder: "Cerca persone, luoghi e professioni",
    },
    news: {
      pageTitle: "Chi è di tendenza oggi?",
      pageSubtitle:
        "Riassunti quotidiani di personaggi storici (generato da IA)",
      trendingIn: "Di tendenza in",
      selectDate: "Seleziona una data diversa",
      references: "Riferimenti:",
      noData: "Nessun dato di tendenza disponibile per questa data.",
      unknown: "Sconosciuto",
    },
    trending: {
      isTrendingToday: "{name} è di tendenza oggi!",
      whyTrending: "Perché {name} è di tendenza:",
      references: "Fonti:",
      viewMoreTrending: "Vedi altre persone di tendenza",
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
    selectOccupationCountry: {
      heading: "Selecione uma profissão e um país",
      pleaseSelect: "Selecione uma combinação de profissão e país para ver as biografias mais memoráveis",
      selectOccupation: "Selecione uma profissão",
      selectCountry: "Selecione um país",
      goToProfile: "Ir para o perfil",
      whoAreTheMostFamous: "Quem são os mais famosos...",
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
          sentence += `${name} é ${article} <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a> mais ${gender === "F" ? "popular" : "popular"}`;
        } else {
          const rankStr = portugueseOrdinal(occupationRank, gender === "F");
          sentence += `${name} é ${article} ${rankStr} <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a> mais ${gender === "F" ? "popular" : "popular"}`;
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
              sentence += ` e ${article} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} mais ${gender === "F" ? "popular" : "popular"} ${countryPrep}</a>`;
            } else {
              const rankStr = portugueseOrdinal(bplaceCountryOccupationRank, gender === "F");
              sentence += ` e ${article} ${rankStr} <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} mais ${gender === "F" ? "popular" : "popular"} ${countryPrep}</a>`;
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
      searchPlaceholder: "Pesquisar pessoas, lugares e profissões",
    },
    news: {
      pageTitle: "Quem está em alta hoje?",
      pageSubtitle: "Resumos diários de figuras históricas (gerado por IA)",
      trendingIn: "Em alta em",
      selectDate: "Selecione uma data diferente",
      references: "Referências:",
      noData: "Nenhum dado de tendência disponível para esta data.",
      unknown: "Desconhecido",
    },
    trending: {
      isTrendingToday: "{name} está em alta hoje!",
      whyTrending: "Por que {name} está em alta?",
      references: "Referências:",
      viewMoreTrending: "Ver mais pessoas em alta",
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
    },
    selectOccupationCountry: {
      heading: "Válasszon foglalkozást és országot",
      pleaseSelect: "Kérjük, válasszon egy foglalkozás és ország kombinációt a legmaradandóbb életrajzok megtekintéséhez",
      selectOccupation: "Válasszon foglalkozást",
      selectCountry: "Válasszon országot",
      goToProfile: "Ugrás a profilhoz",
      whoAreTheMostFamous: "Kik a leghíresebbek...",
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

        sentence += `${name} a ${occupationRank === 1 ? "" : formatOrdinal(occupationRank)} legnépszerűbb <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a>`;
        if (occupationRankPrev && occupationRankPrev !== occupationRank) {
          sentence += ` (${occupationRank < occupationRankPrev ? "növekedés" : "csökkenés"} a ${formatOrdinal(occupationRankPrev)}-ről 2024-ben)`;
        }

        if (country) {
          sentence += `, a ${bplaceCountryRank !== 1 ? formatOrdinal(bplaceCountryRank) : ""} legnépszerűbb életrajz <a href="/profile/place/${countrySlug}">${country}</a> országából`;
          if (bplaceCountryRankPrev && bplaceCountryRankPrev !== bplaceCountryRank) {
            sentence += ` (${bplaceCountryRank < bplaceCountryRankPrev ? "növekedés" : "csökkenés"} a ${formatOrdinal(bplaceCountryRankPrev)}-ről 2019-ben)`;
          }

          if (bplaceCountryOccupationRank) {
            sentence += ` és a ${bplaceCountryOccupationRank !== 1 ? formatOrdinal(bplaceCountryOccupationRank) : ""} legnépszerűbb <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${demonym} ${occupation.toLowerCase()}</a>`;
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
      searchPlaceholder: "Személyek, helyek és foglalkozások keresése",
    },
    news: {
      pageTitle: "Ki a felkapott ma?",
      pageSubtitle:
        "Történelmi személyiségek napi összefoglalói (AI által generálva)",
      trendingIn: "Felkapott:",
      selectDate: "Válasszon más dátumot",
      references: "Hivatkozások:",
      noData: "Nincs elérhető trendinformáció ehhez a dátumhoz.",
      unknown: "Ismeretlen",
    },
    trending: {
      isTrendingToday: "{name} ma felkapott!",
      whyTrending: "Miért felkapott {name}:",
      references: "Hivatkozások:",
      viewMoreTrending: "További felkapott személyek",
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
    selectOccupationCountry: {
      heading: "Selecteer een beroep en land",
      pleaseSelect: "Selecteer een combinatie van beroep en land om de meest gedenkwaardige biografieën te zien",
      selectOccupation: "Selecteer een beroep",
      selectCountry: "Selecteer een land",
      goToProfile: "Ga naar profiel",
      whoAreTheMostFamous: "Wie zijn de beroemdste...",
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
        sentence += `${name} staat op ${placePhrase} onder de meest populaire <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a>`;
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
            sentence += ` en op ${finalPlacePhrase} onder de populairste <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} uit ${country}</a>`;
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
      searchPlaceholder: "Zoek personen, plaatsen en beroepen",
    },
    news: {
      pageTitle: "Wie is vandaag trending?",
      pageSubtitle:
        "Dagelijkse samenvattingen van historische figuren (gegenereerd door AI)",
      trendingIn: "Trending in",
      selectDate: "Selecteer een andere datum",
      references: "Referenties:",
      noData: "Geen trendgegevens beschikbaar voor deze datum.",
      unknown: "Onbekend",
    },
    trending: {
      isTrendingToday: "{name} is vandaag trending!",
      whyTrending: "Waarom {name} trending is:",
      references: "Referenties:",
      viewMoreTrending: "Meer trending mensen bekijken",
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
    selectOccupationCountry: {
      heading: "Wybierz zawód i kraj",
      pleaseSelect: "Wybierz kombinację zawodu i kraju, aby zobaczyć najbardziej niezapomniane biografie",
      selectOccupation: "Wybierz zawód",
      selectCountry: "Wybierz kraj",
      goToProfile: "Przejdź do profilu",
      whoAreTheMostFamous: "Kto jest najbardziej znany...",
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
          sentence += `${name} jest najpopularniejszym <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a>`;
        } else {
          sentence += `${name} jest ${polishOrdinal(occupationRank)} najpopularniejszym <a href="/profile/occupation/${occupationSlug}">${occupation.toLowerCase()}</a>`;
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
              sentence += ` oraz najpopularniejszym <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} ${country}</a>`;
            } else {
              sentence += ` oraz ${polishOrdinal(bplaceCountryOccupationRank)} najpopularniejszym <a href="/profile/occupation/${occupationSlug}/country/${countrySlug}">${occupation.toLowerCase()} ${country}</a>`;
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
      searchPlaceholder: "Szukaj osób, miejsc i zawodów",
    },
    news: {
      pageTitle: "Kto jest dziś w trendach?",
      pageSubtitle:
        "Codzienne podsumowania postaci historycznych (wygenerowane przez AI)",
      trendingIn: "W trendach w",
      selectDate: "Wybierz inną datę",
      references: "Odniesienia:",
      noData: "Brak danych o trendach dla tej daty.",
      unknown: "Nieznany",
    },
    trending: {
      isTrendingToday: "{name} jest dziś w trendach!",
      whyTrending: "Dlaczego {name} jest w trendach:",
      references: "Źródła:",
      viewMoreTrending: "Zobacz więcej osób w trendach",
    },
  },
};

// Helper function to get translations for a specific locale
export function getTranslations(locale, defaultLocale = "en") {
  return translations[locale] || translations[defaultLocale];
}
