import os
from dotenv import load_dotenv
import psycopg2


def load_postgres_credentials():
    load_dotenv()
    creds = {}
    creds["host"] = os.environ.get("POSTGRES_HOST")
    creds["port"] = os.environ.get("POSTGRES_PORT")
    creds["user"] = os.environ.get("POSTGRES_USER")
    creds["password"] = os.environ.get("POSTGRES_USER_PWD")
    creds["db"] = os.environ.get("POSTGRES_DB")
    return creds


def postgres_connection(database):
    creds = load_postgres_credentials()
    conn = psycopg2.connect(
        host=creds["host"],
        port=creds["port"],
        user=creds["user"],
        password=creds["password"],
        database=database,
    )
    return conn
