import eventlet 
eventlet.monkey_patch()

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask import request

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
users = []

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/chat')
def chat():
    return render_template('index.html')  

@socketio.on('message')
def handle_message(data):
    print(f'Received message by {data["username"]} : {data["msg"]}')
    emit("message", data, broadcast=True)

@socketio.on('enter')
def handle_user(username):
    print(f'{username} joined.')
    if username not in users:
        users.append(username)
    emit("enter", {"username": username, "users": users}, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')
    # You could implement user tracking by SID and cleanup here.

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000)
