angular.module('mean.system')
 .directive('fileChange', ['$parse', function($parse) {

    return {
      require: 'ngModel',
      restrict: 'A',
      link: function ($scope, element, attrs, ngModel) {

        var attrHandler = $parse(attrs['fileChange']);

        // This is a wrapper handler which will be attached to the
        // HTML change event.
        var handler = function (e) {

          $scope.$apply(function () {

            // Execute the provided handler in the directive's scope.
            // The files variable will be available for consumption
            // by the event handler.
            attrHandler($scope, { $event: e, files: e.target.files });
          });
        };

        // Attach the handler to the HTML change event 
        element[0].addEventListener('change', handler, false);
      }
    };
  }]);

angular.module('mean.system').directive('errSrc',function() {
    // alert('jskdf');
    return {
        link: function(scope, element, attrs) {

          scope.$watch(function() {
              return attrs['ngSrc'];
            }, function (value) {
              if (!value) {
                element.attr('src', attrs.errSrc);  
              }
          });

          element.bind('error', function() {
            element.attr('src', attrs.errSrc);
          });
        }
      }
    }
);