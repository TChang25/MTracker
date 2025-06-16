DROP TABLE IF EXISTS streaks;
DROP TABLE IF EXISTS user;



CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    username VARCHAR(45) UNIQUE,
    hashed_pw VARCHAR(100) NOT NULL,
    salt VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_on DATE DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS streaks (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    date_worked DATE,
    hours_worked DECIMAL(5, 2) DEFAULT 0,
    work_flag INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE 
); 

CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY,  -- D1 auto-incrementing primary key
    user_id INTEGER NOT NULL,  -- User who initiated the friend request
    friend_id INTEGER NOT NULL,  -- The user who is the friend
    status TEXT DEFAULT 'pending',  -- Friendship status ('pending', 'accepted', etc.)
    created_on TEXT DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the friendship was created
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,  -- If a user is deleted, the friendship is also deleted
    FOREIGN KEY (friend_id) REFERENCES user(id) ON DELETE CASCADE,  -- Same for the friend
    CONSTRAINT unique_friendship UNIQUE (user_id, friend_id)  -- Ensures unique friendship pairs
);