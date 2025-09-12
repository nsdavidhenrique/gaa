from flask import Flask, request, Response, jsonify
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import json
import sqlite3
from db import *

#TODO add edit and delete tasks, and register

app  = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["JWT_SECRET_KEY"] = "foo-bar" # TODO search for best practices to define this key

jwt = JWTManager(app)
ph  = PasswordHasher()

@app.route("/login", methods={"POST"})
def login():
    name     = request.json.get("username", None)
    password = request.json.get("password", None)

    user, status = get_user_and_password(name=name)
    if status == 404: return jsonify({"success": False, "data": "Denied"}), 401    

    try:
        ph.verify(user["password_hash"], password)
        access_token = create_access_token(identity=name)
        return jsonify({"success": True, "data": access_token}), 200
    except VerifyMismatchError:
        return jsonify({"success": False, "data": "Denied"}), 401    

@app.route("/users", methods=['GET'])
@jwt_required()
def users_route():
    params    = request.args.to_dict()
    idParam   = params.get("id")
    nameParam = params.get("name")

    if idParam:     data, status = get_users(id=idParam)
    elif nameParam: data, status = get_users(name=nameParam)
    else:           data, status = get_users()

    if   status == 200: return jsonify({"success": True,  "data": data}), 200
    elif status == 404: return jsonify({"success": False, "data": "User not found"}), 404
    # UNREACHABLE
    else:               return jsonify({"success": False, "data": "Invalid request"}), 400

@app.route("/areas")
@jwt_required()
def areas_route():
    params    = request.args.to_dict()
    idParam   = params.get("id")
    nameParam = params.get("name")

    if idParam:     data, status = get_areas(id=idParam)
    elif nameParam: data, status = get_areas(name=nameParam)
    else:           data, status = get_areas()

    if   status == 200: return jsonify({"success": True,  "data": data}), 200
    elif status == 404: return jsonify({"success": False, "data": "Area not found"}), 404
    # UNREACHEABLE
    else:               return jsonify({"success": False, "data": "Invalid request"}), 400

@app.route("/task", methods=['GET'])
@jwt_required()
def get_task_route():
    params = request.args.to_dict()

    if "id" not in params or not params["id"].isdigit():
        return jsonify({"success": False, "data": "Invalid or missing Task ID"}), 400

    data, status = get_task_details(params['id'])

    if   status == 200: return jsonify({"success": True,  "data": data}), 200
    elif status == 404: return jsonify({"success": False, "data": "Not Found"}), 404
    elif status == 400: return jsonify({"success": False, "data": "Bad request"}), 400
    # UNREACHABLE
    else:               return jsonify({"success": False, "data": "Invalid request"}), 400


@app.route("/task", methods=['PATCH'])
@jwt_required()
def update_task_route():
    currentUser = get_jwt_identity()
    params      = request.args.to_dict()
    data        = request.json

    if not data.get('id') or not params["id"].isdigit():
        return jsonify({"success": False, "data": "Invalide or missing Task ID"}), 400

    if not data.get('status'):
        return jsonify({"success": False, "data": "Invalide or missing status"}), 400

    user, status = get_users(name=currentUser)
    if status != 200: return "", 401

    stat, success = get_status(name=data["status"])
    if status != 200: return "", 400

    data, status = update_task_status(id=params['id'], statusId=stat[0]['id'], userId=user[0]['id'])

    if   status == 204: return "", 204
    elif status == 500: return jsonifu(), 500
    else:             return jsonify({"success": False, "error": data}), status

@app.route("/taskList", methods=['GET'])
@jwt_required()
def task_list_route():
    params  = request.args.to_dict()
    pending = params.get("pending")
    offset  = params.get("offset")

    if pending not in [None, "true", "false"]:
        return jsonify({"success": False, "error": f"Invalid 'pending' value: {pending}"}), 400

    if offset is not None and not offset.isdigit():
        return jsonify({"success": False, "error": f"Invalid 'offset' value: {offset}"}), 400

    data, status = get_task_list(pending, offset)

    if status == 200: return jsonify({"success": True, "data": data}), 200
    else:             return jsonify({"success": False, "data": "Invalid request"}), status

@app.route("/createTask", methods=['POST'])
@jwt_required()
def create_task_route():
    #current_user = get_jwt_identity()

    data        = request.json
    description = data.get("description")
    deadline    = data.get("deadline")
    urgent      = data.get("urgent")
    targetId    = data.get("targetId")
    areaId      = data.get("areaId")
    createdBy   = data.get("createdBy")

    if targetId == 0: targetId = None
    #TODO
    if not createdBy: createdBy = 1

    data, status = create_task(description, deadline, urgent, targetId, areaId, createdBy)

    if status == 201: return "", status
    else:             return jsonify({"success": False, "error": data}), status

@app.route("/", methods=['GET'])
def home_route():
    return "TODO(/)"

if __name__ == '__main__':
    init_db(app)
    app.run(host="0.0.0.0", port=8080,debug=True)
