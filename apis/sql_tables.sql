
-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    apple_id VARCHAR(255) UNIQUE,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_picture_url VARCHAR(255)
);

-- Create Events table
CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    thumbnail VARCHAR(255),
    name VARCHAR(255) NOT NULL
);

-- Create Images table
CREATE TABLE IF NOT EXISTS images (
    image_id SERIAL PRIMARY KEY,
    event_id BIGINT UNSIGNED,
    url VARCHAR(255) NOT NULL,
    tagged TEXT,
    queued BOOLEAN,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);


-- Create UserFriends table to handle the many-to-many relationship between users and friends
CREATE TABLE IF NOT EXISTS friends (
    user_id BIGINT UNSIGNED,
    friend_user_id BIGINT UNSIGNED,
    PRIMARY KEY (user_id, friend_user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create EventAttendees table to handle the many-to-many relationship between users and events they are attending
CREATE TABLE IF NOT EXISTS event_attendees (
    event_id BIGINT UNSIGNED, 
    attendee_user_id BIGINT UNSIGNED, 
    PRIMARY KEY (event_id, attendee_user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (attendee_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

