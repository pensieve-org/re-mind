import psycopg2

# Replace these variables with your own database connection parameters
db_name = 'your_db_name'
db_user = 'your_db_user'
db_password = 'your_db_password'
db_host = 'your_db_host'  # Often 'localhost' or an IP address

# Establish a connection to the database
conn = psycopg2.connect(
    dbname=db_name,
    user=db_user,
    password=db_password,
    host=db_host
)

# Create a cursor object
cursor = conn.cursor()

# Create Users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture_url VARCHAR(255)
);
''')

# Create Events table
cursor.execute('''
CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    thumbnail VARCHAR(255),
    name VARCHAR(255) NOT NULL,
);
''')

# Create Images table
cursor.execute('''
CREATE TABLE IF NOT EXISTS images (
    image_id SERIAL PRIMARY KEY,
    event_id INT,
    url VARCHAR(255) NOT NULL,
    tagged TEXT,
    queued BOOLEAN,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);
''')

# Create UserFriends table to handle the many-to-many relationship between users and friends
cursor.execute('''
CREATE TABLE IF NOT EXISTS user_friends (
    user_id INT,
    friend_user_id INT,
    PRIMARY KEY (user_id, friend_user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
''')

# Create EventAttendees table to handle the many-to-many relationship between users and events they are attending
cursor.execute('''
CREATE TABLE IF NOT EXISTS event_attendees (
    event_id INT,
    attendee_user_id INT,
    PRIMARY KEY (event_id, attendee_user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (attendee_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
''')

# Commit the changes to the database
conn.commit()

# Close the cursor and connection to the database
cursor.close()
conn.close()

print('Database and tables created successfully.')
