import sqlite3
from werkzeug.security import generate_password_hash

conn = sqlite3.connect('users.db')
cursor = conn.cursor()

# Drop the table completely (optional but ensures fresh start)
cursor.execute("DROP TABLE IF EXISTS users")

# Recreate the table

cursor.execute('''
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
''')


# Insert sample users with hashed passwords
users = [
    ('John Doe', 'john@example.com', generate_password_hash('password123')),
    ('Jane Smith', 'jane@example.com', generate_password_hash('secret456')),
    ('Bob Johnson', 'bob@example.com', generate_password_hash('qwerty789')),
    ('John Doe', 'john@example.com', generate_password_hash('password123')),
    ('Jane Smith', 'jane@example.com', generate_password_hash('secret456')),
    ('Bob Johnson', 'bob@example.com', generate_password_hash('qwerty789'))
]

for user in users:
    try:
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", user)
    except sqlite3.IntegrityError:
        print(f"Skipped duplicate email: {user[1]}")

conn.commit()
conn.close()

print("Database initialized with ID reset and sample users.")
