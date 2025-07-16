import sqlite3

from flask import Flask, render_template, redirect, url_for, request, session, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from helpers import checkValidity

app = Flask(__name__)
app.secret_key = 'secret_key'

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username

    def get_id(self):
        return str(self.id)

@login_manager.user_loader
def load_user(user_id):
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    conn.close()

    if row:
        return User(id=row["id"], username=row["username"])
    return None

@app.route("/")
@login_required
def index():
    return render_template("index.html")

@app.route("/timer")
@login_required
def timer():
    return "TIMER"

@app.route("/solver")
@login_required
def solver():
    return "SOLVER"

@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))

@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        endpoint = request.endpoint

        conn = sqlite3.connect("users.db")
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        row = cur.fetchone()
        conn.close()

        validity = checkValidity(username, password, None, endpoint, row)

        if validity:
            return render_template("login.html", validity=validity)
        
        if not check_password_hash(row["password_hash"], password):
            return render_template("login.html", validity="Incorrect password")
        
        login_user(User(id=row["id"], username=row["username"]), remember=True)
        
        return redirect(url_for("index"))
        
    else:
        return render_template("login.html", validity=None)

@app.route("/register", methods=["POST", "GET"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm-password")
        endpoint = request.endpoint

        conn = sqlite3.connect("users.db")
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        row = cur.fetchone()
        conn.close()

        validity = checkValidity(username, password, confirm_password, endpoint, row)

        if validity:
            return render_template("register.html", validity=validity)
        
        conn = sqlite3.connect("users.db")
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username,generate_password_hash(password)))
        conn.commit()
        conn.close()
        
        flash("Registered successfully! You can now log in.")
        return redirect(url_for("login"))
    else:
        return render_template("register.html")

if __name__ == "__main__":
    app.run(debug=True)