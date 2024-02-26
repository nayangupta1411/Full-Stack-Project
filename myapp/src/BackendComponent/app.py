#  // import files

import datetime
import time
from flask import Flask, jsonify, request, make_response, session
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_pymongo import PyMongo
import jwt 
from functools import wraps
from models import Items,User
from database import db

#  // flask app

app= Flask(__name__)
cors = CORS(app)

#  // Token's SECRET_KEY

app.config['SECRET_KEY']='mykey'
jwtt= JWTManager(app)


# // signin route

userResponse={}

# validation function

def Validate_Token():
    try:
        auth_header= request.headers.get('Authorization')
        print("this is response",auth_header)
        if auth_header is None:
            print("that is headers",request.headers)
            return jsonify({'message': 'Authorization header missing'}),401
        token= auth_header.split()[1]
        print(token)
        payload=jwt.decode(token,'mykey',algorithms=['HS256'])
        userid=payload.get('sub',0)
        print("userResponse ==",userResponse)
       
        if (userid!=userResponse['userid']):
            return jsonify({'message':'User not allowed'}),401
        expiration_time=payload.get('exp',0)
        current_time=int(time.time())
        print(expiration_time,current_time)
        if expiration_time<current_time:
            return jsonify({'message':'Token has expire'}),401
    except jwt.ExpiredSignatureError:
        return jsonify({'message':'Token has expire'}),401
  
    return None



#   // Signup for Users

@app.route("/usersignup", methods=['POST','GET'])
@cross_origin()
def usersignup():
    data=request.get_json()
    checkEmail=User.get_by_email(data['email'])
    if checkEmail:
        return jsonify({"status":"email is already exists"})
    addNewUser=User.create(data['name'],data['email'],data['password'],data['confirm_password'],data['roleBasedAccess'])
    return jsonify(data)

# // login for users


@app.route("/usersignin", methods=['POST','GET'])
@cross_origin()
def usersignin():
    data=request.get_json()
    print(data)
    email=data['email']
    loginUser=User.login(data['email'],data['password'])
    print("login user data",loginUser['roleBasedAccess'])
    response1={}
    if 'status' in loginUser:
        return {"status": "something wrong"}
    
    access_token= create_access_token(identity=email, 
                                      fresh=True, 
                                      expires_delta=datetime.timedelta(minutes=5))
    
    userResponse['access_token']= access_token
    userResponse['userid']= email
    userResponse['roleBasedAccess']= loginUser['roleBasedAccess']

    # print(userResponse)
    
    print("data___=",userResponse)
    print("res==",response1)
    return jsonify(userResponse)


# // validate token for user

@app.route("/userValidateTokenController", methods=['GET'])
@cross_origin()
def userValidateTokenController():
    try:
        # print("user data_++_+_+",userResponse)
        payload=jwt.decode(userResponse['access_token'],'mykey',algorithms=['HS256'])
        userid=payload.get('sub',0)
        if (userid!=userResponse['userid']):
            return jsonify({'message':'not allowed'}),401
        expiration_time=payload.get('exp',0)
        current_time=int(time.time())
        if expiration_time<current_time:
            # userResponse={}
            return jsonify({'message':'Token hass expire'}),401
          
    except jwt.ExpiredSignatureError:
        return jsonify({'message':'Token has expire'}),401
   
    return jsonify({ 'current_time':current_time, 
                    'expiry_time':expiration_time,
                    'token': userResponse['access_token'],
                    'userid': userid,
                    'roleBasedAccess': userResponse['roleBasedAccess'] })
    

# // get all user data

@app.route("/getUserData", methods=['POST','GET'])
@cross_origin()
def getUserData():
    userAlldata=User.get_all()
    return jsonify(userAlldata)

#  // add new Item in Items list

@app.route("/addNewItems", methods=['POST','GET'])
@cross_origin()
def addNewItems():
    auth_error=Validate_Token()
    if auth_error:
        return auth_error
    data=request.get_json()
    print(data)
    addItem=Items.add_new_item(data['cuisine'],data['active'])
    # print(Sdata)
    return jsonify(data)


# // getting all items from db 

@app.route("/selectAllItems", methods=['POST','GET'])
@cross_origin()
def selectAllItems():
    Sdata=Items.get_all_item_list()
    return jsonify(Sdata)


@app.route("/selectAllItemsAdmin", methods=['POST','GET'])
@cross_origin()
def selectAllItemsAdmin():
    Sdata=Items.get_all_item_list_Admin()
    return jsonify(Sdata)

#  // delete items from item list 

@app.route("/deleteNewItems", methods=['POST','GET'])
@cross_origin()
def deleteNewItems():
    auth_error=Validate_Token()
    if auth_error:
        return auth_error
    data=request.get_json()
    deleteItem=Items.delete_item(data)
    # print(Sdata)
    return jsonify(data)

# // add a Item

@app.route("/items", methods=['POST','GET'])
@cross_origin()
@jwt_required()
def items():
    time.sleep(0.05)
    auth_error=Validate_Token()
    if auth_error:
        return auth_error
    data=request.get_json()
    addItem=Items.create(data['cuisine'],data['quantity'],data['instructions'],data['userid'])
    # print('=>data:',addItem)
    return jsonify({"msg":data})


# // fetching all data

@app.route("/itemall", methods=['POST','GET'])
@cross_origin()
def itemall():
    fdata=Items.get_all()
    # print(fdata)
    return jsonify(fdata)

# // fetching all data for specific user

@app.route("/itemalluser", methods=['POST','GET'])
@cross_origin()
def itemalluser():
    d=db.ItemsList.find()
    fdata=Items.get_all_by_users(userResponse['userid'])
    # print(fdata)
    return jsonify(fdata)


#  // delete a item

@app.route("/itemdel", methods=['POST','GET'])
@cross_origin()
def itemdel():
    time.sleep(0.05)
    auth_error=Validate_Token()
    if auth_error:
        return auth_error
    d1=request.get_json()
    delItem=Items.delete(d1)
    return jsonify(d1)



# //  fetch the update item id

idd=[]
@app.route("/itemUpdate", methods=['POST'])
@cross_origin()
def itemUpdate():
    auth_error=Validate_Token()
    if auth_error:
        return auth_error
    data=request.get_json()
    if data:
        idd.append(data)
    return jsonify({"id":data})

# // update the item with new one data

@app.route("/itemUpdateOne", methods=['POST','GET'])
@cross_origin()
def itemUpdateOne():
    time.sleep(0.05)
    auth_error=Validate_Token()
    if auth_error:
        return auth_error
    data=request.get_json()
    print("data++=",data)
    print("idd==+==",idd[-1])
    upData=[Items.update(idd[-1],data['cuisine'],data['quantity'],data['instructions'])]
    return jsonify(data)

# // fetch the old data into the form 

@app.route("/itemSetUpdate",methods=['GET'])
@cross_origin()
def itemSetUpdate():
    time.sleep(0.05)
    auth_error=Validate_Token()
    if auth_error:
        return auth_error
    if len(idd)!=0:
        d=idd[-1]
        fdata1=[Items.get_by_id(d)]
        return jsonify(fdata1)
    return jsonify({'status':'ok'})
 
  

if __name__ == "__main__":
    app.run(debug=True)