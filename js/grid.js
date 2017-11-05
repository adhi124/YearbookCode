var grid = angular.module( "grid", [] );
grid.controller('gridCon', function($scope) {
        $scope.photos = [

        ];

        $scope.alert = function(url) {
            window.open(url); 
        }
    }
);