from flask import Flask, request

app = Flask(__name__)
VERIFY_TOKEN = "verifyinstachatbot"  # Ganti dengan token kamu nanti

@app.route("/webhook", methods=["GET", "POST"])
def webhook():
    if request.method == "GET":
        if request.args.get("hub.verify_token") == VERIFY_TOKEN:
            return request.args.get("hub.challenge")
        return "Token salah", 403
    elif request.method == "POST":
        data = request.json
        print("📩 Pesan masuk:", data)
        # Di sini kamu bisa lanjutkan ke Langflow pakai API call
        return "OK", 200

@app.route("/", methods=["GET"])
def home():
    return "Webhook aktif!", 200
