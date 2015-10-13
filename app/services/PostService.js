
angular.module('services')
    .service('PostService', function($resource){
        return $resource('http://jsonplaceholder.typicode.com/posts/:id')
    });