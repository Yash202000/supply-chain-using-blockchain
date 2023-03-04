import psycopg2
from connection import create_connection
import numpy as np


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

            curr.execute("CREATE TABLE IF NOT EXISTS \
                        wholesalerdetails(containerID INTEGER, wholesalerId INTEGER, name TEXT, quantity INTEGER, collectionDate TEXT, shippingDate TEXT, productImg BYTEA, fresh float4,rotten float4,apple float4,banana float4,orange float4)")
            
            
            curr.execute("CREATE TABLE IF NOT EXISTS \
                        collectionhandlers(ID SERIAL PRIMARY KEY , name TEXT, email TEXT UNIQUE ,region TEXT);")


            #wholesalehandlers
            curr.execute("CREATE TABLE IF NOT EXISTS \
                        wholesalehandlers(ID SERIAL PRIMARY KEY , name TEXT, email TEXT UNIQUE ,region TEXT);")
            
            curr.execute("CREATE TABLE IF NOT EXISTS \
                        retailhandlers(ID SERIAL PRIMARY KEY , name TEXT, email TEXT UNIQUE ,region TEXT);")

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




def write_blob(data=None,tablename = None):

    # Get the cursor object from the connection object

    # Read data from a image file
    if tablename==None or data==None:
        return False
    
    conn, curr = create_connection()

    if tablename=="collectiondetails":
        try:

            curr.execute(f"select containerid from {tablename} where containerid={data['containerID']};")
            res = curr.fetchone()
            if res:
                return False

            
            curr.execute(f"INSERT INTO collectiondetails\
            (containerID,farmerid,farmername,productname,quantity , region , productImg,fresh ,rotten ,apple ,banana,orange )" +f" VALUES( {data['containerID']}, {data['farmerid']},' {data['farmername']}', '{data['productname']}', {data['quantity']},'{data['region']}', {psycopg2.Binary(data['productImg'])}, {data['fresh']},{data['rotten']},{data['apple']},{data['banana']},{data['orange']} );")
            
            # Close the connection object
            conn.commit()
            conn.close()
            return True

        except(Exception, psycopg2.Error) as error:
            # Print exception
            print("Error while creating cartoon table", error)


    elif tablename=="wholesalerdetails":
        try:

            curr.execute(f"select containerid from collectiondetails where containerid={data['containerID']};")
            res = curr.fetchone()
            if res:
               
                curr.execute(f"INSERT INTO {tablename}\
                (containerID, wholesalerId, name, quantity, collectionDate, shippingDate, productImg, fresh, rotten, apple, banana, orange )" +f" VALUES( {data['containerID']}, {data['wholesalerId']},' {data['wholesalerName']}', '{data['productQuantity']}', '{data['collectionDate']}','{data['shippingDate']}', {psycopg2.Binary(data['productImg'])}, {data['fresh']},{data['rotten']},{data['apple']},{data['banana']},{data['orange']} );")
                
                # Close the connection object
                conn.commit()
                conn.close()
                return True
            return False

        except(Exception, psycopg2.Error) as error:
            # Print exception
            print("Error while creating cartoon table", error)

    elif tablename=="collectionhandlers" or tablename=='wholesalehandlers':

        try:

            curr.execute(f"select email from {tablename} where email='{data['email']}';")
            res = curr.fetchone()
            
            if res:
                return False

            
            curr.execute(f"INSERT INTO {tablename}\
            (name, email,region )" +f" VALUES( '{data['name']}', '{data['email']}','{data['region']}' );")
            
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
        



def get_image_by_containerid_with_tablename(tablename,containerid):
    conn, curr = create_connection()
    print(tablename,containerid)
    curr.execute(f"select productimg from {tablename} where containerid={containerid};")
    blob = curr.fetchone()
    if blob:
        open("tests/download.jpg",'wb').write(blob[0])
        return True
    return False