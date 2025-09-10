import os
import sys
import sqlite3
from argon2 import PasswordHasher #TODO temp
from datetime import datetime

db_path = "sql/database.db"

def init_db(app):
    if not os.path.exists("sql/database.db"):
        with app.app_context():
            db = get_db()
            with app.open_resource("../sql/schema.sql", "r") as f:
                db.cursor().executescript(f.read())
                db.commit()
            try:
                with app.open_resource("../sql/default_entries.sql", "r") as f:
                    db.cursor().executescript(f.read())
                    db.commit()
                register_users('admin', '123') #TODO temp
                register_users('admin2', '123') #TODO temp
                create_task('description', "2025-08-15T14:30-03:00", True, 1, 1, 1)
            except Exception as e:
                db.close()
                sys.stderr.write(f"Error on inserting default_entries: {e}\n")
                os.remove(db_path)
                exit(1)

def get_db():
    db = sqlite3.connect(db_path)
    db.execute("PRAGMA foreign_keys = ON;")
    db.row_factory = sqlite3.Row
    db.text_factory = lambda b: b.decode('utf-8', errors='replace')
    return db

def register_users(name, password): #TODO temp
    ph = PasswordHasher()
    password_hash = ph.hash(password)

    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO Users (name, password_hash) VALUES (?, ?)", (name, password_hash,))
    db.commit()
    db.close()

def get_user_and_password(name = None):
    if name == None: return None, 400

    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Users WHERE name = ? ;", (name,))
    row = cursor.fetchone()

    if not row: return None, 404
    return dict(row), 200

def get_users(id = None, name = None):
    db = get_db()
    cursor = db.cursor()

    if id:     cursor.execute("SELECT id, name FROM Users WHERE id = ? ;", (id,))
    elif name: cursor.execute("SELECT id, name FROM Users WHERE name = ? ;", (name,))
    else:      cursor.execute("SELECT id, name FROM Users;")

    rows = cursor.fetchall()
    db.close()

    if (id is not None or name is not None) and not rows: return [], 404 
    else:                                                 return [dict(row) for row in rows], 200

def get_areas(id = None, name = None):
    db = get_db()
    cursor = db.cursor()

    if id:     cursor.execute("SELECT * from Areas WHERE id = ? ;", (id,))
    elif name: cursor.execute("SELECT * from Areas WHERE name = ? ;", (name,))
    else:      cursor.execute("SELECT * FROM Areas;")

    rows = cursor.fetchall()
    db.close()

    if (id is not None or name is not None) and not rows: return [], 404 
    else:                                                 return [dict(row) for row in rows], 200

def get_status(id = None, name = None):
    db = get_db()
    cursor = db.cursor()

    if id:     cursor.execute("SELECT * FROM TaskStatuses WHERE id = ? ;", (id,))
    elif name: cursor.execute("SELECT * FROM TaskStatuses WHERE name = ? ;", (name,))
    else:      cursor.execute("SELECT * FROM TaskStatuses;")

    rows = cursor.fetchall()
    db.close()

    if (id is not None or name is not None) and not rows: return [], 404 
    else:                                                 return [dict(row) for row in rows], 200

def get_task_details(id):
    db = get_db()
    cursor = db.cursor()

    query = '''
    SELECT 
        t.id, t.description, t.deadline, t.urgent, t.createdAt, t.lastUpdate, t.updatedBy, t.doneAt, 
        u.name AS target, 
        a.name AS area, 
        s.name AS status, 
        u2.name AS createdBy, 
        u3.name AS updatedBy,
        u4.name AS doneBy 
    FROM Tasks AS t 
    LEFT JOIN Users AS u ON t.targetId = u.id 
    LEFT JOIN Users AS u2 ON t.createdBy = u2.id 
    LEFT JOIN Areas AS a ON t.areaId = a.id 
    LEFT JOIN TaskStatuses AS s ON t.statusId = s.id 
    LEFT JOIN Users AS u3 ON t.beingDoneBy = u3.id 
    LEFT JOIN Users AS u4 ON t.doneBy = u4.id 
    WHERE t.id = ?;
    '''

    cursor.execute(query, (id,))
    row = cursor.fetchone()
    db.close()

    if row: return dict(row), 200
    else:   return {}, 404

def get_task_list(pending = None, offset = None):
    db = get_db()
    cursor = db.cursor()

    query = '''
    SELECT
        t.id, t.description, t.deadline, t.urgent, s.name AS status, u.name AS target
    FROM Tasks as t
    LEFT JOIN TaskStatuses as s ON t.statusId = s.id
    LEFT JOIN Users as u ON t.targetId = u.id
    '''

    if pending is None or pending == "true":
        query += "WHERE t.statusId != 3"
        cursor.execute(query)
    else:
        query += "WHERE t.statusId = 3 ORDER BY t.createdAt DESC LIMIT 5 OFFSET ? ;"
        cursor.execute(query, (int(offset or 0) * 5,))

    rows = cursor.fetchall()
    db.close()
    
    if rows: return [dict(row) for row in rows], 200
    return [], 200

def create_task(description, deadline, urgent, targetId, areaId, createdBy):
    db = get_db()
    cursor = db.cursor()

    query = '''
    INSERT INTO Tasks (description, deadline, urgent, targetId, areaId, createdBy)
    VALUES (?, ?, ?, ?, ?, ?)
    '''

    try:
        cursor.execute(query, (description, deadline, urgent, targetId, areaId, createdBy,))
        db.commit()
    except Exception as e:
        return f"Failed to insert into tasks: {e}", 500
    finally: db.close()
    return "", 201

def update_task_status(id, newStatus, user):
    taskStatus = newStatus
    if not taskStatus.isdigit():
        taskStatus, status = get_status(name = newStatus)
        if status == 404:
            return dict({"success": False, "error": "status does not exist"}), 404
        taskStatus = taskStatus[0].get("id")

    db     = get_db()
    cursor = db.cursor()
    query  = "UPDATE Tasks SET statusId = ?, updatedBy = ?, lastUpdate = ? WHERE id = ?;"

    try:
        cursor.execute(query, (id, user, datetime.now().isoformat(), taskStatus,))
        db.commit()
    except Exception as e:
        print(e)
        return f"Failed to update tasks: {e}", 500
    finally: db.close()

    return "", 204

