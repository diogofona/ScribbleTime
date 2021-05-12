var config = {
  type: Phaser.AUTO,
  parent: "conteudo",
  width: 1440,
  height: 700,
  backgroundColor: "#F0F0F0",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false, // -- true para ver as zonas de colisão, mais à frente
    },
  },
  loop: false,
  delay: 0,
  volume: 1,
  //scene: [IniciarJogo, CriarSala, AdicionarJogador, CenaLoad, CenaMundo],
  scene: {preload: preload, create: create, update: update, iniciarj: iniciarj},
};

var game = new Phaser.Game(config);

  function preload() { 
    //Logo
    this.load.image("scribbletime", "assets/ScribbleTime.png");

    //Botões
    this.load.image("btAdd", "assets/bt_addJogador.png");
    this.load.image("btCriarSala", "assets/bt_criarSala.png");
	
	this.load.image("input", "assets/input.png");

    this.load.image("barra", "assets/barra.png");

    this.load.image("entrar", "assets/bt_Submeter.png");
	
	this.j = 0;
	this.nomeplayer = "";
  }

  function create() {
	var GM = this; 
	//iniciarj(GM);
	iniciarjogador(GM);
	//console.log(this.j[0]["VARRRRR"]);
  }
  
  function update(){
	  
  }
  
  function iniciarj(GM){
	  this.j = new IniciarJogo(GM);
	  //console.log(this.GM);
	  console.log(this.j);
	  console.log("PAASSOU AQUI NO INICIAR JOGO");
	  //this.scene.start(this.j);
  }
  
  function iniciarjogador(GM){
	  this.j = new AdicionarJogador(GM);
	  //console.log(this.GM);
	  //console.log(this.j);
	  console.log("PAASSOU AQUI NO ADICIONAR JOGADOR");
	  //this.scene.start(this.j);
  }
  
  class IniciarJogo extends Phaser.Scene {
  constructor(GM) {
    super({ key: "IniciarJogo" });
	//this.VARRRRR = 0;
	this.create(GM);
  }
  
  create(GM) {
	let gm = GM;
    //Logo
    gm.add.image(720, 160, "scribbletime");

    //Botões
    gm.add
      .image(720, 492, "btAdd")
      .setInteractive()
      .on("pointerdown", () => this.btAdicionarJogador(gm));
    gm.add
      .image(720, 594, "btCriarSala")
      .setInteractive()
      .on("pointerdown", () => this.btCriarSala(gm));
	  
	  console.log("PAASSOU NO CREATE DO INIT JPOGO");
  }

  btAdicionarJogador(GM) {
    //this.scene.start("AdicionarJogador");
	
  }

  btCriarSala(GM) {
    //this.scene.start("CriarSala");
  }
}

class AdicionarJogador extends Phaser.Scene {
  constructor(GM) {
    super({ key: "AdicionarJogador" });
	this.create(GM);
  }

  create(GM) {
    //Código
    GM.add.image(720, 300, "input");
    GM.add.image(720, 400, "input");

    //Barra
    GM.add.image(1000, 664, "barra");

    var nomeJogador = GM.add.text(645, 285, "", {
      font: "32px Courier",
      fill: "#000000",
    });

    GM.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === 8 && nomeJogador.text.length > 0) {
        nomeJogador.text = nomeJogador.text.substr(
          0,
          nomeJogador.text.length - 1
        );
      } else if ( event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
        nomeJogador.text += event.key;
      }
    });
	
	//Botão
    GM.add
      .image(1330, 663, "entrar")
      .setInteractive()
      .on("pointerdown", () => this.btEntrar(GM, nomeJogador.text));
  }

  btEntrar(GM, nomeJogador) {
	console.log("CLICOU EM ENTRAR - " + nomeJogador);
	GM.nomeplayer = nomeJogador;
  }
}
