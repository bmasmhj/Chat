
if(localStorage.getItem("access_token")){
    window.location.href = '/';
}

if (localStorage.getItem("access_email")) {
  $('#login_email').val(localStorage.getItem("access_email"));
}

$('#loginuser').click(function(){
  const email = $('#login_email').val();
  const pass = $('#login_pass').val();
  $.ajax({
    url: '/loginuser',
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify({
      email,
      pass
    }),
    success: function (res) {
      var res_msg = $('#message_signup');
      if (res.status == 'login_verified') {
        localStorage.setItem('access_token', jwt_token(res))
        localStorage.setItem('access_name',res.access_name);
        localStorage.setItem('access_picture',res.access_picture)
        localStorage.setItem('access_id',res.user_id)
        localStorage.setItem('access_email',email)
        res_msg.html(`Logging in as <strong> ${email} </strong>`);
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
      }
      else if (res.status == 'email_unverified') {
        res_msg.html(`We have sent you an email in <strong> ${email} </strong>  please verify`);
        setTimeout(() => {
            window.location.href = '/verify';
        }, 1000);
      } else if (res.status == 'password_incorrect') {
          res_msg.html('Incorrect password');
          $('#login_pass').addClass('is-invalid');
          $('#login_pass').val('');
      } else if (res.status == 'unregistered') {
              res_msg.html(`This account doesnot exist`);
          }
      else {
          res_msg.html('Server Error');
      }
    }
  });
})

$('input[type="email"]').keyup(function(event) {
    var inputId = $(this).attr('id');
    var inputval = $(this).val();
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputval))
    {
        $('#'+inputId).removeClass('is-invalid')
    }else{
      $('#'+inputId).addClass('is-invalid')
    }
});

$('input[type="text"]').keyup(function(event) {
    var inputId = $(this).attr('id');
    $('#'+inputId).removeClass('is-invalid')
});
$('input[type="password"]').keyup(function(event) {
    var inputId = $(this).attr('id');
    $('#'+inputId).removeClass('is-invalid')
});
$('#singup_pass').keyup(function(){
  var np = $('#singup_pass').val();
  var cp = $('#singup_confirm').val();

  if(np == cp ){
    $('#singup_pass').removeClass('is-invalid')
    $('#singup_confirm').removeClass('is-invalid')
  }else{
    $('#singup_pass').addClass('is-invalid')
  }


})
$('#singup_confirm').keyup(function(){
  var np = $('#singup_pass').val();
  var cp = $('#singup_confirm').val();
if(np == cp ){
    $('#singup_confirm').removeClass('is-invalid')
    $('#singup_pass').removeClass('is-invalid')
  }else{
    $('#singup_confirm').addClass('is-invalid')
  }
})

$('#sing_up_user').click(function(){
  var access_name = $('#singup_name').val();
  var access_email = $('#singup_email').val();
  var pass = $('#singup_pass').val();
  var cp = $('#singup_confirm').val();
  var access_picture = 'default.png';

  if(access_name !='' && access_email !='' && pass !='' && cp !='' ){
      if(pass===cp){
        // alert('ok');
      $.ajax({
          url : '/signup-user',
          method : 'POST',
          headers: {
          "Content-Type": "application/json"
          },
          data : JSON.stringify({
              "get_user": "self",
              access_email,
              access_picture,
              access_name,
              pass
          }),
        success: function (res) {
          var response = res;
          var res_msg = '';
          if (response.status == 'new_registration') {
            res_msg = `We have sent you an email in <strong> ${access_email} </strong>  please verify`;
            localStorage.setItem("access_email", access_email)
             setTimeout(() => {
                window.location.href = '/verify';
            }, 1000);
            
          }
          if (response.status == 'registered') {
            if (response.acc_status == 0) {
              res_msg = `Account has been already created with <strong> ${access_email} </strong>  email account please proceed to login and verify`;
              localStorage.setItem("access_email", access_email)
               setTimeout(() => {
                  window.location.href = '/verify';
              }, 1000);
                    
            } else if (response.acc_status == 1) {
              res_msg = `Account has been already created with <strong> ${access_email} </strong> email account please proceed to login`;
              localStorage.setItem("access_email" , access_email)
            }
          }

            // localStorage.setItem("user_id" , user_id )
              // localStorage.setItem("access_token" , accessToken)
              // window.location.href = '/';
            $('#message_signup').html(res_msg);
          }
      })

      }
  }else{
    if(access_name == '') {
       $('#singup_name').addClass('is-invalid')
    }
    if(email == '' ){
        $('#singup_email').addClass('is-invalid')
    }
    if(pass == '' || cp == '' ){
      $('#singup_confirm').addClass('is-invalid')
      $('#singup_pass').addClass('is-invalid')
    }
  }

})

