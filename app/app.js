require('angular');


require('./services');
require('./controllers');
require('angular-resource')

angular.module('app', ['ngResource', 'ui.router', 'ui.bootstrap', 'controllers', 'services']);

require('./router');