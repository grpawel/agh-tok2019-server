var shipImage = new Image();
shipImage.isLoaded = false;
shipImage.onload = function () { shipImage.isLoaded = true; };
shipImage.onerror = function () { console.log("Error loading ship :c"); };
shipImage.src = "img/ship.png"

class Player {

	constructor(x,y,shape){
		this.x = x || 0;
		this.y = y || 0;
		this.xDir = 1;
		this.shape = shape || [0,0,0,0,0,1,1,0,0,1,1,0,1,1,1,1];
		this.speed = 0.12 * globalSpeed;
		this.bulletSpeed = 0.2 * globalSpeed;
		this.isMovingLeft = false;
		this.isMovingRight = false;
		this.isShooting = false;
		this.bullet = {x: this.x, y: this.y, s: 3};
	}

	shoot(){
	 if( !this.isShooting ){
	 	this.bullet = {x: this.x,  y: this.y - shipImage.height * 2, s: 3};
	 	this.isShooting = true;
	 }
	}

	update(){

		if( this.x > 0 && this.isMovingLeft ){
			this.x -= this.speed * dt;
		}
		if( this.x < w && this.isMovingRight ){
			this.x += this.speed * dt;
		}

		if(this.isShooting){
			this.bullet.y -= this.bulletSpeed * dt;
			if( this.bullet.y < 0 ){
				this.isShooting = false;
				this.bullet = {};
			}
		}

	}

	show(){
		if(shipImage.isLoaded)
			c.drawImage(shipImage, this.x - shipImage.width, this.y - shipImage.height * 2, shipImage.width * 2, shipImage.height * 2);
		/*
		c.fillStyle = this.color;
		for(let i = 0; i < this.shape.length; i++){
				if(this.shape[i]){
					c.fillRect( (this.x+i%4)*this.s, (this.y+(i>>2))*this.s, this.s, this.s);
				}
		}*/
		if( this.isShooting ){
			c.fillStyle = "yellow"
			c.fillRect( this.bullet.x, this.bullet.y, this.bullet.s, this.bullet.s * 4);
		}
		this.update();
	}

}
