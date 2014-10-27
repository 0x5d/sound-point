app.controller('fbFriendsModalCtrl', [
    '$scope',
    '$modal',
    '$log',
    function ($scope, $modal, $log) {

        $scope.items = [{name:"juanda",
            id:123,
            picture:"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/r180/p50x50/994478_10203871345159922_4483923506299465616_n.jpg?oh=9ca995da60254972a51e1ffc31ddce6c&oe=54B5844C&__gda__=1421252505_e788835e0c185215f4f726141ae055c0",
            selected:false}];
        $scope.friends = [];

        $scope.addFriend = function(){
              FB.api(
                 "/me/friends?fields=id,name,picture",
                 function (response) {
                   if (response && !response.error) {
                       $scope.items=[];
                       response.data.forEach(function(friend) {
                          //console.log(friend);
                          var obj ={
                              name:friend.name,
                              id:friend.id,
                              picture:friend.picture,
                              selected:false
                          };
                          $scope.items.push(obj  );
                      });
                      //globalFriends = $scope.items;
                      $scope.$apply();
                      $scope.open();
                   }
                 }
             );
         };


        $scope.open = function () {

        var modalInstance = $modal.open({
          templateUrl: 'fbFriendsModal.html',
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
      };
    }]
);

