import React from 'react';

const DataSources = () => {
  return (
    <div>
      <h1>Data Sources</h1>
      <h2>Data Source 1</h2>
      <p>The Pantheon Multilingual Wikipedia Expression Dataset (or Pantheon Data 1.0) by Amy Yu, Kevin Hu, Shahar Ronen, Defne Gurel and Cesar A. Hidalgo (2013)</p>
      <p>The Pantheon 1.0 data was curated by the creators of Pantheon and gathers information on the 11,341 biographies that have presence in more than 25 languages in the Wikipedia (as of May 2013). This dataset is not restricted to any cultural domain or time period, including all biographies that are present in more than 25 different language editions of Wikipedia.</p>
      <p>The creation of the Pantheon 1.0 dataset included connecting each biography to a location using the country where the city of birth is presently located. Biographies were also connected to their date of birth—or an approximate date of birth when an exact date was not available—and a cultural domain, based on a categorization we developed specifically for this dataset. Details about the biases, limitations, coverage and validation of this dataset are described below.</p>

      <h2>Data Source 2</h2>
      <p>Human Accomplishment. The pursuit of excellence in the Arts and Sciences, 800BC to 1950. By Charles Murray (2003) [4]</p>
      <p>Human Accomplishment is a book and a data compilation effort containing information on 3,896 eminent individuals from the arts and sciences who made a significant contribution prior to 1950. The inventories were constructed by Charles Murray using linguistic records—such as encyclopedia entries—from a number of different languages and sources. Human Accomplishment connects each of these historical figures to a location, time and cultural domain, albeit does so using a different methodology than the one we use for the Pantheon 1.0 data.</p>
      <p>During the data compilation face of the Pantheon project we connected both datasets at the level of individuals—a.k.a. historical figures.</p>
      <p>Details about the data in <a href="https://www.amazon.com/Human-Accomplishment-Pursuit-Excellence-Sciences/dp/0060929642">Human Accomplishment</a>, including its limitations, biases, and validation can be found in Murray’s original book, and hence, will be not discussed here.</p>

      <h2>Future Datasets</h2>
      <p>In the future we are planning to release these new data sources that focus on different aspects of cultural production.</p>
    </div>
  );
};

export default DataSources;
