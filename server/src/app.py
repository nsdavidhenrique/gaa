from flask import Flask, request, Response, jsonify
from flask_cors import CORS, cross_origin
import json
import os
import sys
import sqlite3

app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

db_path = "sql/database.db"

def get_db():
    db = sqlite3.connect(db_path)
    db.execute("PRAGMA foreign_keys = ON;")
    # Return fetched result as Row object, that provides index-based and name-based access.
    db.row_factory = sqlite3.Row
    db.text_factory = lambda b: b.decode('utf-8', errors='replace')
    return db

def init_db():
    # create db if it doesn't exist
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
            except Exception as e:
            # Delete database before exit
                db.close()
                sys.stderr.write(f"Error on inserting default_entries: {e}\n")
                os.remove(db_path)
                exit(1)

def get_users(id = None, name = None):
    db = get_db()
    cursor = db.cursor()

    if id:
        cursor.execute("SELECT * from Users WHERE id = ? ;", (id,))
    elif name and not id:
        cursor.execute(f"SELECT * from Users WHERE name = ? ;", (name,))
    elif not id and not name:
        cursor.execute("SELECT * FROM Users;")

    rows = cursor.fetchall()
    db.close()

    if rows: return jsonify([dict(row) for row in rows])
    else:    return jsonify({"error": "Users not found"})

def get_areas(id = None, name = None):
    db = get_db()
    cursor = db.cursor()

    if id:
        cursor.execute("SELECT * from Areas WHERE id = ? ;", (id,))
    elif name:
        cursor.execute("SELECT * from Areas WHERE name = ? ;", (name,))
    else:
        cursor.execute("SELECT * FROM Areas;")

    rows = cursor.fetchall()
    db.close()

    if rows: return jsonify([dict(row) for row in rows])
    else:    return jsonify({f"error": "Area not found"})

def get_task_details(id):
    db = get_db()
    cursor = db.cursor()

    query = '''
    SELECT 
        t.id, t.description, t.deadline, t.urgent, t.createdAt, t.lastUpdate, t.beingDoneAt, t.doneAt, 
        u.name AS target, 
        a.name AS area, 
        s.name AS status, 
        u2.name AS createdBy, 
        u3.name AS beingDoneBy,
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

    if row: return jsonify(dict(row))
    else:   return jsonify({"error": "Task not found"})

@app.route("/users", methods=['GET'])
def users_route():
    params = request.args.to_dict()

    if len(params) == 0:
        return  get_users()
    elif params.get("id") != None:
        return get_users(id = params.get('id'))
    elif params.get("name") != None:
        return get_users(name = params.get('name'))
    else:
        return jsonify({"error": "Invalid paramters to get users"})


@app.route("/areas")
def areas_route():
    params = request.args.to_dict()

    if len(params) == 0:
        return get_areas()
    elif params.get("id") != None:
        return get_areas(id = params.get('id'))
    elif params.get("name") != None:
        return get_areas(name = params.get('name'))
    else:
        return jsonify({"error": "Invalid paramters to get areas"})

@app.route("/taskDetails", methods=['GET'])
def task_details_route():
    params = request.args.to_dict()

    if "id" not in params or not params["id"].isdigit():
        return jsonify({"error": "Invalide or missing Task ID"})
    return get_task_details(params['id'])

@app.route("/taskList", methods=['GET'])
def task_list_route():
    params = request.args.to_dict()
    db = get_db()
    cursor = db.cursor()

    query = '''
    SELECT
        t.id, t.description, t.deadline, t.urgent, s.name AS status, u.name AS target
    FROM Tasks as t
    LEFT JOIN TaskStatuses as s ON t.statusId = s.id
    LEFT JOIN Users as u ON t.targetId = u.id
    '''

    if len(params) > 2:
        return jsonify({"error": "Task List accept only two paramters, pending and offset"})
    if len(params) == 1 and not params.get("pending") == "true":
        return jsonify({"error": f"Invalid missing offset for Task List: {params}"})
    if len(params) == 2 and (params.get("pending") is None or params.get("offset") is None):
        return jsonify({"error": f"Invalid params for Task List params: {params}"})
    if len(params) == 2 and (params.get("pending") not in ["true", "false"] or not params.get("offset").isdigit()):
        return jsonify({"error": f"Invalid values for Task List params: {params}"})

    if len(params) == 0 or params.get("pending") == "true":
        query += "WHERE statusId != 3"
        cursor.execute(query);
    else:
        query += "WHERE statusID = 3 LIMIT 5 OFFSET ?"
        cursor.execute(query, (params['offset'],))

    rows = cursor.fetchall()
    db.close()
    data = {}

    if rows:
        data = [dict(row) for row in rows]
        return Response(
            json.dumps(data, ensure_ascii=False),
            mimetype="application/json; charset=utf-8"
        )
    else: return jsonify({})

@app.route("/createTask", methods=['POST'])
def create_task():
    data        = request.json
    description = data.get("description")
    deadline    = data.get("deadline")
    urgent      = data.get("urgent")
    targetId    = data.get("target")
    areaId      = data.get("area")
    createdBy   = data.get("createdBy")

    #TODO name to ID

    query = '''
    INSERT INTO Tasks (description, deadline, urgent, targetId, areaId, createdBy)
    VALUES (?, ?, ?, ?, ?, ?)
    '''

    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute(query, (description, deadline, urgent, targetId, areaId, createdBy,))
        db.commit()
    except Exception as e: return jsonify({"error": f"Failed to insert into tasks: {e}"})
    finally: db.close()

    return jsonify({"success": True})

@app.route("/", methods=['GET'])
def get_task():
    return "TODO(/)"

if __name__ == '__main__':
    init_db()
    app.run(host="0.0.0.0", port=8080,debug=True)
