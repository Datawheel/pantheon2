import psycopg2, os
dbname = os.getenv("PANTHEON_DBNAME", "pantheon")
dbuser = os.getenv("PANTHEON_DBUSER", "alexandersimoes")
conn = psycopg2.connect("dbname={} user={}".format(dbname, dbuser))
cursor = conn.cursor()
