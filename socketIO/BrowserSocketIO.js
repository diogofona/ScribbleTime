var socket = io("ws://localhost:8081");
var onListingPlayers = false;
var Pname;
var Proom;
var maxTime = 60;
var maxTime2 = 60;
var canvasHidden = true;
var wordRequested = null;
var host;
var once = false;
var delay = 0;
var originURL = "";
var words = [];
var order = "";
var playerCanvas = "";
var againONCE = false;

function createRoom() {
  console.log("CREATE ROOM");
  // Create new room
  socket.emit("comunication", {
    action: 0,
  });
  document.querySelector(".initOption").style.display = "none";
  document.querySelector(".createdRoom").style.display = "flex";

  socket.on("return_roomcode", function (roomcode) {
    console.log("chamou return");
    document.querySelector(".RoomCodeDisplay").textContent = roomcode;
	Proom = roomcode;
  });
  onListingPlayers = true;
}

function AddPlayerOnRoom() {
  //Inserir aqui um layout com os inputs e o botão onClick=entrar()
  document.querySelector(".initOption").style.display = "none";
  document.querySelector(".player--inputs").style.display = "flex";
}

function entrar() {
  const inputPlayerName = document.querySelector(".playername").value;
  const inputCode = document.querySelector(".code").value;

  socket.emit("comunication", {
    action: 1,
    data: {
      roomCode: inputCode,
      playerName: inputPlayerName,
    },
  });
  document.querySelector(".player--inputs").style.display = "none";
  onListingPlayers = true;
  Pname = inputPlayerName;
  Proom = inputCode;
}

socket.on("listplayers", function (listplayers) {
  if (onListingPlayers == true) {
    console.log("chamou list players");
    document.querySelector(".listPlayersOnRoom").style.display = "flex";
    const divs = document.querySelector(".listplayers");
    const divs2 = document.querySelector(".listplayers2");

    while (divs.firstChild) {
      divs.removeChild(divs.firstChild);
    }
    while (divs2.firstChild) {
      divs2.removeChild(divs2.firstChild);
    }

    var player;
    var player2;
    for (var i = 0; i < listplayers.length; i++) {
      player = document.createElement("P");
      player.innerText = listplayers[i].playerName+ "  -  " + listplayers[i].score;
      console.log(player.innerText);
      player2 = player;
      divs2.appendChild(player2);
    }

    for (var i = 0; i < listplayers.length; i++) {
      player = document.createElement("P");
      player.innerText = listplayers[i].playerName;
      console.log(player.innerText);
      divs.appendChild(player);
    }
  }
  checkForPlayersReady();
});

function checkForPlayersReady() {
  socket.on("playercount", function (playercount) {
    if (playercount >= 2) {
      //alert('O jogo vai começar dentro de 5segundos');
      setTimeout(gamestart, 1000);
    }
  });
}

function gamestart() {
  document.querySelector(".listPlayersOnRoom").style.display = "none";
  document.querySelector(".createdRoom").style.display = "none";

  this.maxTime = 15;
  setTimeout(AddCanvas, this.maxTime*1000);
  requestWord();
}

setInterval(function countDown() {
  if (this.maxTime >= 0) {
    document.querySelector(".timer").innerText = this.maxTime;
    this.maxTime--;
  } else if(this.canvasHidden == true) {
	//document.querySelector(".canvas-holder").style.display = "none";
	this.canvasHidden = true;
  }
}, 1000);

function answers() {}

function requestWord(){
	socket.emit("comunication", {
    action: 3,
		data: {
		  roomCode: Proom,
		},
	});
}

socket.on("returnWordRequest", function (data) {
	console.log("word recived ->" + data);
		if(data != "noneForHost" && wordRequested == null){
			console.log("inside reciver word ->" + data);
			this.wordRequested = data;
			document.querySelector(".canvas-holder").style.display = "flex";
			document.querySelector(".word-toDraw").innerHTML = this.wordRequested;
			this.canvasHidden = false;
		} else if(data == "noneForHost"){
			document.querySelector(".player-wait-draw").style.display = "flex";
			document.querySelector(".listPlayersOnRoom2").style.display = "flex";
			this.wordRequested = data;
		}
});

function AddCanvas(){
	saveCanvas();
}

function saveCanvas(){
	//console.log("chamou save canvas");
	var div = document.querySelector(".div1canvas");
	var divA = document.querySelector(".divcanvas");
	//var divURL = divA.toDataURL("image/png");
	var originalCanvas = document.getElementsByTagName("canvas")[0];
	//if(document.getElementsByTagName("canvas")[0] != null){console.log("0 -> ");console.log(document.getElementsByTagName("canvas")[0].toDataURL("image/png"));}
	//if(document.getElementsByTagName("canvas")[1] != null){console.log("1 -> ");console.log(document.getElementsByTagName("canvas")[1].toDataURL("image/png"));}
	var duplicatedCanvas = document.createElement("CANVAS");
	var ctx = duplicatedCanvas.getContext('2d');
	var originalURL = "";
	var Sonce = once;
	var delay = delay;
	var sockett = socket;
	var PProom = Proom;
	if(Sonce == false){
		console.log(PProom);
		originalURL = document.getElementsByTagName("canvas")[1].toDataURL("image/png");
		Sonce = true;
		this.once = true;
		delay = 0;
		if(document.getElementsByTagName("canvas")[1] != null){
			console.log("WAIT");
			setInterval(function countDown() {
				if(delay < 4){
					console.log("waiting delay-->" + delay);
					delay++;
				}
				else if(delay == 4){
					delay++;
					console.log("SAVING URL ->" + originalURL);
					console.log("SAVING URL ->" + PProom);
					sockett.emit("comunication", {
						action: 2,
							data: {
							canvas: originalURL,
							roomCode: PProom,
						},
					});
				}
			}, 1000);
		}
	}
	//duplicatedCanvas.getContext('2d').clearRect(0, 0, duplicatedCanvas.width, duplicatedCanvas.height);
}


socket.on('_returnHost', function(data){
	host = data.hostId;
	if(socket.id == host){
		document.querySelector(".wait-players").style.display = "none";
		var div = document.querySelector(".show-canvas");
		div.style.display = "flex";
		document.querySelector(".show-ans").style.display = "flex";
	} else {
		document.querySelector(".canvas-holder").style.display = "none";
	}
});

socket.on('_returnPlayer', function(data){
	playerCanvas = data.playerId;
	if(playerCanvas != socket.id && socket.id != host){
		document.querySelector(".show-ans2").style.display = "flex";
	} else {
		document.querySelector(".show-ans2").style.display = "none";
	}
});

socket.on('_returnWordR', function(data){
	words.push(data.wordR);
});

socket.on('_returnWordW', function(data){
	words.push(data.wordW);
	console.log(words);
});

socket.on('_order', function(data){
	order = data.SO;
	console.log("val to opt -> "+order);
	var A = document.querySelector(".btn_ans_A");
	var B = document.querySelector(".btn_ans_B");
	switch(order){
		case 0:
			if(A.text == "" || A.text == null){
				console.log("case 0");
				A.innerText = "A - "+words[0];
				B.innerText = "B - "+words[1];
			}
		break;
		case 1:
			if(A.text == "" || A.text == null){
				console.log("case 1");
				A.innerText = "A - "+words[1];
				B.innerText = "B - "+words[0];
			}
		break;
	}
});

socket.on('_returnCanvas', function(data) {
	//console.log("CANVAS -> "+data.canvas);
	
	var div = document.querySelector(".show-canvas");
	//div.style.display = "flex";
	var canvas = document.querySelector(".canvas-output");
	canvas.width = 800;
	canvas.height = 420;
	
	var img = new Image();
	img.onload = function(e){
		canvas.getContext('2d').drawImage(img, 0, 0);
		console.log("drawing?");
	};
	img.src = data.canvas;
	maxTime2 = 15;
	//againONCE = false;
	setInterval(function countDown() {
	  if (maxTime2 >= 0) {
		document.querySelector(".timer2").innerText = maxTime2;
		maxTime2--;
	  } else if(maxTime2 == -1){
		  maxTime2 = -5;
		  console.log("NEXT!!!!!!!!!!!");
			words = [];
			var A = document.querySelector(".btn_ans_A");
			var B = document.querySelector(".btn_ans_B");
			A.disabled = false;
			B.disabled = false;
			A.innerText = "";
			B.innerText = "";
		socket.emit("comunication", {
			action: 6,
				data: {
					roomCode: Proom,
				},
		});
		socket.emit("comunication", {
			action: 7,
				data: {
					roomCode: Proom,
				},
		});
	  }
	}, 1000);
});


function SelectA(){
	if(order == 0){
		socket.emit("comunication", {
			action: 5,
				data: {
					ans: true,
					roomCode: Proom,
				},
		});
	} else {
		socket.emit("comunication", {
			action: 5,
				data: {
					ans: false,
					roomCode: Proom,
				},
		});
	}
	var A = document.querySelector(".btn_ans_A2");
	var B = document.querySelector(".btn_ans_B2");
	A.disabled = true;
	B.disabled = true;
	A.style.backgroundColor = "#c7ccd4";
	A.style.background = "#c7ccd4";
}

function SelectB(){
	if(order == 0){
		socket.emit("comunication", {
			action: 5,
				data: {
					ans: false,
					roomCode: Proom,
				},
		});
	} else {
		socket.emit("comunication", {
			action: 5,
				data: {
					ans: true,
					roomCode: Proom,
				},
		});
	}
	var A = document.querySelector(".btn_ans_A2");
	var B = document.querySelector(".btn_ans_B2");
	A.disabled = true;
	B.disabled = true;
	B.style.backgroundColor = "#c7ccd4";
}

socket.on('_GameOver', function(data){
	if(maxTime2 < -3){
		var player = data.player;
		if(socket.id == host){
			//window.alert("O jogador - "+player.playerName+" GANHOU!");
			document.querySelector(".wait-players-win").style.display = "flex";
			document.querySelector(".show-ans").style.display = "none";
			document.querySelector(".show-ans2").style.display = "none";
			document.querySelector(".show-canvas").style.display = "none";
			document.querySelector(".wait-players-win").style.display = "flex";
			document.querySelector(".winner").innerText = "O jogador - "+ player.playerName +" GANHOU!";
		} else if(player.playerId == socket.id){
			//window.alert("Boa, GANHASTE!");
			document.querySelector(".show-final").style.display = "flex";
			document.querySelector(".final_S").innerText = "Boa, GANHASTE!";
			document.querySelector(".show-ans2").style.display = "none";
		} else {
			//window.alert("Infelizmente perdeste!");
			document.querySelector(".show-final").style.display = "flex";
			document.querySelector(".final_S").innerText = "Infelizmente perdeste!";
			document.querySelector(".show-ans2").style.display = "none";
		}
	}
});

