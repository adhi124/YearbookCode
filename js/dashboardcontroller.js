var dashboard = angular.module( "dashboard", [] );
dashboard.controller('dashCon', function($scope) {
    $scope.photosPerm = [];
    $scope.photos = [];
    $scope.currentTags = [];
    $scope.allTags = [];
    $scope.groups = [];
    $scope.groupNames = [];
    $scope.groupMembers = [];
    $scope.groupMemberNames = [];

    $scope.alert = function(url) {
        window.open(url); 
    }

    $scope.switchGroup = function(groupName, index) {
        if (index != 0) {
            $scope.currentTags = [];
            $scope.groupMembers = [];
            $scope.groupMemberNames = [];
            var database = firebase.database();
            firebase.auth().onAuthStateChanged(user => {
                if(user) {
                    var groupsListRef = database.ref('Users/'+user.uid+'/groupIds');
                    groupsListRef.once('value').then(function(snapshot) {
                        var groupsList = snapshot.val();
                        var newGroupsList = groupsList;
                        var currentGroup = groupsList[0];
                        newGroupsList[0] = groupsList[index];
                        newGroupsList[index] = currentGroup;
                        groupsListRef.set(newGroupsList);
                    });                     
                }
            });
        }
    }

    $scope.flag = function(url) {
        var database = firebase.database();
        var flagRef = database.ref('Flagged');

        flagRef.push(url);
        alert("This photo has been flagged and will be removed by our team if deemed inappropriate after a review");
    }

    $scope.search = function() {
        var input = document.getElementById("searchbar");
        var tag = input.value;
        $scope.currentTags.push(tag);
        var newPhotos = [];
        var photoList = $scope.photos;
        for (var i = 0; i < photoList.length; i++) {
            var photo = photoList[i];
            var tags = photo.tags;
            if (tags.includes(tag)) {
                newPhotos.push(photo);
            }
        }
        $scope.photos = newPhotos;
    }
    
    $scope.addmember = function() {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                var memberinput = document.getElementById('membersearchbar');
                var email = memberinput.value;
                
                var database = firebase.database();
                
                var userRef = database.ref('Users');
                userRef.once('value').then(function(urs) {
                    
                    var uid = user.uid;
                    
                    var users = urs.val();
                    
                    var currentGroups = users[uid].groupIds;
                    
                    var currentGroup = currentGroups[0];
                    
                    for (cuser in users) {
                        if (email === users[cuser].email) {
                            console.log(email);
                            var uidToAdd = cuser;
                            console.log(uidToAdd);
                            if (uidToAdd != user.uid) {
                                var ugRef = database.ref('Users/'+uidToAdd+'/groupIds');
                                ugRef.once('value').then(function(grs) {   
                                    var guRef = database.ref('Groups/'+currentGroup+'/memberIds');
                                    guRef.once('value').then(function(gurs) {
                                        var prevGroups = grs.val();
                                        var currMembers = gurs.val();
                                        
                                        if (!currMembers.contains(uidToAdd)) {
                                            prevGroups.push(currentGroup);
                                            ugRef.set(prevGroups);

                                            currMembers.push(uidToAdd);
                                            guRef.set(currMembers);
                                        }else {
                                            window.alert("User is already in this group");                     
                                        }
                                        //location.reload();
                                    });                                
                                });
                            }else {
                                window.alert("User is already in this group");   
                            }
                        }
                    }
                });                   
            }
        });

    }
    
    $scope.searchTag = function(tag) {
        $scope.currentTags.push(tag);
        var newPhotos = [];
        var photoList = $scope.photos;
        for (var i = 0; i < photoList.length; i++) {
            var photo = photoList[i];
            var tags = photo.tags;
            if (tags.includes(tag)) {
                newPhotos.push(photo);
            }
        }
        $scope.photos = newPhotos;
    }
    
    $scope.clearTags = function() {
        $scope.currentTags = [];
        $scope.photos = $scope.photosPerm;   
    }
    
    $scope.download = function() {
        var urls = [];
        for (photo in $scope.photos) {
            urls.push($scope.photos[photo].url);
        }
        console.log(urls);
    }
    
    $scope.rmMember = function(member, index) {
        var rem = confirm("Remove member from group?");
        if (rem == true) {
            var database = firebase.database();
            firebase.auth().onAuthStateChanged(user => {
                if(user) {
                    var groupRef = database.ref('Users/'+user.uid+'/groupIds');
                    groupRef.once('value').then(function(snapshot) {
                        var currentGroups = snapshot.val();
                        var currentGroup = currentGroups[0];
                        var gmRef = database.ref('Groups/'+currentGroup+'/memberIds');
                        gmRef.once('value').then(function(ms) {
                            var members = ms.val();
                            var rmId = members[index];
                            if (user != rmId) {
                                members.splice(index,1);
                                var rmMRef = database.ref('Users/'+rmId+'/groupIds');
                                rmMRef.once('value').then(function(rmms) {
                                    var allGroups = rmms.val();
                                    for (g in allGroups) {
                                        if (currentGroup === allGroups[g]) {
                                            allGroups.splice(g,1);
                                        }
                                    }
                                    rmMRef.set(allGroups);
                                    gmRef.set(members);
                                });
                            }else {
                                window.alert("Cannot Remove Yourself from Group");   
                            }
                        });
                    });                     
                }
            }); 
        }
    }
    
    $scope.dispMems = function() {
        
    }
    $scope.dispMems();
});