from flask import Flask
from flask import render_template, jsonify, request
from lib import getTags
from flask_cors import CORS

app = Flask(__name__, static_folder='./client/build', static_url_path='/')
cors = CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/getTag', methods=['POST'])
def api_all():
	question = []
	question.append(request.json['question'])
	print(question)
	tags = getTags(question)[0]
	return jsonify(tags)

if __name__ == "__main__":
	app.run(debug=True)