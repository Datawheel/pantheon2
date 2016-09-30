import psycopg2, csv, sys, urllib2, unicodedata

conn = psycopg2.connect("dbname=pantheon user=alexandersimoes")
cursor = conn.cursor()

def strip_accents(s):
   return ''.join(c for c in unicodedata.normalize('NFD', s)
                  if unicodedata.category(c) != 'Mn')

place_lookup = {}
with open('data/cities.tsv', 'rb') as cfile:
    creader = csv.reader(cfile, delimiter='\t', quotechar='"')
    creader.next()
    for row in creader:
        [geonameid, city_name, lat, lon, pop, cname, ccode] = row
        geonameid = int(geonameid)
        ccode = ccode.lower()

        if ccode not in place_lookup:
            # lets add it to the db
            cslug = cname.replace(" ", "_")
            cslug = strip_accents(cslug.decode('utf8'))
            cslug = urllib2.quote(cslug.encode('utf8'))
            query = 'INSERT INTO place (slug, name, country_name, country_code) VALUES (%s, %s, %s, %s) RETURNING id;'
            data = (cslug, cname, cname, ccode)

            cursor.execute(query, data)
            res = cursor.fetchone()
            last_inserted_id = res[0]

            place_lookup[ccode] = last_inserted_id

        lat, lon, pop = int(float(lat)), int(float(lon)), int(float(pop))

        city_slug = city_name.replace(" ", "_")
        city_slug = strip_accents(city_slug.decode('utf8'))
        city_slug = urllib2.quote(city_slug.encode('utf8'))
        query = 'INSERT INTO place (wiki_id, name, slug, country_name, country_code, lat, lon, pop) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;'
        data = (geonameid, city_name, city_slug, cname, ccode, lat, lon, pop)

        cursor.execute(query, data)
        res = cursor.fetchone()
        last_inserted_id = res[0]
        place_lookup[geonameid] = last_inserted_id

conn.commit()


occ_lookup = {}
with open('data/classification.csv', 'rb') as cfile:
    creader = csv.reader(cfile, delimiter=',', quotechar='"')
    creader.next()
    for row in creader:
        [occupation, industry, domain, group] = map(str.lower, row)
        slug = occupation.replace(" ", "_")

        query = 'INSERT INTO occupation (slug, name, industry, domain, "group") VALUES (%s, %s, %s, %s, %s) RETURNING id;'
        data = (slug, occupation, industry, domain, group)

        cursor.execute(query, data)
        res = cursor.fetchone()
        last_inserted_id = res[0]

        occ_lookup[occupation.upper()] = last_inserted_id

conn.commit()

with open('data/Pantheon2.0_Sept29.csv', 'rb') as pfile:
    preader = csv.DictReader(pfile, delimiter=',', quotechar='"')
    for i, row in enumerate(preader):
        # if i > 2000: continue
        '''
            ###########################
            GET PLACE OF BIRTH / DEATH
            ###########################
        '''
        places = [row["geonameid"], row["dgeonameid"]]
        for i, p in enumerate(places):
            try:
                places[i] = int(float(p))
                # print places[i]
                try:
                    places[i] = place_lookup[places[i]]
                except KeyError:
                    places[i] = None
                # print places[i]
            except:
                places[i] = None

        birthplace_id, deathplace_id = places

        countries = [row["ccode"], row["dccode"]]
        for i, c in enumerate(countries):
            try:
                countries[i] = place_lookup[c.lower()]
            except KeyError:
                countries[i] = None

        birthcountry_id, deathcountry_id = countries

        # print birthplace_id, deathplace_id, birthcountry_id, deathcountry_id

        '''
            ###########################
            GET YEAR OF BIRTH
            ###########################
        '''
        try:
            birthyear_id = int(float(row["birthyear"]))
            cursor.execute("SELECT id FROM year WHERE id = %s", (birthyear_id,))
            row_found = cursor.fetchone()
            if row_found:
                birthyear_id = row_found[0]
            else:
                query = 'INSERT INTO year (id, name, slug) VALUES (%s, %s, %s);'
                data = (birthyear_id, birthyear_id, birthyear_id)
                cursor.execute(query, data)
                conn.commit()
        except ValueError:
            birthyear_id = None

        '''
            ###########################
            GET YEAR OF DEATH
            ###########################
        '''
        try:
            # print "deathyear:", row["birthyear"]
            deathyear_id = int(float(row["deathyear"]))
            # print "deathyear_id:", row["birthyear"]
            cursor.execute("SELECT id FROM year WHERE id = %s", (deathyear_id,))
            row_found = cursor.fetchone()
            if row_found:
                deathyear_id = row_found[0]
            else:
                query = 'INSERT INTO year (id, name, slug) VALUES (%s, %s, %s);'
                data = (deathyear_id, deathyear_id, deathyear_id)
                cursor.execute(query, data)
                conn.commit()
        except ValueError:
            deathyear_id = None

        '''
            ###########################
            DO ETL FORMATTING
            ###########################
        '''
        # IDs
        wiki_id = row["en_curid"]
        wd_id = row["wd_id"]

        # Name
        slug = row["title"]
        slug = strip_accents(slug.decode('utf8'))

        name = row["title"].replace("_", " ")

        # Gender
        gender = True if row["gender"] == "female" else False

        # Occupation
        try:
            occupation = occ_lookup[row["occupation"]]
        except:
            print "[ERROR] Cannot find occupation:", row["occupation"]

        # VALUES
        langs = int(row["L"])
        try:
            prob_ratio = float(row["prob_ratio"])
        except ValueError:
            prob_ratio = None

        # Twitter handles
        twitter = row["twitter"] if row["twitter"] != "NA" else None

        # Check if alive
        alive = True if row["deathyear"] == "alive" else False

        '''
            ###########################
            ADD TO DB
            ###########################
        '''
        # print slug, name, gender, langs, prob_ratio, birthyear_id, deathyear_id, lat, lon, birthplace_id, birthcountry_id
        query = 'INSERT INTO person (wiki_id, name, slug, gender, birthyear, deathyear, birthplace, birthcountry, deathplace, deathcountry, occupation, langs, twitter, alive) VALUES (%s, %s, %s, %s,%s, %s, %s,%s, %s, %s, %s, %s, %s, %s) RETURNING id;'
        data = (wiki_id, name, slug, gender, birthyear_id, deathyear_id, birthplace_id, birthcountry_id, deathplace_id, deathcountry_id, occupation, langs, twitter, alive)
        cursor.execute(query, data)
        conn.commit()
        # raw_input('')

'''
CREATE MATERIALIZED VIEW
	public.person_occupation AS
SELECT
	id as person_id, occupation_id, langs, rank()
	OVER (PARTITION BY occupation_id ORDER BY langs DESC)
FROM
	person
ORDER BY occupation_id, langs DESC;
'''
