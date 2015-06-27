//opportunities service used for opportunities REST endpoint
angular.module('mean.system').factory("profileView", [ function() {
    var viewUser={};
    return {
    	saveUser:function(data){
    		viewUser=data;

    	},
    	getUser:function(){
    		
    		return viewUser;
    		
    	}
    }
}]);