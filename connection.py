import json
from web3 import Web3
import psycopg2


def create_connection():
    conn = psycopg2.connect(dbname='collegeproject',
                            user='postgres',
                            password='password',
                            host='localhost',
                            port='5432')
    # Get the cursor object from the connection object
    curr = conn.cursor()
    return conn, curr



def create_web3_connection():
    ganache_url = "http://127.0.0.1:7545"
    web3 = Web3(Web3.HTTPProvider(ganache_url))


    web3.eth.defaultAccount = web3.eth.accounts[0]

    #replace your abi and address
    abi = json.loads('[{"inputs":[],"name":"collectioncounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"containerid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"default_ContainerID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"distributioncounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getCollectionDetails","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCollectioncounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContainerid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDistributioncounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getDistributiondetails","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRetailcounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getRetaildetails","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"greet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"greeting","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"retailcounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_farmername","type":"string"},{"internalType":"uint256","name":"_farmerid","type":"uint256"},{"internalType":"string","name":"_productname","type":"string"},{"internalType":"uint256","name":"_quantity","type":"uint256"},{"internalType":"string","name":"_region","type":"string"},{"internalType":"uint256","name":"_freshness","type":"uint256"},{"internalType":"string","name":"_collectiondate","type":"string"}],"name":"setCollectionDetail","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_containerid","type":"uint256"},{"internalType":"string","name":"_productname","type":"string"},{"internalType":"uint256","name":"_distributorid","type":"uint256"},{"internalType":"uint256","name":"_quantity","type":"uint256"},{"internalType":"uint256","name":"_freshness","type":"uint256"},{"internalType":"string","name":"_collectiondate","type":"string"},{"internalType":"string","name":"_shippingdate","type":"string"}],"name":"setDistributiondetails","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_greeting","type":"string"}],"name":"setGreeting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_containerid","type":"uint256"},{"internalType":"string","name":"_productname","type":"string"},{"internalType":"uint256","name":"_retailerid","type":"uint256"},{"internalType":"uint256","name":"_quantity","type":"uint256"},{"internalType":"uint256","name":"_freshness","type":"uint256"},{"internalType":"string","name":"_collectiondate","type":"string"},{"internalType":"string","name":"_shippingdate","type":"string"}],"name":"setRetailerdetails","outputs":[],"stateMutability":"nonpayable","type":"function"}]')
    address =  web3.toChecksumAddress("0xbf69B3c239c778aa9DF3948F0D9f748EBFd78461")

    contract = web3.eth.contract(address=address,abi=abi)
    return contract


