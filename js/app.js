app = angular.module('esouza.engcards', ['ngMaterial']);

app.service('WordService', function() {
    
    var wordService = {
        words: [],
        onLoaded: [],
        add: function (word) {
            wordService.words.push(word);
            chrome.storage.sync.set({"engcards.words": this.words});
        },
        remove: function(word) {
            var index = wordService.words.indexOf(word);
            wordService.words.splice(index, 1);
            chrome.storage.sync.set({"engcards.words": this.words});  
        }
    };

    var load = function () {
        chrome.storage.sync.get(function(data) { 
            if (data["engcards.words"]) {
                wordService.onLoaded.forEach(function(callback) {
                    callback(data["engcards.words"]);
                });
            }
        });
    };

    load();

    return wordService;
});

app.controller('mainCrl', function($scope, $mdDialog, WordService) {
    
    $scope.search = "";
    $scope.service = WordService;
    $scope.showDelete = false;

    WordService.onLoaded.push(function(words) {
        $scope.$apply(function() {
            WordService.words = words;            
        })
    });

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
                    WordService.remove(items[i]);
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
                item.id = generateUUID();
                WordService.add(item);
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
