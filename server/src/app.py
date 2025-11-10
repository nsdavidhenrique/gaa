from flask import Flask, request, Response, jsonify
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from datetime import timedelta
import json
import sqlite3
from db import *

#TODO add edit and delete tasks, and register

app  = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["JWT_SECRET_KEY"] = "foo-bar" # TODO search for best practices to define this key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=20)
# TODO refresh token

jwt = JWTManager(app)
ph  = PasswordHasher()

@jwt.unauthorized_loader
def custom_unauthorized_response(callback):
    return jsonify({"success": False, "data": "Missing or invalid JWT"}), 401

@jwt.invalid_token_loader
def custom_invalid_token_response(callback):
    print(callback) # TODO temp
    return jsonify({"success": False, "data": "Invalid token"}), 422

@app.route("/login", methods={"POST"})
def login_route():
    username     = request.json.get("username", None)
    user, status = get_user_and_password(username=username)

    if status == 400:                 return jsonify({"success": False, "data": "Bad request"}), 404
    if status == 404:                 return jsonify({"success": False, "data": "User not found"}), 404
    if user['password_hash'] == None: return jsonify({"success": True,  "data": {"hasPassword": False}}), 200
    else:                             return jsonify({"success": True,  "data": {"hasPassword": True}}), 200

@app.route("/authenticate", methods={"POST"})
def authenticate_route():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user, status = get_user_and_password(username=username)
    if status == 404: return jsonify({"success": False, "data": "Denied"}), 401    

    try:
        ph.verify(user["password_hash"], password)
        access_token = create_access_token(identity=username) # TODO user['id'].tostring
        return jsonify({"success": True, "data": access_token}), 200
    except Exception:
        return jsonify({"success": False, "data": "Denied"}), 401    

@app.route("/createUser", methods={"POST"})
@jwt_required()
def create_user_route():
    username = request.json.get("username", None)
    _, status = register_user(username, 'U')

    if status == 204: return "", 204
    if status == 400: return jsonify({"success": False, "data": "Bad request"}), 400
    if status == 409: return jsonify({"success": False, "data": "User already exists"}), 409
    # UNREACHABLLE
    else:             return jsonify({"success": False, "data": "Internal server error"}), 500

@app.route("/createPassword", methods={"POST"})
def create_password_route():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    _, status = register_password(username, password)

    if status == 204: return "", 204
    if status == 400: return jsonify({"success": False, "data": "Bad request"}), 400
    if status == 404: return jsonify({"success": False, "data": "User not found"}), 404
    # UNREACHABLLE
    else:             return jsonify({"success": False, "data": "Internal server error"}), 500

@app.route("/resetPassword", methods={"POST"})
@jwt_required()
def reset_password_route():
    username  = request.json.get("username", None)
    _, status = reset_password(username)

    if status == 204: return "", 204
    if status == 400: return jsonify({"success": False, "data": "Bad request"}), 400
    if status == 404: return jsonify({"success": False, "data": "User not found"}), 404
    # UNREACHABLLE
    else:             return jsonify({"success": False, "data": "Internal server error"}), 500

@app.route("/users", methods=['GET'])
@jwt_required()
def users_route():
    params    = request.args.to_dict()
    idParam   = params.get("id")
    usernameParam = params.get("username")

    if idParam:     data, status = get_users(id=idParam)
    elif usernameParam: data, status = get_users(username=usernameParam)
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
    nameParam = params.get("username")

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


# TODO better naming
@app.route("/task", methods=['PATCH'])
@jwt_required()
def update_task_route():
    currentUser = get_jwt_identity()
    data        = request.json

    taskId      = data.get('id')
    newStatus   = data.get('status')

    user, status = get_users(username=currentUser)
    if status != 200: return jsonify({"success": False, "data": "Unauthorized"}), 401

    stat, success = get_statuses(name=newStatus)
    if status != 200: return jsonify({"success": False, "data": "Bad request"}), 400

    data, status = update_task_status(id=taskId, statusId=stat[0]['id'], userId=user[0]['id'])

    if     status == 204: return "", 204
    elif   status == 400: return jsonify({"success": False, "data": "Bad request"}), 400
    elif   status == 500: return jsonify({"success": False, "data": "Internal server error"}), 500
    # UNREACHABLLE
    else:                 return jsonify({"success": False, "data": "Internal server error"}), 500

@app.route("/taskList", methods=['GET'])
@jwt_required()
def task_list_route():
    params  = request.args.to_dict()
    pending = params.get("pending")
    offset  = params.get("offset")

    if pending not in [None, "true", "false"]:
        return jsonify({"success": False, "data": f"Invalid 'pending' value: {pending}"}), 400

    if offset is not None and not offset.isdigit():
        return jsonify({"success": False, "data": f"Invalid 'offset' value: {offset}"}), 400

    data, status = get_task_list(pending, offset)

    if status == 200: return jsonify({"success": True, "data": data}), 200
    else: return # UNREACHABLE

@app.route("/createTask", methods=['POST'])
@jwt_required()
def create_task_route():
    currentUser = get_jwt_identity()
    data        = request.json
    description = data.get("description")
    deadline    = data.get("deadline")
    urgent      = data.get("urgent")
    targetId    = data.get("targetId")
    areaId      = data.get("areaId")

    createdBy, status = get_users(username=currentUser)
    # TODO handling errors incorrectly
    if status != 200: return jsonify({"success": False, "data": "Unauthorized"}), 401

    if targetId == 0: targetId = None

    data, status = create_task(description, deadline, urgent, targetId, areaId, createdBy[0]['id'])

    if   status == 201: return "", 201
    elif status == 400: return jsonify({"success": False, "data": "Bad request"}), 400
    elif status == 500: return jsonify({"success": False, "data": "Internal server error"}), 500
    # UNREACHABLE
    else:               return jsonify({"success": False, "data": "Internal server error"}), 500

@app.route("/", methods=['GET'])
def home_route():
    register_user('admin', 'A')
    register_user('user', 'U')
    register_password('admin', '123')
    return "TODO(/)"

if __name__ == '__main__':
    bootstrap_db(app)
    init_db(app)
    app.run(host="0.0.0.0", port=8080,debug=True)
