CREATE TABLE Users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR -- TODO not null
);

CREATE TABLE Areas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE TaskStatuses(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE Tasks(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    description VARCHAR NOT NULL,
    deadline    DATETIME NOT NULL,
    urgent      BOOLEAN DEFAULT FALSE NOT NULL,
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    lastUpdate  DATETIME DEFAULT NULL, -- TODO trigger on update, CURRENT_TIMESTAMP
    doneAt      DATETIME DEFAULT NULL, -- TODO trigger on statusId update to 3, CURRENT_TIMESTAMP
    targetId    INTEGER DEFAULT NULL, -- if null, target is all
    areaId      INTEGER NOT NULL,
    statusId    INTEGER DEFAULT 1 NOT NULL,
    createdBy   INTEGER NOT NULL,
    updatedBy INTEGER DEFAULT NULL,

    FOREIGN KEY (targetId) REFERENCES Users(id),
    FOREIGN KEY (areaId) REFERENCES Areas(id),
    FOREIGN KEY (statusId) REFERENCES TaskStatuses(id),
    FOREIGN KEY (createdBy) REFERENCES Users(id),
    FOREIGN KEY (updatedBy) REFERENCES Users(id)
);

-- TODO triggers
