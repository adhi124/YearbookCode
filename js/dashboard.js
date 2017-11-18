// Initialize Firebase
var config = {
    apiKey: "AIzaSyAyTd1DUVUMKki5XAvJ-k_b3heUE4xkqCY",
    authDomain: "yearbook-88994.firebaseapp.com",
    databaseURL: "https://yearbook-88994.firebaseio.com",
    projectId: "yearbook-88994",
    storageBucket: "yearbook-88994.appspot.com",
    messagingSenderId: "91761954072"
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
            var groupsNameList = [];
            console.log(groupsList);
            for (group in groupsList) {
                console.log(groupsList[group]);
                var groupRef = database.ref('Groups/'+groupsList[group]);
                groupRef.on('value', function(groupSnapshot) {
                    groupsNameList.push(groupSnapshot.val().title);
                });
            }
            scope.$apply(function(){
                scope.groupNames = groupsNameList;
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
                        var newTags = [];
                        if (photoJson.taggedMembers != null) {
                            for (tag in photoJson.taggedMembers) {
                                if (scope.allTags.includes(photoJson.taggedMembers[tag])) {

                                }else {
                                    scope.allTags.push(photoJson.taggedMembers[tag]);
                                }
                                if (tagString != "") {
                                    tagString = tagString + ", " + photoJson.taggedMembers[tag];  
                                }else {
                                    tagString = tagString + photoJson.taggedMembers[tag];
                                }
                            }
                            newTags = photoJson.taggedMembers;
                        }
                        var newImage = new function() {
                            this.url = photoJson.imageUrl;
                            this.tags = newTags;
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