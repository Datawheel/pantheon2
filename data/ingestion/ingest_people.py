# -*- coding: utf-8 -*-
import sys, unicodedata
import pandas as pd
from db_connection import get_engine
engine = get_engine()

def strip_accents(s):
    s = s.decode('utf8')
    xtra_chars = {u",":"", u"ł":u'l', u"Ł":u"L", u'ı':u'i', u'‘':u"", u'ø':u'o', u"Ø":"O", u"'":"", u"’":"", u"œ":"oe", u"ß":"ss", u"đ":"d", u"ð":"d", u"Ð":"D", u"æ":"ae", u"ṭ":"t", u"Ṭ":"T", u"Ħ":"H", u"ħ":"h", u"ī":"i"}
    for k, v in xtra_chars.iteritems():
        # pass
        try:
            s = s.replace(k, v)
        except:
            print s
            sys.exit()
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                  if unicodedata.category(c) != 'Mn')


people = pd.read_csv("raw/people2.tsv", sep="\t", na_values="null", true_values="true", false_values="false")
people = people.rename(columns={"curid":"id", "bplace_geonameid":"birthplace", "dplace_geonameid":"deathplace", "l":"langs"})
people = people.drop(["bplace_lat", "bplace_lon", "bplace_name", "bplace_curid", "geacron_name", \
                        "dplace_lat", "dplace_lon", "dplace_name", "dplace_curid", "wd_id", "prob_ratio", \
                        "name_common","region","continent","least_developed"], axis=1)
people["slug"] = people["name"].str.lower().str.replace(" ", "_")
people["slug"] = people["slug"].apply(strip_accents)

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

# print people.tail(10)
# print people[people["id"]==435773]
people.to_sql("person", engine, if_exists="append", index=False)
