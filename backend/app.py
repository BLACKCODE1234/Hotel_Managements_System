from flask import Flask,request,jsonify
import bcrypt
import psycopg2
from datetime import datetime,timedelta
import dotenv
import os

app = Flask(__name__)


def database_connection():
    try:
        return psycopg2.connect(
            host = os.getenv('DB_HOST','localhost'),
            user = os.getenv('DB_USER'),
            password = os.getenv('DB_PASSWORD'),
            database_name = os.getenv('NAME')
        )
    except psycopg2.Error as e:
        print(f"Database connection failed: {e}")
        raise
    
    
app.route('/signup',methods=['POST'])
def signup():
    if not request.is_json:
        return jsonify({"message":"Request must be jsonify","status":"error","user":None}),400

    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    username = data.get('username')
    email = data.get('email')
    password = data.get('email')
    confirmpassword = data.get('confirmpassword')
    
    if not all ([firstname,lastname,email,username,password,confirmpassword]):
        return jsonify({"message":"All fields are required"}),400
    if password != confirmpassword:
        return jsonify({"message":"Passwords do not match"}),400
    
    try:
        hashpassword = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt()).decode('utf-8')
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("select email from loginusers where email = %s",(email,))
        if cursor.fetchone():
            return jsonify({"message":"Email already exists","status":"error","user":None}),409
        
        cursor.execute("select username from loginusers where username = %s",(username,))
        if cursor.fetchone():
            return jsonify({"message":"Username already exists","status":"error","user":None}),409
        
        cursor.execute("insert into loginusers(firstname,lastname,email,username,passwords) values (%s,%s,%s,%s,%s)",
        (firstname,lastname,email,username,hashpassword)
        )
        db.commit()
        
        user = {"firstname":firstname,"lastname":lastname,"email":email}
        response = jsonify({"message":"Signup succesfull","status":"succes","user":user}),200 
        
    except psycopg2.Error as e:
        return jsonify({"message":"Database error","error":str(e),"status":"error","user":None}),500
    finally:
        if 'cursor' in locals:
            cursor.close()
        if 'db' in locals:
            db.close()
            
            
app.route('/login', methods='POST')
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not all ([username,password]):
        return jsonify({"message":"Both username and password required"}),400
    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor) 
        cursor.execute("select passwords,role,email,username from loginusers where username = %s",(username,))           
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"message":"User not found"}),404
        
        passwords = user['password'].encode('utf-8')
        
        if not bcrypt.checkpw(password.encode('utf-8'),passwords):
            return jsonify({"message":"Incorrect passwords"}),404
        
        role = user.get('role','user')
             
    except psycopg2.Error as e:
        return jsonify({"message":"Something Happened,Connection Error","error":str(e)}),500
    finally:
        if 'cursor' in locals:
            cursor.close()
        if 'db' in locals:
            db.close()


app.route('/adminlogin', methods=['POST'])
def adminlogin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not all[email,password]:
        return jsonify({"message":"Email and Password required"}),400
    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select passwords,email,role,username from loginusers where email = %s",(email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"message":"Account not found"}),404
        
        passwords = user['passwords'].encode('utf-8')
        
        if not bcrypt.checkpw(password.encode('utf-8'),passwords):
            return jsonify({"message":"Incorrect Password"}),404
        
        role = user.get('role','admin')
        
        
    except psycopg2.Error as e:
        return jsonify({"message":"Something Happened,Connection Error","error":str(e)}),500
    finally:
        if 'cursor' in locals:
            cursor.close()
        if 'db' in locals:
            db.close()
            
            
app.route('/Superadmin', methods=['POST'])
def superadmin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not all [email,password]:
        return jsonify({"message":"Email and Password required"}),400
    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select passwords,username,role,email from loginusers where email = %s",(email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"message":"Account not Found"}),404
        
        passwords = user['passwords'].encode('utf-8') if isinstance(user['passwords'],str) else user['passwords']
        
        if not bcrypt.checkpw(password.encode('utf-8'),passwords):
            return jsonify({"message":"Incorrect Password"}),404
        
        role = user.get('role','superadmin')
        
             
    except psycopg2.Error as e:
        return jsonify({"message":"Something Happened,Connection Error","error":str(e)}),500
    finally:
        if 'cursor' in locals:
            cursor.close()
        if 'db' in locals:
            db.close()