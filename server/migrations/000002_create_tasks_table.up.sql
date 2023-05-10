CREATE TABLE Tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stage VARCHAR(255) NOT NULL DEFAULT 'Todo',
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
