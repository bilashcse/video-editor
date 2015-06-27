'use strict';
angular.module('landingPage', ['landingPage.system']);

angular.module('landingPage.system',['ui.bootstrap']);


angular.module('landingPage.system').controller('landingCtrl', ['$scope','$http','$window','$location','$modal',function ($scope,$http,$window,$location,$modal) {

	$scope.today = new Date();
	$scope.showPage = 1;
	$scope.term_checked=true;
	$scope.check = false;

	$scope.test = function(data)
	{
		//alert(data);
		
		$http({'method' : 'post', url: '/search', data: {'value' : data}}).
		success(function(data){
			//alert(data)
			$scope.titled = data;
			
		}).
		error(function(data){

		})
		$scope.check = true;
	}

	
	$scope.clickedForgotPassword = function(){

		$scope.forgot_password = !$scope.forgot_password;

	}

	$scope.recoverPassword = function(){

		$scope.forgot_password = !$scope.forgot_password;

		$http({'method' : 'post', url: '/recoverPassword', data: {'email' : $scope.recover_email}}).
		success(function(data){
			$scope.recover_email = '';
			if(data=='ok'){
				var n = noty({text: "Password has been sent to your email address",type: 'information',layout: 'bottomRight', timeout: 3000});

			}
			else{

				var n = noty({text: "There is no account in this email address",type: 'error',layout: 'bottomRight', timeout: 3000});

			}
		}).
		error(function(data){

		})
	}

	$scope.changeShowPage=function(number){
		$scope.showPage = number;
	}
	$scope.toggleAnimation = function () {
	    $scope.animationsEnabled = !$scope.animationsEnabled;
	};

	$scope.registration = function(){
	

	 	if(!$scope.term){

	 		var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modalTerms.html',
		      controller: 'ModalInstanceCtrl',
		      resolve: {
		        items: function () {
		          return $scope.items;
		        }
		      }
		    });

		    modalInstance.result.then(function (selectedItem) {
		      $scope.selected = selectedItem;
		    }, function () {
		     
		    });
	 	}
	    else{

	    	$scope.term_checked = true;
	    	$http({'method' : 'post', url: '/registration', data: {'first_name': $scope.first_name, 'last_name' : $scope.last_name, 'user_name': $scope.user_name, 'email' : $scope.email, 'password' : $scope.password}})
	    	.success(function(data){
	    		if(data=='ok')
	    			$window.location.href = "http://" + $window.location.host +  '/waitingConfirmation';
	    		else{
	    			$window.location.href = "http://" + $window.location.host +  '?already_exist';

	    		}

	    	})
	    	.error(function(data){


	    	})


	    }
	}

    
}]);

angular.module('landingPage.system').controller('ModalInstanceCtrl', function ($scope, $modalInstance) {


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});