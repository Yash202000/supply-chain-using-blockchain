var contract;
var web3;
$(document).ready(function() {
    web3 = new Web3(web3.currentProvider);
    var address = "0x6CeC86F458448251B8f5620E0F82eF2E3445F716";
    var abi = [{
            "constant": false,
            "inputs": [{
                    "name": "product_id",
                    "type": "uint256"
                },
                {
                    "name": "product_detail",
                    "type": "string"
                }
            ],
            "name": "addProduct",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getCount",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{
                "name": "pid",
                "type": "uint256"
            }],
            "name": "getDetails",
            "outputs": [{
                "name": "",
                "type": "string"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{
                "name": "",
                "type": "uint256"
            }],
            "name": "products",
            "outputs": [{
                "name": "product_details",
                "type": "string"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "productsCount",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];
    contract = new web3.eth.Contract(abi, address);
})

function addProduct(productId, containerId, productDetails) {

    web3.eth.getAccounts().then(function(accounts) {
        var acc1 = accounts[0];
        console.log(acc1);
        return contract.methods.addProduct(productId, productDetails).send({
            from: acc1
        });
    }).then(function(tx) {
        firebase.database().ref("Products/").child(productId).set({
            product_details: productDetails
        });
        firebase.database().ref("Containers/" + containerId + "/").child("Barcode_gen").set(true);
        window.alert("Barcode has been created successfully");
    }).catch(function(tx) {
        console.log(tx);
    })
}

function getDetails(productId) {
    contract.methods.getDetails(productId).call().then(function(productDetails) {
        return productDetails;
    })
}

function getCount() {
    contract.methods.getCount().call().then(function(productCount) {
        return productCount;
    })
}