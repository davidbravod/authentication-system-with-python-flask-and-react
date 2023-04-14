from flask_sqlalchemy import SQLAlchemy
from .db import db
from .models import People, User, Planets, Vehicles


class FavoritePeople (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    people_id = db.Column(db.Integer, db.ForeignKey('people.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "people_id": self.people_id,
            "user_id": self.user_id,
            "people_name": People.query.get(self.people_id).serialize()["name"],
            "user_name": User.query.get(self.user_id).serialize()["name"],
            "user":User.query.get(self.user_id).serialize(),
            "people":People.query.get(self.people_id).serialize()
        }

class FavoritePlanets (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    planet_id = db.Column(db.Integer, db.ForeignKey('planets.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "planet_id": self.planet_id,
            "user_id": self.user_id,
            "planet_name": Planets.query.get(self.planet_id).serialize()["name"],
            "user_name": User.query.get(self.user_id).serialize()["name"],
            "user":User.query.get(self.user_id).serialize(),
            "planet":Planets.query.get(self.planet_id).serialize()
        }

class FavoriteVehicles (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "vehicle_id": self.vehicle_id,
            "user_id": self.user_id,
            "vehicle_name": Vehicles.query.get(self.vehicle_id).serialize()["name"],
            "user_name": User.query.get(self.user_id).serialize()["name"],
            "user":User.query.get(self.user_id).serialize(),
            "vehicle":Vehicles.query.get(self.vehicle_id).serialize()
        }