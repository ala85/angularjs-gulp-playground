angular.module('controllers').
    controller('CalculatorController', ['$scope', 'CalculatorService',function($scope, CalculatorService) {

        $scope.doSquare = function() {
            $scope.answer = CalculatorService.square($scope.number);
        }

        $scope.doCube = function() {
            $scope.answer = CalculatorService.cube($scope.number);
        }
    }]);