
import psycopg2


def create_connection():
    conn = psycopg2.connect(dbname='collegeproject',
                            user='postgres',
                            password='password',
                            host='localhost',
                            port='5432')
    # Get the cursor object from the connection object
    curr = conn.cursor()
    return conn, curr

