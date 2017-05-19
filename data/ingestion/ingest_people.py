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
people = people.drop(["wd_id", "prob_ratio", "name_common","region","continent","least_developed"], axis=1)
people["slug"] = people["name"].apply(unicodeToAscii)
people["slug"] = people["slug"].str.lower().str.replace(" ", "_")

people['bplace_lat_lon'] = None
people['dplace_lat_lon'] = None
people.loc[lambda df: df.bplace_lat.notnull(), ("bplace_lat_lon",)] = people.bplace_lat.map(str) + ", " + people.bplace_lon.map(str)
people.loc[lambda df: df.dplace_lat.notnull(), ("dplace_lat_lon",)] = people.dplace_lat.map(str) + ", " + people.dplace_lon.map(str)
people = people.drop(["bplace_lat", "bplace_lon", "dplace_lat", "dplace_lon"], axis=1)

# need birth & death country
# countries = pd.read_sql("select p1.id as place_id, p2.id as country_code from place p1, place p2 where p1.is_country is false and p2.is_country is true and p1.country_code = p2.country_code", engine)
countries = pd.read_sql("select id as country_id, country_code from place where is_country is true and country_code is not null", engine)
# countryid_countrycode_lookup = countries["id"].to_dict()
place_countrycode = pd.read_csv("raw/cities_20170228.tsv", sep="\t", na_values="null", usecols=("geonameid", "ccode"), encoding="utf-8")
place_countrycode.ccode = place_countrycode.ccode.str.lower()
place_countrycode = place_countrycode.merge(countries, how="left", left_on="ccode", right_on="country_code")
place_countrycode = place_countrycode[["geonameid", "country_id"]]

people["birthcountry"] = people["birthplace"]
people["deathcountry"] = people["deathplace"]
people = people.merge(place_countrycode, how="left", left_on="birthcountry", right_on="geonameid")
people = people.merge(place_countrycode, how="left", left_on="deathcountry", right_on="geonameid", suffixes=('', '_death'))
people = people.drop(["geonameid", "geonameid_death", "birthcountry", "deathcountry"], axis=1)
people = people.rename(columns={"country_id":"birthcountry", "country_id_death":"deathcountry"})

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

# replace birthplace with metroid
place_metro_lookup = pd.read_csv("raw/cities_20170228.tsv", sep="\t", na_values="null", usecols=("geonameid", "metroid"), encoding="utf-8", index_col="geonameid")
place_metro_lookup = place_metro_lookup["metroid"].to_dict()
people["birthplace"] = people["birthplace"].replace(place_metro_lookup)
# places = pd.read_sql("select id as place_id, is_country from place", engine)
# people = people.merge(places, how="left", left_on="birthplace", right_on="place_id")
# print people.loc[0,:]

# print people.is_country.value_counts()
# people.loc[lambda df: df.is_country.isnull(), ("is_country",)] = False
# people.loc[lambda df: df.is_country, ("birthplace",)] = None

people["deathplace"] = people["deathplace"].replace(place_metro_lookup)
# people.loc[lambda df: df.is_country & ~df.deathplace.isnull(), ("deathplace",)] = None

# calculate ranks...
for rank_type in ["birthyear", "deathyear", "birthcountry", "deathcountry", \
                    "birthplace", "deathplace", "occupation", "birthera", "deathera"]:
    people["{}_rank".format(rank_type)] = people.groupby(rank_type)['hpi'].rank(ascending=False, method="dense", na_option="bottom")
    people["{}_rank_unique".format(rank_type)] = people.groupby(rank_type)['hpi'].rank(ascending=False, method="first", na_option="bottom")

# print people.tail(10)
# print people.loc[0,:]
people.to_sql("person", engine, if_exists="append", index=False)
