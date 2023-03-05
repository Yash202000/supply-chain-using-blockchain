import json
from web3 import Web3

ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))


web3.eth.defaultAccount = web3.eth.accounts[0]


abi = json.loads('[{"inputs":[],"name":"default_Greeter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"greet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"greeting","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_greeting","type":"string"}],"name":"setGreeting","outputs":[],"stateMutability":"nonpayable","type":"function"}]')
address =  web3.toChecksumAddress("0x8b0DCaC8e96A0FEd7610F1C6aC42Bdd8Ce436d4d")

contract = web3.eth.contract(address=address,abi=abi)





# print(contract.functions.greet().call())
# tx_hash = contract.functions.setGreeting("HEEEEEEEEEllo!").transact()

web3.eth.waitForTransactionReceipt('0x044989a8482046a125db51be683f3aba91ffc3af759e55a4deaa21b8d76c42c6')

print(f"updated greeting : {contract.functions.greet().call()}")




# [{"inputs":[],"name":"default_Greeter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"greet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"greeting","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_greeting","type":"string"}],"name":"setGreeting","outputs":[],"stateMutability":"nonpayable","type":"function"}]

