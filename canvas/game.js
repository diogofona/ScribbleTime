//var socket = io("ws://localhost:8081");

//-- Configuration of the Game basics
var config = {
	type	: Phaser.CANVAS,
	parent	: 'conteudo',
	width: 800,
    height: 600,
	//zoom	: 1,
	pixelArt: true,
	physics	: {
		default	: 'arcade',
		arcade	: {
			gravity	: { y: 0 },
			debug 	: false
		}
	},
scene :	{preload: preload, create: create, update: update, iniciarcanvas: iniciarcanvas}
}

var game = new Phaser.Game(config);

function preload() { 
	this.canvas = 0;
  }

  function create() {
	var GM = this; 
	iniciarcanvas(GM);
  }
  
  function update(){
	  
  }
  
  function iniciarcanvas(GM){
	  this.canvas = new InitialCanvas(GM);
	  //console.log(this.GM);
	  console.log("CANVAS OPEN");
  }
  
  
class InitialCanvas extends Phaser.Scene {

	constructor(GMs){
		super({ key: "InitialScreenPU" });
		this.GM = GMs;
        this.pointsX = [];
		this.pointsY = [];
        this.count = 0;
		this.oldLineEXP = 4;
		this.lineEXP = 4;
		this.colors = [];
		this.timeout = 0;
		this.maxTimeout = 1000;
		this.justChanged = false;
		this.colors[0] = '0x000000';
		this.colors[1] = '0xFFFFFF';
		this.colors[2] = '0xFF0000';
		this.colors[3] = '0x00FF00';
		this.colors[4] = '0x0000FF';
		this.create(GMs);
	}
	

	preload(){
		
	}
		
	
	create(GM){
		
		GM.cameras.main.setBackgroundColor('#FFFFFF');
		//this.add.rectangle(0, 0, 1900, 1200, '0xFFFFF1');
		GM.add.rectangle(800/2, 600, 800, 180, '0xD9D9DB');
		//var canvasRect = this.add.rectangle(0, 0, 100, this.height, 0x000000);
		this.canvas = GM.add.graphics().fillStyle(0xffffff).lineStyle(4, '0x000000');
		 
		const prev = new Phaser.Math.Vector2();

        const hsl = Phaser.Display.Color.HSVColorWheel();
		//var rgb = Phaser.Color.createColor(0,0,0);

        this.colorIndex = 0;
		this.oldColorIndex = 0;
		this.lines = [];
		this.cols = [];
		this.sizes = [];
		
		//Elipse das cores
		this.elliColor = GM.add.ellipse(50, 600 - 40, 40, 40, this.colors[this.colorIndex]);
		//this.canvas.strokeCircle(50, 600 - 50, 20);
		this.elliColor.setInteractive();
		this.colorBox = GM.add.rectangle(150, 600 - 120, 250, 50, '0xA3B1A3');
		this.colorBox.setInteractive();
		this.colorBlack = GM.add.ellipse(50, 600 - 120, 35, 35, '0x000000');
		this.colorBlack.setInteractive();
		this.colorWhite = GM.add.ellipse(50*2, 600 - 120, 35, 35, '0xFFFFFF');
		this.colorWhite.setInteractive();
		this.colorRed = GM.add.ellipse(50*3, 600 - 120, 35, 35, '0xFF0000');
		this.colorRed.setInteractive();
		this.colorGreen = GM.add.ellipse(50*4, 600 - 120, 35, 35, '0x00FF00');
		this.colorGreen.setInteractive();
		this.colorBlue = GM.add.ellipse(50*5, 600 - 120, 35, 35, '0x0000FF');
		this.colorBlue.setInteractive();
		//Linha da espessura
		this.lineSize = GM.add.rectangle(50 + 3*this.elliColor.width, 600 - 40, 100, this.lineEXP, this.colors[this.colorIndex]);
		//this.strokeR = this.canvas.strokeRect(50 + 3*this.elliColor.width - 50, 550 - this.lineEXP/2, 100, this.lineEXP);
		this.lineSize.setInteractive();
		this.lineBox = GM.add.rectangle(50 + 3*this.elliColor.width, 420, 130, 170, '0xA3B1A3');
		this.lineBox.setInteractive();
		this.lineSize1 = GM.add.rectangle(50 + 3*this.elliColor.width, 490, 100, 1, this.colors[this.colorIndex]);
		this.lineSize1.setInteractive();
		this.lineSize2 = GM.add.rectangle(50 + 3*this.elliColor.width, 455, 100, 4, this.colors[this.colorIndex]);
		this.lineSize2.setInteractive();
		this.lineSize3 = GM.add.rectangle(50 + 3*this.elliColor.width, 425, 100, 7, this.colors[this.colorIndex]);
		this.lineSize3.setInteractive();
		this.lineSize4 = GM.add.rectangle(50 + 3*this.elliColor.width, 398, 100, 10, this.colors[this.colorIndex]);
		this.lineSize4.setInteractive();
		this.lineSize5 = GM.add.rectangle(50 + 3*this.elliColor.width, 365, 100, 13, this.colors[this.colorIndex]);
		this.lineSize5.setInteractive();
		// Hide'em
		this.hideColorBox();
		this.hideLineBox();
		
		// Call options
		this.SHColors();
		this.pickColor();
		this.SHLines();
		this.pickSize();
		
			GM.input.on('pointerdown', (pointer) => {
				if(this.colorBox.visible == false && this.lineBox.visible == false){
					if(this.justChanged == false) {
						prev.x = pointer.x;
						prev.y = pointer.y;
					
						this.pointsX.push(pointer.x - 1);
						this.pointsY.push(pointer.y - 1);
						this.cols.push(this.colors[this.colorIndex]);
						this.sizes.push(this.lineEXP);

						this.canvas.fillStyle(this.colors[this.colorIndex]);
						this.canvas.fillRect(pointer.x - 1, pointer.y - 1, this.lineEXP, this.lineEXP);	
						//console.log("DRAWING");
					} else { this.justChanged = false; }
				}
			});
	  
			GM.input.on('pointermove', (pointer) => {
				if(this.colorBox.visible == false && this.lineBox.visible == false){
					if (pointer.isDown)
					{
						if(this.justChanged == false) {
							const x = pointer.x;
							const y = pointer.y;
					
							prev.x = x;
							prev.y = y;

							this.pointsX.push(pointer.x - 1);
							this.pointsY.push(pointer.y - 1);
							this.cols.push(this.colors[this.colorIndex]);
							this.sizes.push(this.lineEXP);
					
							this.canvas.fillRect(pointer.x - 1, pointer.y - 1, this.lineEXP, this.lineEXP);
						} else { this.justChanged = false; }
					}
				} 
			});
    
        GM.input.on('pointerup', () => {
			this.setFundation();
        });

        //this.add.text(10, 10, 'ScribbleTime', { font: '16px Courier', fill: '#ffffff' }).setShadow(1, 1).setDepth(1);
    }
	
	
	setFundation() {
		//console.log("clear");
        this.GM.add.rectangle(800/2, 600, 800, 180, '0xD9D9DB');
		this.elliColor = this.GM.add.ellipse(50, 600 - 40, 40, 40, this.colors[this.colorIndex]);
		this.lineSize = this.GM.add.rectangle(50 + 3*this.elliColor.width, 600 - 40, 100, this.lineEXP, this.colors[this.colorIndex]);
		
		if(this.colorBox.visible == true){
			this.showColorBox();
		}
		if(this.lineBox.visible == true){
			this.showLineBox();
		}
	}
	
	showColorBox(){
		this.colorBox.visible = true;
			this.colorBlack.visible = true;
			this.colorWhite.visible = true;
			this.colorRed.visible = true;
			this.colorGreen.visible = true;
			this.colorBlue.visible = true;
		this.hideLineBox();	
	}
	
	hideColorBox(){
		this.colorBox.visible = false;
				this.colorBlack.visible = false;
				this.colorWhite.visible = false;
				this.colorRed.visible = false;
				this.colorGreen.visible = false;
				this.colorBlue.visible = false;
		this.justChanged = true;
	}
	
	showLineBox() {
		this.lineBox.visible = true;
			this.lineSize1.visible = true;
			this.lineSize2.visible = true;
			this.lineSize3.visible = true;
			this.lineSize4.visible = true;
			this.lineSize5.visible = true;
		this.hideColorBox();
	}
	
	hideLineBox() {
		this.lineBox.visible = false;
			this.lineSize1.visible = false;
			this.lineSize2.visible = false;
			this.lineSize3.visible = false;
			this.lineSize4.visible = false;
			this.lineSize5.visible = false;
		this.justChanged = true;	
	}
	
	SHColors(){
		this.elliColor.on("pointerdown", (pointer) => {
			if(this.colorBox.visible == true){
				this.hideColorBox();
				//console.log("HIDE");
			} else {
				this.showColorBox();
				//console.log("SHOW");
			}
		});
	}
	
	SHLines(){
		this.lineSize.on("pointerdown", (pointer) => {
			if(this.lineBox.visible == true){
				this.hideLineBox();
				//console.log("HIDE");
			} else {
				this.showLineBox();
				//console.log("SHOW");
			}
		});
	}
	
	pickColor(){
		this.colorBlack.on("pointerdown", (pointer) => {
			this.colorIndex = 0;
			this.hideColorBox();
		});
		this.colorWhite.on("pointerdown", (pointer) => {
			this.colorIndex = 1;
			this.hideColorBox();
		});
		this.colorRed.on("pointerdown", (pointer) => {
			this.colorIndex = 2;
			this.hideColorBox();
		});
		this.colorGreen.on("pointerdown", (pointer) => {
			this.colorIndex = 3;
			this.hideColorBox();
		});
		this.colorBlue.on("pointerdown", (pointer) => {
			this.colorIndex = 4;
			this.hideColorBox();
		});
	}
	
	pickSize(){
		this.lineSize1.on("pointerdown", (pointer) => {
			this.lineEXP = 1;
			this.hideLineBox();
		});
		this.lineSize2.on("pointerdown", (pointer) => {
			this.lineEXP = 4;
			this.hideLineBox();
		});
		this.lineSize3.on("pointerdown", (pointer) => {
			this.lineEXP = 7;
			this.hideLineBox();
		});
		this.lineSize4.on("pointerdown", (pointer) => {
			this.lineEXP = 10;
			this.hideLineBox();
		});
		this.lineSize5.on("pointerdown", (pointer) => {
			this.lineEXP = 13;
			this.hideLineBox();
		});
	}


    update()
    {
		
		if(this.oldColorIndex != this.colorIndex) {
			this.canvas.fillStyle(this.colors[this.colorIndex]);
			this.elliColor = this.GM.add.ellipse(50, 600 - 50, 40, 40, this.colors[this.colorIndex]);
			this.lineSize = this.GM.add.rectangle(50 + 3*this.elliColor.width, 550, 100, this.lineEXP, this.colors[this.colorIndex]);
			this.oldColorIndex = this.colorIndex; 
		}
		
		if(this.oldLineEXP != this.lineEXP) {
			this.lineSize = this.GM.add.rectangle(50 + 3*this.elliColor.width, 550, 100, this.lineEXP, this.colors[this.colorIndex]);
			this.oldLineEXP = this.lineEXP;
		}
    }
	
	
}
  