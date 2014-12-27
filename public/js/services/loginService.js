app.service("fbService",
    function() {
        this.login = function() {
            FB.login(function(response) {
                if (response.authResponse) {
                    alert('Welcome!  Fetching your information.... ');
                    FB.api('/me', function(response) {
                        console.log('Good to see you, ' + response.name + '.');
                    });
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            });

        };
    }
);