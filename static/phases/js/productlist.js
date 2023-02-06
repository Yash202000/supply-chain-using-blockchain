firebase.database().ref('Products').on('value', gotData, errData);

var Products;

function gotData(data) {
    var table = document.getElementById("productlist");
    Products = data.val();
    var key = Object.keys(Products);
    for (var i = table.rows.length; i > 1; i--) {
        table.deleteRow(i - 1);
    }

    for (var i = 0; i < key.length; i++) {
        var id = key[i];
        // var details = farmers[id].farmerName;
        var tabody = document.getElementById("tableBody");
        tabody.insertAdjacentHTML("beforeend", '<tr>' +
            '<td class="column1">' + id + '</td>' +
            '<td class="column2"><input type="button" onclick="viewDetails(this)" value="View"></td>' +
            '<td class="column3"><input type="button" onclick="viewQRcode(this)" value="View"></td>' +
            '</tr>');
    }
}

function errData(err) {
    console.log("Error!");
}

function viewDetails(element) {
    document.getElementById("Popup").style.display = "block";
    var table = document.getElementById("productlist");
    var row = element.parentNode.parentNode.rowIndex;
    var productID = table.rows[row].cells[0].innerHTML;
    var productDetails;
    var key = Object.keys(Products);
    for (var i = 0; i < key.length; i++) {
        var id = key[i];
        if (id == productID) {
            productDetails = Products[id].product_details;
            document.getElementById('content').innerHTML = "<h2>Product Details</h2>";
            document.getElementById('content').innerHTML += "<h6>" + productDetails + "</h6>";
            break;
        }
    }
    // contract.methods.getDetails(productID).call().then(function(product_Details) {
    //     productDetails = product_Details;
    //     document.getElementById('content').innerHTML = "<h2>Product Details</h2>";
    //     document.getElementById('content').innerHTML += "<h6>" + productDetails + "</h6>";
    // })

}

function viewQRcode(element) {
    document.getElementById('content').innerHTML = "<h2>QR Code</h2>";
    document.getElementById("Popup").style.display = "block";
    var table = document.getElementById("productlist");
    var row = element.parentNode.parentNode.rowIndex;
    var productID = table.rows[row].cells[0].innerHTML;
    var key = Object.keys(Products);
    var productDetails;
    for (var i = 0; i < key.length; i++) {
        var id = key[i];
        if (id == productID) {
            productDetails = Products[id].product_details;
            document.getElementById('content').innerHTML = "<h2>QR Code</h2>";
            document.getElementById('content').innerHTML += "<div id='qrcode'></div>";
            var qrcode = new QRCode(document.getElementById("qrcode"));
            qrcode.makeCode(productDetails);
            // JsBarcode("#barcode", productDetails, {
            //     format: "UPC",
            //     lineColor: "#0aa",
            //     width: 4,
            //     height: 40,
            //     displayValue: false
            // });

            break;
        }
    }
}

function closeForm() {
    document.getElementById("Popup").style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById('container-contact100');
    if (event.target == modal) {
        closeForm();
    }
}

$('.logout').click(function() {
    firebase.auth().signOut().then(() => {
        window.alert("Employee Signout Successfully");
        var a = document.createElement('a');
        a.href = "index.html";
        a.click();
    });

});