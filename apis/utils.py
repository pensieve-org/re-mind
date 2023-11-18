import pymysql
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials
import json
import requests

load_dotenv()


def mysql_connection():
    try:
        conn = pymysql.connect(
            unix_socket=os.getenv("MYSQL_UNIX_SOCKET"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_USER_PWD"),
            database=os.getenv("MYSQL_DATABASE_NAME"),
            cursorclass=pymysql.cursors.DictCursor,
        )
        return conn
    except pymysql.MySQLError as e:
        print(f"Error connecting to the MySQL Database: {e}")
        return None


def firebase_connection():
    creds = credentials.Certificate(
        "./re-mind-405009-firebase-adminsdk-2r0et-0ce1cad289.json"
    )
    firebase_admin.initialize_app(
        creds, {"storageBucket": "re-mind-405009.appspot.com"}
    )


def sign_in_with_email_and_password(email, password):
    request_ref = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key={0}".format(
        os.getenv("FIREBASE_API_KEY")
    )
    headers = {"content-type": "application/json; charset=UTF-8"}
    data = json.dumps({"email": email, "password": password, "returnSecureToken": True})
    response = requests.post(request_ref, headers=headers, data=data)
    response_data = response.json()

    if "error" in response_data:
        raise Exception(response_data["error"]["message"])

    return response_data
