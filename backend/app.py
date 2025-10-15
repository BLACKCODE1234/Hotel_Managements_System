from flask import Flask,request,jsonify
import bcrypt
import psycopg2
from datetime import datetime,timedelta
from dotenv import load_dotenv
import os
from psycopg2.extras import RealDictCursor
import jwt
from helper.generate_token import generate_refresh_token,decode_token,generate_access_token
import requests

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY","THE_SECRET_KEY")



def database_connection():
    try:
        return psycopg2.connect(
            host = os.getenv('DB_HOST','localhost'),
            user = os.getenv('DB_USER'),
            password = os.getenv('DB_PASSWORD'),
            database = os.getenv('DB_NAME')
        )
    except psycopg2.Error as e:
        print(f"Database connection failed: {e}")
        raise
    
    

def get_cookie_settings():
    is_local = ("localhost" in request.host) or ("127.0.0.1" in request.host)
    secure_cookie = False if is_local else True
    samesite_cookie = "Lax" if is_local else "None"  # Lax for local since same-origin now, None for production
    domain_cookie = None  # No domain for same-origin
    return secure_cookie, samesite_cookie, domain_cookie    
    
@app.route('/signup',methods=['POST'])
def signup():
    if not request.is_json:
        return jsonify({"message":"Request must be jsonify","status":"error","user":None}),400

    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
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
        
        access_token = generate_access_token(email,role='guest')
        refresh_token = generate_refresh_token(email,role='guest')
        secure_cookie,samesite_cookie,domain_cookie = get_cookie_settings()
        guest = {"firstname":firstname,"lastname":lastname,"email":email}
        response = jsonify({"message":"Signup succesfull",
                            "status":"succes",
                            "user":guest}) 
        
    
        response.set_cookie(
            'refresh_token',
            refresh_token,
            httponly=True,
            secure=secure_cookie,
            samesite=samesite_cookie,
            domain=domain_cookie,
            max_age=7*24*60*60
        )
        response.set_cookie(
            'access_token',
            access_token,
            httponly=True,
            secure=secure_cookie,
            samesite=samesite_cookie,
            domain=domain_cookie,
            max_age=15*60
        )
        
        return response,200
    except psycopg2.Error as e:
        return jsonify({"message":"Database error","error":str(e),"status":"error","user":None}),500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()
            
            
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not all ([username,password]):
        return jsonify({"message":"Both username and password required"}),400
    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor) 
        cursor.execute("select passwords,role,email,username,firstname,lastname from loginusers where username = %s",(username,))           
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"message":"User Account not found"}),404
        
        passwords = user['passwords'].encode('utf-8')
        
        if not bcrypt.checkpw(password.encode('utf-8'),passwords):
            return jsonify({"message":"Incorrect passwords"}),404
        
        role = user.get('role','guest')
        email = user['email']
        
        if role != 'guest':
            return jsonify({"message":"Login unsuccessfull,only for guest"}),403
        
        access_token = generate_access_token(email,role)
        refresh_token = generate_refresh_token(email,role)
        secure_cookie,samesite_cookie,domain_cookie = get_cookie_settings()
        
        response = jsonify({"message":"Login successful",
                            "status":"success",
                            "access_token":access_token,
                            "user":{
                                "username":user['username'],
                                "email":user["email"],
                                "role":role,
                                "firstname":user.get("firstname"),
                                "lastname":user.get("lastname")
                                }
                            })
        response.set_cookie('refresh_token',refresh_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=7*24*60*60,
                            path='/'    
                            )
        
        response.set_cookie('access_token',access_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=15*60,
                            path='/'
                            )
        
        return response,200
    except psycopg2.Error as e:
        return jsonify({"message":"Something Happened,Connection Error","error":str(e)}),500
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()


@app.route('/adminlogin', methods=['POST'])
def adminlogin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not all([email,password]):
        return jsonify({"message":"Email and Password required"}),400
    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select passwords,email,role,username,firstname,lastname from loginusers where email = %s",(email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"message":"Account not found"}),404
        
        passwords = user['passwords'].encode('utf-8')
        
        if not bcrypt.checkpw(password.encode('utf-8'),passwords):
            return jsonify({"message":"Incorrect Password"}),404
        
        role = user.get('role','admin')
        email = user['email']
        
        if role != 'admin':
            return jsonify({"message":"Login unsuccessfull,Unauthoised Account"}),403
        
        access_token = generate_access_token(email,role)
        refresh_token = generate_refresh_token(email,role)
        secure_cookie,samesite_cookie,domain_cookie = get_cookie_settings()        
        
        response =  jsonify({"message":"Login Successfull",
                             "status":"success",
                             "access_token":access_token,
                             "user":{
                                 "username":user.get("username"),
                                 "email":user["email"],
                                 "role":role,
                                 "firstname":user.get("firstname"),
                                 "lastname":user.get("lastname")
                                 }
                             })
        
        response.set_cookie('refresh_token',refresh_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=7*24*60*60,
                            path='/'
                            )
        
        response.set_cookie('access_token',access_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=15*60,
                            path='/'
                            )
        
        return response,200
    except psycopg2.Error as e:
        return jsonify({"message":"Something Happened,Connection Error","error":str(e)}),500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()
            
            
@app.route('/superadmin', methods=['POST'])
def superadmin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not all ([email,password]):
        return jsonify({"message":"Email and Password required"}),400
    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select passwords,username,role,email,firstname,lastname from loginusers where email = %s",(email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"message":"Account not Found"}),404
        
        passwords = user['passwords'].encode('utf-8') if isinstance(user['passwords'],str) else user['passwords']
        
        if not bcrypt.checkpw(password.encode('utf-8'),passwords):
            return jsonify({"message":"Incorrect Password"}),404
        
        role = user.get('role','superadmin')
        
        if role != 'superadmin':
            return jsonify({"message":"Unauthorised Access"}),403
        
        
        access_token = generate_access_token(email,role)
        refresh_token = generate_refresh_token(email,role)
        secure_cookie,samesite_cookie,domain_cookie = get_cookie_settings()
        
        response = jsonify({"message":"Login successful",
                            "status":"success",
                            "access_token":access_token,
                            "user":{
                                "username":user['username'],
                                "email":user["email"],
                                "role":role,
                                "firstname":user.get("firstname"),
                                "lastname":user.get("lastname")
                                }
                            })
        response.set_cookie('refresh_token',refresh_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=7*24*60*60,
                            path='/'    
                            )
        
        response.set_cookie('access_token',access_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=15*60,
                            path='/'
                            )
        
        
        return response,200             
    except psycopg2.Error as e:
        return jsonify({"message":"Something Happened,Connection Error","error":str(e)}),500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()
            
         
@app.route('/stafflogin', methods=['POST'])
def stafflogin():
    data = request.get_json()
    email = data.get('email') 
    password = data.get('password') 
    
    if not all ([email,password]) :
        return jsonify({"message":"Email and Password required"}),400
    
    try:
        db = database_connection()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select email,passwords,username,role,firstname,lastname from loginusers where email = %s",(email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"message":"Account not Found"}),404
        
        passwords = user['passwords'].encode('utf-8')
        
        if not bcrypt.checkpw(password.encode('utf-8'),passwords):
            return jsonify({"message":"Incorrect Password"}),404
        
        role = user.get('role','staff')
        email = user['email']
        
        if role != 'staff':
            return jsonify({"message":"Unauthorised"}),403
        
        access_token = generate_access_token(email,role)
        refresh_token = generate_refresh_token(email,role)
        secure_cookie,samesite_cookie,domain_cookie = get_cookie_settings()        
            
        response =  jsonify({"message":"Login Successfull",
                                "status":"success",
                                "access_token":access_token,
                                "user":{
                                    "username":user.get("username"),
                                    "email":user["email"],
                                    "role":role,
                                    "firstname":user.get("firstname"),
                                    "lastname":user.get("lastname")
                                    }
                                })
        
        response.set_cookie('refresh_token',refresh_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=7*24*60*60,
                            path='/'
                            )
        
        response.set_cookie('access_token',access_token,
                            httponly=True,
                            secure=secure_cookie,
                            samesite=samesite_cookie,
                            domain=domain_cookie,
                            max_age=15*60,
                            path='/'
                            )
        
        return response,200    
    except psycopg2.Error as e:
        return jsonify({"message":"Something Happened,Connection Error","error":str(e)}),500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()
            
            
if __name__ == '__main__':
    app.run(debug=True)
