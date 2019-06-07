function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


class Invader {

	constructor(x,y,shape,color,speed){
		this.x = x || 0;
		this.y = y || 0;
		this.xDir = 1;
		this.dim = 8;
    this.rectSize = 4;
		this.i = 0;
		this.speed = speed != undefined ? speed : 0.024 * globalSpeed;
		this.frame = 0;
		this.dir = ( Math.random () < 0.5 ? -1 : 1 );
		this.maxFrame = Math.floor( Math.random() * 32 ) + 16;
		this.color = color || 'violet';
		this.shape = shape || Array.apply(null, Array(64)).map(Number.prototype.valueOf,1);
		this.isAlive = true;
		this.fit = 0;
	}

	update(){
		if( this.y >= h - this.dim * this.rectSize){
			if(lives > 0)
        lives--;
			this.isAlive = false;
			return;
		}

		if( !this.shape[this.i] ){

			let value =  this.dir * this.speed * dt
			if( this.x + value > 0 && (this.x + value) < w - this.dim * this.rectSize ){
				this.x += value;
			}
		}

		this.y += this.speed * dt;

		if( this.frame == this.maxFrame ){
			this.dir = -this.dir;
			this.frame = 0;
			this.maxFrame = Math.floor( Math.random() * 32 ) + 16;
			this.i = this.i + 1 % this.shape.length;
		}

		this.frame++;
		this.fit = Math.round( this.y );

        function distance(p1, p2)
        {
          return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
        }

        let bulletPos = { x: player.bullet.x, y: player.bullet.y }
        let invaderMiddlePos = {
          x: this.x + this.dim * this.rectSize/2,
          y: this.y + this.dim * this.rectSize/2
        }

        if( distance(bulletPos, invaderMiddlePos) < this.dim * this.rectSize / 2) {
			this.isAlive = false;
			player.bullet = {};
			player.isShooting = false;
			/*
            let cv = c.getImageData(0, 0, w, h).data;
            let cv_h;
            console.log("invader, bullet dist :" + distance(bulletPos, invaderMiddlePos))
            for(cv_h = 0; cv_h < h; cv_h++) {
                let cv_w;
                for(cv_w = 0; cv_w < w; cv_w++) {
                    let data = cv[cv_h * w + cv_w]
                    if(data) {
                        console.log("w : " + cv_w + ", h : " + cv_h + ", val = " + data)
                    }
                }

            }

            let x = player.bullet.x;
            let y = player.bullet.y;

            let area = c.getImageData(x, y, player.bullet.s, player.bullet.s);
            for(let i = 0; i < area.data.length; i++){
                if( area.data[i] ) {
                    this.isAlive = false;
                    player.bullet = {};
                    player.isShooting = false;
                    break;
                }
            }
            */
        }
	}

	show(){
		if(this.isAlive){
			c.fillStyle = this.color;
			for(let i = 0; i < this.shape.length; i++){
					if(this.shape[i]){
						c.fillRect(this.x + (i % this.dim) * this.rectSize, this.y + (i / this.dim) * this.rectSize, this.rectSize, this.rectSize);
					}
			}
			this.update();
		}
	}

}
