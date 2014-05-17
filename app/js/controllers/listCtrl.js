app.controller('listCtrl', ['$scope', 'ReceiveService', function ($scope, ReceiveService) {

    $scope.objects = [{},{}];

    $scope.properties = [
        "username",
        "state",
        "status"
    ];

    setInterval( function() {
        $scope.objects = ReceiveService.getData( $scope.properties );
    }, 1000);

    $scope.deleteAmbulance = function() {
        
    };  

}]);