import "/styles/About.css";

export default async function Page() {
  return (
    <div>
      <h1>Download Data</h1>
      <h2>Pantheon 2.0 datasets</h2>
      <dl className="download-dl">
        <dt>
          <a href="https://storage.googleapis.com/pantheon-public-data/person_2020_update.csv.bz2">
            2020 Person Dataset
          </a>
        </dt>
        <dd>
          A bzip compressed comma delimited file containing a row of data per
          person found in the Panthon 2.0 version released in 2020.
        </dd>
      </dl>
      <dl className="download-dl">
        <dt>
          <a href="https://storage.googleapis.com/pantheon-public-data/person_2019_update.csv.bz2">
            2019 Person Dataset
          </a>
        </dt>
        <dd>
          A bzip compressed comma delimited file containing a row of data per
          person found in the Panthon 2.0 version released in 2019.
        </dd>
      </dl>
      <br />
      <hr />
      <br />
      <h2>Pantheon 1.0 datasets</h2>
      <dl className="download-dl">
        <dt>
          <a href="https://storage.googleapis.com/pantheon-public-data/legacy_pantheon.tsv.bz2">
            pantheon.tsv
          </a>
        </dt>
        <dd>
          A tab delimited file containing a row of data per person found in the
          Panthon 1.0 dataset.
        </dd>
      </dl>
      <dl className="download-dl">
        <dt>
          <a href="https://storage.googleapis.com/pantheon-public-data/legacy_wikilangs.tsv.bz2">
            wikilangs.tsv
          </a>
        </dt>
        <dd>
          A tab delimited file of all the different Wikipedia language editions
          that each biography has a presence in.
        </dd>
      </dl>
      <dl className="download-dl">
        <dt>
          <a href="https://storage.googleapis.com/pantheon-public-data/legacy_pageviews_2008-2013.tsv.bz2">
            pageviews_2008-2013.tsv
          </a>
        </dt>
        <dd>
          A file containing the monthly pageview data for each individual, for
          all the Wikipedia language editions in which they have a presence.
        </dd>
      </dl>
      <p className="outro">
        Please refer to the <a href="/about/methods">methods</a> section for
        more information on how this data was created. For detailed descriptions
        of these datasets, please refer to our{" "}
        <a href="https://arxiv.org/abs/1502.07310">data descriptor paper</a>.
      </p>
      <p>
        If you use the Pantheon dataset, please cite: Yu, A. Z., et al. (2016).
        Pantheon 1.0, a manually verified dataset of globally famous
        biographies. <i>Scientific Data</i> 2:150075. doi: 10.1038/sdata.2015.75
      </p>
    </div>
  );
}
