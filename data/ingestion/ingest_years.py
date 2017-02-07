# -*- coding: utf-8 -*-
import sys
import pandas as pd
from db_connection import get_engine

people = pd.read_csv("raw/people.tsv", sep="\t", na_values="null", true_values="true", false_values="false",usecols=("birthyear", "deathyear"))
births = people.groupby("birthyear").size()
deaths = people.groupby("deathyear").size()
years = pd.concat([births, deaths], axis=1)
years.columns = ["num_born", "num_died"]
years = years.reset_index()
years = years.rename(columns={"index":"id"})
years["name"] = years["id"]
years["slug"] = years["id"]

years.to_sql("year", get_engine(), if_exists="append", index=False)
