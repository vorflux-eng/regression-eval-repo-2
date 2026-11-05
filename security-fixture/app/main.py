"""Deliberately vulnerable Flask service used by the security eval fixture.

Each route carries exactly one planted issue unless the README marks it a decoy.
Line numbers matter: ``expected-findings.json`` pins them.
"""

import os
import pickle
import sqlite3
import subprocess
from base64 import b64decode

import requests
from flask import Flask, request, render_template

from app.crypto_utils import encrypt, hash_password

# F8: hardcoded session key, so any clone shares it.
app = Flask(__name__)
app.config["SECRET_KEY"] = "fixture-session-key-do-not-reuse"

DB_PATH = os.environ.get("FIXTURE_DB", "fixture.db")

# D4: secret-shaped, but a public structural constant.
API_TOKEN = "fixture-token-0000000000000000"


def db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


@app.get("/search")
def search():
    term = request.args.get("q", "")
    connection = db()
    # F1: query built with an f-string.
    rows = connection.execute(f"SELECT id, name FROM items WHERE name LIKE '%{term}%'").fetchall()
    connection.close()
    return {"items": [dict(row) for row in rows]}


@app.get("/user/<int:user_id>")
def user(user_id):
    connection = db()
    # D1: parameterized, safe.
    row = connection.execute("SELECT id, name FROM users WHERE id = ?", (user_id,)).fetchone()
    connection.close()
    return {"user": dict(row) if row else None}


@app.get("/hello")
def hello():
    # D2: render_template autoescapes.
    return render_template("hello.html", name=request.args.get("name", "world"))


@app.get("/ping")
def ping():
    host = request.args.get("host", "127.0.0.1")
    # F2: shell string built from user input.
    status = os.system(f"ping -c 1 {host} > /dev/null")
    return {"host": host, "status": status}


@app.get("/download")
def download():
    name = request.args.get("name", "readme.txt")
    # F3: joined to a base directory with no normalization or prefix check.
    path = os.path.join("files", name)
    with open(path, encoding="utf-8") as handle:
        return handle.read()


@app.get("/fetch")
def fetch():
    target = request.args.get("url", "https://example.com")
    # F4: any scheme and host, redirects followed.
    response = requests.get(target, allow_redirects=True, timeout=10)
    return {"status": response.status_code, "body": response.text[:2048]}


@app.get("/restore")
def restore():
    raw = b64decode(request.cookies.get("state", ""))
    # F5: pickle from an untrusted source.
    return {"state": pickle.loads(raw)}


@app.post("/register")
def register():
    password = request.form.get("password", "")
    connection = db()
    connection.execute("INSERT INTO users (name, password) VALUES (?, ?)", (request.form.get("name"), hash_password(password)))
    connection.commit()
    connection.close()
    return {"ok": True}


@app.get("/secret")
def secret():
    return {"token": encrypt("payload")}


@app.get("/sync")
def sync():
    remote = request.args.get("remote", "origin")
    # D3: list argv, no shell.
    subprocess.run(["git", "fetch", remote], check=False)
    return {"remote": remote}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
