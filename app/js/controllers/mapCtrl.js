app.controller('mapCtrl', ['$scope', 'ReceiveService', function ($scope, ReceiveService) {

    $scope.map = {
        zoom: 12,

        center: {
            latitude: 52.405137,
            longitude: 16.932222
        }
    };

    $scope.receive = function() {
    	ReceiveService.receive();
    };

    $scope.receive();
}]);