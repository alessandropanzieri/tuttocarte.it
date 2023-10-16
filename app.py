from random import sample
from flask import (
    Flask,
    redirect,
    send_file,
    render_template
)
from flask_socketio import (
    SocketIO
)

app = Flask(__name__)
socketio = SocketIO(app)
app.template_folder = "templates/min"

italian = ["1B", "1C", "1D", "1S", "2B", "2C", "2D", "2S", "3B", "3C", "3D", "3S", "4B", "4C", "4D", "4S", "5B", "5C", "5D", "5S", "6B", "6C", "6D", "6S", "7B", "7C", "7D", "7S", "8B", "8C", "8D", "8S", "9B", "9C", "9D", "9S", "10B", "10C", "10D", "10S"]
french = ["1C", "1F", "1P", "1Q", "2C", "2F", "2P", "2Q", "3C", "3F", "3P", "3Q", "4C", "4F", "4P", "4Q", "5C", "5F", "5P", "5Q", "6C", "6F", "6P", "6Q", "7C", "7F", "7P", "7Q", "8C", "8F", "8P", "8Q", "9C", "9F", "9P", "9Q", "10C", "10F", "10P", "10Q", "JC", "JF", "JP", "JQ", "QC", "QF", "QP", "QQ", "KC", "KF", "KP", "KQ", "BJ", "RJ"]

@app.get("/")
def index():
    return render_template("index.min.html", italian = sample(italian, len(italian)), french = sample(french, len(french)))

@app.route("/robots.txt")
def robots():
    return send_file("robots.txt")

@app.route("/sitemap.xml")
def sitemap():
    return send_file("sitemap.xml")

@app.route("/manifest.json")
def manifest():
    return send_file("manifest.json")

@app.route("/service-worker.js")
def service_worker():
    return send_file("service-worker.js")

@app.errorhandler(404)
@app.errorhandler(405)
def error(_):
    return redirect("/")

if __name__ == "__main__": socketio.run(app, debug = True, allow_unsafe_werkzeug = True)

# @socketio.on("join")
# def join(data):
#     room = data["room"]

#     join_room(room)

#     emit("drop", {"cards": rooms[room]["drop"]}, room = data["user"])
    
# @socketio.on("public_notes")
# def public_notes(data):
#     emit("public_notes", {"text": data["text"]}, room = data["room"])

# @socketio.on("deck_to_hand")
# def deck_to_hand(data):
#     room = data["room"]
#     deck = rooms[room]["deck"]

#     card = choice(deck)

#     deck.remove(card)
#     rooms[room]["deck"] = deck
#     if len(deck) == 0:
#         emit("void", room = room)

#     emit("pick", {"card": card}, room = data["user"])

# @socketio.on("deck_to_drop")
# def deck_to_drop(data):
#     room = data["room"]
#     deck = rooms[room]["deck"]
#     drop = rooms[room]["drop"]

#     card = choice(deck)

#     deck.remove(card)
#     rooms[room]["deck"] = deck
#     if len(deck) == 0:
#         emit("void", room = room)

#     drop.append(card)
#     rooms[room]["drop"] = drop

#     emit("drop", {"cards": rooms[room]["drop"]}, room = room)

# @socketio.on("hand_to_drop")
# def hand_to_drop(data):
#     room = data["room"]
#     drop = rooms[room]["drop"]

#     drop.append(data["card"])
#     rooms[room]["drop"] = drop

#     emit("drop", {"cards": rooms[room]["drop"]}, room = room)

# @socketio.on("drop_to_hand")
# def drop_to_hand(data):
#     room = data["room"]
#     card = data["card"]
#     drop = rooms[room]["drop"] 

#     drop.remove(card)
#     rooms[room]["drop"] = drop

#     emit("pick", {"card": card}, room = data["user"])
#     emit("drop", {"cards": rooms[room]["drop"]}, room = room)