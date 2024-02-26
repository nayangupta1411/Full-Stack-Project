

import bson
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from database import db


class Items:
    
    def __init__(self):
        return

    def create( cuisine, quantity, instructions, userid):    
        new_item= db.ItemsList.insert_one(
            {
                "cuisine": cuisine,
                "quantity": quantity,
                "instructions": instructions,
                "userid":userid
     
            }
        )
       
        return new_item
    

    def get_all():
        """Get all items"""
        items = db.ItemsList.find()
        return [{**item, "_id": str(item["_id"])} for item in items]
    
    def get_all_by_users(userid):
        """Get all items for each user"""
        items = db.ItemsList.find({'userid':userid})
        return [{**item, "_id": str(item["_id"])} for item in items]

    

    def update(item_id,cuisine,quantity,instructions):
        """Update a item"""
        data={}
        if cuisine: data["cuisine"]=cuisine
        if quantity: data["quantity"]=quantity
        if instructions: data["instructions"]= instructions
        
        print("newone data :",data)
        item = db.ItemsList.update_one(
            {"_id": bson.ObjectId(item_id)},
            {
                "$set": data
            }
        )
        # item["_id"] = str(item["_id"])
        print(item)
        return item
    
    def get_by_id(item_id):
        """Get a book by id"""
       
        item = db.ItemsList.find_one({"_id": bson.ObjectId(item_id)})
        if not item:
            return
        item["_id"] = str(item["_id"])
        print("item==",item)
        return item
    
    def delete(item_id):

        item = db.ItemsList.delete_one({"_id": bson.ObjectId(item_id)})
        return item
    
    def add_new_item(cuisine,active):
        """Create a new book"""
        # book = self.get_by_user_id_and_title(user_id, title)
        
        add_item= db.SelectItems.insert_one(
            {
                "cuisine": cuisine,
                "active":  active
            }
        )
        return add_item
    
    def get_all_item_list():
        itemsList = db.SelectItems.find({"active": "1" })
        
        return [{**item, "_id": str(item["_id"])} for item in itemsList]
    
    def get_all_item_list_Admin():
        itemsList = db.SelectItems.find()
        
        return [{**item, "_id": str(item["_id"])} for item in itemsList]
    
    def delete_item(item_id):
        itemsList=db.SelectItems.find({"_id": bson.ObjectId(item_id)})
        itemFind=[{**item, "_id": str(item["_id"])} for item in itemsList]
        print("items get : ",itemFind)
        print("items active : ",itemFind[0]["active"])
        item=''
        if itemFind[0]["active"]=="1":
            item = db.SelectItems.update_one({"_id": bson.ObjectId(item_id)},
                                         {
                                             "$set": {"active": "0" }
                                         })
        else:
            item = db.SelectItems.update_one({"_id": bson.ObjectId(item_id)},
                                         {
                                             "$set": {"active": "1" }
                                         })
        print("item:--",item)
        # itemSend=[{**items, "_id": str(items["_id"])} for items in item]
        return item


  

class User:
    """User Model"""
    def __init__(self):
        return

    def create(name, email, password, confirmPassword, roleBasedAccess):
        """Create a new user"""
        new_user = db.UserData.insert_one(
            {
                "name": name,
                "email": email,
                "password": generate_password_hash(password),
                "confirm_password":  generate_password_hash(confirmPassword), 
                "roleBasedAccess" :  roleBasedAccess          
            }
        )
        return new_user

    def get_all():
        """Get all users"""
        users = db.UserData.find()
        return [{**user, "_id": str(user["_id"])} for user in users]


    def get_by_email(email):
        """Get a user by email"""
        user = db.UserData.find_one({"email": email})
        if not user:
            return False
        # user["_id"] = str(user["_id"])
        return True

   
    def login(email, password):
        """Login a user"""
        print(email)
        user = db.UserData.find_one({"email": email}) 
        print(user) 
        
        if not user or not check_password_hash(user["password"], password):
            return {"status":"something wrong"}
        user["_id"] = str(user["_id"])
        # user.pop("password")
        return user
    










    # def get_by_id(self, user_id):
    #     """Get a user by id"""
    #     user = db.users.find_one({"_id": bson.ObjectId(user_id), "active": True})
    #     if not user:
    #         return
    #     user["_id"] = str(user["_id"])
    #     user.pop("password")
    #     return user


     # def update(self, user_id, name=""):
    #     """Update a user"""
    #     data = {}
    #     if name:
    #         data["name"] = name
    #     user = db.users.update_one(
    #         {"_id": bson.ObjectId(user_id)},
    #         {
    #             "$set": data
    #         }
    #     )
    #     user = self.get_by_id(user_id)
    #     return user

    # def delete(self, user_id):
    #     """Delete a user"""
    #     Books().delete_by_user_id(user_id)
    #     user = db.users.delete_one({"_id": bson.ObjectId(user_id)})
    #     user = self.get_by_id(user_id)
    #     return user

    # def disable_account(self, user_id):
    #     """Disable a user account"""
    #     user = db.users.update_one(
    #         {"_id": bson.ObjectId(user_id)},
    #         {"$set": {"active": False}}
    #     )
    #     user = self.get_by_id(user_id)
    #     return user

   
