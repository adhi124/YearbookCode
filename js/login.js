var config = {
    apiKey: "AIzaSyAyTd1DUVUMKki5XAvJ-k_b3heUE4xkqCY",
    authDomain: "yearbook-88994.firebaseapp.com",
    databaseURL: "https://yearbook-88994.firebaseio.com",
    projectId: "yearbook-88994",
    storageBucket: "yearbook-88994.appspot.com",
    messagingSenderId: "91761954072"
};
firebase.initializeApp(config);

var emailText = document.getElementById('emailInput');
var passwordText = document.getElementById('passwordInput');
var btn = document.getElementById('loginButton');

btn.addEventListener('click', e=> {  
    var email = emailText.value;
    var password = passwordText.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
        console.log(error.message)
    });
});

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        window.location.replace('dashboard.html');  
    }else {
        console.log("nobody logged in");   
    }
});