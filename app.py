import cv2
import numpy as np
from flask import render_template,request,Flask
import requests,json,xmltodict

import torch.nn as nn
import torch
import numpy as np
from torchvision import transforms
import base64
from net import Net

ML_MODEL = None
ML_MODEL_FILE = "model.pt"
TORCH_DEVICE = "cpu"

def get_model():
    """Loading the ML model once and returning the ML model"""
    global ML_MODEL
    if not ML_MODEL:
        ML_MODEL = Net()
        ML_MODEL.load_state_dict(
            torch.load(ML_MODEL_FILE, map_location=torch.device(TORCH_DEVICE))
        )

    return ML_MODEL

def freshness_label(freshness_percentage):
    if freshness_percentage > 90:
        return "Segar"
    elif freshness_percentage > 65:
        return "Baik"
    elif freshness_percentage > 50:
        return "Cukup Baik"
    elif freshness_percentage > 0:
        return "Tidak Baik"
    else:
        return "Busuk"

def price_to_text(price):
    if price == 0:
        return "Gratis"

    return str(price)

def price_by_freshness_percentage(freshness_percentage):
    return int(freshness_percentage/100*10000)

def freshness_percentage_by_cv_image(cv_image):
    """
    Reference: https://github.com/anshuls235/freshness-detector/blob/4cd289fb05a14d3c710813fca4d8d03987d656e5/main.py#L40
    """
    mean = (0.7369, 0.6360, 0.5318)
    std = (0.3281, 0.3417, 0.3704)
    transformation = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean, std)
    ])
    image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (32, 32))
    image_tensor = transformation(image)
    batch = image_tensor.unsqueeze(0)
    out = get_model()(batch)
    s = nn.Softmax(dim=1)
    result = s(out)
    return int(result[0][0].item()*100)

def imdecode_image(image_file):
    return cv2.imdecode(
        np.frombuffer(image_file.read(), np.uint8),
        cv2.IMREAD_UNCHANGED
    )

def recognize_fruit_by_cv_image(cv_image):
    freshness_percentage = freshness_percentage_by_cv_image(cv_image)
    return {
        # TODO: change freshness_level to freshness_percentage
        "freshness_level": freshness_percentage,
        "price": price_by_freshness_percentage(freshness_percentage)
    }


app = Flask(__name__)


@app.route('/')
def home():
    return render_template("index.html")



    

@app.route('/login', methods =["GET", "POST"])
def login():
    if request.method == "POST":
        emailid = request.form.get("emailid")
        password = request.form.get("password")
        print(emailid,password)
        if emailid=="admin@gmail.com" and password=="admin":
            return render_template('admin.html')
       
    return render_template('login.html')


@app.route('/collection', methods =["GET", "POST"])
def collection():
    if request.method=="POST":
        print(request.form.get("cid"))
        print(request.form.get("fid"))
        print(request.form.get("fname"))
        print(request.form.get("pname"))
        print(request.form.get("pquantity"))
        print(request.form.get("region"))
        cv_image = imdecode_image(request.files["pimage"])
        print(cv_image)
        return " request handled."
    return render_template("Collection.html")


@app.route('/collection_handler',methods =["GET", "POST"])
def collection_handler():
    if request.method == "POST":
        emailid=request.form.get("emailidhandler")
        print(emailid)
        return render_template("admin.html")

    return render_template("handlercollection.html")


@app.route('/wholesaler_handler',methods =["GET", "POST"])
def wholesaler_handler():
    if request.method == "POST":
        emailid=request.form.get("emailidhandler")
        print(emailid)
        return render_template("admin.html")

    return render_template("handlerreception.html")

@app.route('/wholesaler')
def wholesaler():
    return render_template("wholesaler.html")


"""
https://youtube.com/watch?v=08S5Br_iED8&si=EnSIkaIECMiOmarE
watch this..

"""
@app.route('/treatment')
def treatment():
    return render_template("Treatment.html")




@app.route('/packaging')
def packaging():
    return render_template("Packaging.html")


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)