// Initialize Firebase
var config = {
    apiKey: "AIzaSyCiFUwt7sjio-wd-iM0N2d9hNy3P5Tac6Q",
    authDomain: "fir-web-demo-1e811.firebaseapp.com",
    databaseURL: "https://fir-web-demo-1e811.firebaseio.com",
    projectId: "fir-web-demo-1e811",
    storageBucket: "fir-web-demo-1e811.appspot.com",
    messagingSenderId: "631543468405"
};
firebase.initializeApp(config);

var logoutbtn = document.getElementById('logoutButton');
var database = firebase.database();

logoutbtn.addEventListener('click', e=> {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        
        var appElement = document.querySelector('[ng-app=dashboard]');
        var scope = angular.element(appElement).scope();

        var groupsListRef = database.ref('Users/'+user.uid+'/groupIds');
        groupsListRef.on('value', function(snapshot) {
            var groupsList = snapshot.val();
            scope.$apply(function(){
                scope.groups = groupsList;
            })   
        });
        
        var userRef = database.ref('Users/'+user.uid+'/groupIds/0');

        userRef.on('value', function(snapshot) {
            var groupRef = database.ref('Groups/'+snapshot.val()+'/photoIds');
            groupRef.on('value', function(photoSnapshot) {
                var photoNames = photoSnapshot.val();
                var photoLength = photoNames.length;
                var photoUrls = new Array(photoLength);
                
                scope.photos = [];
                scope.photosPerm = [];
                scope.allTags = [];
                                
                for (var i = 0; i < photoLength; i++) {
                    var photoRef = database.ref('Photos/'+photoNames[i]);
                    photoRef.on('value', function(snapshot) {
                        var photoJson = snapshot.val();
                        var tagString = "";
                        for (tag in photoJson.tags) {
                            if (scope.allTags.includes(photoJson.tags[tag])) {
                                
                            }else {
                                scope.allTags.push(photoJson.tags[tag]);
                            }
                            if (tagString != "") {
                                tagString = tagString + ", " + photoJson.tags[tag];  
                            }else {
                                tagString = tagString + photoJson.tags[tag];
                            }
                        }
                        var newImage = new function() {
                            this.url = photoJson.imageUrl;
                            this.tags = photoJson.tags;
                            this.title = photoJson.caption;
                            this.tagString = tagString;
                        }
                        scope.$apply(function(){
                            scope.photos.push(newImage);
                            scope.photosPerm.push(newImage);
                        })                        
                    });
                }
            });
        });
        
    }else {
        window.location.replace('login.html');
    }
});