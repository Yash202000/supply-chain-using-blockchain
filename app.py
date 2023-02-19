import os
from flask import Flask, redirect, request, render_template, send_file, url_for
import cv2
import base64



from werkzeug.utils import secure_filename
# from operations import create_table, freshness_label, get_image_by_containerid_with_tablename, imdecode_image, price_to_text, read_blob_by_id, read_blobs_from_collectiondetails, recognize_fruit_by_cv_image, write_blob
from operations import read_blobs_from_collectiondetails ,get_image_by_containerid_with_tablename, write_blob


#  create_table,  get_image_by_containerid_with_tablename,read_blob_by_id,

import os
import sys
import numpy as np
from flask import Flask, render_template, request
from werkzeug.utils import secure_filename

from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from PIL import Image, ImageFile
import my_tf_mod
from io import BytesIO
import matplotlib.pyplot as plt
import base64



app = Flask(__name__)


# create_table()





@app.route("/")
def home():
    # return render_template('home.html')
    return render_template("index.html")



@app.route("/freshnessdetection")
def freshnessdetection():
    return render_template('home.html')



@app.route('/Prediction', methods=['GET','POST'])
def pred():
    if request.method=='POST':
        file = request.files['file']
        org_img, img= my_tf_mod.preprocess(file)

        print(img.shape)
        fruit_dict=my_tf_mod.classify_fruit(img)
        rotten=my_tf_mod.check_rotten(img)

        img_x=BytesIO()
        plt.imshow(org_img/255.0)
        plt.savefig(img_x,format='png')
        plt.close()
        img_x.seek(0)
        plot_url=base64.b64encode(img_x.getvalue()).decode('utf8')

        # {'apple': 100.0, 'banana': 0.0, 'orange': 0.0}
        # [98.3, 1.7]

    return render_template('Pred3.html', fruit_dict=fruit_dict, rotten=rotten, plot_url=plot_url)




@app.route("/purchase", methods=["POST"])
def purchase_page():
    return render_template("purchase.html")




# @app.route("/checkout", methods=["POST"])
# def checkout_page():
#     cv_image = imdecode_image(request.files["image"])
#     fruit_information = recognize_fruit_by_cv_image(cv_image)
#     # TODO: change freshness_level to freshness_percentage
#     freshness_percentage = fruit_information["freshness_level"]

#     # show submitted image
#     image_content = cv2.imencode('.jpg', cv_image)[1].tobytes()
#     encoded_image = base64.encodebytes(image_content)
#     base64_image = 'data:image/jpg;base64, ' + str(encoded_image, 'utf-8')
    
#     return render_template(
#         "checkout.html",
#         freshness_percentage=freshness_percentage,
#         freshness_label=freshness_label(freshness_percentage),
#         base64_image=base64_image,
#         price=price_to_text(fruit_information["price"])
#     )




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
        containerid = request.form.get("cid")
        farmerid = request.form.get("fid")
        farmername = request.form.get("fname")
        productname = request.form.get("pname")
        productquantity = request.form.get("pquantity")
        region = request.form.get("region")
        # cv_image = imdecode_image(request.files["pimage"])
        # print(type(cv_image))
        f = request.files['pimage']
        f.save(secure_filename("download.jpg"))
        
        # with open("download.jpg","rb") as f:
        #     byte_data = f.read()
        #     print(str(byte_data))
            


        cv_image = cv2.imread("download.jpg")
        

        fruit_information = recognize_fruit_by_cv_image(cv_image)
        
        freshness_percentage = fruit_information["freshness_level"]
        image_content = cv2.imencode('.jpg', cv_image)[1].tobytes()
        encoded_image = base64.encodebytes(image_content)
        base64_image = 'data:image/jpg;base64, ' + str(encoded_image, 'utf-8')
        
        with open("download.jpg","rb") as f:
            byte_data = f.read()
        
        # store data in database (if not exist container id..)
        result = write_blob(containerid, farmerid,farmername, productname, productquantity,region,byte_data,freshness_percentage)
        os.remove("download.jpg")
        if result:
            return redirect(url_for( 'collectiontable' ))
        else:
            return render_template("Collection.html")    
    return render_template("Collection.html")





@app.route("/collectiontable",methods=['GET'])
def collectiontable():
    if request.method=="GET":
        results = read_blobs_from_collectiondetails()
        print(results)
        
        return render_template("CollectionTable.html",results=results)


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


# http://localhost:5000/send_image?tablename=collectiondetails&containerid=1
@app.route('/send_image',methods =["GET"])
def send_image():
    args = request.args
    tablename = args.get('tablename')
    containerid = args.get('containerid')
    if None not in (tablename, containerid):
        blob = get_image_by_containerid_with_tablename(tablename,containerid)
        if blob:
            return send_file('tests/download.jpg', mimetype='image/jpg')
        else:
            return "None"


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
