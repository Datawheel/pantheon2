import React from "react";

const Datasets = () =>
  <div>
    <h1>Download Data</h1>
    <h2>Pantheon 2.0 datasets</h2>
    <dl className="download-dl">
      <dt><a href="https://pantheon.world/data/files/person_latest.csv.bz2">person_latest.csv.bz2</a></dt>
      <dd>A compressed comma delimited file containing a row of data per person found in the Panthon 2.0 dataset.</dd>
    </dl>
    <br />
    <hr />
    <br />
    <h2>Pantheon 1.0 datasets</h2>
    <dl className="download-dl">
      <dt><a href="https://pantheon.world/data/files/pantheon.tsv.bz2">pantheon.tsv</a></dt>
      <dd>A tab delimited file containing a row of data per person found in the Panthon 1.0 dataset.</dd>
    </dl>
    <dl className="download-dl">
      <dt><a href="https://pantheon.world/data/files/wikilangs.tsv.bz2">wikilangs.tsv</a></dt>
      <dd>A tab delimited file of all the different Wikipedia language editions that each biography has a presence in.</dd>
    </dl>
    <dl className="download-dl">
      <dt><a href="https://pantheon.world/data/files/pageviews_2008-2013.tsv.bz2">pageviews_2008-2013.tsv</a></dt>
      <dd>A file containing the monthly pageview data for each individual, for all the Wikipedia language editions in which they have a presence.</dd>
    </dl>
    <p className="outro">Please refer to the <a href="/about/methods">methods</a> section for more information on how this data was created. For detailed descriptions of these datasets, please refer to our <a href="https://arxiv.org/abs/1502.07310">data descriptor paper</a>.</p>
    <p>If you use the Pantheon dataset, please cite: Yu, A. Z., et al. (2016). Pantheon 1.0, a manually verified dataset of globally famous biographies. <i>Scientific Data</i> 2:150075. doi: 10.1038/sdata.2015.75</p>
  </div>;

export default Datasets;
