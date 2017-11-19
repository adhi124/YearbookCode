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
var downloadbtn = document.getElementById('downloadButton');
var database = firebase.database();

logoutbtn.addEventListener('click', e=> {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(user => {
    if(user) {
        
        var appElement = document.querySelector('[ng-app=dashboard]');
        var scope = angular.element(appElement).scope();

        //Gets list of groups
        //from user -> uid -> groups
        //group in groups -> name + id to scope
        var groupsListRef = database.ref('Users/'+user.uid+'/groupIds');
        groupsListRef.on('value', function(snapshot) {
            
            var groupsList = snapshot.val();
            var groupsNameList = [];
            for (group in groupsList) {
                var groupRef = database.ref('Groups/'+groupsList[group]);
                groupRef.once('value', function(groupSnapshot) {
                    groupsNameList.push(groupSnapshot.val().title);
                });
            }
            scope.$apply(function(){
                scope.groupNames = groupsNameList;
                scope.groups = groupsList;
            })   
        });
        
        //Gets photos
        //Gets user -> current user -> current Group
        //groups -> current group -> photos
        //photo in photos -> get url and make obj
        var userRef = database.ref('Users/'+user.uid+'/groupIds/0');
        userRef.on('value', function(snapshot) {
            scope.$apply(function() {
                scope.groupMemberNames = []; 
                scope.groupmembers = [];
            });            
            var groupRef = database.ref('Groups/'+snapshot.val()+'/photoIds');
            groupRef.on('value', function(photoSnapshot) {
                var photoNames = photoSnapshot.val();
                if (photoNames != null) {
                    var photoLength = photoNames.length;
                    var photoUrls = new Array(photoLength);

                    scope.photos = [];
                    scope.photosPerm = [];
                    scope.allTags = [];

                    for (var i = 0; i < photoLength; i++) {
                        var photoRef = database.ref('Photos/'+photoNames[i]);
                        photoRef.once('value', function(snapshot) {
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
                            });                        
                        });
                    }
                }else {
                    scope.$apply(function(){
                        scope.photos = [];
                        scope.photosPerm = [];
                        scope.allTags = [];
                    });                       
                }
            });
            
            //Get members
            //groups -> current group -> member Ids
            //member in members -> name + id to scope
            /*var groupMembers = [];
            var gmNames = [];
            scope.$apply(function() {
                scope.groupMemberNames = []; 
            });*/
            
            var groupMembersRef = database.ref('Groups/'+snapshot.val()+'/memberIds');
            groupMembersRef.on('value', function(groupMembersSnapshot) {
                var groupMembers = [];
                var gmNames = [];
                scope.$apply(function() {
                    scope.groupMemberNames = []; 
                    scope.grouMembers = [];
                });
                groupMembers = groupMembersSnapshot.val();
                for (groupMember in groupMembers) {
                    var individualMember = groupMembers[groupMember];
                    var imRef = database.ref('Users/'+individualMember);
                    var tms = [];
                    imRef.once('value', function(imRefSnapshot) {
                        scope.$apply(function() {
                            scope.groupMemberNames.push(imRefSnapshot.val().name);
                        }); 
                    });
                }
                scope.$apply(function() {
                    scope.groupMembers = groupMembers;
                });                
            });
        });
        
    }else {
        window.location.replace('login.html');
    }
});