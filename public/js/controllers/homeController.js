angular.module('mean.system').controller('homeCntrl', ['$scope', 'Global', '$http', '$upload',  function ($scope, Global, $http, $upload) {

	$scope.global = Global;
	$scope.all_user = [];
	$scope.view_user = [];
	$scope.password_match = true;
	$scope.password_condition_length = true;
	$scope.password_condition_number = true;
	$scope.password_condition_alpha = true;
	$scope.forgot_password = false; // flag of if forgot_password is clicked
	$scope.edit_profile=false;
	$scope.pp_change=false;
	$scope.uploadingProfileImageSrc= '';
	$scope.uploadingProfileImage = '';
	$scope.uploadingCoverImageSrc= '';
	$scope.uploadingCoverImage = '';
	$scope.email_exist = false;
	$scope.user_name_exist = false;


	$scope.toggleUpload = false;
	$scope.upload_started = true;
	$scope.upload_in_progress = false;
	$scope.upload_progress = 0;

	$scope.toggleEdit=function(){
		
		$scope.edit_profile = !$scope.edit_profile;
	}

	$scope.uploadPopup = function()
	{
		$scope.toggleUpload = !$scope.toggleUpload;
	}

	$scope.onFilePCSelect = function (event, files) {
      
	  
	 	$scope.uploadingCoverImageSrc = [];

	    console.log(files);

        var reader = new FileReader();
        var file = files[0];
        $scope.uploadingCoverImage = file;
        reader.readAsDataURL(file);

        reader.onload = function (e) {

          $scope.$apply(function(){
          	$scope.uploadingCoverImageSrc = e.target.result;
          
          })

        }
	       
	      
	}


	$scope.onFilePISelect = function (event, files) {
      
	  
	 	$scope.uploadingProfileImageSrc = [];

	    console.log(files);
	    
        var reader = new FileReader();
        var file = files[0];
        $scope.uploadingProfileImage = file;
        reader.readAsDataURL(file);

        reader.onload = function (e) {

          $scope.$apply(function(){
          	$scope.uploadingProfileImageSrc = e.target.result;
          
          })

        }
	       
	      
	}

	$scope.onProfilePicChnage = function (event, files) {
      
	  
	 	$scope.uploadingCoverImageSrc = [];

	    console.log(files);

        var reader = new FileReader();
        var file = files[0];
        $scope.uploadingCoverImage = file;
        reader.readAsDataURL(file);

        reader.onload = function (e) {

          $scope.$apply(function(){
          	$scope.uploadingCoverImageSrc = e.target.result;
          	$scope.pp_change=true;
          	$scope.editProfileDone();
          })

        }
	       
	      
	}


	$scope.onCoverPicChnage = function (event, files) {
      
	  
	 	$scope.uploadingProfileImageSrc = [];

	    console.log(files);

        var reader = new FileReader();
        var file = files[0];
        $scope.uploadingProfileImage = file;
        reader.readAsDataURL(file);

        reader.onload = function (e) {

          $scope.$apply(function(){
          	$scope.uploadingProfileImageSrc = e.target.result;
          	$scope.pp_change=true;
          	$scope.editProfileDone();
          })

        }
	       
	      
	}

	

	$scope.editProfileDone=function(){
		
		var formData = new FormData();
     
      	var files = $scope.uploadingProfileImage;
      	var cover_pic = $scope.uploadingCoverImage;
      	formData.append('file', files);
      	formData.append('cover_image', cover_pic);
	    formData.append('first_name', $scope.global.user.first_name);
	    formData.append('last_name',$scope.global.user.last_name);
	    formData.append('user_name',$scope.global.user.user_name);
	    formData.append('email',$scope.global.user.email);

      	$http.post('/users/editProfile', formData, {
        	headers: { 'Content-Type': undefined },
        	transformRequest: function(data) { return data; }
      	})
      	.success(function(data){

      		if(data=='ok'){

      			if(!$scope.pp_change){
      				$scope.edit_profile = !$scope.edit_profile;
      			  }
      			
      				$scope.pp_change = false;
	          	if($scope.uploadingProfileImageSrc)
	          	{
	          		$scope.global.user.profile_picture = $scope.uploadingProfileImageSrc;
	          		$scope.uploadingProfileImage = '';
	          		$scope.uploadingProfileImageSrc = '';
	          		$scope.email_exist = false;
      				$scope.user_name_exist = false;
      			}
      			if($scope.uploadingCoverImageSrc)
      			{
      				$scope.global.user.cover_picture = $scope.uploadingCoverImageSrc;
	          		$scope.uploadingCoverImageSrc= '';
					$scope.uploadingCoverImage = '';
	          		$scope.email_exist = false;
      				$scope.user_name_exist = false;
      			}


      		}
      		else{

      			$scope.email_exist = data.email_exist;
      			$scope.user_name_exist = data.user_name_exist;

      		}
      		
              

      	})

	}


	$scope.setPassword=function(){
		// console.log($scope.password);
		if($scope.password != $scope.password_confirmation){
			$scope.password_match = false;
			$scope.password_condition_length = true;
			$scope.password_condition_number = true;
			$scope.password_condition_alpha = true;

		}
		else if ($scope.password.length < 6) {
	        $scope.password_match = true;
			$scope.password_condition_length = false;
			$scope.password_condition_number = true;
			$scope.password_condition_alpha = true;
	
	    }
	    else if ($scope.password.search(/\d/) == -1) {
	        $scope.password_match = true;
			$scope.password_condition_length = true;
			$scope.password_condition_number = false;
			$scope.password_condition_alpha = true;
	    } 
	    else if ($scope.password.search(/[A-Za-z]/) == -1) {
	        $scope.password_match = true;
			$scope.password_condition_length = true;
			$scope.password_condition_number = true;
			$scope.password_condition_alpha = false;
	    }
	    else{

	    	$scope.global.user.password = "xyz";
	    	$http({'method': 'post', 'url': '/setPassword', data: {'password' : $scope.password}}).
	    	success(function(data){

	    	})
	    	.error(function(data){

	    	})

	    }
	}

	//get all user for admin panel====================================
	$scope.getallUser = function(){

		$http({'method' : 'get', 'url' : '/getallUser'})
		.success(function(data){

			$scope.all_user = data;

		})
		.error(function(data){

		})

	}
	//=================================================================

	//resend activation link ==========================================
	$scope.resendActivationLink=function(user_id){

		$http({'method' : 'post', url: '/admin/resendActivationLink', data: {'user_id' : user_id}}).
		success(function(data){
			if(data=='ok'){
				var n = noty({text: "Resent Activation Link",type: 'information',layout: 'bottomRight', timeout: 3000});
			}

		}).
		error(function(data){

		})
	}

	//=================================================================



	//delete user======================================================
	$scope.deleteUser=function(user_id){

		if($scope.view_user){
			if($scope.view_user._id == user_id){

				$scope.view_user = [];

			}
		}


		$http({'method' : 'post', url: '/admin/deleteUser', data: {'user_id' : user_id}}).
		success(function(data){

			if(data=='ok'){
				var n = noty({text: "User deleted",type: 'information',layout: 'bottomRight', timeout: 3000});
			}

			var find = _.findWhere($scope.all_user,{'_id' : user_id});
			if(find){
				$scope.all_user = _.without($scope.all_user, find);
			}

		}).
		error(function(data){

		})
	}

	/*****************
	 * Videos Upload
	 ****************/

	 $scope.VideoUpload = function($files)
	 {
	 	$scope.upload_started = !$scope.upload_started;
	 	$scope.upload_in_progress = true;

	 	var file = $files[0];
	 	$scope.upload = $upload.upload({
	 		url: '/users/upload',
	 		file: file
	 	}).progress(function(evt) {
        $scope.upload_progress = parseInt(100.0 * evt.loaded / evt.total);
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully 
        console.log(data);
      });;
	 }
	//==================================================================


	//view user=========================================================

	$scope.viewUser = function(user_id){

		var find = _.findWhere($scope.all_user,{'_id' : user_id});
		if(find){
			$scope.view_user = find;
		}


	}

	//==================================================================

}]);