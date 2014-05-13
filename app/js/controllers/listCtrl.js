app.controller('listCtrl', ['$scope', 'ReceiveService', function ($scope, ReceiveService) {

    $scope.objects = [{},{}];

    $scope.order = [
        "username",
        "state",
        "status",
        "operations"
    ];

    setInterval( function() {
        var temp = ReceiveService.getData();

        for (var i = 0; i < temp.length; i++) {
            for (var j = 0; j < $scope.order.length; j++) {
                $scope.objects[i][$scope.order[j]] = temp[i][$scope.order[j]];
            }
            $scope.objects[i].state = $scope.objects[i].state == 0 ? "bussy" : "free";
            $scope.objects[i].status = (new Date() - new Date(temp[i].lastLogin)) > 10000 ? "offline" : "online"; 
        }

        console.log($scope.objects);
    }, 1000);

}]);