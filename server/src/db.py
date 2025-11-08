import os
import sys
import sqlite3
from argon2 import PasswordHasher #TODO temp
from datetime import datetime
from flask import g
from contextlib import contextmanager

# TODO print exception

db_path = "sql/database.db"

def bootstrap_db(app):
    if not os.path.exists("sql/database.db"):
        with sqlite3.connect(db_path) as db:
            with app.open_resource("../sql/schema.sql", "r") as f:
                db.executescript(f.read())
            try:
                with app.open_resource("../sql/default_entries.sql", "r") as f:
                    db.executescript(f.read())
            except Exception as e:
                db.close()
                sys.stderr.write(f"Error on inserting default_entries: {e}\n")
                os.remove(db_path)
                exit(1)

def init_db(app):
    app.teardown_appcontext(close_db)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(db_path)
        g.db.execute("PRAGMA foreign_keys = ON;")
        g.db.row_factory = sqlite3.Row
        g.db.text_factory = lambda b: b.decode('utf-8', errors='replace')
    return g.db

def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@contextmanager
def db_cursor(commit=False):
    db = get_db()
    cursor = db.cursor()
    try:
        yield cursor
        if commit:
            db.commit()
    except Exception:
        db.rollback()
        raise

def register_user(username, uType):
    if not username or not uType: return 400

    with db_cursor(commit=True) as cursor:
        try:
            cursor.execute("INSERT INTO Users (name, type) VALUES (?, ?)", (username, uType,))
            return None, 204
        except Exception as e:
            # TODO handle more than duplicated
            return None, 409

def register_password(username, password): # TODO name or id
    if not username or not password: return None, 400

    ph = PasswordHasher()
    password_hash = ph.hash(password)

    with db_cursor(commit=True) as cursor:
        try:
            cursor.execute("UPDATE Users SET password_hash = ? WHERE name = ?;", (password_hash, username,))
            return None, 204
        except Exception as e:
            return None, 404

def reset_password(username): # TODO name or id
    if not username: return None, 400

    with db_cursor(commit=True) as cursor:
        try:
            cursor.execute("UPDATE Users SET password_hash = NULL WHERE name = ?;", (username,))
            return None, 204
        except Exception as e:
            return None, 404
    

def get_users(id = None, username = None):
    with db_cursor() as cursor:
        if   id:   cursor.execute("SELECT id, name, type FROM Users WHERE id = ? ;", (id,))
        elif username: cursor.execute("SELECT id, name, type FROM Users WHERE name = ? ;", (username,))
        else:      cursor.execute("SELECT id, name, type FROM Users;")
        rows = cursor.fetchall()

    if (id is not None or username is not None) and not rows: return None, 404 
    else:                                                 return [dict(row) for row in rows], 200

def get_user_and_password(username = None):
    if not username: return None, 400

    with db_cursor() as cursor:
        cursor.execute("SELECT * FROM Users WHERE name = ? ;", (username,))
        row = cursor.fetchone()

    if not row: return None, 404
    return dict(row), 200

def get_areas(id = None, name = None):
    with db_cursor() as cursor:
        if id:     cursor.execute("SELECT * from Areas WHERE id = ? ;", (id,))
        elif name: cursor.execute("SELECT * from Areas WHERE name = ? ;", (name,))
        else:      cursor.execute("SELECT * FROM Areas;")
        rows = cursor.fetchall()

    if (id is not None or name is not None) and not rows: return None, 404 
    else:                                                 return [dict(row) for row in rows], 200

def get_statuses(id = None, name = None):
    with db_cursor() as cursor:
        if id:     cursor.execute("SELECT * FROM TaskStatuses WHERE id = ? ;", (id,))
        elif name: cursor.execute("SELECT * FROM TaskStatuses WHERE name = ? ;", (name,))
        else:      cursor.execute("SELECT * FROM TaskStatuses;")
        rows = cursor.fetchall()

    if (id is not None or name is not None) and not rows: return None, 404 
    else:                                                 return [dict(row) for row in rows], 200

def get_task_list(pending = None, offset = None):
    query = '''
    SELECT
        t.id, t.description, t.deadline, t.urgent, s.name AS status, u.name AS target
    FROM Tasks as t
    LEFT JOIN TaskStatuses as s ON t.statusId = s.id
    LEFT JOIN Users as u ON t.targetId = u.id
    '''

    with db_cursor() as cursor:
        if pending is None or pending == "true":
            query += "WHERE t.statusId != 3"
            cursor.execute(query)
        else:
            query += "WHERE t.statusId = 3 ORDER BY t.createdAt DESC LIMIT 5 OFFSET ? ;"
            cursor.execute(query, (int(offset or 0) * 5,))

        rows = cursor.fetchall()
        
    if rows: return [dict(row) for row in rows], 200
    return [], 200

def get_task_details(id):
    if not id: return None, 400
    try:
        id = int(id)
    except Exception as e:
        print(f'EXCEPTION: get_task_details(id={id}): {e}')
        return None, 400

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

    with db_cursor() as cursor:
        cursor.execute(query, (id,))
        row = cursor.fetchone()

    if row: return dict(row), 200
    else:   return None, 404

def create_task(description, deadline, urgent, targetId, areaId, createdBy):
    if not description or not deadline or not targetId or not areaId or not createdBy: return None, 400

    try:
        targetId  = int(targetId)
        areaId    = int(areaId)
        createdBy = int(createdBy)
    except Exception as e:
        print(f'EXCEPTION: create_task(description={description}, deadline={deadline}, urgent={urgent}, targetId={targetId}, areaId={areaId}, createBy={createdBy}): {e}')
        return None, 400

    query = '''
    INSERT INTO Tasks (description, deadline, urgent, targetId, areaId, createdBy)
    VALUES (?, ?, ?, ?, ?, ?)
    '''

    with db_cursor(commit=True) as cursor:
        try:
            cursor.execute(query, (description, deadline, urgent, targetId, areaId, createdBy,))
        except Exception as e:
            print(f'EXCEPTION: create_task(description={description}, deadline={deadline}, urgent={urgent}, targetId={targetId}, areaId={areaId}, createBy={createdBy}): {e}')
            return None, 500
    return None, 201

def update_task_status(id, statusId, userId):
    if not id or not statusId or not userId: return None, 400
    try:
        id       = int(id)
        statusId = int(statusId)
        userId   = int(userId)
    except Exception as e:
        print(f'EXCEPTION: update_task_status(id={id}, statusId={statusId}, userId={userId}): {e}')
        return None, 400

    query  = "UPDATE Tasks SET statusId = ?, updatedBy = ? WHERE id = ?;"

    with db_cursor(commit=True) as cursor:
        try:
            cursor.execute(query, (statusId, userId, id,))
        except Exception as e:
            print(f'EXCEPTION: update_task_status(id={id}, statusId={statusId}, userId={userId}): {e}')
            return None, 500

    return None, 204

def get_comments(taskId):
    if not taskId: return None, 400
    try:
        taskId = int(taskId)
    except Exception as e:
        print(f'EXCEPTION: get_comments(taskId={taskId}): {e}')
        return None, 400

    query  = '''
        SELECT c.content, u.name As user
        FROM Comments As c
        LEFT JOIN Users AS u on u.id = c.userId
        WHERE taskId = ?
    '''
    with db_cursor() as cursor:
        cursor.execute(query, (taskId,))
        rows = cursor.fetchall()

    if not rows: return [], 200 # ? 404
    else:        return [dict(row) for row in rows], 200

def create_comment(taskId, userId, content):
    if not taskId or not userId or not content:      return None, 400
    try:
        userId = int(userId)
        taskId = int(taskId)
    except Exception as e:
        print(f'EXCEPTION: create_comments(taskId={taskId}, userId={userId}, content={content}): {e}')
        return None, 400

    query  = "INSERT INTO Comments (taskId, userId, content) VALUES (?, ?, ?)"

    with db_cursor(commit=True) as cursor:
        try:
            cursor.execute(query, (taskId, userId, content,))
        except Exception as e:
            print(f'EXCEPTION: create_comment(taskId={taskId}, userId={userId}, content=\"{content}\"): {e}')
            return None, 500

    return None, 201

