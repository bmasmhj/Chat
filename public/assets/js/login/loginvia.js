
$('#loginwithfb').click(function(){
  FB.init({
  appId: '194086375720907', // Replace with your app ID
  cookie: true, // Enable cookies to allow the server to access the session
  xfbml: true, // Parse social plugins on this page
  version: 'v15.0' // Use Graph API version 8.0
});


  FB.login(function (response) {
    if (response.authResponse) {
      var accessToken = response.authResponse.accessToken;
      $.ajax({
        url: 'https://graph.facebook.com/me?fields=id,name,email,picture.height(160)&access_token=' + accessToken,
        success: function (response) {
            var user_id = response.id;
            var access_email = response.email;
            var access_picture = response.picture.data.url;
            var access_name = response.name;
            $.ajax({
                url : '/login-user',
                method : 'POST',
                headers: {
                "Content-Type": "application/json"
                },
                data : JSON.stringify({
                    "get_user": "google",
                    user_id,
                    access_email,
                    access_picture,
                    access_name
                }),
                success : function(res){
                  localStorage.setItem("access_token", jwt_token(res))
                  localStorage.setItem('access_name',access_name);
                  localStorage.setItem('access_picture',access_picture)
                  localStorage.setItem('access_id',user_id)
                  localStorage.setItem('access_email',access_email)
                  window.location.href = '/';
                }
            })
        }
      });
    } else {
       
    }
  }, { scope: 'public_profile,email' });

})

function handleCredentialResponse(response) {
  responsePayload = decodeJwtResponse(response.credential);
    var user_id = responsePayload.sub;
    var access_email = responsePayload.email;
    var access_picture = responsePayload.picture;
    var access_name = responsePayload.name;
   $.ajax({
        url : '/login-user',
        method : 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        data : JSON.stringify({
            "get_user": "google",
            user_id,
            access_email,
            access_picture,
            access_name
        }),
        success : function(res){
            localStorage.setItem("access_token" , jwt_token(res))
            localStorage.setItem('access_name',access_name);
            localStorage.setItem('access_picture',access_picture)
            localStorage.setItem('access_id',user_id)
            localStorage.setItem('access_email',access_email)
            window.location.href = '/';
        }
    })
  
}

