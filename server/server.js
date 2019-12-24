var express = require('express.io');
var server = express();
server.http().io();
var PORT = 3000
console.log('server started on port ' + PORT);

server.use(express.static(__dirname + '/public'));

server.get('/', function(req, res){
	res.render('index.ejs');
});

//joined room
server.io.route('ready', function(req) {
    req.io.join(req.data.chat_room)
    req.io.join(req.data.signaling_room)
    server.io.room(req.data).broadcast('announce', {
        message: 'New client in the ' + req.data + ' room'
    })
})

//chat
server.io.route('send', function(req) {
    server.io.room(req.data.room).broadcast('message', {
        message: req.data.message,
        author: req.data.author
    });
})

//signaling
server.io.route('signal', function(req) {
    req.io.room(req.data.room).broadcast('signaling_message', {
        type: req.data.type,
        message: req.data.message
    });
})

server.listen(PORT);