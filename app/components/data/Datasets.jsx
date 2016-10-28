import React from 'react';

const Datasets = () => {
  return (
    <div>
      <h1>Download Data</h1>
      <p>The Pantheon 1.0 datasets are available to download from the links below:</p>
      <p><a href="http://pantheon.media.mit.edu/pantheon.tsv">pantheon.tsv</a>, is a flattened tab-limited table, where each row of the table represents a unique biography.</p>
      <p><a href="http://pantheon.media.mit.edu/wikilangs.tsv">wikilangs.tsv</a>, is a tab-delimited table of all the different Wikipedia language editions that each biography has a presence in.</p>
      <p><a href="http://pantheon.media.mit.edu/pageviews_2008-2013.tsv">pageviews_2008-2013.tsv</a> contains the monthly pageview data for each individual, for all the Wikipedia language editions in which they have a presence.</p>
      <p>Please refer to the <a href="/about/methods">methods</a> section for more information on how this data was created. For detailed descriptions of these datasets, please refer to our <a href="https://arxiv.org/abs/1502.07310">data descriptor paper</a>.</p>
      <p>If you use the Pantheon dataset, please cite: Yu, A. Z., et al. (2016). Pantheon 1.0, a manually verified dataset of globally famous biographies. <i>Scientific Data</i> 2:150075. doi: 10.1038/sdata.2015.75</p>
    </div>
  );
};

export default Datasets;
