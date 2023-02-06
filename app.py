from flask import render_template,request,Flask
import requests,json,xmltodict


app = Flask(__name__)


@app.route('/')
def home():
    return render_template("index.html")


    

@app.route('/login', methods =["GET", "POST"])
def login():
    if request.method == "POST":
        emailid = request.form.get("emailid")
        password = request.form.get("password")
        if emailid=="admin@gmail.com" and password=="admin":
            return render_template('admin.html')
        else:
            """
            add check in database part...
            """
            return render_template("admin.html")
       
    return render_template('login.html')


@app.route('/collection')
def collection():
    return render_template("Collection.html")


@app.route('/reception')
def reception():
    return render_template("Reception.html")


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