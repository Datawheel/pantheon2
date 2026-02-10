"use client";

import {useState, useEffect} from "react";
import {getTranslations} from "/app/translations";

const WikiExtract = ({personSlug, localizedName, lang = "en"}) => {
  const [wikiData, setWikiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const t = getTranslations(lang);

  useEffect(() => {
    const fetchWikiExtract = async () => {
      try {
        const headers = {
          "Api-User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
        };

        let extractData = null;
        let targetUrl = null;

        if (lang === "en") {
          // For English, use the slug directly
          const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|info&inprop=url&exsentences=4&explaintext&exsectionformat=wiki&exintro&titles=${encodeURIComponent(personSlug)}&format=json&exlimit=1&origin=*`;
          const res = await fetch(url, {headers});
          extractData = await res.json();
        } else {
          // Step 1: Get langlink from English Wikipedia to target language
          const langLinkUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(personSlug)}&prop=langlinks&lllimit=500&llprop=url&lllang=${lang}&format=json&origin=*`;
          const langLinkRes = await fetch(langLinkUrl, {headers});
          const langLinkData = await langLinkRes.json();

          // Extract the langlink URL and title
          let targetTitle = null;

          if (langLinkData.query && langLinkData.query.pages) {
            const pageId = Object.keys(langLinkData.query.pages)[0];
            const page = langLinkData.query.pages[pageId];

            if (page.langlinks && page.langlinks.length > 0) {
              const langLink = page.langlinks[0];
              targetTitle = langLink["*"];
              targetUrl = langLink.url;
            }
          }

          // If no langlink found, fall back to using the slug or localized name
          if (!targetTitle) {
            targetTitle = localizedName || personSlug.replace(/_/g, " ");
          }

          // Step 2: Get extract from target language Wikipedia
          const extractUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts|info&inprop=url&exsentences=4&explaintext&exsectionformat=wiki&exintro&titles=${encodeURIComponent(targetTitle)}&format=json&exlimit=1&origin=*`;
          const extractRes = await fetch(extractUrl, {headers});
          extractData = await extractRes.json();
        }

        // Process the extract data
        if (extractData?.query?.pages) {
          const pageId = Object.keys(extractData.query.pages)[0];
          const page = extractData.query.pages[pageId];

          if (page && page.extract) {
            let wikiSentence = page.extract;
            if (wikiSentence.length > 1000) {
              // take up until last full sentence
              wikiSentence = wikiSentence.slice(0, wikiSentence.lastIndexOf(". "));
              // remove line breaks
              wikiSentence = wikiSentence.replace(/(\r\n|\n|\r)/gm, " ");
              // remove all wiki markup (replace all instances of 2 or more `=` signs)
              wikiSentence = wikiSentence.replace(/={2,}[\w\s]+={2,}/g, "");
              // remove double spaces
              wikiSentence = wikiSentence.replace(/  +/g, " ");
              // add final period back in
              wikiSentence = wikiSentence + ".";
            }

            // Use the actual Wikipedia URL from the API or langlinks
            let wikiUrl = targetUrl || page.fullurl;
            if (!wikiUrl) {
              const wikiSlug = page.title.replace(/ /g, "_");
              wikiUrl = `https://${lang}.wikipedia.org/wiki/${wikiSlug}`;
            }

            setWikiData({sentence: wikiSentence, url: wikiUrl});
          }
        }
      } catch (error) {
        console.error("Error fetching Wikipedia extract:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWikiExtract();
  }, [personSlug, localizedName, lang]);

  if (loading || !wikiData) {
    return null;
  }

  return (
    <p>
      {wikiData.sentence}{" "}
      <a href={wikiData.url} target="_blank" rel="noopener noreferrer">
        {t.readMoreWikipedia}
      </a>
    </p>
  );
};

export default WikiExtract;
