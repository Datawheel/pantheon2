import bz2, psycopg2, sys
from datetime import datetime
import pandas as pd

conn = psycopg2.connect("dbname=pantheon user=zeus")
cursor = conn.cursor()

cursor.execute("SELECT wiki_id, id from person where wiki_id is not null")
person_lookup = {r[0]:r[1] for r in cursor.fetchall()}

pageviews_df = pd.read_csv(bz2.BZ2File("data/pageviews_raw.tsv.bz2", "rb"), sep="\t", header=None, names=["person", "lang", "date", "pageviews"])
pageviews_df = pageviews_df.groupby(["person", "date"]).sum()

for index, row in pageviews_df.iterrows():
    person_wiki_id, date_str = index
    pageviews = row["pageviews"]
    person = person_lookup[person_wiki_id]
    date = datetime.strptime(str(date_str), "%Y%m%d").strftime("%Y-%m-%d")
    
    query = 'INSERT INTO pageview (person, pageview_date, num_pageviews) VALUES (%s, %s, %s)'
    data = (person, date, pageviews)

    cursor.execute(query, data)
    conn.commit()

# pg_dump -t pageview pantheon -O -x > pantheon_pageview.sql