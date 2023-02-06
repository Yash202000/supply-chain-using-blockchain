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
    var cid = $('.validate-input input[name="cid"]');
    var tempvalue = $('.validate-input input[name="tempvalue"]');
    var shelflife = $('.validate-input input[name="shelflife"]');
    var method = $('.validate-input input[name="method"]');
    var dvalue = $('.validate-input input[name="dvalue"]');
    var renoyld = $('.validate-input input[name="renoyld"]');


    $('.validate-form').on('submit', function() {
        var check = true;
        var check = true;
        if (temp == false) {
            temp = true;
            return false;
        }

        if ($(cid).val() == '') {
            showValidate(cid);
            check = false;
        }

        if ($(tempvalue).val() == '') {
            showValidate(tempvalue);
            check = false;
        }


        // if ($(email).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        //     showValidate(email);
        //     check = false;
        // }


        if ($(shelflife).val() == '') {
            showValidate(shelflife);
            check = false;
        }

        if ($(method).val() == '') {
            showValidate(method);
            check = false;
        }
        if ($(dvalue).val() == '') {
            showValidate(dvalue);
            check = false;
        }
        if ($(renoyld).val() == '') {
            showValidate(renoyld);
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

    var cid = document.getElementById("cid").value;
    var tempvalue = document.getElementById("tempvalue").value;
    var shelflife = document.getElementById("shelflife").value;
    var method = document.getElementById("method").value;
    var dvalue = document.getElementById("dvalue").value;
    var renoyld = document.getElementById("renoyld").value;


    if (cid == "" || tempvalue == "" || shelflife == "" || method == "" || dvalue == "" || renoyld == "") {
        // document.getElementById("submit-button").click();

        return false;
    }
    if (isform) {
        var key = Object.keys(treatment);
        for (var i = 0; i < key.length; i++) {
            if (cid == key[i]) {
                window.alert("Container id should be unique. Error in adding data!");
                return;
            }
        }
    }

    firebase.database().ref("Milk-Treatment/").child(cid).set({
        TempratureValue: tempvalue,
        ShelfLife: shelflife,
        PasteurizationMethod: method,
        HeatResistence: dvalue,
        RenoyldNumber: renoyld
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

firebase.database().ref('Milk-Treatment').on('value', gotData, errData);

var treatment;

function gotData(data) {
    treatment = data.val();
    if (isform) {
        return;
    }
    var table = document.getElementById("milkTreatment");
    var key = Object.keys(treatment);
    for (var i = table.rows.length; i > 1; i--) {
        table.deleteRow(i - 1);
    }

    for (var i = 0; i < key.length; i++) {
        var id = key[i];
        var tempreture = treatment[id].TempratureValue;
        var shelflife = treatment[id].ShelfLife;
        var method = treatment[id].PasteurizationMethod;
        var heatResistence = treatment[id].HeatResistence;
        var renoyldNumber = treatment[id].RenoyldNumber;
        var tabody = document.getElementById("tableBody");
        var QRCode_gen = containers[id].QRCode_gen;
        if (QRCode_gen) {
            tabody.insertAdjacentHTML("beforeend", '<tr>' +
                '<td class="column1">' + id + '</td>' +
                '<td class="column2">' + tempreture + '</td>' +
                '<td class="column3">' + shelflife + '</td>' +
                '<td class="column4">' + method + '</td>' +
                '<td class="column5">' + heatResistence + '</td>' +
                '<td class="column6">' + renoyldNumber + '</td>' +
                '<td class="column7"></td>' +
                '<td class="column8"></td>' +
                '</tr>');
        } else {
            tabody.insertAdjacentHTML("beforeend", '<tr>' +
                '<td class="column1">' + id + '</td>' +
                '<td class="column2">' + tempreture + '</td>' +
                '<td class="column3">' + shelflife + '</td>' +
                '<td class="column4">' + method + '</td>' +
                '<td class="column5">' + heatResistence + '</td>' +
                '<td class="column6">' + renoyldNumber + '</td>' +
                '<td class="column7"><input type="button" onclick="editFarmer(this)" value="Edit"></td>' +
                '<td class="column8"><input type="button" onclick="deleteFarmer(this)" value="Delete"></td>' +
                '</tr>');
        }

    }
}

function errData(err) {
    console.log("Error!");
}

function editFarmer(element) {
    document.getElementById("Popup").style.display = "block";
    var table = document.getElementById("milkTreatment");
    var row = element.parentNode.parentNode.rowIndex;
    var ContainerID = table.rows[row].cells[0].innerHTML;
    document.getElementById("cid").value = ContainerID;
    document.getElementById("tempvalue").value = treatment[ContainerID].TempratureValue;
    document.getElementById("shelflife").value = treatment[ContainerID].ShelfLife;
    document.getElementById("method").value = treatment[ContainerID].PasteurizationMethod;
    document.getElementById("dvalue").value = treatment[ContainerID].HeatResistence;
    document.getElementById("renoyld").value = treatment[ContainerID].RenoyldNumber;



}

function deleteFarmer(element) {
    if (confirm("Do you really want to delete this data")) {
        var table = document.getElementById("milkTreatment");
        var row = element.parentNode.parentNode.rowIndex;
        var ContainerID = table.rows[row].cells[0].innerHTML;
        firebase.database().ref("Milk-Treatment").child(ContainerID).remove();
    }
}

var temp = true;
$('.logout').click(function() {
    firebase.auth().signOut().then(() => {
        window.alert("Employee Signout Successfully");
        temp = false;
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