# -*- coding: utf-8 -*-
import sys, unicodedata, string
import pandas as pd
from db_connection import get_engine
engine = get_engine()

# Turn a Unicode string to plain ASCII, thanks to http://stackoverflow.com/a/518232/2809427
all_letters = string.ascii_letters + " .,;'"
def unicodeToAscii(s):
    return ''.join(
        c for c in unicodedata.normalize('NFD', s)
        if unicodedata.category(c) != 'Mn'
        and c in all_letters
    )

people = pd.read_csv("raw/people_20170228.tsv", sep="\t", na_values="null", true_values="true", false_values="false", encoding="utf-8")
people = people.rename(columns={"curid":"id", "bplace_geonameid":"birthplace", "dplace_geonameid":"deathplace", "l":"langs"})
people = people.drop(["bplace_lat", "bplace_lon", "bplace_name", "geacron_name", \
                        "dplace_lat", "dplace_lon", "dplace_name", "wd_id", "prob_ratio", \
                        "name_common","region","continent","least_developed"], axis=1)
people["slug"] = people["name"].apply(unicodeToAscii)
people["slug"] = people["slug"].str.lower().str.replace(" ", "_")

# need birth & death country
countries = pd.read_sql("select p1.id as place_id, p2.id as country_code from place p1, place p2 where p1.is_country is false and p2.is_country is true and p1.country_code = p2.country_code", engine)
people["birthcountry"] = people["birthplace"]
people["deathcountry"] = people["deathplace"]
people = people.merge(countries, how="left", left_on="birthcountry", right_on="place_id")
people = people.merge(countries, how="left", left_on="deathcountry", right_on="place_id", suffixes=('', '_death'))
people = people.drop(["place_id", "place_id_death", "birthcountry", "deathcountry"], axis=1)
people = people.rename(columns={"country_code":"birthcountry", "country_code_death":"deathcountry"})

# need occupation IDs
occupations = pd.read_sql("select id, occupation from occupation", engine, index_col="id")
occupations["occupation"] = occupations["occupation"].str.upper()
occupations = occupations["occupation"].to_dict()
occupations = {v:k for k, v in occupations.items()}
people["occupation"] = people["occupation"].replace(occupations)

# need era IDs (for rankings)
eras = pd.read_sql("select id, start_year, end_year from era", engine, index_col="id")
eras_lookup = {y:None for y in range(-3501, -500)}
for id, (start_year, end_year) in eras.iterrows():
    for year in range(start_year, end_year+1):
        eras_lookup[year] = id
people["birthera"] = people["birthyear"].replace(eras_lookup)
people["deathera"] = people["deathyear"].replace(eras_lookup)

# print people.tail(10)
# print people[people["id"]==435773]

places = pd.read_sql("select id as place_id, is_country from place", engine)
people = people.merge(places, how="left", left_on="birthplace", right_on="place_id")
# print people.dtypes
# print people.loc[0,:]
# print people.is_country.value_counts()
people.loc[lambda df: df.is_country.isnull(), ("is_country",)] = False
people.loc[lambda df: df.is_country, ("birthplace",)] = None
people = people.drop(["place_id", "is_country"], axis=1)

people = people.merge(places, how="left", left_on="deathplace", right_on="place_id")
people.loc[lambda df: df.is_country & ~df.deathplace.isnull(), ("deathplace",)] = None
people = people.drop(["place_id", "is_country"], axis=1)

# calculate ranks...
for rank_type in ["birthyear", "deathyear", "birthcountry", "deathcountry", \
                    "birthplace", "deathplace", "occupation", "birthera", "deathera"]:
    people["{}_rank".format(rank_type)] = people.groupby(rank_type)['hpi'].rank(ascending=False, method="dense", na_option="bottom")
    people["{}_rank_unique".format(rank_type)] = people.groupby(rank_type)['hpi'].rank(ascending=False, method="first", na_option="bottom")

# print people.tail(10)
# print people.loc[0,:]
people.to_sql("person", engine, if_exists="append", index=False)
