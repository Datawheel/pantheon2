import psycopg2, os
from sqlalchemy import create_engine

def get_engine():
    return create_engine("postgresql://%s:%s@%s/%s" % (
        os.getenv("PANTHEON_DBUSER", "pantheonuser"),
        os.getenv("PANTHEON_DBPW", "pantheonpw"),
        os.getenv("PANTHEON_DBHOST", "localhost"),
        os.getenv("PANTHEON_DBNAME", "pantheon"),
    ))

def get_cursor():
    conn = psycopg2.connect(
        database=os.getenv("PANTHEON_DBNAME", "pantheon"),
        user=os.getenv("PANTHEON_DBUSER", "pantheon"),
        host=os.getenv("PANTHEON_DBPW", "localhost"),
        password=os.getenv("PANTHEON_DBPW", "pantheon")
    )
    return conn.cursor()
