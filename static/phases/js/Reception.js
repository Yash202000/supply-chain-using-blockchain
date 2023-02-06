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
    var somaticcount = $('.validate-input input[name="somaticcount"]');
    var protein = $('.validate-input input[name="protein"]');
    var fat = $('.validate-input input[name="fat"]');
    var fp = $('.validate-input input[name="fp"]');
    var ph = $('.validate-input input[name="ph"]');
    var hygiene = $('.validate-input input[name="hygiene"]');


    $('.validate-form').on('submit', function() {
        var check = true;
        if (temp == false) {
            temp = true;
            return false;
        }
        if ($(cid).val() == '') {
            showValidate(cid);
            check = false;
        }

        if ($(somaticcount).val() == '') {
            showValidate(somaticcount);
            check = false;
        }


        // if ($(email).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        //     showValidate(email);
        //     check = false;
        // }


        if ($(protein).val() == '') {
            showValidate(protein);
            check = false;
        }

        if ($(fat).val() == '') {
            showValidate(fat);
            check = false;
        }
        if ($(fp).val() == '') {
            showValidate(fp);
            check = false;
        }
        if ($(ph).val() == '') {
            showValidate(ph);
            check = false;
        }
        if ($(hygiene).val() == '') {
            showValidate(hygiene);
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
    var somaticcount = document.getElementById("somaticcount").value;
    var protein = document.getElementById("protein").value;
    var fat = document.getElementById("fat").value;
    var fp = document.getElementById("fp").value;
    var ph = document.getElementById("ph").value;
    var hygiene = document.getElementById("hygiene").value;


    if (cid == "" || somaticcount == "" || protein == "" || fat == "" || fp == "" || ph == "" || hygiene == "") {
        // document.getElementById("submit-button").click();

        return false;
    }

    if (isform) {
        var key = Object.keys(reception);
        for (var i = 0; i < key.length; i++) {
            if (cid == key[i]) {
                window.alert("Container id should be unique. Error in adding data!");
                return;
            }
        }
    }

    firebase.database().ref("Milk-Reception/").child(cid).set({
        SomaticCellCount: somaticcount,
        Protein: protein,
        Fat: fat,
        FreezingPoint: fp,
        PhValue: ph,
        Hygiene: hygiene
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

firebase.database().ref('Milk-Reception').on('value', gotData, errData);

var reception;

function gotData(data) {
    reception = data.val();
    if (isform) {
        return;
    }
    var table = document.getElementById("milkReception");
    var key = Object.keys(reception);
    for (var i = table.rows.length; i > 1; i--) {
        table.deleteRow(i - 1);
    }

    for (var i = 0; i < key.length; i++) {
        var id = key[i];
        var SomaticCount = reception[id].SomaticCellCount;
        var protein = reception[id].Protein;
        var fat = reception[id].Fat;
        var fp = reception[id].FreezingPoint;
        var ph = reception[id].PhValue;
        var hygiene = reception[id].Hygiene;
        var tabody = document.getElementById("tableBody");
        var QRCode_gen = containers[id].QRCode_gen;
        if (QRCode_gen) {
            tabody.insertAdjacentHTML("beforeend", '<tr>' +
                '<td class="column1">' + id + '</td>' +
                '<td class="column2">' + SomaticCount + '</td>' +
                '<td class="column3">' + protein + '</td>' +
                '<td class="column4">' + fat + '</td>' +
                '<td class="column5">' + fp + '</td>' +
                '<td class="column6">' + ph + '</td>' +
                '<td class="column6">' + hygiene + '</td>' +
                '<td class="column7"></td>' +
                '<td class="column8"></td>' +
                '</tr>');
        } else {
            tabody.insertAdjacentHTML("beforeend", '<tr>' +
                '<td class="column1">' + id + '</td>' +
                '<td class="column2">' + SomaticCount + '</td>' +
                '<td class="column3">' + protein + '</td>' +
                '<td class="column4">' + fat + '</td>' +
                '<td class="column5">' + fp + '</td>' +
                '<td class="column6">' + ph + '</td>' +
                '<td class="column6">' + hygiene + '</td>' +
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
    var table = document.getElementById("milkReception");
    var row = element.parentNode.parentNode.rowIndex;
    var ContainerID = table.rows[row].cells[0].innerHTML;
    document.getElementById("cid").value = ContainerID;
    document.getElementById("somaticcount").value = reception[ContainerID].SomaticCellCount;
    document.getElementById("protein").value = reception[ContainerID].Protein;
    document.getElementById("fat").value = reception[ContainerID].Fat;
    document.getElementById("fp").value = reception[ContainerID].FreezingPoint;
    document.getElementById("ph").value = reception[ContainerID].PhValue;
    document.getElementById("hygiene").value = reception[ContainerID].Hygiene;


}

function deleteFarmer(element) {
    if (confirm("Do you really want to delete this data")) {
        var table = document.getElementById("milkReception");
        var row = element.parentNode.parentNode.rowIndex;
        var ContainerID = table.rows[row].cells[0].innerHTML;
        firebase.database().ref("Milk-Reception").child(ContainerID).remove();
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