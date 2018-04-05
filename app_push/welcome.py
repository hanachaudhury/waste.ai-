#TeamG - Waste
#imports the necessary modules for it to work 
#commenting and context also provided by looking at Flask documentation online 
import os
import json
import getpass
from flask import Flask, jsonify, request #imports the flask class 
from watson_developer_cloud import VisualRecognitionV3

'''Authentication'''
#This part of the code references the api key for Watson Visual Recognition 
visual_recognition = VisualRecognitionV3(
    '2016-05-20',
    api_key='7bb9d7d05b11e8ec3a2e8a01ef59acb02c174da9'
)

#Creates the Flask Application instance in the main module 
#Flask uses this to know where to look for the files 
app = Flask(__name__)

#uses route() to tell the flask application what URL should activate the function 
@app.route('/')
def Welcome():
    return app.send_static_file('index.html')

#route function tells Flask that /analyze needs to be in the url 
#methods are GET and POST to receive and transfer the data 
@app.route('/analyze', methods=['GET','POST'])
def Analyze():   
    images_file = request.form['text']                  #get the POST data from main.js
    path = 'C:/Users/' + getpass.getuser() + '/Desktop/Test/'+ images_file  #defines the path to get the test image 
    images_file = open(path, 'rb')                      #get the local image
    #creates variable analysis_results that will make the POST call to the Watson API to have the image analyse
    #the minimum threshold is 20% confidence 
    analysis_results = visual_recognition.classify(     #Post to waston api
		images_file,
		parameters=json.dumps({
			'classifier_ids': ['waste_sorter_classification_1971313190'],
			'threshold': 0.2
		}))

    return jsonify(analysis_results)       #return the result

#what local host it's running on 
port = os.getenv('PORT', '5000')
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=int(port), debug=True)
