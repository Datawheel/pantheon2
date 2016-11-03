import csv
from db_connection import conn, cursor

with open('data/found_date.csv', 'rb') as fdfile:
    fdreader = csv.reader(fdfile, delimiter=',', quotechar='"')
    fdreader.next()
    for i, row in enumerate(fdreader):
        country, soverign_date, soverign_date_latest = row
        country = country.lower()
        soverign_date = None if soverign_date == "NA" else int(soverign_date)
        soverign_date_latest = None if soverign_date_latest == "NA" else int(soverign_date_latest)
        query = 'UPDATE place SET soverign_date=%s, soverign_date_latest=%s WHERE country_code=%s AND wiki_id is null;'
        data = (soverign_date, soverign_date_latest, country)

        cursor.execute(query, data)
        conn.commit()
