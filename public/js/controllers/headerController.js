angular.module('mean.system').controller('headerCntrl', ['$scope', 'Global', '$http', function ($scope, Global, $http) {

	$scope.global = Global;
	$scope.today = new Date();
	$scope.forecast = [];
	$scope.address = '';

	//get current time and cloud forecast==================================================================

	if($scope.global.user)
	{
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition);
	    } 
	 
	}
	function showPosition(position) {

	     $http({method: 'post', url: '/current_location',data: {
	      	'latitude': position.coords.latitude,
	      	'longitude': position.coords.longitude,
	     

	    } }).
	    success(function(data) {
	      	if(data!='error'){
		        $scope.global.user.loc=data.loc;
		        $scope.address = data.address;
		        console.log(data);
		        // $scope.global.user.current_location=data.current_location;
	        	$http({method: 'get', url: '/users/getTimeForecast'})
				.success(function(data){
					console.log(data);
					if(data !='error'){

						$scope.forecast = data;
						// $scope.today = new Date(data.time);

					}

				})
				.error(function(data){

				})
	      	}
	      	else{
	        	alert('location not available');
	     	}

	    }).
	    error(function(data) {
	      console.log(data);
	    });
	}


	setInterval(function(){

		$http({method: 'get', url: '/users/getTimeForecast'})
		.success(function(data){
			
			if(data !='error'){

				$scope.forecast = data;
				// $scope.today = new Date(data.time);

			}

		})
		.error(function(data){

		})

	},3600000)

	//=====================================================================================================

}]);