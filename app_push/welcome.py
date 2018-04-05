import os
import json
import getpass
from flask import Flask, jsonify, request
from watson_developer_cloud import VisualRecognitionV3

#Authentication
visual_recognition = VisualRecognitionV3(
    '2016-05-20',
    api_key='7bb9d7d05b11e8ec3a2e8a01ef59acb02c174da9'
)

#Flask
app = Flask(__name__)

@app.route('/')
def Welcome():
    return app.send_static_file('index.html')

@app.route('/analyze', methods=['GET','POST'])
def Analyze():   
    images_file = request.form['text']                  #get the POST data from main.js
    path = 'C:/Users/' + getpass.getuser() + '/Desktop/Test/'+ images_file  
    images_file = open(path, 'rb')                      #get the local image
    analysis_results = visual_recognition.classify(     #Post to waston api
		images_file,
		parameters=json.dumps({
			'classifier_ids': ['waste_sorter_classification_1971313190'],
			'threshold': 0.2
		}))

    return jsonify(analysis_results)       #return the result


port = os.getenv('PORT', '3800')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=int(port), debug=True)