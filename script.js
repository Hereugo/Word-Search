const R = 100;
const RMouse = 150;
const LETTER = "abcdefghijklmnopqrtsuvwxyz";
var a = [], b = [];
var mouse;
var zerozero;
var customWords = ["From:Hreugo", "Happy Birthday", "!Zhangir!"];

function setup() {
	mouse = createVector();
	zerozero = createVector(0,0);
	createCanvas(500, 500).center();


	const C = 50;

	var c = ["#4D9DE0", "#E3C13B", "#E23C3C"];
	for (let i=0; i<width/C - 1; i++) {
		b[i] = []
		for (let j=0; j<height/C - 1; j++) {
			b[i][j] = {let: LETTER[floor(random(25))], clr:random(c)}; 
		}
	}

	// for (let i=0; i<customWords[0].length; i++) b[8+i][18] = {let: customWords[0][i], clr:'red'};
	// for (let i=0; i<customWords[1].length; i++) b[3+i][7] = {let: customWords[1][i], clr:'#75BF00'};
	// for (let i=0; i<customWords[2].length; i++) b[5+i][10] = {let: customWords[2][i], clr:"#FF8811"};

	for (let i=0; i<width/C - 1; i++) {
		for (let j=0; j<height/C - 1; j++) {
			a.push(new elem(i*C + C, j*C + C, b[i][j].let, b[i][j].clr));
		}
	}
}

function draw() {
	mouse.set(mouseX, mouseY);
	background(color("#10212D"));


	for (let i=0; i<a.length; i++) {
		let d = dist(a[i].pos.x, a[i].pos.y, a[i].target.x, a[i].target.y);
		if (d < 0.1 && d > RMouse) {
			a[i].show();
			continue;
		}
		a[i].behaviors();
		a[i].update();
		a[i].show();
	}
}


function elem(x , y, ltt, clr) {
	this.pos = createVector(x , y);
	this.target = createVector(x , y);
	this.vel = createVector();
	this.acc = createVector();
	this.maxSpeed = 10;
	this.maxForce = 1;
	this.txtSz = 32;
	this.letter = ltt;
	this.clr = clr

	this.update = function() {
		this.pos.add(this.vel);
		this.vel.add(this.acc);
		this.acc.mult(0);
	}

	this.show = function() {
		textSize(this.txtSz);
		textAlign(CENTER);
		noStroke();
		fill(this.clr);
		text(this.letter, this.pos.x , this.pos.y);
		/*
		strokeWeight(4);
		stroke(255, 100);
		line(this.pos.x, this.pos.y, this.target.x, this.target.y);
		*/
	}

	this.behaviors = function() {
		let arrive = this.arrive(this.target);
		let flee = this.flee(mouse);
		flee.mult(3);
		this.applyForce(flee);
		this.applyForce(arrive);
	}

	this.arrive = function(target) {
		let desire = p5.Vector.sub(target, this.pos);
		let speed = this.maxSpeed;
		let d = desire.mag();
		if (d <= R) speed = map(d, 0, 100, 0, this.maxSpeed);
		desire.setMag(speed);
		let steer = p5.Vector.sub(desire, this.vel);
		steer.limit(this.maxForce);
		return steer;
	}

	this.flee = function(target) {
		let desire = p5.Vector.sub(target, this.pos);
		let speed = this.maxSpeed;
		let d = desire.mag();
		if (d > RMouse) return zerozero;
		desire.setMag(this.maxSpeed);
		desire.mult(-1); //flee
		let steer = p5.Vector.sub(desire, this.vel);
		steer.limit(this.maxForce);
		return steer;
	}

	this.applyForce = function(f) {
		this.acc.add(f);
	}
}


