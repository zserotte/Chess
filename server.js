const io = require('socket.io')();

let users = {};
let currentUsers = {};
let onlineGame = {};

class user {
    constructor(username) {
        this.username = username;
        this.wins = 0;
        this.losses = 0;
        this.friends = [];
    }
}

io.on('connection', (client) => {
    console.log("You are connected");

    client.on('sendMessage', (data) => {
        console.log(data.sender);
        console.log('client is sending the message ' + data.message);
        io.to(currentUsers[data.otherUser]).emit('submitMessage', {message:data.message, sender:data.sender});
        io.to(currentUsers[data.sender]).emit('submitMessage', {message:data.message, sender:data.sender});
    });

    client.on('friendUser', (data) => {
        console.log("You are inside frienduser on server");
        users[data.user].friends.push(data.otherUser);
        console.log(data.otherUser);
        console.log(users[data.user].friends[0]);
    });

    client.on('Login', (username) => {
        console.log('client is attempting loggin as ', username);
        if (typeof currentUsers[username] == "undefined") {
            if (typeof users[username] == "undefined") {
                console.log("User: " + username + " was created with socket.id: " + client.id)
                let currentUser = new user(username);
                console.log("CurrentUser is ", currentUser);
                users[username] = currentUser;
                console.log(users[username]);
            }
            else {
                console.log("Person already created");
            }
            currentUsers[username] = client.id;
            client.emit("loginResults", {success: true});
        }
        else {
            client.emit("loginResults", {success: false});
        }
    });

    client.on('PlayOnline', (username) => {
        // console.log('Client' + username + 'looking to play an online game');
        // console.log(onlineGame.length);
        let keys = Object.keys(onlineGame);
        if (keys[0] != null) {
            console.log('Found another player');
            io.to(onlineGame[keys[0]]).emit('JoinOnline', {color: "White", otherUser: username});
            client.emit('JoinOnline', {color: "Black", otherUser: keys[0]});
            onlineGame = {};
        }
        else {
            console.log('Im the only player');
            onlineGame[username] = client.id;
        }
    });

    client.on('passMove', (data) => {
        console.log('inside passMove on server');
        io.to(currentUsers[data.recipient]).emit('recieveMove', {i:data.i, color:data.color});
    });

    client.on('disconnect', ()=>{
		for(var user in currentUsers) {
			if(currentUsers[user] == client.id) {
				console.log('Disconnected User:' + user + ' of ID: ' + currentUsers[user]);
				delete currentUsers[user];
			}
		}
		console.log('disconnected from user');
    });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);