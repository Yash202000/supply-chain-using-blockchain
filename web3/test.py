import json
from web3 import Web3

ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))


web3.eth.defaultAccount = web3.eth.accounts[0]


abi = json.loads('[{"inputs":[],"name":"collectioncounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"containerid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"default_ContainerID","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"distributioncounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getCollectionDetails","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCollectioncounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContainerid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDistributioncounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getDistributiondetails","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRetailcounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getRetaildetails","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"greet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"greeting","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"retailcounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_farmername","type":"string"},{"internalType":"string","name":"_productname","type":"string"},{"internalType":"uint256","name":"_freshness","type":"uint256"},{"internalType":"string","name":"_collectiondate","type":"string"}],"name":"setCollectionDetail","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_containerid","type":"uint256"},{"internalType":"string","name":"_productname","type":"string"},{"internalType":"uint256","name":"_freshness","type":"uint256"},{"internalType":"string","name":"_collectiondate","type":"string"},{"internalType":"string","name":"_shippingdate","type":"string"}],"name":"setDistributiondetails","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_greeting","type":"string"}],"name":"setGreeting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_containerid","type":"uint256"},{"internalType":"string","name":"_productname","type":"string"},{"internalType":"uint256","name":"_freshness","type":"uint256"},{"internalType":"string","name":"_collectiondate","type":"string"},{"internalType":"string","name":"_shippingdate","type":"string"}],"name":"setRetailerdetails","outputs":[],"stateMutability":"nonpayable","type":"function"}]')
address =  web3.toChecksumAddress("0x1C8eFc0A32168bFbe1f75E06A25cD38941a59e95")

contract = web3.eth.contract(address=address,abi=abi)





print(contract.functions.greet().call())
print(contract.functions.getCollectioncounter().call())

# contract.functions.setCollectionDetail("yash","apple",97,"5-3-23").transact()

print(contract.functions.getCollectionDetails(contract.functions.getCollectioncounter().call()).call())

# contract.functions.setDistributiondetails(contract.functions.getContainerid().call(),"apple",87,"5-3-23","5-3-23").transact()


print(contract.functions.getDistributiondetails(contract.functions.getDistributioncounter().call()).call())

# contract.functions.setRetailerdetails(contract.functions.getContainerid().call(),"apple",87,"5-3-23","5-3-23").transact()
print(contract.functions.getRetaildetails(contract.functions.getRetailcounter().call()).call())




contract.functions.setCollectionDetail("avinash","apple",97,"6-3-23").transact()

print(contract.functions.getCollectionDetails(contract.functions.getCollectioncounter().call()).call())

contract.functions.setDistributiondetails(contract.functions.getContainerid().call(),"apple",87,"6-3-23","6-3-23").transact()


print(contract.functions.getDistributiondetails(contract.functions.getDistributioncounter().call()).call())

contract.functions.setRetailerdetails(contract.functions.getContainerid().call(),"apple",87,"6-3-23","6-3-23").transact()
print(contract.functions.getRetaildetails(contract.functions.getRetailcounter().call()).call())







