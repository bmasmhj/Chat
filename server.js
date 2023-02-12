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
  const nlp = dock.get('nlp');
  await nlp.addCorpus('./corpus-en.json');
  await nlp.train();
  io.on("connection", (socket) => {
      socket.on("new-nlp-message", (message) => {
          const msg = message.text;
          add_chatbotmsg(message.socket_sender, msg, 'outgoing');
          nlp.process('en', message.text).then((value) => {
            // console.log(value['answer']);
            // console.log(value['answers']);
              if (value['answers'].length > 0 && value['answers'] != undefined) {
                const ans = value['answer'];
                function encodeHTML(str) {
                    return str.replace(/[<>&"'`!*]/g, function (c) {
                        return `&#${c.charCodeAt(0)};`;
                    });
                }
                  add_chatbotmsg(message.socket_sender, encodeHTML(ans), 'incoming');
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
              } else {
                const ans = "Sorry, I don't understand";
                function encodeHTML(str) {
                    return str.replace(/[<>&"'`!*]/g, function (c) {
                        return `&#${c.charCodeAt(0)};`;
                    });
                }
                  add_chatbotmsg(message.socket_sender,  encodeHTML(ans) , 'incoming');
                  socket.emit("new-nlp-message", {
                        text: ans ,
                        type : "bot",
                        socket_sender: message.socket_sender
                    });
                  socket.broadcast.emit("new-nlp-message", {
                        text: ans ,
                        type : "bot",
                        socket_sender: message.socket_sender
                  });
                  socket.broadcast.emit("new-nlp-message", {
                        text: msg,
                        type : "user",
                        socket_sender: message.socket_sender
                    });
              }
          });
      });


    socket.on("user-connected", (user) => {
      users[socket.id] = { user, id: socket.id };
      socket.broadcast.emit("users-online", Object.values(users));
      // console.log("user-connected", users);    
    });


    socket.on("new-chat-message", (message) => {
      // console.log("new-chat-message", message);
      socket.broadcast.emit("users-online", Object.values(users));
      addmessage(message.socket_sender , message.text )
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
        if (objects.user.username) {
          console.log("user-went-off" , objects.user.username);
        }
      } catch(error) {
        console.error(error);
        console.log('No-user to disconnect')
      }
      delete users[socket.id];
      socket.broadcast.emit("users-online", Object.values(users));
      // console.log("users-online", users);
    });

  });
}
startNLP()

server.listen(3000, () => {
  // console.log("listening on 3000");
});
