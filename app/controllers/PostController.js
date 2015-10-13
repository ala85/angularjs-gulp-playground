angular.module('controllers').
    controller('PostController', ['$scope', 'PostService',function($scope, PostService) {

        $scope.config = {
            currentPage : 1,
            numPerPage : 4,
            maxSize : 5
        };

        function initializePosts () {
            PostService.query(function(posts) {
                $scope.posts = posts;

                $scope.filteredPosts = [];

                $scope.$watch('config.currentPage + config.numPerPage', function() {
                    var begin = (($scope.config.currentPage - 1) * $scope.config.numPerPage)
                        , end = begin + $scope.config.numPerPage;

                    $scope.filteredPosts = $scope.posts.slice(begin, end);
                });
            });
        }

        initializePosts();


    }]);