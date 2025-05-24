from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

CONFIRMADOS_PATH = "/data/confirmados.json"
COMENTARIOS_PATH = "/data/comentarios.json"

# Inicialização
os.makedirs("data", exist_ok=True)
if not os.path.exists(CONFIRMADOS_PATH):
    with open(CONFIRMADOS_PATH, "w") as f:
        json.dump({"quantidade": 0}, f)

if not os.path.exists(COMENTARIOS_PATH):
    with open(COMENTARIOS_PATH, "w") as f:
        json.dump([], f)


@app.route("/api/confirmados", methods=["GET"])
def get_confirmados():
    with open(CONFIRMADOS_PATH) as f:
        data = json.load(f)
    return jsonify(data)


@app.route("/api/confirmar", methods=["POST"])
def post_confirmar():
    data = request.json
    quantidade = data.get("quantidade", 0)
    with open(CONFIRMADOS_PATH, "w") as f:
        json.dump({"quantidade": quantidade}, f)
    return jsonify({"status": "ok"})


@app.route("/api/comentarios", methods=["GET"])
def get_comentarios():
    with open(COMENTARIOS_PATH) as f:
        comentarios = json.load(f)
    return jsonify(comentarios)


@app.route("/api/comentarios", methods=["POST"])
def post_comentario():
    comentario = request.json
    with open(COMENTARIOS_PATH) as f:
        comentarios = json.load(f)

    comentarios.append(comentario)

    with open(COMENTARIOS_PATH, "w") as f:
        json.dump(comentarios, f)

    return jsonify({"status": "ok"})

@app.route("/")
def home():
    return render_template("batalha-de-rap-heliopolis.html")

if __name__ == "__main__":
    app.run(debug=True)
