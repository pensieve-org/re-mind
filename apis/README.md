# RE:MIND APIs

"""
README

This is a FastAPI application that provides [insert purpose of the app here].

INSTRUCTIONS

## Running locally (native)

First, ensure you are in the `apis` folder. Then set up a virtual env

```
python<version> -m venv venv

source venv/bin/activate
```

Install the requirements for the app

```
pip install -r requirements.txt
```

Run the application

```
uvicorn app.main:app --reload
```

Set up and run the cloud sql socket

```
gcloud auth login or gcloud auth application-default login
cloud-sql-proxy re-mind-405009:europe-west2:remind-mysql --unix-socket=/Users/jamesheavey/Documents/GitHub/re-mind/apis/sql_socket
```

To hit the API, run the following command in a separate terminal window

```
curl http://localhost:8000/{endpoint}
```

If it is not a get request, you will need to add the `-X` flag and specify the request type as 'POST', 'PUT', etc. You will also need to provide the data in the request body using the `-d` e.g.

```
curl http://localhost:8000/{endpoint} -X POST -d '{"key": "value"}'
```

## Running in a local Container

> Install Docker or a compatible container runtime if you don't have it

Podman

```
podman build -t fastapi:latest .

podman run -p 8080:8080 fastapi:latest
```

Docker

```
docker build -t fastapi:latest .

docker run -p 8000:8000 fastapi:latest
```

## Deploying to PythonAnywhere

> Ensure you have a PythonAnywhere account

1. Log in to PythonAnywhere and go to the Web tab to set up a new web app.
2. Choose the manual configuration option and select Python 3.x for your web app.
3. In the "Code" section, set the source code to your repository clone path.
4. In the "Virtualenv" section, enter the path to your virtual environment.
5. Edit the WSGI configuration file to import and run your FastAPI app.
6. Reload your web app to apply the changes.

For more detailed instructions, consult the PythonAnywhere documentation on deploying web apps.


LOOK AT Quey.io for deployment to opnshift, ask ASAA
