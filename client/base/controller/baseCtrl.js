
app.controller('baseCtrl', ['$scope', '$rootScope', '$http','$window','$location', 'Global',
 function ($scope,$rootScope,$http,$window,$location, Global) {

	 $scope.global = Global;

	 if (!$scope.global.io)
	 {
		 $scope.global.io = io.connect('localhost');
	 }
	
	$scope.isHome = ($location.path() == '/' ? true : false) ;

	$rootScope.$on('$routeChangeStart', function(){
		$scope.isHome = ($location.path() == '/' ? true : false) ;
		console.error("route changed");
	})
   
}]);