import psycopg2, csv, sys

conn = psycopg2.connect("dbname=pantheon user=alexandersimoes")
cursor = conn.cursor()

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

with open('data/Pantheon2.0Sept7.csv', 'rb') as pfile:
    preader = csv.DictReader(pfile, delimiter=',', quotechar='"')
    for i, row in enumerate(preader):
        # if i > 2000: continue
        '''
            ###########################
            GET PLACE OF BIRTH
            ###########################
        '''
        try:
            birthplace_wiki_id = int(float(row["pcurid"]))
            cursor.execute("SELECT id FROM place WHERE wiki_id = %s", (birthplace_wiki_id,))
            row_found = cursor.fetchone()
            if row_found:
                birthplace_id = row_found[0]
            else:
                birthplace_name = row["pname"]
                birthplace_name_slug = birthplace_name.replace(" ", "_")
                query = 'INSERT INTO place (wiki_id, name, slug) VALUES (%s, %s, %s) RETURNING id;'
                data = (birthplace_wiki_id, birthplace_name, birthplace_name_slug)
                cursor.execute(query, data)
                conn.commit()
                res = cursor.fetchone()
                birthplace_id = res[0]
        except ValueError:
            birthplace_id = None

        '''
            ###########################
            GET COUNTRY OF BIRTH
            ###########################
        '''
        try:
            birthplace_country_id = row["ccode"].lower()
            cursor.execute("SELECT id FROM country WHERE id = %s", (birthplace_country_id,))
            row_found = cursor.fetchone()
            if row_found:
                birthplace_country_id = row_found[0]
            else:
                birthplace_name = row["cname"]
                birthplace_name_slug = birthplace_name.replace(" ", "_")
                query = 'INSERT INTO country (id, name, slug) VALUES (%s, %s, %s);'
                data = (birthplace_country_id, birthplace_name, birthplace_name_slug)
                cursor.execute(query, data)
                conn.commit()
        except ValueError:
            birthplace_country_id = None

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
            deathyear_id = int(float(row["deathyear"]))
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
        name = row["title"].replace("_", " ")

        # Gender
        gender = True if row["gender"] == "female" else False

        # Occupation
        try:
            occupation = occ_lookup[row["occupation"]]
        except:
            print "[ERROR] Cannot find occupation:", row["occupation"]

        # birth locations
        try:
            lat = float(row["lat"])
            lon = float(row["lon"])
        except ValueError:
            lat, lon = None, None

        # VALUES
        langs = int(row["L"])
        try:
            prob_ratio = float(row["prob_ratio"])
        except ValueError:
            prob_ratio = None

        '''
            ###########################
            ADD TO DB
            ###########################
        '''
        print slug, name, gender, langs, prob_ratio, birthyear_id, deathyear_id, lat, lon, birthplace_id, birthplace_country_id
        query = 'INSERT INTO person (wiki_id, name, slug, gender, birthyear, deathyear, birthplace, birthcountry, occupation, langs) VALUES (%s, %s, %s,%s, %s, %s,%s, %s, %s, %s) RETURNING id;'
        data = (wiki_id, name, slug, gender, birthyear_id, deathyear_id, birthplace_id, birthplace_country_id, occupation, langs)
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
