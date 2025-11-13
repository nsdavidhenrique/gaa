CREATE TABLE Users(
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    type              TEXT CHECK( type IN ('A', 'U') ), -- A for admin and U for user
    name VARCHAR(255) UNIQUE NOT NULL,
    password_hash     VARCHAR
);

CREATE TABLE Areas(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE TaskStatuses(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Tasks(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    description VARCHAR NOT NULL,
    deadline    DATETIME NOT NULL,
    urgent      BOOLEAN DEFAULT FALSE NOT NULL,
    createdAt   TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
    lastUpdate  TEXT DEFAULT NULL,
    targetId    INTEGER DEFAULT NULL, -- if null, target is all
    areaId      INTEGER NOT NULL,
    statusId    INTEGER DEFAULT 1 NOT NULL,
    createdBy   INTEGER NOT NULL,
    updatedBy   INTEGER DEFAULT NULL,

    FOREIGN KEY (targetId)  REFERENCES Users(id),
    FOREIGN KEY (areaId)    REFERENCES Areas(id),
    FOREIGN KEY (statusId)  REFERENCES TaskStatuses(id),
    FOREIGN KEY (createdBy) REFERENCES Users(id),
    FOREIGN KEY (updatedBy) REFERENCES Users(id)
);

CREATE TABLE Comments(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    createdAt TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M%SZ', 'now')) NOT NULL,
    content   TEXT NOT NULL,
    taskId    INTEGER NOT NULL,
    userId    INTEGER NOT NULL,

    FOREIGN KEY (taskId) REFERENCES Tasks(id),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TRIGGER set_lastUpdate_on_status_change
AFTER UPDATE OF statusId ON Tasks
FOR EACH ROW
BEGIN
    UPDATE Tasks
    SET lastUpdate = strftime('%Y-%m-%dT%H:%M:%SZ', CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
