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
    var fid = $('.validate-input input[name="fid"]');
    var fname = $('.validate-input input[name="fname"]');
    var quantity = $('.validate-input input[name="quantity"]');
    var impurity = $('.validate-input input[name="impurity"]');
    var cid = $('.validate-input input[name="cid"]');


    $('.validate-form').on('submit', function() {
        var check = true;
        if (temp == false) {
            temp = true;
            return false;
        }
        if ($(fid).val() == '') {
            showValidate(fid);
            check = false;
        }

        if ($(fname).val() == '') {
            showValidate(fname);
            check = false;
        }


        // if ($(email).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        //     showValidate(email);
        //     check = false;
        // }


        if ($(quantity).val() == '') {
            showValidate(quantity);
            check = false;
        }

        if ($(impurity).val() == '') {
            showValidate(impurity);
            check = false;
        }

        if ($(cid).val() == '') {
            showValidate(cid);
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

    var fid = document.getElementById("fid").value;
    var fname = document.getElementById("fname").value;
    var quantity = document.getElementById("quantity").value;
    var region = document.getElementById("region").value;
    var impurity = document.getElementById("impurity").value;
    var type = document.getElementById("type").value;
    var cid = document.getElementById("cid").value;


    if (fid == "" || fname == "" || quantity == "" || region == "" || impurity == "" || type == "" || cid == "") {
        return false;
    }
    if (isform) {
        var key = Object.keys(farmers);
        for (var i = 0; i < key.length; i++) {
            if (fid == key[i]) {
                window.alert("Farmer id should be unique. Error in adding data!");
                return;
            }
        }
    }

    firebase.database().ref("Milk-Collection/").child(fid).set({
        farmerName: fname,
        quantity: quantity,
        region: region,
        impurity: impurity,
        type: type,
        cid: cid
    });
    firebase.database().ref("Containers/").child(cid).set({
        QRCode_gen: false
    });
    window.alert("Data Added Successfully");
}
var temp = true;

function resetForm() {
    temp = false;
    document.getElementById("my-form").reset();

}

firebase.database().ref('Containers').on('value', gotDataTCo, errDataCo);
var containers;

function gotDataTCo(data) {
    containers = data.val();
}

function errDataCo(err) {
    console.log("Error!");
}

firebase.database().ref('Milk-Collection').on('value', gotData, errData);

var farmers;

function gotData(data) {
    farmers = data.val();
    if (isform) {
        return;
    }
    var table = document.getElementById("milkCollection");
    var key = Object.keys(farmers);
    for (var i = table.rows.length; i > 1; i--) {
        table.deleteRow(i - 1);
    }

    for (var i = 0; i < key.length; i++) {
        var id = key[i];
        var fname = farmers[id].farmerName;
        var imp = farmers[id].impurity;
        var qty = farmers[id].quantity;
        var reg = farmers[id].region;
        var type = farmers[id].type;
        var cid = farmers[id].cid;
        var tabody = document.getElementById("tableBody");
        var QRCode_gen = containers[cid].QRCode_gen;
        if (QRCode_gen) {
            tabody.insertAdjacentHTML("beforeend", '<tr>' +
                '<td class="column1">' + id + '</td>' +
                '<td class="column2">' + fname + '</td>' +
                '<td class="column3">' + qty + '</td>' +
                '<td class="column4">' + reg + '</td>' +
                '<td class="column5">' + imp + '</td>' +
                '<td class="column6">' + type + '</td>' +
                '<td class="column7">' + cid + '</td>' +
                '<td class="column8"></td>' +
                '<td class="column9"></td>' +
                '</tr>');
        } else {
            tabody.insertAdjacentHTML("beforeend", '<tr>' +
                '<td class="column1">' + id + '</td>' +
                '<td class="column2">' + fname + '</td>' +
                '<td class="column3">' + qty + '</td>' +
                '<td class="column4">' + reg + '</td>' +
                '<td class="column5">' + imp + '</td>' +
                '<td class="column6">' + type + '</td>' +
                '<td class="column7">' + cid + '</td>' +
                '<td class="column8"><input type="button" onclick="editFarmer(this)" value="Edit"></td>' +
                '<td class="column9"><input type="button" onclick="deleteFarmer(this)" value="Delete"></td>' +
                '</tr>');
        }

    }
}

function errData(err) {
    console.log("Error!");
}

function editFarmer(element) {
    document.getElementById("Popup").style.display = "block";
    var table = document.getElementById("milkCollection");
    var row = element.parentNode.parentNode.rowIndex;
    var farmerID = table.rows[row].cells[0].innerHTML;
    document.getElementById("fid").value = farmerID;
    document.getElementById("fname").value = farmers[farmerID].farmerName;
    document.getElementById("quantity").value = farmers[farmerID].quantity;
    document.getElementById("nashik").click();
    document.getElementById("impurity").value = farmers[farmerID].impurity;
    if (farmers[farmerID].type == "Cow") {
        document.getElementById("type").selectedIndex = "0";
    } else {
        document.getElementById("type").selectedIndex = "1";
    }
    document.getElementById("cid").value = farmers[farmerID].cid;

}

function deleteFarmer(element) {
    if (confirm("Do you really want to delete this data")) {
        var table = document.getElementById("milkCollection");
        var row = element.parentNode.parentNode.rowIndex;
        var farmerID = table.rows[row].cells[0].innerHTML;
        firebase.database().ref("Milk-Collection").child(farmerID).remove();
    }
}

var temp = true;
$('.logout').click(function() {
    firebase.auth().signOut().then(() => {
        window.alert("Employee Signout Successfully");
        temp = false;
        // var a = document.createElement('a');
        // a.href = "index.html";
        // a.click();
        location.replace('index.html');
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