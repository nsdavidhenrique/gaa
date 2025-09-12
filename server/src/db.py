import os
import sys
import sqlite3
from argon2 import PasswordHasher #TODO temp
from datetime import datetime

# TODO instead of open db connection every time, use context, g

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

    if (id is not None or name is not None) and not rows: return None, 404 
    else:                                                 return [dict(row) for row in rows], 200

def get_areas(id = None, name = None):
    db = get_db()
    cursor = db.cursor()

    if id:     cursor.execute("SELECT * from Areas WHERE id = ? ;", (id,))
    elif name: cursor.execute("SELECT * from Areas WHERE name = ? ;", (name,))
    else:      cursor.execute("SELECT * FROM Areas;")

    rows = cursor.fetchall()
    db.close()

    if (id is not None or name is not None) and not rows: return None, 404 
    else:                                                 return [dict(row) for row in rows], 200

def get_status(id = None, name = None):
    db = get_db()
    cursor = db.cursor()

    if id:     cursor.execute("SELECT * FROM TaskStatuses WHERE id = ? ;", (id,))
    elif name: cursor.execute("SELECT * FROM TaskStatuses WHERE name = ? ;", (name,))
    else:      cursor.execute("SELECT * FROM TaskStatuses;")

    rows = cursor.fetchall()
    db.close()

    if (id is not None or name is not None) and not rows: return None, 404 
    else:                                                 return [dict(row) for row in rows], 200

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

def get_task_details(id):
    if not id or not id.isdigit(): return None, 400

    db = get_db()
    cursor = db.cursor()

    query = '''
    SELECT 
        t.id, t.description, t.deadline, t.urgent, t.createdAt, t.lastUpdate,
        a.name AS area, 
        u.name AS target, 
        s.name AS status, 
        u2.name AS createdBy, 
        u3.name AS updatedBy
    FROM Tasks AS t 
    LEFT JOIN Users AS u ON t.targetId = u.id 
    LEFT JOIN Users AS u2 ON t.createdBy = u2.id 
    LEFT JOIN Areas AS a ON t.areaId = a.id 
    LEFT JOIN TaskStatuses AS s ON t.statusId = s.id 
    LEFT JOIN Users AS u3 ON t.updatedBy = u3.id 
    WHERE t.id = ?;
    '''

    cursor.execute(query, (id,))
    row = cursor.fetchone()
    db.close()

    if row: return dict(row), 200
    else:   return None, 404

def create_task(description, deadline, urgent, targetId, areaId, createdBy):
    if not description or not deadline or not targetId or not areaId or not createBy: return None, 400
    if not targetId.isdigit() or not areaId.isdigit() or not createBy.isdigit():      return None, 400

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
        print(f'EXCEPTION: create_task(description={description}, deadline={deadline}, urgent={urgent}, targetId={targetId}, areaId={areaId}, createBy={createdBy}): {e}')
        return None, 500
    finally: db.close()
    return None, 201

def update_task_status(id, statusId, userId):
    if not id or not statusId or not userId:                               return "", 400
    if not id.isdigit() or not statusId.isdigit() or not userId.isdigit(): return "", 400

    db     = get_db()
    cursor = db.cursor()
    query  = "UPDATE Tasks SET statusId = ?, updatedBy = ? WHERE id = ?;"

    try:
        cursor.execute(query, (statusId, userId, id,))
        db.commit()
    except Exception as e:
        print(f'EXCEPTION: update_task_status(id={id}, statusId={statusId}, userId={userId}): {e}')
        return None, 500
    finally: db.close()

    return None, 204

def get_comments(taskId):
    if not taskId or not taskId.isdigit(): return "", 400

    db     = get_db()
    cursor = db.cursor()
    query  = '''
        SELECT c.content, u.name As user
        FROM Comments As c
        LEFT JOIN Users AS u on u.id = c.userId
        WHERE taskId = ?
    '''
    cursor.execute(query, (taskId,))
    rows = cursor.fetchall()

    if not rows: return [], 200 # ? 404
    else:        return [dict(row) for row in rows], 200

def create_comment(taskId, userId, content):
    if not taskId or not userId or not content:      return "", 400
    if not userId.isdigit() or not taskId.isdigit(): return "", 400

    db     = get_db()
    cursor = db.cursor()
    query  = "INSERT INTO Comments (taskId, userId, content) VALUES (? ? ?)"

    try:
        cursor.execute(query, (taskId, userId, content,))
        db.commit()
    except Exception as e:
        print(f'EXCEPTION: create_comment(taskId={taskId}, userId={statusId}, content=\"{content}\"): {e}')
        return None, 500
    finally: db.close()

    return "", 201

