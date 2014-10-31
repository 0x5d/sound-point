window.onload = function(){
      SC.initialize({
        client_id: "d00547f88a72d9a987b70342928f1a61"
    });
};

var currentTrack;
app.controller('stationCtrl', [
    '$scope',
    '$http',
    '$timeout',
    '$stateParams',
    '$modal',
    function($scope, $http, $timeout, $stateParams, $modal){
        $scope.station = {
            stationId : $stateParams.stationId,
            stationName : $stateParams.stationName,
            type : $stateParams.type
        };
        $scope.songs = [];
        $scope.results = [];
        $scope.currentSong = {};
        $http.get('/station/' + $scope.station.stationId)
            .success(
                function(data, status){
                    if(data.station.songs){
                        console.log(data.station);
                        $scope.station.users = data.station.users;
                        $scope.station.invitations = data.station.invitations;
                        setupSongs($scope.station);
                        pollSongs();
                    }
                }
            )
            .error(
                function(data, status){
                }
            );

        function setupSongs(songs){
            if(songs.length > 0){
                $scope.currentSong.title = songs[0].title;
                $scope.currentSong.artist = songs[0].artist;
                $scope.currentSong.artwork = songs[0].artwork;
                var ids = songs[0].songId;
                for(var i = 1; i < songs.length; i++){
                    ids += "," + songs[i].songId;
                }
                $scope.songs = songs;
                getTracks(ids);

            }
        }

        function getTracks(ids){
           SC.get('/tracks',{ids : ids},
                    function(tracks) {
                        if(tracks.errors){
                            getTracks(ids);
                            return;
                        }
                        var track;
                        for(var i = 0; i < tracks.length; i++){
                            $scope.songs[i].title = tracks[i].title;
                            $scope.songs[i].artwork = tracks[i].artwork_url;
                            $scope.songs[i].artist = tracks[i].user.username;
                            $scope.songs[i].description = tracks[i].description;
                            $scope.songs[i].songId = tracks[i].id;
                            $scope.songs[i].url = tracks[i].stream_url;
//                            track = {
//                                title : tracks[i].title,
//                                artwork : tracks[i].artwork_url,
//                                artist : tracks[i].user.username,
//                                description:tracks[i].description,
//                                songId : tracks[i].id,
//                                url : tracks[i].stream_url
//                            };
//                            $scope.songs.push(track);
                        }
                        $scope.$apply();
                        qmanager($scope.songs[0]);
                    }
                ); 
        }

        function qmanager(song){
            if(song.url){
                SC.stream(song.url, {onfinish:
                    function(){
                        var finishedSong = $scope.songs.shift();
                        $scope.$apply();
                        currentTrack = null;
                        qmanager($scope.songs[0]);
                        removeSong($scope.station.stationId, finishedSong.songId);   
                    }}, 
                    function(sound){
                        currentTrack = sound;
                        sound.play();
                    }
                );
            }else if($scope.songs[0]){
                var lastSong = $scope.songs.shift();
                removeSong($scope.station.stationId, lastSong.songId);
            }
        }

        $scope.next = function (){
            if($scope.songs[0]){
                currentTrack.stop();
                var lastSong = $scope.songs.shift();
                removeSong($scope.station.stationId, lastSong.songId);
            }
            if($scope.songs[0]){
                $scope.currentSong.title = $scope.songs[0].title;
                $scope.currentSong.artist = $scope.songs[0].artist;
                $scope.currentSong.artwork = $scope.songs[0].artwork;
                SC.stream($scope.songs[0].url, {onfinish:
                     function(){ 
                             var finishedSong = $scope.songs.shift();
                             $scope.$apply();
                             qmanager($scope.songs[0]);
                             removeSong($scope.station.stationId, finishedSong.songId);                            
                         }}, 
                     function(sound){
                         currentTrack = sound;
                         sound.play();
                     }
                 );
            }
        };

        addSong = function(song){
            if($scope.station.type == 'voting'){
                song.votes = 1;
            }
            var postData = {
                'stationId' : $scope.station.stationId,
                'song' : song
            };
            $http.post('/newSong', postData).
                success(
                    function(data, status){
                    }
                ).
                error(
                    function(data, status){
                        //TODO handle error
                    }
                );
        };
        
        function removeSong(stationId, songId){
           $http.get('/station/removeSong/'
                + stationId
                + '/' + songId).
                success(
                    function(data, status){
                    }
                ).
                error(
                    function(data, status){
                    }
                );
        }
        
        $scope.openSongSearchModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'songSearchModal.html',
                controller: 'songSearchModalCtrl'
            });

            modalInstance.result.then(function (addedSong) {
                addSong(addedSong);
                if(!$scope.songs[0]){
                    qmanager(addedSong);
                }
            },
            function () {
            });
        };

        $scope.isPlaying = false;

        $scope.pause= function(){
            currentTrack.pause();
            $scope.isPlaying = true;
        }; 

        $scope.play = function(){
            currentTrack.play();
            $scope.isPlaying = false;
        };
        
        $scope.voteUp = function(index){
            
        };

        $scope.openFriendsModal = function () {
            FB.api(
                "/me/friends?fields=id,name,picture",
                function (response) {
                    if (response && !response.error) {
                        var friends = [];
                        for(var i = 0; i < response.data.length; i++){
                            for(var j = 0; j < $scope.station.invitations.length; j++ ){
                                if(response.data[i].id ==  $scope.station.invitations[j]){
                                    response.data.splice(i,1);
                                }
                            }for(var j = 0; j < $scope.station.users.length; j++ ){
                                if(response.data[i].id ==  $scope.station.users[j]){
                                    response.data.splice(i,1);
                                }
                            }
                        }
                        response.data.forEach(function(friend) {
                            var obj ={
                                name:friend.name,
                                id:friend.id,
                                picture:friend.picture,
                                selected:false
                            };
                            friends.push(obj);
                        });
                        var modalInstance = $modal.open({
                            templateUrl: 'fbFriendsModal.html',
                            controller: 'modalInstanceCtrl',
                            resolve: {
                                items: function () {
                                    return friends;
                                },
                                stationName : function(){
                                    return $scope.station.stationName; 
                                },
                                stationId : function(){
                                    return $scope.station.stationId; 
                                },stationInvites : function(){
                                    return $scope.station.invitations;
                                }
                            }
                        });

                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, 
                        function () {
                        });
                    }
                }
            );
        };

        var pollSongs = function(){
            if($scope.songs){
                var currentSongs = [];
                for(var i = 0; i < $scope.songs.length; i++){
                    currentSongs.push({songId : $scope.songs[i].songId});
                }
                $http.get('/pollStation/'
                    + $scope.station.stationId
                    + '/' + JSON.stringify(currentSongs)).
                success(
                    function(data, status){
                        if(data.songs){
                            $scope.songs = [];
                            $scope.songs = data.songs;
                        }
                        $timeout(pollSongs, 1000);
                    }
                ).error(
                    function(data, status){
                        $timeout(pollSongs, 1000);
                    }
                );
            }
            else{
                $timeout(pollSongs, 1000);
            }
        };
    }]
);


