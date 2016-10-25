# -*- coding: utf-8 -*-
import psycopg2, csv, sys, urllib2, unicodedata
from db_connection import conn, cursor

country_lookup = {"afago":"ao","afbdi":"bi","afben":"bj","afbfa":"bf","afbwa":"bw","afcaf":"cf","afciv":"ci","afcmr":"cm","afcod":"cd","afcog":"cg","afcom":"km","afcpv":"cv","afdji":"dj","afdza":"dz","afegy":"eg","aferi":"er","afesh":"eh","afeth":"et","afgab":"ga","afgha":"gh","afgin":"gn","afgmb":"gm","afgnb":"gw","afgnq":"gq","afken":"ke","aflbr":"lr","aflby":"ly","aflso":"ls","afmar":"ma","afmdg":"mg","afmli":"ml","afmoz":"mz","afmrt":"mr","afmus":"mu","afmwi":"mw","afmyt":"yt","afnam":"na","afner":"ne","afnga":"ng","afreu":"re","afrwa":"rw","afsdn":"sd","afsen":"sn","afshn":"sh","afsle":"sl","afsom":"so","afssd":"ss","afstp":"st","afswz":"sz","afsyc":"sc","aftcd":"td","aftgo":"tg","aftun":"tn","aftza":"tz","afuga":"ug","afzaf":"za","afzmb":"zm","afzwe":"zw","anata":"aq","anatf":"tf","anbvt":"bv","anhmd":"hm","ansgs":"gs","asafg":"af","asare":"ae","asarm":"am","asaze":"az","asbgd":"bd","asbhr":"bh","asbrn":"bn","asbtn":"bt","ascck":"cc","aschn":"cn","ascxr":"cx","ascyp":"cy","asgeo":"ge","ashkg":"hk","asidn":"id","asind":"in","asiot":"io","asirn":"ir","asirq":"iq","asisr":"il","asjor":"jo","asjpn":"jp","askaz":"kz","askgz":"kg","askhm":"kh","askor":"kr","askwt":"kw","aslao":"la","aslbn":"lb","aslka":"lk","asmac":"mo","asmdv":"mv","asmmr":"mm","asmng":"mn","asmys":"my","asnpl":"np","asomn":"om","aspak":"pk","asphl":"ph","asprk":"kp","aspse":"ps","asqat":"qa","assau":"sa","assgp":"sg","assyr":"sy","astha":"th","astjk":"tj","astkm":"tm","astls":"tl","astur":"tr","astwn":"tw","asuzb":"uz","asvnm":"vn","asyem":"ye","asymd":"yd","eualb":"al","euand":"ad","euaut":"at","eubel":"be","eubgr":"bg","eubih":"ba","eublr":"by","euche":"ch","eucze":"cz","eudeu":"de","eudnk":"dk","euesp":"es","euest":"ee","eufin":"fi","eufra":"fr","eufro":"fo","eugbr":"gb","eugib":"gi","eugrc":"gr","euhrv":"hr","euhun":"hu","euimn":"im","euirl":"ie","euisl":"is","euita":"it","euksv":"kv","eulie":"li","eultu":"lt","eulux":"lu","eulva":"lv","eumco":"mc","eumda":"md","eumkd":"mk","eumlt":"mt","eumne":"me","eunld":"nl","eunor":"no","eupol":"pl","euprt":"pt","eurou":"ro","eurus":"ru","eusjm":"sj","eusmr":"sm","eusrb":"rs","eusvk":"sk","eusvn":"si","euswe":"se","euukr":"ua","euvat":"va","naabw":"aw","naaia":"ai","naant":"an","naatg":"ag","nabes":"bq","nabhs":"bs","nablm":"bl","nablz":"bz","nabmu":"bm","nabrb":"bb","nacan":"ca","nacri":"cr","nacub":"cu","nacuw":"cw","nacym":"ky","nadma":"dm","nadom":"do","nagrd":"gd","nagrl":"gl","nagtm":"gt","nahnd":"hn","nahti":"ht","najam":"jm","nakna":"kn","nalca":"lc","namaf":"mf","namex":"mx","namsr":"ms","namtq":"mq","nanic":"ni","napan":"pa","napri":"pr","naslv":"sv","naspm":"pm","natca":"tc","natto":"tt","naumi":"um","nausa":"us","navct":"vc","navgb":"vg","navir":"vi","ocasm":"as","ocaus":"au","occok":"ck","ocfji":"fj","ocfsm":"fm","ocglp":"gp","ocgum":"gu","ockir":"ki","ocmhl":"mh","ocmnp":"mp","ocncl":"nc","ocnfk":"nf","ocniu":"nu","ocnru":"nr","ocnzl":"nz","ocpcn":"pn","ocplw":"pw","ocpng":"pg","ocpyf":"pf","ocslb":"sb","octkl":"tk","octon":"to","octuv":"tv","ocvut":"vu","ocwlf":"wf","ocwsm":"ws","saarg":"ar","sabol":"bo","sabra":"br","sachl":"cl","sacol":"co","saecu":"ec","saflk":"fk","saguf":"gf","saguy":"gy","saper":"pe","sapry":"py","sasur":"sr","saury":"uy","saven":"ve","xxwld":"1w"};
country_lookup = {v:k[2:] for k, v in country_lookup.items()}

def strip_accents(s):
    xtra_chars = {u",":"", u"ł":u'l', u"Ł":"L", u'ı':u'i', u'‘':u"", u'ø':u'o', u"Ø":"O", u"'":"", u"’":"", u"œ":"oe", u"ß":"ss", u"đ":"d", u"ð":"d", u"Ð":"D", u"æ":"ae", u"ṭ":"t", u"Ṭ":"T", u"Ħ":"H", u"ħ":"h"}
    for k, v in xtra_chars.iteritems():
        pass
        s = s.replace(k, v)
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                  if unicodedata.category(c) != 'Mn')

cursor.execute("SELECT wiki_id, id from place where wiki_id is not null")
place_lookup = {r[0]:r[1] for r in cursor.fetchall()}
cursor.execute("SELECT country_code, id from place where wiki_id is null")
for r in cursor.fetchall(): place_lookup[r[0]] = r[1]

if not place_lookup:
    with open('data/cities.tsv', 'rb') as cfile:
        creader = csv.reader(cfile, delimiter='\t', quotechar='"')
        creader.next()
        for row in creader:
            [geonameid, city_name, lat, lon, pop, ccode, cname] = row
            geonameid = int(geonameid)
            ccode = ccode.lower()

            if ccode == "na":
                ccode = None
            elif ccode not in place_lookup:
                # lets add it to the db
                cslug = cname.replace(" ", "_")
                cslug = strip_accents(cslug.decode('utf8'))
                # cslug = urllib2.quote(cslug.encode('utf8'))
                query = 'INSERT INTO place (slug, name, country_name, country_code) VALUES (%s, %s, %s, %s) RETURNING id;'
                data = (cslug, cname, cname, ccode)

                cursor.execute(query, data)
                res = cursor.fetchone()
                last_inserted_id = res[0]

                place_lookup[ccode] = last_inserted_id

            lat, lon, pop = int(float(lat)), int(float(lon)), int(float(pop))

            city_slug = city_name.replace(" ", "_")
            city_slug = strip_accents(city_slug.decode('utf8'))
            # city_slug = urllib2.quote(city_slug.encode('utf8'))
            query = 'INSERT INTO place (wiki_id, name, slug, country_name, country_code, lat, lon, pop) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;'
            data = (geonameid, city_name, city_slug, cname, ccode, lat, lon, pop)

            cursor.execute(query, data)
            res = cursor.fetchone()
            last_inserted_id = res[0]
            place_lookup[geonameid] = last_inserted_id
    conn.commit()
print "First 5 places in DB:"
print place_lookup.items()[:5]

cursor.execute("SELECT name, id from profession")
prof_lookup = {r[0].upper():r[1] for r in cursor.fetchall()}

def slugify(s):
    return s.lower().replace("&", "and").replace(" ", "_")

if not prof_lookup:
    with open('data/classification.csv', 'rb') as cfile:
        creader = csv.reader(cfile, delimiter=',', quotechar='"')
        creader.next()
        for row in creader:
            [profession, industry, domain, group] = map(str.title, row)
            [profession_slug, industry_slug, domain_slug, group_slug] = map(slugify, row)

            query = 'INSERT INTO profession (slug, name, industry, industry_slug, domain, domain_slug, "group", group_slug) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;'
            data = (profession_slug, profession, industry, industry_slug, domain, domain_slug, group, group_slug)

            cursor.execute(query, data)
            res = cursor.fetchone()
            last_inserted_id = res[0]

            prof_lookup[profession.upper()] = last_inserted_id
    conn.commit()
print "First 5 occupations in DB:"
print prof_lookup.items()[:5]

with open('data/Pantheon2.0_Oct24.csv', 'rb') as pfile:
    preader = csv.DictReader(pfile, delimiter=',', quotechar='"')
    print "Inserting people to DB..."
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
                try:
                    places[i] = place_lookup[places[i]]
                except KeyError:
                    places[i] = None
            except:
                places[i] = None

        birthplace_id, deathplace_id = places

        countries = [row["ccode"], row["dccode"]]
        for i, c in enumerate(countries):
            try:
                c = country_lookup[c.lower()]
                countries[i] = place_lookup[c]
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
        slug = row["title"].replace(" ", "_")
        slug = strip_accents(slug.decode('utf8'))

        name = row["title"].replace("_", " ")

        # Gender
        gender = True if row["gender"] == "female" else False

        # Profession
        try:
            profession = prof_lookup[row["occupation"]]
        except:
            print "[ERROR] Cannot find profession:", row["occupation"]

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
        # print wiki_id, name, slug, gender, birthyear_id, deathyear_id, birthplace_id, birthcountry_id, deathplace_id, deathcountry_id, profession, langs, twitter, alive

        query = 'INSERT INTO person (wiki_id, name, slug, gender, birthyear, deathyear, birthplace, birthcountry, deathplace, deathcountry, profession, langs, twitter, alive) VALUES (%s, %s, %s, %s,%s, %s, %s,%s, %s, %s, %s, %s, %s, %s) RETURNING id;'
        data = (wiki_id, name, slug, gender, birthyear_id, deathyear_id, birthplace_id, birthcountry_id, deathplace_id, deathcountry_id, profession, langs, twitter, alive)
        cursor.execute(query, data)
        conn.commit()
        # raw_input('')
