# -*- coding: utf-8 -*-
import sys
import pandas as pd
from db_connection import get_engine
engine = get_engine()

def slugify(series):
    return series.str.lower().str.replace("&", "and").str.replace(" ", "_")

def get_people(people, countries, places, occupations):
    people = people.rename(columns={"curid":"id", "bplace_geonameid":"birthplace", "dplace_geonameid":"deathplace"})
    people["slug"] = slugify(people["name"])
    people = people.drop(["bplace_lat", "bplace_lon", "bplace_name", "bplace_curid", "geacron_name", \
                            "dplace_lat", "dplace_lon", "dplace_name", "dplace_curid"], axis=1)

    people = people.merge(countries, how="left", left_on="birthplace", right_on="id")
    print people.tail(10)
    sys.exit()

    return people

def get_countries(people):
    places = pd.read_csv("cities.tsv", sep="\t", na_values="null", true_values="true", false_values="false", converters={"geonameid":float}, usecols=("geonameid", "ccode", "cname", "region", "continent"))

    people = people.merge(places, how="left", left_on="bplace_geonameid", right_on="geonameid", suffixes=('_birth_people', '_birth'))
    people = people.merge(places, how="left", left_on="dplace_geonameid", right_on="geonameid", suffixes=('_birth', '_death'))

    births_in_country = people.groupby("ccode_birth").agg({"ccode_birth": "count", "l": "mean", "hpi": "mean"})
    deaths_in_country = people.groupby("ccode_death").agg({"ccode_death": "count", "l": "mean", "hpi": "mean"})
    country_meta = births_in_country.join(deaths_in_country, lsuffix='_birth', rsuffix='_death', how="outer")

    birth_countries = people[["ccode_birth", "cname_birth", "region_birth", "continent_birth"]].rename(columns={"ccode_birth":"ccode", "cname_birth":"cname", "region_birth":"region", "continent_birth":"continent"})
    death_countries = people[["ccode_death", "cname_death", "region_death", "continent_death"]].rename(columns={"ccode_death":"ccode", "cname_death":"cname", "region_death":"region", "continent_death":"continent"})
    countries = pd.concat([birth_countries, death_countries]).drop_duplicates(keep="first")[1:] # remove first element
    countries = countries.set_index("ccode").join(country_meta, how="outer")

    countries = countries.reset_index()
    countries["slug"] = slugify(countries["cname"])
    countries["name"] = countries["cname"]
    countries["country_name"] = countries["cname"]
    countries["country_code"] = countries["index"]

    countries = countries.rename(columns={"ccode_birth":"num_born","ccode_death":"num_died"})
    countries = countries.drop(["index", "cname", "hpi_birth", "l_birth", "hpi_death", "l_death"], axis=1)

    countries["born_rank"] = countries["num_born"].rank(ascending=False, method="dense", na_option="bottom")
    countries["born_rank_unique"] = countries["num_born"].rank(ascending=False, method="first", na_option="bottom")

    countries = countries.reset_index()
    countries["index"] = countries["index"]+1
    countries = countries.rename(columns={"index":"id"})

    return countries

def get_places(people):
    places = pd.read_csv("cities.tsv", sep="\t", na_values="null", true_values="true", false_values="false", converters={"geonameid":float}, usecols=("geonameid", "ccode", "cname", "region", "continent"))

    people = people.merge(places, how="left", left_on="bplace_geonameid", right_on="geonameid", suffixes=('_birth_people', '_birth'))
    people = people.merge(places, how="left", left_on="dplace_geonameid", right_on="geonameid", suffixes=('_birth', '_death'))

    births_in_place = people.groupby("bplace_geonameid").agg({"bplace_geonameid": "count", "l": "mean", "hpi": "mean"})
    deaths_in_place = people.groupby("dplace_geonameid").agg({"dplace_geonameid": "count", "l": "mean", "hpi": "mean"})
    place_meta = births_in_place.join(deaths_in_place, lsuffix='_birth', rsuffix='_death', how="outer")

    birth_places = people[["bplace_geonameid", "bplace_name", "ccode_birth", "cname_birth", "region_birth", "continent_birth"]].rename(columns={"bplace_geonameid":"id", "bplace_name":"name", "ccode_birth":"ccode", "cname_birth":"cname", "region_birth":"region", "continent_birth":"continent"})
    death_places = people[["dplace_geonameid", "dplace_name", "ccode_death", "cname_death", "region_death", "continent_death"]].rename(columns={"dplace_geonameid":"id", "dplace_name":"name", "ccode_death":"ccode", "cname_death":"cname", "region_death":"region", "continent_death":"continent"})
    places = pd.concat([birth_places, death_places]).drop_duplicates(subset=('id', 'name'), keep="first")[1:] # remove first element
    # print places.tail(5)
    print places[places.id == 2643743]
    sys.exit()
    # places = places.set_index("id").join(country_meta, how="outer")

    print place_meta.tail(10)
    sys.exit()

    print people.tail(1).to_dict()
    sys.exit()

    people = people[["bplace_geonameid", "dplace_geonameid", "bplace_name", "dplace_name", "ccode_birth", "dcode_birth", "l", "hpi"]]
    print people.tail()

    births_in_country = people.groupby("bplace_geonameid").agg({"bplace_geonameid": "count", "l": "mean", "hpi": "mean"})
    deaths_in_country = people.groupby("dplace_geonameid").agg({"dplace_geonameid": "count", "l": "mean", "hpi": "mean"})
    print births_in_country.ix[2988507]

def get_occupations(people):
    occupations = pd.read_csv("raw/classification.csv", sep=",", na_values="null", true_values="true", false_values="false")
    people = people.merge(occupations, how="left", on="occupation", suffixes=('_people', '_occ'))
    born_in_occupation = people.groupby("occupation").size()
    born_in_occupation_men = people[people["gender"]].groupby("occupation").size()
    born_in_occupation_women = people[~people["gender"]].groupby("occupation").size()
    num_born = pd.concat([born_in_occupation, born_in_occupation_women, born_in_occupation_men], axis=1)
    num_born.columns = ["num_born", "num_born_women", "num_born_men"]

    occupations = people[["occupation", "domain", "industry", "group"]].drop_duplicates(subset=("occupation",), keep="first")
    occupations["slug"] = slugify(occupations["occupation"])
    occupations["group_slug"] = slugify(occupations["group"])
    occupations["industry_slug"] = slugify(occupations["industry"])
    occupations["domain_slug"] = slugify(occupations["domain"])
    occupations = occupations.set_index("occupation").join(num_born, how="outer")

    occupations = occupations.reset_index()
    occupations["name"] = occupations["index"].str.title()
    occupations["domain"] = occupations["domain"].str.title()
    occupations["industry"] = occupations["industry"].str.title()
    occupations["group"] = occupations["group"].str.title()
    occupations = occupations.drop(["index"], axis=1)

    return occupations.sort_values(by=["domain", "group", "industry", "name"]).reset_index(drop=True)

def get_indicators():
    ind = pd.read_csv("raw/indicators.tsv", sep="\t", na_values="null", true_values="true", false_values="false", parse_dates=[1])
    ind = ind.rename(columns={"curid":"person", "dt":"pageview_date", "pv_en":"num_pageviews", "l":"num_langs"})
    return ind

people = pd.read_csv("raw/people.tsv", sep="\t", na_values="null", true_values="true", false_values="false")

places = get_places(people)
sys.exit()

countries = get_countries(people)
# countries.to_sql("place", engine, if_exists="append", index=False)

occupations = get_occupations(people)
# occupations.to_sql("occupation", engine, if_exists="append", index_label="id")

people = get_people(people, countries, occupations)
print people.tail(10)
sys.exit()

indicators = get_indicators()
print indicators.head()
# indicators.to_sql("indicators", engine, if_exists="append", index=False, chunksize=20000)

# death_countries = people[["ccode_death", "cname_death", "region_death", "continent_death"]].rename(columns={"ccode_death":"ccode", "cname_death":"cname", "region_death":"region", "continent_death":"continent"})
# countries = pd.concat([birth_countries, death_countries]).drop_duplicates(keep="first")[1:] # remove first element
# countries = countries.set_index("ccode").join(country_meta, how="outer")
# countries["slug"] = slugify(countries["cname"])




# "id","wiki_id","name","slug","region","country_name","country_code","continent","is_country","lat_lon","pop","soverign_date","soverign_date_latest","num_born","num_died","img_link","img_author","img_meta","born_rank","born_rank_unique","country_num"
# 2651930 "Cromer"        null    52.93123        1.29892 9033    "GBR"
# 2636663 "Stretford"     null    53.45   -2.31667        41953   "GBR"
