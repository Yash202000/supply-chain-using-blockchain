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


// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         console.log(user);
//     } else {
//         if (temp == false) {
//             temp = true;
//         } else {
//             window.alert("Admin should login first to access this page");
//             var a = document.createElement('a');
//             a.href = "index.html";
//             a.click();
//         }
//     }
// });


$('.add-Collection-handler').on('click', function() {
    document.getElementById("Popup").style.display = "block";
    document.getElementById("title").innerHTML = "Add New Collection Handler"
    document.getElementById("error-message").innerHTML = "";
    location.href="/collection_handler";
});

$('.add-Reception-handler').on('click', function() {
    document.getElementById("Popup").style.display = "block";
    document.getElementById("title").innerHTML = "Add New Reception Handler"
    document.getElementById("error-message").innerHTML = "";

});

$('.add-Treatment-handler').on('click', function() {
    document.getElementById("Popup").style.display = "block";
    document.getElementById("title").innerHTML = "Add New Treatment Handler"
    document.getElementById("error-message").innerHTML = "";
});

$('.add-Packing-handler').on('click', function() {
    document.getElementById("Popup").style.display = "block";
    document.getElementById("title").innerHTML = "Add New Packing Handler"
    document.getElementById("error-message").innerHTML = "";
});

window.onclick = function(event) {
    var modal = document.getElementById('Popup');
    if (event.target == modal) {
        closeForm();
    }
}

function closeForm() {
    document.getElementById("Popup").style.display = "none";
    document.getElementById("emailid").value = "";
    document.getElementById("pass").value = "";
}

var users;
firebase.database().ref('Users').on('value', gotData, errData);

function gotData(data) {
    users = data.val();
    loadHandler();
}

function errData(err) {
    console.log("Error!");
}

function loadHandler() {
    var key = Object.keys(users);
    for (var i = 0; i < key.length; i++) {
        var id = key[i];
        if (users[id].type == "employee" && users[id].phase != "none") {
            document.getElementById(users[id].phase).innerHTML = users[id].email;
        }
    }
}

//sign up employee

$('.login100-form-btn').click(function() {
    var emailAdd = document.getElementById("emailid").value;
    var newPass = document.getElementById("pass").value;
    if (emailAdd == "") {
        document.getElementById("error-message").innerHTML = "<h6>Please fill out Email Address field.</h6>";
        return;
    }
    if (newPass == "") {
        document.getElementById("error-message").innerHTML = "<h6>Please fill out Password field.</h6>";
        return;
    }

    var title = document.getElementById("title").innerHTML;
    var res = title.split(" ");
    var key = Object.keys(users);
    for (var i = 0; i < key.length; i++) {
        var id = key[i];
        if (users[id].phase == res[2]) {
            firebase.database().ref("Users/" + id + "/").child("phase").set("none");
            break;
        }
    }
    firebase.auth().createUserWithEmailAndPassword(emailAdd, newPass).then(cred => {
        var id = cred.user.uid;

        firebase.database().ref("Users/").child(id).set({
            email: emailAdd,
            type: "employee",
            phase: res[2]
        });
        window.alert("Employee Updated Successfully");
        closeForm();
    }).catch(function(error) {
        // Handle Errors here.        
        if (error.message = "The email address is already in use by another account.") {
            var key = Object.keys(users);
            for (var i = 0; i < key.length; i++) {
                var id = key[i];
                if (users[id].email == emailAdd && users[id].phase == "none") {
                    firebase.database().ref("Users/" + id + "/").child("phase").set(res[2]);
                    window.alert("Former employee with old credentials set successfully");
                    closeForm();
                    return;
                }
            }
        }
        document.getElementById("error-message").innerHTML = "<h6>The email address is already in use by another phase.</h6>";
        // ...
    });

});

var temp = true;
$('.logout').click(function() {
    firebase.auth().signOut().then(() => {
        window.alert("Admin Signout Successfully");
        temp = false;
        var a = document.createElement('a');
        a.href = "index.html";
        a.click();
    });
});