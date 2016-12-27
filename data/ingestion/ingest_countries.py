# -*- coding: utf-8 -*-
import sys
import pandas as pd
from db_connection import get_engine

def slugify(series):
    return series.str.lower().str.replace("&", "and").str.replace(" ", "_")

people = pd.read_csv("raw/people2.tsv", sep="\t", na_values="null", true_values="true", false_values="false")
people = people.drop(["hpi", "l", "name", "occupation", "prob_ratio", "gender", "twitter", "alive", "wd_id"], axis=1)
people = people.drop(["deathyear", "dplace_name", "dplace_curid", "dplace_lat", "dplace_lon", "dplace_geonameid"], axis=1)
people = people.drop(["birthyear", "bplace_geonameid", "bplace_lat", "bplace_lon", "bplace_curid", "bplace_name", "least_developed", "geacron_name"], axis=1)
people = people.groupby("name_common").agg({"curid": "count", "region": "first", "continent": "first"}).reset_index()

places = pd.read_csv("cities.tsv", sep="\t", na_values="null", usecols=("ccode", "cname"))
places = places.drop_duplicates(keep="first")

people = people.merge(places, how="left", left_on="name_common", right_on="cname")
people = people.rename(columns={"curid":"num_born", "ccode":"country_code", "name_common":"country_name"})


people["born_rank"] = people["num_born"].rank(ascending=False, method="dense", na_option="bottom")
people["born_rank_unique"] = people["num_born"].rank(ascending=False, method="first", na_option="bottom")

people["is_country"] = True
people["name"] = people["country_name"]
people["slug"] = slugify(people["name"])
people["country_code"] = slugify(people["country_code"])
people = people.reset_index()
people["id"] = people["index"]+1

people = people.drop(["cname", "index"], axis=1)
print people.head(10)


people.to_sql("place", get_engine(), if_exists="append", index=False)
