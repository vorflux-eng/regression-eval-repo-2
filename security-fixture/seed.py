"""Create fixture.db with the rows the vulnerable routes read."""

import sqlite3

connection = sqlite3.connect("fixture.db")
connection.executescript(
    """
    CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT);
    CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, password TEXT);
    INSERT INTO items (name) VALUES ('alpha'), ('beta'), ('gamma');
    INSERT INTO users (name, password) VALUES ('ada', 'x'), ('grace', 'y');
    """
)
connection.commit()
connection.close()
print("seeded fixture.db")
