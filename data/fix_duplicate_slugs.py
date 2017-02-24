# -*- coding: utf-8 -*-
import sys
from ingestion.db_connection import get_conn

conn = get_conn()
cursor = conn.cursor()

cursor.execute("SELECT slug, count(*) FROM place GROUP BY slug HAVING count(*) > 1")
duplicate_places = [r[0] for r in cursor.fetchall()]
if duplicate_places:
    print "Found {} duplicate place slugs. Replacing now...".format(len(duplicate_places))
else:
    print "Didn't find any place dupes!"

for d in duplicate_places:
    cursor.execute("SELECT slug, country_code, id FROM place WHERE slug=%s ORDER BY num_born DESC OFFSET 1", (d,))
    dupes_here = cursor.fetchall()
    for dh in dupes_here:
        suffix = dh[1].upper() if dh[1] else dh[2]
        new_slug = "{},_{}".format(dh[0], suffix)
        # check if this new slug is in the db
        cursor.execute("SELECT * FROM place WHERE slug=%s", (new_slug,))
        if cursor.fetchone():
            new_slug = "{},_{}_{}".format(dh[0], dh[1].upper(), dh[2])
        cursor.execute("UPDATE place SET slug=%s WHERE id=%s;", (new_slug, dh[2]))
        conn.commit()

cursor.execute("SELECT slug, count(*) FROM person GROUP BY slug HAVING count(*) > 1")
duplicate_people = [r[0] for r in cursor.fetchall()]
if duplicate_people:
    print "Found {} duplicate people slugs. Replacing now...".format(len(duplicate_people))
else:
    print "Didn't find any dupes!"
    sys.exit()

for d in duplicate_people:
    cursor.execute("SELECT slug, id FROM person WHERE slug=%s ORDER BY langs DESC OFFSET 1", (d,))
    dupes_here = cursor.fetchall()
    for dh in dupes_here:
        new_slug = "{}_{}".format(dh[0], dh[1])
        cursor.execute("UPDATE person SET slug=%s WHERE id=%s;", (new_slug, dh[1]))
        conn.commit()
