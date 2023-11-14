import pymysql
import os
from dotenv import load_dotenv


load_dotenv()


def mysql_connection():
    try:
        conn = pymysql.connect(
            unix_socket=os.getenv("MYSQL_UNIX_SOCKET"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_USER_PWD"),
            database=os.getenv("MYSQL_DATABASE_NAME"),
            cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except pymysql.MySQLError as e:
        print(f"Error connecting to the MySQL Database: {e}")
        return None
