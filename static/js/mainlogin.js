(function($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function() {
        var check = true;
        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
                console.log(input[i]);
            }
        }
        if (check == true) {
            signIn();
            check = false;
        }
        return check;
    });


    $('.validate-form .input100').each(function() {
        $(this).focus(function() {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function() {
        if (showPass == 0) {
            $(this).next('input').attr('type', 'text');
            $(this).find('i').removeClass('fa-eye');
            $(this).find('i').addClass('fa-eye-slash');
            showPass = 1;
        } else {
            $(this).next('input').attr('type', 'password');
            $(this).find('i').removeClass('fa-eye-slash');
            $(this).find('i').addClass('fa-eye');
            showPass = 0;
        }
    });
})(jQuery);



function signIn() {
    const email = document.getElementById("emailid").value;
    const pass = document.getElementById("pass").value;
    console.log(email);
    console.log(pass);

    var http = new XMLHttpRequest();
    http.setRequestHeader('Access-Control-Allow-Origin','*');
var url = 'http://127.0.0.1:8000/admin_login"';
var params = 'email=admin@gmail.com&&password=admin';
http.open('POST', url, true);

//Send the proper header information along with the request
http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        alert(http.response.data);
    }
}
http.send(params);


    // firebase.auth().signInWithEmailAndPassword(email, pass).then(cred => {
    //     var key = Object.keys(users);
    //     for (var i = 0; i < key.length; i++) {
    //         var id = key[i];
    //         if (id == cred.user.uid) {
    //             if (localStorage.getItem("textvalue") == "Admin") {
    //                 if (users[id].type == "admin") {
    //                     document.getElementById("form").submit();
    //                 } else {
    //                     document.getElementById("error-message").innerHTML = "<h6>User is not of type admin</h6>";
    //                     document.getElementById("pass").value = "";
    //                 }
    //             } else {
    //                 if (users[id].type == "employee") {
    //                     if (users[id].phase == "none") {
    //                         document.getElementById("error-message").innerHTML = "<h6>This Account has been removed by Admin</h6>";
    //                         firebase.auth().signOut().then(() => {});
    //                         return;
    //                     }
    //                     var a = document.createElement('a');
    //                     a.href = '' + users[id].phase + '.html';
    //                     a.click();
    //                     // location.replace('/Our WebApp/' + users[id].phase + '.html');
    //                 } else {
    //                     document.getElementById("error-message").innerHTML = "<h6>User is not of type employee</h6>";
    //                     document.getElementById("pass").value = "";
    //                 }
    //             }
    //         }
    //     }
    // }).catch(err => {
    //     document.getElementById("error-message").innerHTML = "<h6>" + err.message + "</h6>";
    //     document.getElementById("pass").value = "";
    // });;
}

// fetch users data from database
var users;
firebase.database().ref('Users').on('value', gotData, errData);

function gotData(data) {
    users = data.val();
}

function errData(err) {
    console.log("Error!");
}

$(".forgot").click(function() {
    const emailid = document.getElementById("emailid").value;
    if (emailid == "") {
        document.getElementById("error-message").innerHTML = "<h6>Enter Email Id first</h6>";
        return;
    }
    var key = Object.keys(users);
    var temp = true;
    for (var i = 0; i < key.length; i++) {
        var id = key[i];
        if (users[id].email == emailid) {
            temp = false;
        }
    }

    if (temp == true) {
        document.getElementById("error-message").innerHTML = "<h6>There is no user record corresponding to this identifier. The user may have been deleted.</h6>";

    } else {
        firebase.auth().sendPasswordResetEmail(emailid).then(function() {
            window.alert("Link to change the password has been sent successfully to your email address");
        }).catch(function(error) {});
    }
});