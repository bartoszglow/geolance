app.controller('listCtrl', ['$scope', 'ReceiveService', function ($scope, ReceiveService) {

    $scope.properties = [
        "username",
        "state",
        "status"
    ];

    setInterval( function() {
        $scope.objects = ReceiveService.getData( $scope.properties );
        console.log($scope.objects);
    }, 1000);

    $scope.deleteAmbulance = function() {
        
    };  

}]);