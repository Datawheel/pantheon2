# -*- coding: utf-8 -*-
import sys
import pandas as pd
from db_connection import get_engine

def slugify(series):
    return series.str.lower().str.replace("&", "and").str.replace(" ", "_")

people = pd.read_csv("raw/people.tsv", sep="\t", na_values="null", true_values="true", false_values="false")
occupations = pd.read_csv("raw/classification.csv", sep=",", na_values="null", true_values="true", false_values="false")
people = people.merge(occupations, how="left", on="occupation", suffixes=('_people', '_occ'))
born_in_occupation = people.groupby("occupation").size()
born_in_occupation_men = people[people["gender"]].groupby("occupation").size()
born_in_occupation_women = people[~people["gender"]].groupby("occupation").size()
num_born = pd.concat([born_in_occupation, born_in_occupation_women, born_in_occupation_men], axis=1)
num_born.columns = ["num_born", "num_born_women", "num_born_men"]

occupations = people[["occupation", "domain", "industry", "group"]].drop_duplicates(subset=("occupation",), keep="first")
occupations["occupation_slug"] = slugify(occupations["occupation"])
occupations["group_slug"] = slugify(occupations["group"])
occupations["industry_slug"] = slugify(occupations["industry"])
occupations["domain_slug"] = slugify(occupations["domain"])
occupations = occupations.set_index("occupation").join(num_born, how="outer")

occupations = occupations.reset_index()
occupations["occupation"] = occupations["index"].str.title()
occupations["domain"] = occupations["domain"].str.title()
occupations["industry"] = occupations["industry"].str.title()
occupations["group"] = occupations["group"].str.title()
occupations = occupations.drop(["index"], axis=1)

occupations = occupations.sort_values(by=["domain", "group", "industry", "occupation"]).reset_index(drop=True)
occupations = occupations.reset_index()
occupations["id"] = occupations["index"]+1
occupations = occupations.drop(["index"], axis=1)
print occupations.head()

occupations.to_sql("occupation", get_engine(), if_exists="append", index=False)
