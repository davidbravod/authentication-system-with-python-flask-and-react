"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, People, Planets, Vehicles, TokenBlockedList
from api.favoritos import FavoritePeople, FavoritePlanets, FavoriteVehicles
from api.utils import generate_sitemap, APIException

from api.extensions import jwt, bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity, get_jwt
from flask_jwt_extended import jwt_required

from datetime import date, time, datetime, timezone, timedelta

api = Blueprint('api', __name__)

def verificacionToken(jti):
    jti#Identificador del JWT (es más corto)
    print("jit", jti)
    token = TokenBlockedList.query.filter_by(token=jti).first()

    if token is None:
        return False
    
    return True

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/hola', methods=['POST', 'GET'])
def handle_hola():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/user', methods=['GET'])
def handle_users():
    users = User.query.all()
    users = list(map(lambda item: item.serialize(), users))

    #return jsonify(users), 200

    response_body = {
        "msg": "ok",
        "users": users
    }

    return jsonify(response_body), 200

@api.route('/register', methods=['POST'])
def register_user():
    body = request.get_json()
    email = body["email"]
    name = body["name"]
    password = body["password"]
    is_active = body["is_active"]

    if body is None:
        raise APIException("You need to specify the request body as json object", status_code=400)
    if "email" not in body:
        raise APIException("You need to specify the email", status_code=400)
    if "name" not in body:
        raise APIException("You need to specify the name", status_code=400)
    if "password" not in body:
        raise APIException("You need to specify the password", status_code=400)
    if "is_active" not in body:
        raise APIException("You need to specify the is_active", status_code=400)
    
    user = User.query.filter_by(email=email).first()
    if user is not None:
        raise APIException("Email is already registered", status_code=409)
    
    password_encrypted = bcrypt.generate_password_hash(password,10).decode("utf-8")
    
    new_user = User(email=email, name=name, password=password_encrypted, is_active=is_active)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"mensaje":"Usuario creado correctamente"}), 201

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email=body["email"]
    password = body["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"message":"Login failed"}), 401

    #validar el password encriptado
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message":"Login failed"}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({"token":access_token}), 200

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"] #Identificador del JWT (es más corto)
    now = datetime.now(timezone.utc)

    #identificamos al usuario
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    tokenBlocked = TokenBlockedList(token=jti , created_at=now, email=user.email)
    db.session.add(tokenBlocked)
    db.session.commit()

    return jsonify({"message":"logout successfully"})

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    token = verificacionToken(get_jwt()["jti"]) #reuso la función de verificacion de token
    if token:
       raise APIException('Token está en lista negra', status_code=404)

    print("EL usuario es: ", user.name)
    return jsonify({"message":"Estás en una ruta protegida"}), 200

@api.route('/user/<int:id>', methods=['GET'])
def get_specific_user(id):
    user = User.query.get(id)    
  
    return jsonify(user.serialize()), 200

@api.route('/user-with-post', methods=['POST'])
def get_specific_user_with_post():
    body = request.get_json()   
    id = body["id"]

    user = User.query.get(id)   
  
    return jsonify(user.serialize()), 200

@api.route('/user', methods=['DELETE'])
def delete_specific_user():
    body = request.get_json()   
    id = body["id"]

    user = User.query.get(id) 

    db.session.delete(user)
    db.session.commit()  
  
    return jsonify("Usuario borrado"), 200

@api.route('/user', methods=['PUT'])
def edit_user():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]

    if "name" not in body:
        raise APIException("You need to specify the name", status_code=400)
    if "id" not in body:
        raise APIException("You need to specify the id", status_code=400)

    user = User.query.get(id)   
    user.name = name #modificamos el nombre en base de datos

    db.session.commit()
  
    return jsonify(user.serialize()), 200

############################################################# PEOPLE:
############################################################# PEOPLE:
############################################################# PEOPLE:

@api.route('/people', methods=['GET'])
def get_all_people():
    people = People.query.all()
    people = list(map(lambda item: item.serialize(), people))

    #return jsonify(people), 200

    response_body = {
        "msg": "ok",
        "people": people
    }

    return jsonify(response_body), 200

@api.route('/people', methods=['POST'])
def add_people():
    body = request.get_json()
    name = body["name"]
    birthdate = body["birthdate"]
    eyes = body["eyes"]
    height = body["height"]

    if body is None:
        raise APIException("You need to specify the request body as json object", status_code=400)
    if "name" not in body:
        raise APIException("You need to specify the name", status_code=400)
    if "birthdate" not in body:
        raise APIException("You need to specify the birthdate", status_code=400)
    if "eyes" not in body:
        raise APIException("You need to specify the eyes", status_code=400)
    if "height" not in body:
        raise APIException("You need to specify the height", status_code=400)
    
    new_people = People(name=name, birthdate=birthdate, eyes=eyes, height=height)

    db.session.add(new_people)
    db.session.commit()

    return jsonify({"mensaje":"People creado correctamente"}), 201

@api.route('/people/<int:id>', methods=['GET'])
def get_specific_people(id):
    people = People.query.get(id)    
  
    return jsonify(people.serialize()), 200

@api.route('/people-with-post', methods=['POST'])
def get_specific_people_with_post():
    body = request.get_json()   
    id = body["id"]

    people = People.query.get(id)   
  
    return jsonify(people.serialize()), 200

@api.route('/people', methods=['DELETE'])
def delete_specific_people():
    body = request.get_json()   
    id = body["id"]

    people = People.query.get(id)

    db.session.delete(people)
    db.session.commit()  
  
    return jsonify("People borrado"), 200

@api.route('/people', methods=['PUT'])
def edit_people():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]
    birthdate = body["birthdate"]
    eyes = body["eyes"]
    height = body["height"]

    if body is None:
        raise APIException("You need to specify the request body as json object", status_code=400)
    if "name" not in body:
        raise APIException("You need to specify the name", status_code=400)
    if "birthdate" not in body:
        raise APIException("You need to specify the birthdate", status_code=400)
    if "eyes" not in body:
        raise APIException("You need to specify the eyes", status_code=400)
    if "height" not in body:
        raise APIException("You need to specify the height", status_code=400)

    people = People.query.get(id)   
    people.name = name #modificamos el nombre en base de datos
    people.birthdate = birthdate
    people.eyes = eyes
    people.height = height

    db.session.commit()
  
    return jsonify(people.serialize()), 200

############################################################# PLANETS:
############################################################# PLANETS:
############################################################# PLANETS:

@api.route('/planets', methods=['GET'])
def get_all_planets():
    planets = Planets.query.all()
    planets = list(map(lambda item: item.serialize(), planets))

    #return jsonify(people), 200

    response_body = {
        "msg": "ok",
        "planets": planets
    }

    return jsonify(response_body), 200

@api.route('/planets', methods=['POST'])
def add_planet():
    body = request.get_json()
    name = body["name"]
    population = body["population"]
    surface = body["surface"]
    diameter = body["diameter"]

    if body is None:
        raise APIException("You need to specify the request body as json object", status_code=400)
    if "name" not in body:
        raise APIException("You need to specify the name", status_code=400)
    if "population" not in body:
        raise APIException("You need to specify the population", status_code=400)
    if "surface" not in body:
        raise APIException("You need to specify the surface", status_code=400)
    if "diameter" not in body:
        raise APIException("You need to specify the diameter", status_code=400)
    
    new_planet = Planets(name=name, population=population, surface=surface, diameter=diameter)

    db.session.add(new_planet)
    db.session.commit()

    return jsonify({"mensaje":"Planet creado correctamente"}), 201

@api.route('/planets/<int:id>', methods=['GET'])
def get_specific_planet(id):
    planet = Planets.query.get(id)    
  
    return jsonify(planet.serialize()), 200

@api.route('/planet-with-post', methods=['POST'])
def get_specific_planet_with_post():
    body = request.get_json()   
    id = body["id"]

    planet = Planets.query.get(id)   
  
    return jsonify(planet.serialize()), 200

@api.route('/planets', methods=['DELETE'])
def delete_specific_planet():
    body = request.get_json()   
    id = body["id"]

    planet = Planets.query.get(id) 

    db.session.delete(planet)
    db.session.commit()  
  
    return jsonify("Planet borrado"), 200

@api.route('/planets', methods=['PUT'])
def edit_planet():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]
    population = body["population"]
    surface = body["surface"]
    diameter = body["diameter"]

    if body is None:
        raise APIException("You need to specify the request body as json object", status_code=400)
    if "name" not in body:
        raise APIException("You need to specify the name", status_code=400)
    if "population" not in body:
        raise APIException("You need to specify the population", status_code=400)
    if "surface" not in body:
        raise APIException("You need to specify the surface", status_code=400)
    if "diameter" not in body:
        raise APIException("You need to specify the diameter", status_code=400)

    planet = Planets.query.get(id)   
    planet.name = name #modificamos el nombre en base de datos
    planet.population = population
    planet.surface = surface
    planet.diameter = diameter

    db.session.commit()
  
    return jsonify(planet.serialize()), 200

############################################################# VEHICLES:
############################################################# VEHICLES:
############################################################# VEHICLES:

@api.route('/vehicles', methods=['GET'])
def get_all_vehicles():
    vehicles = Vehicles.query.all()
    vehicles = list(map(lambda item: item.serialize(), vehicles))

    #return jsonify(people), 200

    response_body = {
        "msg": "ok",
        "vehicles": vehicles
    }

    return jsonify(response_body), 200

@api.route('/vehicles', methods=['POST'])
def add_vehicle():
    body = request.get_json()
    name = body["name"]
    passengers = body["passengers"]
    length = body["length"]
    cargo_capacity = body["cargo_capacity"]

    if body is None:
        raise APIException("You need to specify the request body as json object", status_code=400)
    if "name" not in body:
        raise APIException("You need to specify the name", status_code=400)
    if "passengers" not in body:
        raise APIException("You need to specify the passengers", status_code=400)
    if "length" not in body:
        raise APIException("You need to specify the length", status_code=400)
    if "cargo_capacity" not in body:
        raise APIException("You need to specify the cargo_capacity", status_code=400)
    
    new_vehicle = Vehicles(name=name, passengers=passengers, length=length, cargo_capacity=cargo_capacity)

    db.session.add(new_vehicle)
    db.session.commit()

    return jsonify({"mensaje":"Vehicle creado correctamente"}), 201

@api.route('/vehicles/<int:id>', methods=['GET'])
def get_specific_vehicle(id):
    vehicle = Vehicles.query.get(id)    
  
    return jsonify(vehicle.serialize()), 200

@api.route('/vehicles-with-post', methods=['POST'])
def get_specific_vehicle_with_post():
    body = request.get_json()   
    id = body["id"]

    vehicle = Vehicles.query.get(id)   
  
    return jsonify(vehicle.serialize()), 200

@api.route('/vehicles', methods=['DELETE'])
def delete_specific_vehicle():
    body = request.get_json()   
    id = body["id"]

    vehicle = Vehicles.query.get(id) 

    db.session.delete(vehicle)
    db.session.commit()  
  
    return jsonify("Vehicle borrado"), 200

@api.route('/vehicles', methods=['PUT'])
def edit_vehicle():
    body = request.get_json()   
    id = body["id"]
    name = body["name"]
    passengers = body["passengers"]
    length = body["length"]
    cargo_capacity = body["cargo_capacity"]

    if body is None:
        raise APIException("You need to specify the request body as json object", status_code=400)
    if "name" not in body:
        raise APIException("You need to specify the name", status_code=400)
    if "passengers" not in body:
        raise APIException("You need to specify the passengers", status_code=400)
    if "length" not in body:
        raise APIException("You need to specify the length", status_code=400)
    if "cargo_capacity" not in body:
        raise APIException("You need to specify the cargo_capacity", status_code=400)

    vehicle = Vehicles.query.get(id)   
    vehicle.name = name #modificamos el nombre en base de datos
    vehicle.passengers = passengers
    vehicle.length = length
    vehicle.cargo_capacity = cargo_capacity

    db.session.commit()
  
    return jsonify(vehicle.serialize()), 200

############################################################# FAVORITES:
############################################################# FAVORITES:
############################################################# FAVORITES:

@api.route('/favorite/people', methods=['POST'])
def add_favorite_people():
    body = request.get_json()
    user_id = body["user_id"]
    people_id = body["people_id"]

    character = People.query.get(people_id)
    if not character:
        raise APIException('personaje no encontrado', status_code=404)
    
    user = User.query.get(user_id)
    if not user:
        raise APIException('usuario no encontrado', status_code=404)

    fav_exist = FavoritePeople.query.filter_by(user_id = user.id, people_id = character.id).first() is not None
    
    if fav_exist:
        raise APIException('el usuario ya lo tiene agregado a favoritos', status_code=400)

    favorite_people = FavoritePeople(user_id=user.id, people_id=character.id)
    db.session.add(favorite_people)
    db.session.commit()

    return jsonify({
        "people_name":favorite_people.serialize()["people_name"],
        "user": favorite_people.serialize()["user_name"]
    }), 201

@api.route('/favorite/people', methods=['DELETE'])
def remove_favorite_people():
    body = request.get_json()
    user_id = body["user_id"]
    people_id = body["people_id"]

    favorite_people = FavoritePeople.query.filter_by(user_id=user_id, people_id=people_id).first()

    if not favorite_people:
        raise APIException('Favorite people not found', status_code=404)

    db.session.delete(favorite_people)
    db.session.commit()

    return jsonify({"msg":"Favorite people removed successfully"}), 200

@api.route('/favorite/planet', methods=['POST'])
def add_favorite_planet():
    body = request.get_json()
    user_id = body["user_id"]
    planet_id = body["planet_id"]

    planet = Planets.query.get(planet_id)
    if not planet:
        raise APIException('planeta no encontrado', status_code=404)
    
    user = User.query.get(user_id)
    if not user:
        raise APIException('usuario no encontrado', status_code=404)

    fav_exist = FavoritePlanets.query.filter_by(user_id = user.id, planet_id = planet.id).first() is not None
    
    if fav_exist:
        raise APIException('el usuario ya lo tiene agregado a favoritos', status_code=400)

    favorite_planet = FavoritePlanets(user_id=user.id, planet_id=planet.id)
    db.session.add(favorite_planet)
    db.session.commit()

    return jsonify({
        "planet_name":favorite_planet.serialize()["planet_name"],
        "user": favorite_planet.serialize()["user_name"]
    }), 201

@api.route('/favorite/planet', methods=['DELETE'])
def remove_favorite_planet():
    body = request.get_json()
    user_id = body["user_id"]
    planet_id = body["planet_id"]

    favorite_planet = FavoritePlanets.query.filter_by(user_id=user_id, planet_id=planet_id).first()

    if not favorite_planet:
        raise APIException('Favorite planet not found', status_code=404)

    db.session.delete(favorite_planet)
    db.session.commit()

    return jsonify({"msg":"Favorite planet removed successfully"}), 200

@api.route('/favorite/vehicle', methods=['POST'])
def add_favorite_vehicle():
    body = request.get_json()
    user_id = body["user_id"]
    vehicle_id = body["vehicle_id"]

    vehicle = Vehicles.query.get(vehicle_id)
    if not vehicle:
        raise APIException('vehicle not found', status_code=404)

    user = User.query.get(user_id)
    if not user:
        raise APIException('user not found', status_code=404)

    fav_exist = FavoriteVehicles.query.filter_by(user_id=user.id, vehicle_id=vehicle.id).first() is not None

    if fav_exist:
        raise APIException('user already has it added to favorites', status_code=400)

    favorite_vehicle = FavoriteVehicles(user_id=user.id, vehicle_id=vehicle.id)
    db.session.add(favorite_vehicle)
    db.session.commit()

    return jsonify({
        "vehicle_name": favorite_vehicle.serialize()["vehicle_name"],
        "user": favorite_vehicle.serialize()["user_name"]
    }), 201


@api.route('/favorite/vehicle', methods=['DELETE'])
def remove_favorite_vehicle():
    body = request.get_json()
    user_id = body["user_id"]
    vehicle_id = body["vehicle_id"]

    favorite_vehicle = FavoriteVehicles.query.filter_by(user_id=user_id, vehicle_id=vehicle_id).first()

    if not favorite_vehicle:
        raise APIException('Favorite vehicle not found', status_code=404)

    db.session.delete(favorite_vehicle)
    db.session.commit()

    return jsonify({"msg": "Favorite vehicle removed successfully"}), 200

@api.route('/favorites', methods=['POST'])
def get_favorites_with_post():
    body = request.get_json()
    user_id = body["user_id"]

    if user_id is None:
        raise APIException("You need to specify the user_id as a query parameter", status_code=400)

    user = User.query.get(user_id)
    if not user:
        raise APIException('User not found', status_code=404)

    favorite_people = list(map(lambda item: {"name": item.serialize()["people_name"], "id": item.serialize()["people_id"], "url": "/people"}, FavoritePeople.query.filter_by(user_id=user.id)))
    favorite_planets = list(map(lambda item: {"name": item.serialize()["planet_name"], "id": item.serialize()["planet_id"], "url": "/planets"}, FavoritePlanets.query.filter_by(user_id=user.id)))
    favorite_vehicles = list(map(lambda item: {"name": item.serialize()["vehicle_name"], "id": item.serialize()["vehicle_id"], "url": "/vehicles"}, FavoriteVehicles.query.filter_by(user_id=user.id)))

    return jsonify({
        "msg":"ok",
        "all_favorites": favorite_people + favorite_planets + favorite_vehicles,
    }), 200

@api.route('/favorites/<int:user_id>', methods=['GET'])
@jwt_required()
def get_favorites(user_id):
    current_user = get_jwt_identity() # Get the current user ID from the token
    if user_id != current_user: # Check if the requested user ID matches the current user ID
        raise APIException('Unauthorized', status_code=401)
    
    user = User.query.get(user_id)
    if not user:
        raise APIException('User not found', status_code=404)

    token = verificacionToken(get_jwt()["jti"])
    if token:
       raise APIException('Token está en lista negra', status_code=404)

    favorite_people = list(map(lambda item: {"name": item.serialize()["people_name"], "id": item.serialize()["people_id"], "url": "/people"}, FavoritePeople.query.filter_by(user_id=current_user)))
    favorite_planets = list(map(lambda item: {"name": item.serialize()["planet_name"], "id": item.serialize()["planet_id"], "url": "/planets"}, FavoritePlanets.query.filter_by(user_id=current_user)))
    favorite_vehicles = list(map(lambda item: {"name": item.serialize()["vehicle_name"], "id": item.serialize()["vehicle_id"], "url": "/vehicles"}, FavoriteVehicles.query.filter_by(user_id=current_user)))

    return jsonify({
        "msg":"ok",
        "all_favorites": favorite_people + favorite_planets + favorite_vehicles,
    }), 200