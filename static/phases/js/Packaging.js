(function($) {
    "use strict";


    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function() {
        $(this).on('blur', function() {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            } else {
                $(this).removeClass('has-val');
            }
        })
    })


    /*==================================================================
    [ Validate ]*/
    var pid = $('.validate-input input[name="pid"]');
    var cid = $('.validate-input input[name="cid"]');
    var shelflife = $('.validate-input input[name="shelflife"]');
    var color = $('.validate-input input[name="color"]');
    var method = $('.validate-input input[name="method"]');
    var dimension = $('.validate-input input[name="dimension"]');


    $('.validate-form').on('submit', function() {
        var check = true;

        if (temp == false) {
            temp = true;
            return false;
        }
        if ($(pid).val() == '') {
            showValidate(pid);
            check = false;
        }

        if ($(cid).val() == '') {
            showValidate(cid);
            check = false;
        }

        if ($(shelflife).val() == '') {
            showValidate(shelflife);
            check = false;
        }


        // if ($(email).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        //     showValidate(email);
        //     check = false;
        // }


        if ($(color).val() == '') {
            showValidate(color);
            check = false;
        }

        if ($(method).val() == '') {
            showValidate(method);
            check = false;
        }
        if ($(dimension).val() == '') {
            showValidate(dimension);
            check = false;
        }

        return check;
    });


    $('.validate-form .input100').each(function() {
        $(this).focus(function() {
            hideValidate(this);
        });
    });

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }



})(jQuery);

var isform = false;
if ($(document).find("title").text() == "formpage") {
    isform = true;
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

function addToFirebase() {
    var pid = document.getElementById("pid").value;
    var cid = document.getElementById("cid").value;
    var shelflife = document.getElementById("shelflife").value;
    var color = document.getElementById("color").value;
    var method = document.getElementById("method").value;
    var dimension = document.getElementById("dimension").value;

    if (pid == "" || cid == "" || shelflife == "" || color == "" || method == "" || dimension == "") {
        // document.getElementById("submit-button").click();

        return false;
    }

    if (isform) {
        var key = Object.keys(package);
        for (var i = 0; i < key.length; i++) {
            if (pid == key[i]) {
                window.alert("Packaging id should be unique. Error in adding data!");
                return;
            }
        }
    }

    firebase.database().ref("Milk-Package/").child(pid).set({
        cid: cid,
        Shelflife: shelflife,
        Color: color,
        MilkPackageMethod: method,
        Dimension: dimension,
        QRCode_gen: false
    });
    window.alert("Data Added Successfully");

}
var temp = true;

function resetForm() {
    temp = false;
    document.getElementById("my-form").reset();
}

firebase.database().ref('Milk-Package').on('value', gotDataP, errDataP);
var package;

firebase.database().ref('Milk-Collection').on('value', gotDataC, errDataC);
var collection;

firebase.database().ref('Milk-Reception').on('value', gotDataR, errDataR);
var reception;

firebase.database().ref('Milk-Treatment').on('value', gotDataT, errDataT);
var treatment;



function gotDataP(data) {
    package = data.val();
    if (isform) {
        return;
    }
    var table = document.getElementById("milkPackage");
    var key = Object.keys(package);
    for (var i = table.rows.length; i > 1; i--) {
        table.deleteRow(i - 1);
    }

    for (var i = 0; i < key.length; i++) {
        var id = key[i];
        var cid = package[id].cid;
        var shelflife = package[id].Shelflife;
        var color = package[id].Color;
        var method = package[id].MilkPackageMethod;
        var dimension = package[id].Dimension;
        var tabody = document.getElementById("tableBody");
        var QRcode_gen = package[id].QRCode_gen;
        if (QRcode_gen) {
            tabody.insertAdjacentHTML("beforeend", '<tr>' +
                '<td class="column1">' + id + '</td>' +
                '<td class="column2">' + cid + '</td>' +
                '<td class="column3">' + shelflife + '</td>' +
                '<td class="column4">' + color + '</td>' +
                '<td class="column5">' + method + '</td>' +
                '<td class="column6">' + dimension + '</td>' +
                '<td class="column7"></td>' +
                '<td class="column8"></td>' +
                '<td class="column9"></td>' +
                '</tr>');
        } else {
            tabody.insertAdjacentHTML("beforeend", '<tr>' +
                '<td class="column1">' + id + '</td>' +
                '<td class="column2">' + cid + '</td>' +
                '<td class="column3">' + shelflife + '</td>' +
                '<td class="column4">' + color + '</td>' +
                '<td class="column5">' + method + '</td>' +
                '<td class="column6">' + dimension + '</td>' +
                '<td class="column7"><input type="button" onclick="editFarmer(this)" value="Edit"></td>' +
                '<td class="column8"><input type="button" onclick="deleteFarmer(this)" value="Delete"></td>' +
                '<td class="column9"><input type="button" onclick="createBarcode(this)" value="Create"></td>' +
                '</tr>');
        }
    }
}

function errDataP(err) {
    console.log("Error!");
}

function gotDataC(data) {
    collection = data.val();
}

function errDataC(err) {
    console.log("Error!");
}

function gotDataR(data) {
    reception = data.val();
}

function errDataR(err) {
    console.log("Error!");
}

function gotDataT(data) {
    treatment = data.val();
}

function errDataT(err) {
    console.log("Error!");
}

function editFarmer(element) {
    document.getElementById("Popup").style.display = "block";
    var table = document.getElementById("milkPackage");
    var row = element.parentNode.parentNode.rowIndex;
    var packageID = table.rows[row].cells[0].innerHTML;
    document.getElementById("pid").value = packageID;
    document.getElementById("cid").value = package[packageID].cid;
    document.getElementById("shelflife").value = package[packageID].Shelflife;
    document.getElementById("color").value = package[packageID].Color;
    document.getElementById("method").value = package[packageID].MilkPackageMethod;
    document.getElementById("dimension").value = package[packageID].Dimension;
}

function deleteFarmer(element) {
    if (confirm("Do you really want to delete this data")) {
        var table = document.getElementById("milkPackage");
        var row = element.parentNode.parentNode.rowIndex;
        var packageID = table.rows[row].cells[0].innerHTML;
        firebase.database().ref("Milk-Package").child(packageID).remove();
    }
}

function createBarcode(element) {
    if (confirm("After Creating Barcode you woundn't be able to edit or delete any details of any phases of this product. Do you really want to create barcode?")) {
        var productDetails = getWholeProductDetails(element);
        if (productDetails == 'false') {
            window.alert("Error in creating barcode due to incomplete data related to product");
            return;
        }

        var table = document.getElementById("milkPackage");
        var row = element.parentNode.parentNode.rowIndex;
        var productID = table.rows[row].cells[0].innerHTML;
        var containerID = table.rows[row].cells[1].innerHTML;
        addProduct(productID, containerID, productDetails);
    }
}

function getWholeProductDetails(element) {
    var table = document.getElementById("milkPackage");
    var row = element.parentNode.parentNode.rowIndex;
    var productId = table.rows[row].cells[0].innerHTML;
    var packageDetails = '********Package Details********' +
        '\nShelf Life:-' + package[productId].Shelflife +
        '\nColor:-' + package[productId].Color +
        '\nMilk Package Method:-' + package[productId].MilkPackageMethod +
        '\nDimension:-' + package[productId].Dimension;

    var collectionDetails;
    var key = Object.keys(collection);
    var id;
    for (var i = 0; i < key.length; i++) {
        id = key[i];
        if (collection[id].cid == package[productId].cid) {
            collectionDetails = '********Collection Phase Details********' +
                '\nRegion:-' + collection[id].region +
                '\nMilk Type:-' + collection[id].type + ' Milk';
            break;
        }
    }
    if (!collectionDetails) {
        return 'false';
    }

    var receptionDetails;
    id = package[productId].cid;
    if (reception[id]) {
        receptionDetails = '********Reception Phase Details********' +
            '\nFat:-' + reception[id].Fat +
            '\nFreezing Point:-' + reception[id].FreezingPoint +
            '\nHygiene:-' + reception[id].Hygiene +
            '\nPh Value:-' + reception[id].PhValue +
            '\nProtein:-' + reception[id].Protein +
            '\nSomatic Cell Count:-' + reception[id].SomaticCellCount;
    }
    if (!receptionDetails) {
        return 'false';
    }

    var treatmentDetails;
    id = package[productId].cid;
    if (treatment[id]) {
        treatmentDetails = '********Treatment Phase Details********' +
            '\nTemperature:-' + treatment[id].TempratureValue +
            '\nShelf Life:-' + treatment[id].ShelfLife +
            '\nPasteurization Method:-' + treatment[id].PasteurizationMethod +
            '\nHeat Resistance:-' + treatment[id].HeatResistence +
            '\nRenoyld Number:-' + treatment[id].RenoyldNumber;
    }
    if (!treatmentDetails) {
        return 'false';
    }

    var productDetails = '********Product Details********' +
        '\nProduct Id:-' + productId +
        '\nDetails and readings of different phases of this product is given below' +
        '\n' + collectionDetails +
        '\n' + receptionDetails +
        '\n' + treatmentDetails +
        '\n' + packageDetails;

    return productDetails;
}

$('.logout').click(function() {
    firebase.auth().signOut().then(() => {
        window.alert("Employee Signout Successfully");
        var a = document.createElement('a');
        a.href = "index.html";
        a.click();
    });

});


// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         console.log(user);
//     } else {
//         if (temp == false) {
//             temp = true;
//         } else {
//             window.alert("Employee should login first to access this page");
//             var a = document.createElement('a');
//             a.href = "index.html";
//             a.click();
//         }
//     }
// });