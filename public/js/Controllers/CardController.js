angular.module('StudentApp.CardController', [])
.controller('CardController', ['$scope', 'studentFactory', function ($scope, studentFactory) {
    //Close card handler
    $scope.close_card = function(){
        $scope.$parent.editing = false;
        $scope.$parent.loading = false;
    };

    //Save fruit button handler
    $scope.save_fruit = function(){
        $scope.$parent.loading = true;
        if($scope.$parent.fruit._id === undefined){
            //Adding fruit -> POST
            studentFactory.save({
                name: $scope.$parent.fruit.name,
                description: $scope.$parent.fruit.description,
                price: $scope.$parent.fruit.price
            }, function(response) {
                    console.log(response);
                    $scope.$parent.editing = false;
                    $scope.$parent.update_fruits();
            }, function(response) {
                    //error
                    console.error(response);
            });

        }else{
            //Editing fruit -> PUT
            studentFactory.update({id: $scope.$parent.fruit._id}, {
                name: $scope.$parent.fruit.name,
                description: $scope.$parent.fruit.description,
                price: $scope.$parent.fruit.price
            },function(response) {
                console.log(response);
                $scope.$parent.editing = false;
                $scope.$parent.update_fruits();
            }, function(response) {
                //error
                console.error(response);
            });
        }
    };

    //Delete fruit button handler
    $scope.delete_card = function(id) {
        $scope.$parent.loading = true;
        studentFactory.delete({id: id},
        function(response) {
            console.log(response);
            $scope.$parent.editing = false;
            $scope.$parent.update_fruits();
        }, function(response) {
            //error
            console.error(response);
        });
    };

}]);
