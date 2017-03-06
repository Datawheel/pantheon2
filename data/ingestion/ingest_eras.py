# -*- coding: utf-8 -*-
import sys
import pandas as pd
from db_connection import get_engine

eras = pd.DataFrame({ 'id' : [1, 2, 3, 4, 5, 6],
                     'name' : ["Scribal Era", "Printing Era", "Newspaper Era", "Radio and Film Era", "Television Era", "Personal Computer Era"],
                     'slug' : ["scribal", "printing", "newspaper", "radio_and_film", "television", "personal_computer"],
                     'description' : ["The Scribal Era is defined by...", "The Printing Era is defined by...", "The Newspaper Era is defined by...", "The Radio and Film Era is defined by...", "The Television Era is defined by...", "The Personal Computer Era is defined by..."],
                     'start_year' : [-500, 1450, 1700, 1900, 1950, 1990],
                     'end_year' : [1449, 1699, 1899, 1949, 1989, 2016] })
eras.to_sql("era", get_engine(), if_exists="append", index=False)
