# -*- coding: utf-8 -*-
import sys, unicodedata, string
import pandas as pd
from db_connection import get_engine

# Turn a Unicode string to plain ASCII, thanks to http://stackoverflow.com/a/518232/2809427
all_letters = string.ascii_letters + " .,;'"
def unicodeToAscii(s):
    try:
        return ''.join(
            c for c in unicodedata.normalize('NFD', s)
            if unicodedata.category(c) != 'Mn'
            and c in all_letters
        )
    except:
        print s
        sys.exit()
'''
cities.tsv
geonameid,city_name,lat,lon,pop,ccode,cname,region,continent,least_developed,metroid
'''
countries = pd.read_csv("raw/cities_20170228.tsv", sep="\t", na_values="null", usecols=("geonameid", "city_name", "ccode", "cname", "region", "continent"), encoding="utf-8")
countries = countries[(countries.city_name=="unknown") | (countries.ccode.isnull())]
countries["is_country"] = True
countries["name"] = countries["cname"]
countries["country_name"] = countries["name"]
countries["id"] = countries["geonameid"]
countries["slug"] = countries["name"].str.lower().str.replace("&", "and").str.replace(" ", "_")
countries["country_code"] = countries["ccode"].str.lower()
countries = countries.drop(["ccode", "cname", "city_name", "geonameid"], axis=1)
# special edge case for ocean/antarctica
countries.loc[47649,('name','country_name','slug')] = ("Antarctica", "Antarctica", "antarctica")
countries.loc[47650,('name','country_name','slug')] = ("Ocean", "Ocean", "ocean")

places = pd.read_csv("raw/cities_20170228.tsv", sep="\t", na_values="null", encoding="utf-8")
# exclude countries
places = places[(places.city_name!="unknown")&(places.city_name!="Antarctica")&(places.city_name!="Ocean")]
# exclude places without a metroname
places = places[pd.notnull(places.metro_name)]
# group by metro location
places = places.groupby('metroid').first().reset_index()
places['lat_lon'] = places.lat.map(str) + ", " + places.lon.map(str)
places = places.drop(["least_developed", "lat", "lon", "geonameid", "city_name"], axis=1)
places = places.rename(columns={"aname":"state", "metroid":"id", "ccode":"country_code", "cname":"country_name", "metro_name":"name"})
places["country_code"] = places["country_code"].str.lower()
places["is_country"] = False
# print places.head()
# print places.dtypes
# sys.exit()
places["slug"] = places["name"].map(unicodeToAscii).str.lower().str.replace("&", "and").str.replace(" ", "_")


people = pd.read_csv("raw/people_20170228.tsv", sep="\t", na_values="null", usecols=("curid", "bplace_geonameid", "dplace_geonameid"))
place_metro_lookup = pd.read_csv("raw/cities_20170228.tsv", sep="\t", na_values="null", usecols=("geonameid", "metroid"), encoding="utf-8", index_col="geonameid")
place_metro_lookup = place_metro_lookup["metroid"].to_dict()
birth_people = people[~people.bplace_geonameid.isnull()]
death_people = people[~people.dplace_geonameid.isnull()]

births = birth_people.merge(pd.concat([places, countries]), how="left", left_on="bplace_geonameid", right_on="id")
# print births[births.country_code.isnull()].head()
# births.loc[lambda df: df.is_country, ()]
# print births.head()
# print countries[countries.id==3389629]
# countries.to_csv('test.csv')
birth_countries = births["country_name"].value_counts()
countries = countries.merge(birth_countries.to_frame(), how="left", left_on="country_name", right_index=True)
countries = countries.rename(columns={"country_name_x":"country_name", "country_name_y":"num_born"})

deaths = death_people.merge(pd.concat([places, countries]), how="left", left_on="dplace_geonameid", right_on="id")
death_countries = deaths["country_name"].value_counts()
countries = countries.merge(death_countries.to_frame(), how="left", left_on="country_name", right_index=True)
countries = countries.rename(columns={"country_name_x":"country_name", "country_name_y":"num_died"})

countries["born_rank"] = countries["num_born"].rank(ascending=False, method="dense", na_option="bottom")
countries["born_rank_unique"] = countries["num_born"].rank(ascending=False, method="first", na_option="bottom")
countries["died_rank"] = countries["num_died"].rank(ascending=False, method="dense", na_option="bottom")
countries["died_rank_unique"] = countries["num_died"].rank(ascending=False, method="first", na_option="bottom")


'''metro rankings!'''
birth_people["metroid"] = birth_people["bplace_geonameid"].replace(place_metro_lookup)
# births_by_city = birth_people.merge(pd.concat([places, countries]), how="left", left_on="bplace_geonameid", right_on="id")
# births_by_city.to_csv('births_by_city.csv', encoding='utf-8')
# births_by_city = births_by_city.loc[lambda df: ~df.is_country, :]
birth_people = birth_people.metroid.value_counts()

death_people["metroid"] = death_people["dplace_geonameid"].replace(place_metro_lookup)
# deaths_by_city = death_people.merge(pd.concat([places, countries]), how="left", left_on="dplace_geonameid", right_on="id")
# deaths_by_city = deaths_by_city.loc[lambda df: ~df.is_country, :]
death_people = death_people.metroid.value_counts()

places = places.merge(birth_people.to_frame(), how="left", left_on="id", right_index=True)
places = places.rename(columns={"metroid":"num_born"})
places = places.merge(death_people.to_frame(), how="left", left_on="id", right_index=True)
places = places.rename(columns={"metroid":"num_died"})

places["born_rank"] = places["num_born"].rank(ascending=False, method="dense", na_option="bottom")
places["born_rank_unique"] = places["num_born"].rank(ascending=False, method="first", na_option="bottom")
places["died_rank"] = places["num_died"].rank(ascending=False, method="dense", na_option="bottom")
places["died_rank_unique"] = places["num_died"].rank(ascending=False, method="first", na_option="bottom")

# add to DB
countries.to_sql("place", get_engine(), if_exists="append", index=False)
places.to_sql("place", get_engine(), if_exists="append", index=False)
