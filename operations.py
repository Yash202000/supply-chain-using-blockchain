# from torchvision import transforms
# import torch
# import torch.nn as nn
# import torch

import psycopg2

from connection import create_connection
# from net import Net

import os
from flask import Flask, request, render_template

import numpy as np

import cv2
import base64
# from net import Net


"""_summary_

Returns:
    _type_: _description_
"""

""""""



ML_MODEL = None
ML_MODEL_FILE = "model.pt"
TORCH_DEVICE = "cpu"


def create_table():
    try:
        # Get the cursor object from the connection object
        conn, curr = create_connection()
        try:
            # Fire the CREATE query
            curr.execute("CREATE TABLE IF NOT EXISTS \
            collectiondetails(containerID INTEGER, farmerid INTEGER, farmername TEXT,productname TEXT, quantity INTEGER, region TEXT, productImg BYTEA, fresh float4,rotten float4,apple float4,banana float4,orange float4);")

            c#urr.execute("CREATE TABLE IF NOT EXISTS \
            #collectionhandlers(handlerID SERIAL PRIMARY KEY , name TEXT, farmername TEXT,productname TEXT, quantity INTEGER, region TEXT);")


        except(Exception, psycopg2.Error) as error:
            # Print exception
            print("Error while creating cartoon table", error)
        finally:
            # Close the connection object
            conn.commit()
            conn.close()
    finally:
        # Since we do not have to do anything here we will pass
        pass




def write_blob(containerid, farmerid,farmername, productname, productquantity,region,byte_data,fresh ,rotten ,apple ,banana,orange):

    # Get the cursor object from the connection object

    # Read data from a image file
    conn, curr = create_connection()
    try:

        curr.execute(f"select containerid from collectiondetails where containerid={containerid};")
        res = curr.fetchone()
        if res:
            return False

        
        curr.execute(f"INSERT INTO collectiondetails\
        (containerID,farmerid,farmername,productname,quantity , region , productImg,fresh ,rotten ,apple ,banana,orange )" +f" VALUES( {containerid}, {farmerid},' {farmername}', '{productname}', {productquantity},'{region}', {psycopg2.Binary(byte_data)}, {fresh},{rotten},{apple},{banana},{orange} );")
        
        # Close the connection object
        conn.commit()
        conn.close()
        return True

    except(Exception, psycopg2.Error) as error:
        # Print exception
        print("Error while creating cartoon table", error)
        
    


def read_blob_by_id(id,tablename):
    try:
        # Get the cursor object from the connection object

        # Read data from a image file
        conn, curr = create_connection()
        curr.execute(f"select * from {tablename} where containerID={id};")
        blob = curr.fetchone()
        # print(blob[0],blob[1],blob[2],blob[3],blob[4])

        return blob
        

    except(Exception, psycopg2.Error) as error:
        # Print exception
        print(error)
        


def read_blobs_from_collectiondetails():
    try:
        # Get the cursor object from the connection object

        # Read data from a image file
        conn, curr = create_connection()
        curr.execute(f"select  containerid, farmerid , farmername , productname , quantity , region, fresh  from collectiondetails;")
        results = curr.fetchall()
        
        return results
    except(Exception, psycopg2.Error) as error:
        # Print exception
        print(error)
        



# def get_model():
#     """Loading the ML model once and returning the ML model"""
#     global ML_MODEL
#     if not ML_MODEL:
#         ML_MODEL = Net()
#         ML_MODEL.load_state_dict(
#             torch.load(ML_MODEL_FILE, map_location=torch.device(TORCH_DEVICE))
#         )

#     return ML_MODEL

# def freshness_label(freshness_percentage):
#     if freshness_percentage > 90:
#         return "Segar"
#     elif freshness_percentage > 65:
#         return "Baik"
#     elif freshness_percentage > 50:
#         return "Cukup Baik"
#     elif freshness_percentage > 0:
#         return "Tidak Baik"
#     else:
#         return "Busuk"

# def price_to_text(price):
#     if price == 0:
#         return "Gratis"

#     return str(price)

# def price_by_freshness_percentage(freshness_percentage):
#     return int(freshness_percentage/100*10000)

# def freshness_percentage_by_cv_image(cv_image):
#     """
#     Reference: https://github.com/anshuls235/freshness-detector/blob/4cd289fb05a14d3c710813fca4d8d03987d656e5/main.py#L40
#     """
#     mean = (0.7369, 0.6360, 0.5318)
#     std = (0.3281, 0.3417, 0.3704)
#     transformation = transforms.Compose([
#         transforms.ToTensor(),
#         transforms.Normalize(mean, std)
#     ])
#     image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
#     image = cv2.resize(image, (32, 32))
#     image_tensor = transformation(image)
#     batch = image_tensor.unsqueeze(0)
#     out = get_model()(batch)
#     s = nn.Softmax(dim=1)
#     result = s(out)
#     return result[0][0].item()*100

# def imdecode_image(image_file):
#     return cv2.imdecode(
#         np.frombuffer(image_file.read(), np.uint8),
#         cv2.IMREAD_UNCHANGED
#     )

# def recognize_fruit_by_cv_image(cv_image):
#     freshness_percentage = freshness_percentage_by_cv_image(cv_image)
#     return {
#         # TODO: change freshness_level to freshness_percentage
#         "freshness_level": freshness_percentage,
#         "price": price_by_freshness_percentage(freshness_percentage)
#     }




def get_image_by_containerid_with_tablename(tablename,containerid):
    conn, curr = create_connection()
    print(tablename,containerid)
    curr.execute(f"select productimg from {tablename} where containerid={containerid};")
    blob = curr.fetchone()
    if blob:
        open("tests/download.jpg",'wb').write(blob[0])
        return True
    return False