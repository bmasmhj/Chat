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
    }
    socket.emit("user-connected" , user_details);
    $('#profilepic').attr( "src" , picture )
    $('#user_name').html(username)
    $('#user_email').html(email)
    $('#logout').removeClass('d-none');
    $.ajax({
        url : '/get-my-chat',
        method : 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + access_token
        },
        data: JSON.stringify({
            get_my_chat : 'get',
            userid
        }),
        success : function(res){
            // console.log(res.data);   
            const ress = res.data
           var len = ress.length;
           for(var lk = 0 ; lk < len ; lk++ ){
             if(ress[lk].msg_type == 'incoming' ){
                // document.querySelector('ul').appendChild(el)
                $('#chat-msg').append(
                    `<div class="chat ${ress[lk].msg_type}">
                           <img src='https://chat.bimash.com.np/assets/images/bot.png' class='rounded-circle'/>
                        <div class="align-items-center details">
                        <small>Chat bot</small>
                            <p class='m-0'>${ress[lk].text}</p>
                        </div>
                    </div>`);
                scrollToBottom();
             } else {
                $('#chat-msg').append(
                `<div class="chat ${ress[lk].msg_type}">
                        <div class="align-items-center details">
                        <p class='m-0'>${ress[lk].text}</p>
                    </div>
                </div>`);
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
            else {  
                 
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

    socket.on("new-nlp-message", (message) => {
        // console.log(message);
        // $('#chat-msg').append('<p>'+message.text+'</p>')
        var userid = localStorage.getItem('access_id');
        if (message.type == 'user' && userid == message.socket_sender) {
            $('#chat-msg').append(
                `<div class="chat outgoing">
                        <div class="align-items-center details">
                        <p class='m-0'>${message.text}</p>
                    </div>
                </div>`);
        }
        if (userid == message.socket_sender &&  message.type == 'bot') {  
           setTimeout(() => {
               $('#typing').remove();
            // document.querySelector('ul').appendChild(el)
            $('#chat-msg').append(
                `<div class="chat incoming">
                        <img src='https://chat.bimash.com.np/assets/images/bot.png' class='rounded-circle'/>
                        <div class="align-items-center details">
                        <small>Chat bot</small>
                        <p class='m-0'>${message.text}</p>
                    </div>
                </div>`);
           }, 1000);
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
            var message = {
                "socket_sender": userid,
                "text" : text
            }
            socket.emit('new-nlp-message', message)
            var text_ms = message.text;
            var user_id = message.userid;
            $('#chat-msg').append(
            `<div class="chat outgoing">
                    <div class="align-items-center details">
                        <p class='m-0'>${text_ms}</p>
                </div>
            </div>`
            );
            $('#chat-msg').append(`
               <div class="chat incoming " id="typing">
                    <img src='https://chat.bimash.com.np/assets/images/bot.png' class='rounded-circle'/>
                    <div class="align-items-center details">
                        <small>Chat bot</small>
                        <div class="typng">
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>
                        </div>
                    </div>
                </div>
            `);
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