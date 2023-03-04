from datetime import datetime
from flask import Flask, redirect, request, render_template, send_file, url_for
import base64



from operations import create_table, read_blobs ,get_image_by_containerid_with_tablename, write_blob


import my_tf_mod
from io import BytesIO
import matplotlib.pyplot as plt
import base64



app = Flask(__name__)



create_table()





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

        bufdata = file.read()
        imgbytedata = BytesIO(bufdata)
        org_img, img= my_tf_mod.preprocess(file,imgbytedata)

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
        file = request.files['pimage']
        
        
        bufdata = file.read()
        imgbytedata = BytesIO(bufdata)
        
        org_img, img= my_tf_mod.preprocess(file,imgbytedata)
        print(img.shape)
        fruit_dict=my_tf_mod.classify_fruit(img)
        rotten=my_tf_mod.check_rotten(img)

        # {'apple': 100.0, 'banana': 0.0, 'orange': 0.0}
        # [98.3, 1.7]
        result = write_blob(
            data={
            "containerID": containerid,
            "farmerid":farmerid,
            "farmername": farmername,
            "productname": productname,
            "quantity": productquantity,
            "region": region,
            "productImg": bufdata,
            "fresh":  rotten[0],
            "rotten": rotten[1],
            "apple": fruit_dict['apple'],
            "banana": fruit_dict['banana'],
            "orange": fruit_dict['orange']
            }
            ,tablename = "collectiondetails")
        if result:
            return redirect(url_for( 'collectiontable' ))
        else:
            return render_template("Collection.html")
        
        
        #return render_template('Pred3.html', fruit_dict=fruit_dict, rotten=rotten, plot_url=plot_url)

   
    return render_template("Collection.html")





@app.route("/collectiontable",methods=['GET'])
def collectiontable():
    if request.method=="GET":
        results = read_blobs(tablename='collectiondetails')
        print(results)
        
        return render_template("CollectionTable.html",results=results)


@app.route('/collection_handler',methods =["GET", "POST"])
def collection_handler():
    if request.method == "POST":
        emailid=request.form.get("cemail")
        cname = request.form.get("cname")
        region = request.form.get("region")
        
        result = write_blob(data={
            "name": cname,
            "email": emailid,
            "region": region
        },tablename = "collectionhandlers")
        
        if result:
            return redirect(url_for( 'collectiontable' ))
        else:
            return render_template("admin.html")
        

    return render_template("handlercollection.html")






@app.route('/wholesale_handler',methods =["GET", "POST"])
def wholesaler_handler():
    if request.method == "POST":
        emailid=request.form.get("cemail")
        cname = request.form.get("cname")
        region = request.form.get("region")
        
        result = write_blob(data={
            "name": cname,
            "email": emailid,
            "region": region
        },tablename = "wholesalehandlers")
        
        if result:
            return redirect(url_for( 'collectiontable' ))
        else:
            return render_template("admin.html")
        

    return render_template("handlerwholesaler.html")




@app.route('/wholesaler',methods =["GET", "POST"])
def wholesaler():
    if request.method=="POST":
        containerId = request.form.get("cid")
        wholesalerId = request.form.get("wid")
        wholesalerName = request.form.get("wname")
        productQuantity = request.form.get("wquantity")
        collectionDate = request.form.get("collectiondate")
        shippingDate = request.form.get("shippingdate")
        file = request.files['pimage']

        bufdata = file.read()
        imgbytedata = BytesIO(bufdata)
        
        org_img, img= my_tf_mod.preprocess(file,imgbytedata)
        print(img.shape)
        fruit_dict=my_tf_mod.classify_fruit(img)
        rotten=my_tf_mod.check_rotten(img)

        # {'apple': 100.0, 'banana': 0.0, 'orange': 0.0}
        # [98.3, 1.7]
        result = write_blob(
            data={
            "containerID": containerId,
            "wholesalerId":wholesalerId,
            "wholesalerName": wholesalerName,
            "productQuantity": productQuantity,
            "collectionDate": collectionDate,
            "shippingDate": shippingDate,
            "productImg": bufdata,
            "fresh":  rotten[0],
            "rotten": rotten[1],
            "apple": fruit_dict['apple'],
            "banana": fruit_dict['banana'],
            "orange": fruit_dict['orange']
            },
            tablename="wholesalerdetails")
        if result:
            return redirect(url_for( 'wholesaletable' ))
        else:
            return render_template("Collection.html")
        
        
        

        # difference =datetime.strptime(shippingDate, '%Y-%m-%d') - datetime.strptime(collectionDate, '%Y-%m-%d') 
        # print(difference.days)
        
       
        
    return render_template("wholesaler.html")

@app.route("/wholesaletable",methods=['GET'])
def wholesaletable():
    if request.method=="GET":
        results = read_blobs(tablename='wholesalerdetails')
        
        return render_template("WholesaleTable.html",results=results)
    

"""
https://youtube.com/watch?v=08S5Br_iED8&si=EnSIkaIECMiOmarE
watch this..

"""


@app.route('/retailer',methods=['GET','POST'])
def retailer():
    if request.method=="POST":
        containerId = request.form.get("cid")
        wholesalerId = request.form.get("wid")
        wholesalerName = request.form.get("wname")
        productQuantity = request.form.get("wquantity")
        collectionDate = request.form.get("collectiondate")
        shippingDate = request.form.get("shippingdate")
        file = request.files['pimage']

        bufdata = file.read()
        imgbytedata = BytesIO(bufdata)
        
        org_img, img= my_tf_mod.preprocess(file,imgbytedata)
        print(img.shape)
        fruit_dict=my_tf_mod.classify_fruit(img)
        rotten=my_tf_mod.check_rotten(img)

        result = write_blob(
            data={
            "containerID": containerId,
            "retailerId":wholesalerId,
            "wholesalerName": wholesalerName,
            "productQuantity": productQuantity,
            "collectionDate": collectionDate,
            "shippingDate": shippingDate,
            "productImg": bufdata,
            "fresh":  rotten[0],
            "rotten": rotten[1],
            "apple": fruit_dict['apple'],
            "banana": fruit_dict['banana'],
            "orange": fruit_dict['orange']
            },
            tablename="retailerdetails")
        if result:
            return redirect(url_for( 'retailtable' ))
        else:
            return render_template("Retailer.html")
        

    return render_template("Retailer.html")




@app.route('/retail_handler',methods =["GET", "POST"])
def retail_handler():
    if request.method == "POST":
        emailid=request.form.get("cemail")
        cname = request.form.get("cname")
        region = request.form.get("region")
        
        result = write_blob(data={
            "name": cname,
            "email": emailid,
            "region": region
        },tablename = "retailhandlers")
        
        if result:
            return redirect(url_for( 'retailtable' ))
        else:
            return render_template("admin.html")
        

    return render_template("handlerretailer.html")


@app.route("/retailtable",methods=['GET'])
def retailtable():
    if request.method=="GET":
        results = read_blobs(tablename='retailerdetails')
        print(results)
        
        return render_template("CollectionTable.html",results=results)


@app.route('/customer')
def packaging():
    return render_template("Customers.html")


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
