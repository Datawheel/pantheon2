import psycopg2, csv, sys, urllib2, unicodedata
from datetime import datetime
from db_connection import conn, cursor

# get person ID lookup
cursor.execute("SELECT wiki_id, id FROM person")
person_lookup = {r[0]:r[1] for r in cursor.fetchall()}
# print person_lookup[378466]

# sys.exit()
errors = []

with open('data/creation_date.tsv', 'rb') as vfile:
    vreader = csv.reader(vfile, delimiter='\t', quotechar='"')
    vreader.next()
    for i, row in enumerate(vreader):
        [person_wiki_id, lang, timestamp, year, month] = row
        if timestamp == "NA": continue

        try:
            person_id = person_lookup[int(person_wiki_id)]
        except KeyError:
            if person_wiki_id not in errors:
                errors.append(person_wiki_id)
            continue

        db_date = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
        db_timestamp = db_date.isoformat()
        # print timestamp

        query = 'INSERT INTO creation (person, lang, creation_date) VALUES (%s, %s, %s);'
        data = (person_id, lang, db_timestamp)

        cursor.execute(query, data)
        conn.commit()

        # raw_input()
        # geonameid = int(geonameid)
        # ccode = ccode.lower()
print "Unable to find the following people's Wiki IDs:"
for e in errors:
    print e
