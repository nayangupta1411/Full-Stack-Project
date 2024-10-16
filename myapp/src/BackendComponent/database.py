from pymongo import MongoClient

DATABASE_URL= 'mongodb://localhost:27017/FoodItems'
print(DATABASE_URL)
client = MongoClient("mongodb://localhost:27017/FoodItems")
db = client.FoodItems






