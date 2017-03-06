# -*- coding: utf-8 -*-
import sys
import pandas as pd
from db_connection import get_engine

ind = pd.read_csv("raw/indicators.tsv", sep="\t", na_values="null", true_values="true", false_values="false", parse_dates=[1])
people = pd.read_csv("raw/people_20170228.tsv", sep="\t", na_values="null", true_values="true", false_values="false", usecols=("curid",))
ind['indata'] = ind['curid'].isin(people['curid'])
ind = ind[ind["indata"]]
ind = ind.drop(["indata",], axis=1)
ind = ind.rename(columns={"curid":"person", "dt":"pageview_date", "pv_en":"num_pageviews", "l":"num_langs"})
print ind.head()
print ind.tail()
ind.to_sql("indicators", get_engine(), if_exists="append", index=False, chunksize=20000)
