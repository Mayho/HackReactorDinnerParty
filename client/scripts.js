var app = angular.module('dinnerRoulette', ['ngAnimate'])
// Similar to ngClick.
.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
})
.controller('main', function($scope, $filter, $http) {

  // Get a list of all students on init.
  $http.get('/students')
  .success(function(data) {
    $scope.students = [];
    for (var i = 0; i < data.length; i++) {
      $scope.students.push({name: data[i], selected:false});
    }
  })
  .error(function(err){console.log(err);});

  // Pick a student if passed one.
  // Otherwise, if only one student passes the current search filter,
  // pick him or her.
  $scope.select = function(student) {
    if (student) {
      student.selected = true;
    } else {
      var unselected = $filter('filter')($scope.students, {selected: false});
      var matches = $filter('filter')(unselected, $scope.search);
      if (matches.length === 1) {
        matches[0].selected = true;
      }
    }
    $scope.search = "";
  };

  $scope.selectAll = function() {
    for (var i = 0; i < $scope.students.length; i++) {
      $scope.students[i].selected = true;
    }
  };

  $scope.unselect = function(student) {
    if (student) {
      student.selected = false;
    }
  };

  $scope.unselectAll = function() {
    for (var i = 0; i < $scope.students.length; i++) {
      $scope.students[i].selected = false;
    }
  };

  // Send a post request to the server to match students together
  $scope.match = function() {
    var nameList = [];
    for (var i = 0; i < $scope.students.length; i++) {
      if ($scope.students[i].selected) {
        nameList.push($scope.students[i].name);
      }
    }
    $http({
      method: 'post',
      url: '/match',
      data: nameList
    }).success(function(groups) {
      $scope.groups = groups;
      console.log(groups);
    }).error(function() {
      $scope.submitted = false;
    });
    $scope.submitted = true;
  };

});