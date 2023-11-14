import pymysql
import os
from dotenv import load_dotenv


load_dotenv()


def mysql_connection():
    try:
        # conn = pymysql.connect(
        #     host=os.getenv("MYSQL_HOST"),
        #     port=int(os.getenv("MYSQL_PORT")),
        #     user=os.getenv("MYSQL_USER"),
        #     password=os.getenv("MYSQL_USER_PWD"),
        #     database=os.getenv("MYSQL_DATABASE_NAME"),
        # )
        conn = pymysql.connect(
            host="35.246.46.4",
            user="root",
            password="~UH/k@#g&LYp#UPq",
            database="remind_db"
            # cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except pymysql.MySQLError as e:
        print(f"Error connecting to the MySQL Database: {e}")
        return None
