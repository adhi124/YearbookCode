var config = {
    apiKey: "AIzaSyCiFUwt7sjio-wd-iM0N2d9hNy3P5Tac6Q",
    authDomain: "fir-web-demo-1e811.firebaseapp.com",
    databaseURL: "https://fir-web-demo-1e811.firebaseio.com",
    projectId: "fir-web-demo-1e811",
    storageBucket: "fir-web-demo-1e811.appspot.com",
    messagingSenderId: "631543468405"
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