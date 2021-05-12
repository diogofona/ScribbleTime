const ACTIONSTYPES = require("./../enum/actionsTypes");

class ManageSocketIO {
  rooms = [];
  players = [];
  canvas = [];
  wordPool = [];
  hostSocket = "";
  SENT = false;
  calledOnce = false;
  onceonce = false;
  onceonceN = 0;


  constructor(io) {
    console.log("Instance");
    io.on("connection", (socket) => {
      console.log("CONNECT ->", socket.id);

      socket.on("comunication", (information) => {
        switch (information.action) {
          case ACTIONSTYPES.CREATE_ROOM:
            this.createRoom(socket);
            break;
          case ACTIONSTYPES.ADD_PLAYER:
            this.AddPlayer(information.data, socket, io);
			break;
		  case ACTIONSTYPES.SAVE_CANVAS:
            this.AddCanvas(information.data, socket, io);
			break;
		  case ACTIONSTYPES.REQUEST_WORD:
            this.wordSelector(information.data, socket, io);
			break;
		  case ACTIONSTYPES.POINTS:
            this.UpdateScore(information.data, socket, io);
			break;
		  case ACTIONSTYPES.END_TURN:
            this.CallNextTurn(information.data, socket, io);
			this.onceonce = false;
			break;
        }
      });

      socket.on("disconnecting", () => {
		var byePlayerName = "";
		var byePlayerRoom = "";
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i].playerId == socket.id){
				byePlayerName = this.players[i].playerName;
				byePlayerRoom = this.players[i].RoomCode;
				//delete this.players[i];
				this.players.splice(i, 1);
				break;
			}
		}
		if(byePlayerName != ""){ console.log("Disconect -> "+ socket.id +" -> player -> "+ byePlayerName);  }
		else{ console.log("Disconect -> "+ socket.id +" -> not player"); }
		io.emit('listplayers', this.players);
      });
    });
  }

  createRoom(socket) {
    // Generate random code to identify the room
    var generateRandomCode = Math.floor(1000 + Math.random() * 9000);
    // Add new room
    this.rooms.push({
      code: generateRandomCode,
    });
	console.log("Room created at -> "+ this.rooms[0].code);
	socket.emit('return_roomcode', generateRandomCode);
	this.hostSocket = socket;
  }

  AddPlayer(data, socket, io) {
    var roomCode = data.roomCode;
	var roomFound = false;
	for(var i = 0; i < this.rooms.length; i++){
		if(this.rooms[i].code == roomCode){
			roomFound = true;
		}
	}
	if(roomFound == true){
		var playerName = data.playerName;
		var playerObject = {
		  playerId: socket.id,
		  roomCode,
		  playerName,
		  score: 0,
		  word: "",
		  canvas: "",
		  canvasUsed: false,
		};
		// Add new player
		this.players.push(playerObject);
		// Send to other players
		socket.broadcast.emit(playerObject);
		// Send room information to current connection
		var playersOnRoom = this.players.filter((f) => f.roomCode == roomCode);
		socket.send(playersOnRoom);
		console.log("created player -> " + playerName + " -> to room -> " + roomCode);
		this.listPlayers(this.players, roomCode, socket, io);
	}else{
		console.log("Room not found -> " + roomCode);
	}
  }
  
  listPlayers(players, RoomCode, socket, io){
	var roomCode = RoomCode;
	var listplayers = [];
	var listplayersScore = [];
	for(var i = 0; i < this.players.length; i++){
		if(this.players[i].roomCode == roomCode){
			console.log("player -> " + this.players[i].playerName + " -> awaiting in room -> " + this.players[i].roomCode);
			listplayers.push(this.players[i]);
		}
	}
	io.emit('listplayers', listplayers);
	io.emit('playercount', listplayers.length);
  }
  
    // Lista de palavras para desenhar e as respectivas opções
  wordPool = [
    {
        "word"  : "GATO",
        "optionR" : "GATO",
		"optionW" : "CAO"
    },

    {
        "word"  : "GALINHA",
        "optionR" : "GALINHA",
		"optionW" : "PASSARO"
    },

    {
        "word"  : "MACACO",
        "optionR" : "MACACO",
		"optionW" : "GORILA"
    },

    {
        "word"  : "CAVALO",
        "optionR" : "CAVALO",
		"optionW" : "ZEBRA"
    },

    {
        "word"  : "TIGRE",
        "optionR" : "TIGRE",
		"optionW" : "LEAO"
    },

    {
        "word"  : "PANTERA",
        "optionR" : "PANTERA",
		"optionW" : "CHITA"
    },

    {
        "word"  : "BUFALO",
        "optionR" : "BUFALO",
		"optionW" : "VACA"
    },

    {
        "word"  : "HIPOPOTAMO",
        "optionR" : "HIPOPOTAMO",
		"optionW" : "RINOCERONTE"
    },

    {
        "word"  : "CISNE",
        "optionR" : "CISNE",
		"optionW" : "PATO"
    },

    {
        "word"  : "BALEIA",
        "optionR" : "BALEIA",
		"optionW" : "ORCA"
    }
]
	WP = [
    {
        "word"  : "GATO",
        "optionR" : "GATO",
		"optionW" : "CAO"
    },

    {
        "word"  : "GALINHA",
        "optionR" : "GALINHA",
		"optionW" : "PASSARO"
    },

    {
        "word"  : "MACACO",
        "optionR" : "MACACO",
		"optionW" : "GORILA"
    },

    {
        "word"  : "CAVALO",
        "optionR" : "CAVALO",
		"optionW" : "ZEBRA"
    },

    {
        "word"  : "TIGRE",
        "optionR" : "TIGRE",
		"optionW" : "LEAO"
    },

    {
        "word"  : "PANTERA",
        "optionR" : "PANTERA",
		"optionW" : "CHITA"
    },

    {
        "word"  : "BUFALO",
        "optionR" : "BUFALO",
		"optionW" : "VACA"
    },

    {
        "word"  : "HIPOPOTAMO",
        "optionR" : "HIPOPOTAMO",
		"optionW" : "RINOCERONTE"
    },

    {
        "word"  : "CISNE",
        "optionR" : "CISNE",
		"optionW" : "PATO"
    },

    {
        "word"  : "BALEIA",
        "optionR" : "BALEIA",
		"optionW" : "ORCA"
    }
]
	
	
  wordSelector(data, socket, io){
	var roomCode = data.roomCode;
	var selectedWordIndex = 0;
	if(socket.id != this.hostSocket.id){
		selectedWordIndex = Math.floor(Math.random() * this.WP.length);
		//console.log("selected word index ->"+selectedWordIndex);
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i].playerId == socket.id && this.players[i].word == ""){
				
				socket.emit('returnWordRequest', this.WP[selectedWordIndex].word);
				console.log(this.players[i].playerName+" -> "+this.WP[selectedWordIndex].word);
				this.players[i].word = this.WP[selectedWordIndex].word;
				this.WP.splice(selectedWordIndex, 1);
				break;
			}
		}
	} else {
		socket.emit('returnWordRequest', "noneForHost");
	}
  }
  
  AddCanvas(data, socket, ios){
	var RCode = data.roomCode;
	var wordindex = 0;
	var NN = 0;
	var sent = this.SENT;
	var once = this.calledOnce;
	var io = ios;
	var players = this.players;
	var wordPool = this.wordPool;
	var hostSocket = this.hostSocket;
	for(var i = 0; i < this.players.length; i++){
		if(this.players[i].playerId == socket.id && this.players[i].canvas == ""){
			this.players[i].canvas = data.canvas;
			console.log("canvas saved!!!!!");
			//console.log(data.canvas);
			if(this.calledOnce == false){
				this.calledOnce = true;
				setInterval(function countDown() {
					if(NN < 4){
						NN++;
						console.log("NN -> "+NN);
					}
					if(NN < 7){
						NN++;
						if(once == false){
							console.log("-------->");
							once = true;
							console.log("ENTROU NO CALLBACKCANVAS");
								for(var i = 0; i < players.length; i++){
									//console.log("->" + this.players[i].roomCode + " =?= "+ RCode +" -----> usedcanvas=? "+ this.players[i].canvasUsed);
									if(players[i].roomCode == RCode && players[i].canvasUsed == false){
										//console.log("prepare to send back canvas");
										//console.log("WP.length"+this.wordPool.length);
										for(var n = 0; n < wordPool.length; n++){
											if(players[i].word == wordPool[n].word){
												//console.log(this.players[i].word +" --> against wordPool --> "+ this.wordPool[n].word);
												wordindex = n;
												//break;
											}
										}
										if(sent == false){
											sent = true;
											console.log("host -> " + hostSocket.id);
											io.emit('_returnHost', {hostId: hostSocket.id});
											console.log("player -> " + players[i].playerName);
											io.emit('_returnPlayer', {playerId: players[i].playerId});
											console.log("wordR -> " + wordPool[wordindex].word);
											io.emit('_returnWordR', {wordR: wordPool[wordindex].word});
											console.log("wordW -> " + wordPool[wordindex].optionW);
											io.emit('_returnWordW', {wordW: wordPool[wordindex].optionW});
											console.log("canvas -> " + players[i].canvas);
											io.emit('_returnCanvas', {canvas: players[i].canvas});
											var selectedOption = Math.floor(Math.random() * 2);
											io.emit('_order', {SO: selectedOption});
											players[i].canvasUsed = true;
											console.log("Returning the Canvas data made by player -> " + players[i].playerName);
											break;
										}
									}
								}
						}
					}
				},1000);
				//this.CallBackCanvas(data, socket, io, RCode, wordindex);
			}
			break;
		}
	}
  }
  
  CallBackCanvas(data, socket, io, RCode, wordindex){
	//if(socket.id == this.hostSocket.id){
		console.log("ENTROU NO CALLBACKCANVAS");
		this.calledOnce = true;
		for(var i = 0; i < this.players.length; i++){
			//console.log("->" + this.players[i].roomCode + " =?= "+ RCode +" -----> usedcanvas=? "+ this.players[i].canvasUsed);
			if(this.players[i].roomCode == RCode && this.players[i].canvasUsed == false){
				//console.log("prepare to send back canvas");
				//console.log("WP.length"+this.wordPool.length);
				for(var n = 0; n < this.wordPool.length; n++){
					if(this.players[i].word == this.wordPool[n].word){
						//console.log(this.players[i].word +" --> against wordPool --> "+ this.wordPool[n].word);
						wordindex = n;
						//break;
					}
				}
				if(this.SENT == false){
					this.SENT = true;
					console.log("host -> " + this.hostSocket.id);
					io.emit('_returnHost', {hostId: this.hostSocket.id});
					console.log("player -> " + this.players[i].playerName);
					io.emit('_returnPlayer', {playerId: this.players[i].playerId});
					console.log("wordR -> " + this.wordPool[wordindex].word);
					io.emit('_returnWordR', {wordR: this.wordPool[wordindex].word});
					console.log("wordW -> " + this.wordPool[wordindex].optionW);
					io.emit('_returnWordW', {wordW: this.wordPool[wordindex].optionW});
					console.log("canvas -> " + this.players[i].canvas);
					io.emit('_returnCanvas', {canvas: this.players[i].canvas});
					var selectedOption = Math.floor(Math.random() * 2);
					io.emit('_order', {SO: selectedOption});
					this.players[i].canvasUsed = true;
					console.log("Returning the Canvas data made by player -> " + this.players[i].playerName);
					break;
				}
			}
		}
	//}
  }
  
	UpdateScore(data, socket, io){
		var bool = data.ans;
		var RCode = data.roomCode;
		for(var i = 0; i < this.players.length; i++){
			if(this.players[i].playerId == socket.id && bool == true){
				this.players[i].score += 10;
				break;
			}
		}
		this.listPlayers(this.players, RCode, socket, io);
	}
	
	CallNextTurn(data, socket, ios){
		if(this.onceonce == false){
			this.onceonce = true;
			var RCode = data.roomCode;
			//console.log("RC-----> "+RCode);
			var wordindex = 0;
			var NN = 0;
			var sent = this.SENT = false;
			var once = this.calledOnce = false;
			var io = ios;
			var players = this.players;
			var wordPool = this.wordPool;
			var hostSocket = this.hostSocket;
			var onceN = this.onceonceN;
			//console.log("calledonce? -> " + once + "  -----> " + sent);
			setInterval(function countDown() {
				if(NN < 4){
					NN++;
					console.log("NN -> "+NN);
				}
				if(NN == 4){
					var okok = 0;
					NN++;
					//console.log("calledonce? -> " + once);
					if(once == false){
						console.log("-------->");
						once = true;
						console.log("ENTROU NO CALLBACKCANVAS");
							for(var i = 0; i < players.length; i++){
								//console.log("->" + this.players[i].roomCode + " =?= "+ RCode +" -----> usedcanvas=? "+ this.players[i].canvasUsed);
								if(players[i].roomCode == RCode && players[i].canvasUsed == false){
									//console.log("prepare to send back canvas");
									//console.log("WP.length"+this.wordPool.length);
									for(var n = 0; n < wordPool.length; n++){
										if(players[i].word == wordPool[n].word){
											//console.log(this.players[i].word +" --> against wordPool --> "+ this.wordPool[n].word);
											wordindex = n;
											//break;
										}
									}
									if(sent == false){
										sent = true;
										console.log("host -> " + hostSocket.id);
										io.emit('_returnHost', {hostId: hostSocket.id});
										console.log("player -> " + players[i].playerName);
										io.emit('_returnPlayer', {playerId: players[i].playerId});
										console.log("wordR -> " + wordPool[wordindex].word);
										io.emit('_returnWordR', {wordR: wordPool[wordindex].word});
										console.log("wordW -> " + wordPool[wordindex].optionW);
										io.emit('_returnWordW', {wordW: wordPool[wordindex].optionW});
										console.log("canvas -> " + players[i].canvas);
										io.emit('_returnCanvas', {canvas: players[i].canvas});
										var selectedOption = Math.floor(Math.random() * 2);
										io.emit('_order', {SO: selectedOption});
										players[i].canvasUsed = true;
										console.log("Returning the Canvas data made by player -> " + players[i].playerName);
										okok++;
										break;
									}
								}
								if(okok == 0 && i == players.length -1 && sent == false){
										sent = true;
										var maxP = -1;
										var playerWIN = [];
										for(var i = 0; i < players.length; i++){
											if(players[i].score > maxP){ 
												maxP = players[i].score; 
												playerWIN = players[i];
											}
										}
										console.log("--------------> FIM! <--------------");
										io.emit('_GameOver', {player: playerWIN});
								}
							}	
					}
				}
			}, 1000);	
		}
	}
	
	

}

module.exports = ManageSocketIO;
