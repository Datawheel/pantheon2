# -*- coding: utf-8 -*-
import sys
import pandas as pd
from db_connection import get_engine

eras = pd.DataFrame({ 'id' : [1, 2, 3, 4, 5],
                     'name' : ["Before 1450", "1450 - 1699", "1700 - 1899", "1900 - 1949", "1950 - Present"],
                     'slug' : ["pre-1450", "1450-1699", "1700-1899", "1900-1949", "1950-present"],
                     'description' : ["The Pre 1450 Era is defined by...", "The 1450 - 1699 Era is defined by...", "The 1700 - 1899 Era is defined by...", "The 1900 - 1949 Era is defined by...", "The 1950 - Present daty Era is defined by..."],
                     'start_year' : [0, 1450, 1700, 1900, 1950],
                     'end_year' : [1449, 1699, 1899, 1949, 2016] })
eras.to_sql("era", get_engine(), if_exists="append", index=False)
