app = angular.module('esouza.engcards', ['ngMaterial']);

app.service('WordService', function() {
    var wordService = {
        words: [],
        load: function () {
                
        }
    };

    wordService.load();

    return wordService;
});

app.controller('mainCrl', function($scope, $mdDialog, WordService) {
    $scope.search = "";
    $scope.service = WordService;
    $scope.showDelete = false;

    $scope.sensitiveSearch = function (item) {
        if ($scope.search) {
            return item.word.indexOf($scope.search) == 0;
        }
        return true;
    };

    $scope.$watch('service.words', function (newVal, oldVal) { 
        var hasOne = false;
        angular.forEach($scope.service.words, function(item, index) {
            if (item.isDelete) {
                hasOne = true;
            }
        });

        $scope.showDelete = hasOne;

    }, true);

    $scope.delete = function(ev) {
        var items = [];
        angular.forEach($scope.service.words, function(item, index) {
            if (item.isDelete) {
                items.push(item);
            }
        });

        if(items.length > 0) {
            var confirm = $mdDialog.confirm()
              .title('Confirm')
              .content('Are you sure delete all ?')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('YES')
              .cancel('NO');
            $mdDialog.show(confirm).then(function() {
                for (var i =0; i < items.length; i++) {
                    var index = $scope.service.words.indexOf(items[i]);
                    $scope.service.words.splice(index, 1);
                }
            });
        }
    };

    $scope.showAdd = function(ev) {
        $mdDialog.show({
            templateUrl: 'views/addView.html',
            controller: addDialogController,
            parent: angular.element(document.body),
            targetEvent: ev
        }).then(function(item) {
            if (item.word) {
                $scope.service.words.push(item);
            }
        });
    };

    function addDialogController($scope, $mdDialog) {
        
        $scope.add = function() {
            $mdDialog.hide($scope.item);
        }; 

        $scope.cancel = function () {
            $mdDialog.hide();
        };   
    };
});
