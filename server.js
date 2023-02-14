const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const io = new Server(server);
var cors = require('cors')
app.use(cors())
const users = {};

const getmessage = require('./src/messages/getdata.js').getmessage;
const getmymessage = require('./src/chatbot/getdata.js').getmymessage;
const getuser = require('./src/messages/getdata.js').getuser;
const loginuser = require('./src/login/login.js').loginuser;
const login_user = require('./src/login/login.js').login_user;
const signup = require('./src/login/signup.js').signup;
const verify_user = require('./src/login/verifycode.js').verify_user;
const addmessage = require('./src/messages/addmessage.js');
const add_chatbotmsg = require('./src/chatbot/chatbot.js');
const train_to_db = require('./src/chatbot/train_chatbot.js');

const axios = require('axios');


app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});
app.get("/verify", (req, res) => {
  res.sendFile(__dirname + "/public/verify.html");
});
app.get("/nlpbot", (req, res) => {
  res.sendFile(__dirname + "/public/nlpbot.html");
});

app.get("/users", (_, res) => {
  res.send(Object.values(users));
});
app.get('/get-chat', getmessage);
app.get('/get-user', getuser);  

app.use(bodyParser.json());
app.post('/get-my-chat', getmymessage);
app.post('/login-user', login_user);
app.post('/signup-user', signup);
app.post('/loginuser', loginuser);
app.post('/verify-user', verify_user);
const { dockStart } = require('@nlpjs/basic');

async function startNLP() {
  const dock = await dockStart({ use: ['Basic']});
  const nlp_bot = dock.get('nlp');
  await nlp_bot.addCorpus('https://api.bimash.com.np/chatbot/dataset.php');
  await nlp_bot.train();
  io.on("connection", (socket) => {
    const moment = require('moment-timezone');
    function time_stamp() {
      const now = moment.tz('Asia/Kathmandu');
      const mysqlTimestamp = now.format('YYYY-MM-DD HH:mm:ss');
      return mysqlTimestamp;
    }
    socket.on("new-nlp-message", (message) => {
      const msg = message.text;
        var now_time = time_stamp();
        add_chatbotmsg(message.socket_sender, msg, 'outgoing' , now_time);
        nlp_bot.process('en', message.text).then((value) => {
          console.log(value['answer']);
          console.log(value['answers']);
            if (value['answers'].length > 0 && value['answers'] != undefined && value['answer']!='' ) {
              var ans = value['answer'];
              if (ans.includes('websearch')) {
                findinweb(msg);
              } else {
                sendsocketmsg(value['answer'])
              }
            } else {
                findinweb(msg);
          }
          function sendsocketmsg(ans) {
            try {
                var now_time = time_stamp();
                add_chatbotmsg(message.socket_sender, ans, 'incoming' , now_time);
                  socket.emit("new-nlp-message", {
                    text: ans,
                    type : "bot",
                      socket_sender: message.socket_sender
                  });
                  socket.broadcast.emit("new-nlp-message", {
                        text: ans,
                        type : "bot",
                        socket_sender: message.socket_sender
                  });
                  socket.broadcast.emit("new-nlp-message", {
                        text: msg,
                        type : "user",
                        socket_sender: message.socket_sender
                    });
            } catch {
                var now_time = time_stamp();
              add_chatbotmsg(message.socket_sender, 'Something went wrong', 'incoming', now_time);
                socket.emit("new-nlp-message", {
                    text: 'Something went wrong',
                    type : "bot",
                      socket_sender: message.socket_sender
                  });
                  socket.broadcast.emit("new-nlp-message", {
                        text: 'Something went wrong',
                        type : "bot",
                        socket_sender: message.socket_sender
                  });
                  socket.broadcast.emit("new-nlp-message", {
                        text: msg,
                        type : "user",
                        socket_sender: message.socket_sender
                    });

            }
          }
          function findinweb(qur) {
            const nlp = require('compromise');
            console.log('Searching web..');
              axios({
                    method: 'get',
                    url: 'https://api.bimash.com.np/chatbot/scrapper.php?q='+qur,
                  })
                  .then(function (response) {
                      // console.log(response)
                      var docx = nlp(qur);
                      var json = JSON.stringify(docx.nouns().text());
                    var intent = json.toLowerCase().trim().replaceAll('"', '').replaceAll(' ', '');
                    console.log(`Intent = ${intent} , utterances = ${qur} , answer =  ${response.data}`)
                    nlp_bot.addLanguage('en');
                    nlp_bot.addDocument('en', qur , `question.${intent}`);
                    nlp_bot.addAnswer('en', `question.${intent}`, response.data);
                    nlp_bot.train();
                    train_to_db( intent , qur , response.data);
                      sendsocketmsg(response.data)
                  });
          }
        });
    });


    socket.on("user-connected", (user) => {
      users[socket.id] = { user, id: socket.id };
      socket.broadcast.emit("users-online", Object.values(users));
      console.log("user-connected", users);    
    });


    socket.on("new-chat-message", (message) => {
      // console.log("new-chat-message", message);
      socket.broadcast.emit("users-online", Object.values(users));
      var now_time = time_stamp();

      addmessage(message.socket_sender , message.text , now_time )
      socket.broadcast.emit("new-chat-message", {
        text: message.text,
        socket_sender : message.socket_sender,
        username : message.username,
        picture : message.picture,

      });
    });
      
      
  
    
    socket.on("disconnect", () => {
      const objects = users[socket.id];
      try {
        if (objects) {
          delete users[socket.id];
          console.log("user-went-off" , objects);
        }
      } catch(error) {
        console.error(error);
        console.log('No-user to disconnect')
      }
      socket.broadcast.emit("users-online", Object.values(users));
      // console.log("users-online", users);
    });

  });
}
startNLP()

server.listen(3000, () => {
  // console.log("listening on 3000");
});
