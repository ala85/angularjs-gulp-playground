angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/home");
        //
        // Now set up the states
        $stateProvider

            // HOME STATES AND NESTED VIEWS ========================================
            .state('home', {
                url: '/home',
                templateUrl: 'partials/home.html'
            })

            // nested list with custom controller
            .state('home.list', {
                url: '/list',
                templateUrl: 'partials/home-list.html',
                controller: function($scope) {
                    $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
                }
            })

            // nested list with just some random string data
            .state('home.paragraph', {
                url: '/paragraph',
                template: 'I could sure use a drink right now.'
            })


            // HOME STATES AND NESTED VIEWS ========================================
            .state('table', {
                url: '/table',
                templateUrl: 'partials/table.html',
                controller : 'PostController'
            })

            // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
            .state('about', {
                url: '/about',
                views: {

                    // the main template will be placed here (relatively named)
                    '': { templateUrl: 'partials/about.html' },

                    // the child views will be defined here (absolutely named)
                    'columnOne@about': { template: 'Look I am a column!' },

                    // for column two, we'll define a separate controller
                    'columnTwo@about': {
                        templateUrl: 'partials/table-data.html',
                        controller: 'CalculatorController'
                    }
                }

            });
});

