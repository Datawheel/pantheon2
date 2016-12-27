# -*- coding: utf-8 -*-
import sys
import pandas as pd
import numpy as np
from db_connection import get_engine

def slugify(series):
    return series.str.lower().str.replace("&", "and").str.replace(" ", "_")

places = pd.read_csv("cities.tsv", sep="\t", na_values="null", usecols=("ccode", "cname"))
places = places.drop_duplicates(keep="first")

def collapse(people, born=True):
    if born:
        people = people.drop(["dplace_name", "dplace_lat", "dplace_lon", "dplace_geonameid"], axis=1)
        # people['lat_lon'] = tuple(zip(people.bplace_lat, people.bplace_lon))
        people['lat_lon'] = people.bplace_lat.map(str) + ", " + people.bplace_lon.map(str)
        people = people.rename(columns={"bplace_geonameid":"id", "bplace_name":"name"})
        num_people_key = "num_born"
    else:
        people = people.drop(["bplace_name", "bplace_lat", "bplace_lon", "bplace_geonameid"], axis=1)
        # people['lat_lon'] = tuple(zip(people.dplace_lat, people.dplace_lon))
        people['lat_lon'] = people.dplace_lat.map(str) + ", " + people.dplace_lon.map(str)
        people = people.rename(columns={"dplace_geonameid":"id", "dplace_name":"name"})
        num_people_key = "num_died"

    people = people.groupby("id").agg({ \
            "curid": "count", \
            "name": "first", \
            "lat_lon": "first", \
            "region": "first", \
            "continent": "first", \
            "name_common": "first" \
        }).reset_index()
    people = people.merge(places, how="left", left_on="name_common", right_on="cname")
    people = people.rename(columns={"curid":num_people_key, "ccode":"country_code", "name_common":"country_name"})
    people["is_country"] = False
    people["slug"] = slugify(people["name"])
    people["country_code"] = slugify(people["country_code"])

    return people

people = pd.read_csv("raw/people2.tsv", sep="\t", na_values="null", true_values="true", false_values="false")
people = people.drop(["hpi", "l", "name", "occupation", "prob_ratio", "gender", "twitter", "alive", "wd_id", "deathyear", "birthyear", "dplace_curid", "bplace_curid", "least_developed", "geacron_name"], axis=1)
born = collapse(people)
died = collapse(people, born=False)

died_overlap = died[["id", "num_died"]]

people = born.merge(died_overlap, how="left", on="id")
print people.shape

# print died.shape

died["overlap"] = died.id.isin(born["id"])
died = died[~died["overlap"]]
died = died.drop(["overlap"], axis=1)
died["num_born"] = np.nan

people = pd.concat([people, died])

print died.shape
print people.shape
people = people.drop(["cname"], axis=1)




people["born_rank"] = people["num_born"].rank(ascending=False, method="dense", na_option="bottom")
people["born_rank_unique"] = people["num_born"].rank(ascending=False, method="first", na_option="bottom")
people["died_rank"] = people["num_died"].rank(ascending=False, method="dense", na_option="bottom")
people["died_rank_unique"] = people["num_died"].rank(ascending=False, method="first", na_option="bottom")

print people.tail(10)

# people.to_sql("place", get_engine(), if_exists="append", index=False)
