var dashboard = angular.module( "dashboard", [] );
dashboard.controller('dashCon', function($scope) {
    $scope.photosPerm = [];

    $scope.photos = [];
    
    $scope.currentTags = [];

    $scope.allTags = [];
    
    $scope.groups = [];
    
    $scope.groupNames = [];

    $scope.alert = function(url) {
        window.open(url); 
    }

    $scope.switchGroup = function(groupName, index) {
        $scope.currentTags = [];
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
});