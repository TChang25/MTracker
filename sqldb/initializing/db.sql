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
    hours_worked INTEGER DEFAULT 0,
    work_flag INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(id)
);