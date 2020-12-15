import React from "react";
import {Helmet} from "react-helmet-async";

const Faq = () =>
  <div className="data-faq-container">
    <Helmet title="About Pantheon and FAQs" />
    <h1>Pantheon Frequently Asked Questions</h1>

    <h2>What is Pantheon?</h2>
    <p>Pantheon is project that uses biographical data to expose patterns of human collective memory. Pantheon contains data on more than 70k biographies, which Pantheon distributes through a powerful data visualization engine centered on locations, occupations, and biographies. Pantheon’s biographical data contains information on the age, occupation, place of birth, and place of death, of historical characters with a presence in more than 15 language editions of Wikipedia. Pantheon also uses real-time data from the Wikipedia API to show the dynamics of attention received by historical characters in different Wikipedia language editions.</p>
    <p>Pantheon’s front-end expresses the data through profiles that aggregate data for locations (cities and countries), occupations (e.g. actor, painter, astronomer, tennis player), and eras. Pantheon’s front end also contains a visualization builder, which allows users to construct custom visualizations, and a yearbook function, which provides an entertaining summary of people born each year during the twentieth century.</p>

    <h2>Who uses Pantheon?</h2>
    <p>Pantheon 1.0 was visited by over half-a-million people, including students, scholars, entertainment industry executives, and history aficionados. The data from Pantheon has been used in several academic publications. For instance, we have used it in in work connecting the <a href="https://www.pnas.org/content/111/52/E5616" target="_blank" rel="noopener noreferrer">centrality of languages in the network of translations with fame</a>, in work exploring <a href="https://www.nature.com/articles/s41562-018-0474-5" target="_blank" rel="noopener noreferrer">the decay of human collective memory</a>, and in work showing how <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0205771" target="_blank" rel="noopener noreferrer">the size and composition of human collective memory changes with the introduction of communication technologies</a></p>
    <p>Pantheon has also been used by people in the entertainment industry to estimate the potential market size of biographical productions.  Pantheon is also a popular resource with some history teachers and scholars in the digital humanities.</p>

    <h2>How was the data from Pantheon collected?</h2>
    <p>Pantheon data was collected through a slow and painful process involving several steps. First, we identify all entities of the type biography from Wikidata. This takes a few days. Then, we use the Wikipedia API to identify all biographies that have a presence in more than 15 language editions of Wikipedia. We then run a classifier over the English text of those biographies to identify the occupation, place of birth, place of death, and gender of each biography. That classifier, called Johnny 5 in honor of the famous robot from short circuit was trained using Pantheon 1.0 data (which had been more manually curated). Johnny 5 maps locations to latitudes and longitudes and clusters them. For instance, we group people born in “The Upper East Side” or “Manhattan,” into the “New York City,” location. This classification and aggregation uses present day geographical boundaries (Pantheon does not have information on the nationality of people, but on geographical location where they were born). Then, we put the data in the front-end and search for bugs and gaps in content. We use the front-end to help clean the data, rerunning parts of the data pipeline, or sometimes, manually correcting misclassified entries. For more details on the methodology see: the Pantheon 1.0  paper in Nature’s Scientific Data.</p>
    <p>Pantheon’s methodology is scalable, but not bulletproof. You can report data issues here.</p>

    <h2>What is HPI?</h2>
    <p>HPI stands for Historical Popularity Index. It is a simple an ad-hoc metric that aggregates information on a biography’s online popularity. HPI is based on the idea that fame needs to break multiple barriers, like those of time and language.  HPI aggregates information on the age and attention received by biographies in multiple language editions of Wikipedia to provide a summary statistic of their global popularity.</p>
    <p>HPI is currently made of five components: the “age” of a biography’s character (e.g. Jesus is more than 2,000 years old), number of Wikipedia language editions in which the biography has a presence (L), the concentration of the pageviews received by a biography across languages (L*), the stability of pageviews over time (CV), and the number of non-English pageviews received by that biography. We find that combining these metrics provides a more sensible ranking than using these metrics alone. <a href="https://www.nature.com/articles/sdata201575" target="_blank" rel="noopener noreferrer">To validate HPI, we previously showed that it correlates better with accomplishments than single metrics</a>, when we focus on activities where individual accomplishments are measurable (e.g. Chess, Olympic Swimming, Tennis, Formula One).</p>
    <p>While being an ad-hoc metric, HPI also attempts to correct for the internet’s English bias. By using non-English page views, and giving a premium to biographies that have a presence in multiple languages, and whose pageviews are not concentrated in only a few of them, HPI tries to move away from a ranking dominated by English pageviews. </p>

    <h2>Where can I submit a suggestion?</h2>
    <p>You can use the following form to suggest correction to Pantheon’s data. Pantheon’s atomic unit of data is the biography, so all corrections should be communicated as corrections to a biography (everything else is an aggregate). </p>

    <a className="bp3-button bp3-icon-link" href="https://docs.google.com/forms/d/e/1FAIpQLSdHKWwONdugZfwQvCvkSHakG-xeFh_HOZcvK3NqVOv19h0-jQ/viewform" target="_blank" rel="noopener noreferrer">Pantheon Data Correction Form</a>

    <h2>Who made Pantheon?</h2>
    <p>Pantheon is a collaboration between multiple people. Pantheon 1.0 (2013-2018) started as a project by MIT’s Collective Learning group, under the supervision of Professor Cesar A. Hidalgo. Pantheon 1.0 was developed by Amy Yu, with the support of Kevin Hu, Ali Almossawi, and Shahar Ronen, among others. Pantheon 2.0 (2019-today) was developed by <a href="https://datawheel.us/" target="_blank" rel="noopener">Datawheel</a> (mainly by Alex Simoes with the support of Marcio Porto). The Pantheon 2.0 data collection script (Johnny 5), was created by Cristian Jara-Figueroa at MIT’s Collective Learning group. Pantheohn 2.0 was also developed under the supervision of Cesar A. Hidalgo.</p>

    <h2>How did the idea of Pantheon come about?</h2>
    <p>Pantheon was inspired by the <a href="https://oec.world/" target="_blank" rel="noopener noreferrer">Observatory of Economic Complexity (OEC)</a>, the world’s leading data visualization tool for international trade data. The OEC provides a global picture of the geography of productive knowledge based expressed in international trade data. Pantheon’s idea was to create a similar resource focused on cultural exports. For instance, in the OEC, Brazil exports Iron Ore, Soybeans, and Aircraft. In Pantheon, Brazil exports Soccer Players and Politicians.</p>

  </div>;

export default Faq;
