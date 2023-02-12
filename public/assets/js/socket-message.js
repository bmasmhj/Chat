const socket = io();

if(validatelogin()){
    var access_token = localStorage.getItem('access_token');
    var userid = localStorage.getItem('access_id');
    var email = localStorage.getItem('access_email');
    var username = localStorage.getItem('access_name');
    var picture = localStorage.getItem('access_picture');
    var access_token = localStorage.getItem('access_token');

    var user_details = {
        "userid" : userid,
        "email" : email,
        "username" : username,
        "picture" : picture,
    }
    socket.emit("user-connected" , user_details);
    $('#profilepic').attr( "src" , picture )
    $('#user_name').html(username)
    $('#user_email').html(email)
    $('#logout').removeClass('d-none');
    $.ajax({
        url : '/get-chat',
        method : 'GET',
          headers: {
            'Authorization': 'Bearer ' + access_token
        },
        data : { get_chat : 'get' },
        success : function(res){
            var ress = JSON.parse(res);
            // console.log(ress.id);   
           var len = ress.length;
           for(var lk = 0 ; lk < len ; lk++ ){
             if(userid== ress[lk].uid ){
                // document.querySelector('ul').appendChild(el)
                $('#chat-msg').append(
                    `<div class="chat outgoing">
                            <div class="align-items-center details">
                            <p class='m-0'>${ress[lk].text}</p>
                        </div>
                    </div>`);
                scrollToBottom();
            }
            else{  
                $('#chat-msg').append(
                    `<div class="chat incoming">
                            <img src='${ress[lk].access_picture}' class='rounded-circle'/>
                            <div class="align-items-center details">
                            <small>${ress[lk].access_name}</small>
                            <p class='m-0'>${ress[lk].text}</p>
                        </div>
                    </div>`);
                scrollToBottom();
            }
           }
        }
    })
     $.ajax({
        url : '/get-user',
        method : 'GET',
          headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success : function(userres){
            var userress = JSON.parse(userres);
            // console.log(userress.id);   
            var len = userress.length;
            $('#total_user_count').html(len)
           for(var lk = 0 ; lk < len ; lk++ ){
             if(userid != userress[lk].uid ){
                $('#user_list').append(
                    ` <li class="list-group-item border-0 d-flex align-items-center px-0 mb-2">
                            <div class="avatar me-3">
                            <img src="${userress[lk].access_picture}" alt="kal" class="border-radius-lg shadow">
                            </div>
                            <div class="d-flex align-items-start flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${userress[lk].access_name}</h6>
                            </div>
                        </li>
                `);
            }
            else{  
            }
           }
        }
    })

    
}

$('#logout').click(function(){
    localStorage.setItem("access_name", '');
    localStorage.setItem("access_email", '');
    localStorage.setItem("access_picture",'');
    localStorage.setItem("access_token" , '')
    localStorage.setItem('access_id','');
    window.location.href = '/login';
})

    socket.on("users-online", (users) => {
    //   console.log(users.length)
    });
    


    socket.on('user-connected', (text) => {
        // console.log(text)
    });

    socket.on("new-chat-message", (message) => {
        // console.log(message);
        // $('#chat-msg').append('<p>'+message.text+'</p>')
        var userid = localStorage.getItem('access_id');
         if(userid== message.socket_sender ){
            // document.querySelector('ul').appendChild(el)
            $('#chat-msg').append(
                `<div class="chat outgoing">
                        <div class="align-items-center details">
                        <p class='m-0'>${message.text}</p>
                    </div>
                </div>`);
            scrollToBottom();
        }
         else{  
            $('#chat-msg').append(
                `<div class="chat incoming">
                        <img src='${message.picture}' class='rounded-circle'/>
                        <div class="align-items-center details">
                        <small>${message.username}</small>
                        <p class='m-0'>${message.text}</p>
                    </div>
                </div>`);
            scrollToBottom();
        }
    });

$('#send-data').click(function(){
    if (validatelogin()) {

        function encodeHTML(str) {
        return str.replace(/[<>&"'`!*]/g, function (c) {
            return `&#${c.charCodeAt(0)};`;
        });
        }

        var text =  encodeHTML($('#message').val());
        if (text !== '') {
           
            var userid = localStorage.getItem('access_id');
            var username = localStorage.getItem('access_name');
            var picture = localStorage.getItem('access_picture');
            var access_token = localStorage.getItem('access_token');
            var message = {
                "socket_sender" : userid,
                "username" : username,
                "picture" : picture,
                "text": text,
            }
            socket.emit('new-chat-message', message)
            var text_ms = message.text;
            var user_id = userid;
            $('#chat-msg').append(
                `<div class="chat outgoing">
                        <div class="align-items-center details">
                            <p class='m-0'>${message.text}</p>
                    </div>
                </div>`);
            scrollToBottom();
            $('#message').val('');
       }
    
   }else{
    window.location.href = '/login';
   }
})




$('#messagedata').submit(function (e) {
    e.preventDefault();
    document.getElementById("send-data").click();
})

var input = document.getElementById("message");
input.addEventListener("keypress", function (event) {
if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("send-data").click();
}
});

$('#message').keyup(function () {
    var msg = $('#message').val();
    if (msg !== '') {
        $('#send-data').addClass('bg-info')
    } else {
        $('#send-data').removeClass('bg-info')
    }
})

// 

function scrollToBottom() {
    chatBox = document.querySelector(".chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}
scrollToBottom();

if(!validatelogin()){
    window.location.href = '/login';
}

function validatelogin(){
    if(localStorage.getItem("access_token")){
        return true
    }else{
        return false
    }
}