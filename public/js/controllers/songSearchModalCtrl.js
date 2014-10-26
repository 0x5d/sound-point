app.controller('songSearchModalCtrl', [
    '$scope',
    '$modal',
    '$log',
    function ($scope, $modal, $log) {
        $scope.items = [];

        var searchSong = function(){
            $log.info('Add song clicked');
            $scope.open();
        };

        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: 'songSearchModal.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            },
            function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]
);

