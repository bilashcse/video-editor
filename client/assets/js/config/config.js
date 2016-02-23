app.config(function($stateProvider,$urlRouterProvider){
    
    $urlRouterProvider.otherwise('/home');

    $stateProvider

        .state('home',{
            url:'/home',
            templateUrl:'views/home/template/home.html',
            controller: 'homeCtrl'
        })

        .state('about',{
            url: '/about',
            templateUrl:'views/about/template/about.html',
            controller: 'aboutCtrl'

        })
});


