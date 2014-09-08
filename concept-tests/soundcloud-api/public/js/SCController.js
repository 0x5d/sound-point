/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.onload = function(){
      SC.initialize({
        client_id: "d00547f88a72d9a987b70342928f1a61",
        redirect_uri: "http://localhost:8383/sound-point/concept-tests/soundcloud-api/public/index.html"
    });
};
function test(){
    //para traer canciones
    SC.get('/tracks', { q: 'Goliat' }, function(tracks) {
        console.log(tracks);
        SC.stream(tracks[0].stream_url, function(sound){
            sound.play();
        });
    });
    //para reproducir
    
    /*SC.get("/groups/55517/tracks", {limit: 1}, function(tracks){
      console.log(tracks);
    });*/
}


