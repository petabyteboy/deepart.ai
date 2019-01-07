'use strict';

//
// Initial configuration
//
const INIT_OBJ_AMNT_MIN = 1;       // Min. amount of initial objects
const INIT_OBJ_AMNT_MAX = 5;       // Max. amount of initial objects


//
// Evolution settings
//
const EVOL_GENERATION_SIZE = 25;   // Number of canvases in the next generation


//
// Mutation settings
//
const MUTA_OBJ_ADD = 0.10;         // Prop. of adding a new object in the filial generation
const MUTA_OBJ_REM = 0.10;         // Prop. of removing an object in the filial generation
const MUTA_OBJ_MUT = 0.20;         // Prop. of a random mutation of an object in the filial generation
const MUTA_PNT_MUT = 0.33;         // Prop. of a random mutation of a point of an object in the filial generation
                                   // (real prop. is given by MUTA_OBJ_MUT * MUTA_PNT_MUT)

// The following settings define the shape of gaussian curves
// for the mutation process

const MUTA_GEO_POS_MID = 0;        // My for position mutation of points
const MUTA_GEO_POS_STD = 0.1;      // Sigma for position mutation of points

const MUTA_GEO_COL_MID = 0;        // My for color mutation of points
const MUTA_GEO_COL_STD = 0.1;      // Sigma for color mutation of points

const MUTA_CIR_RAD_MID = 0;        // My for radius mutation of circles
const MUTA_CIR_RAD_STD = 0.1;      // Sigma for radius mutation of circles
const MUTA_CIR_MIN_RAD = 0.05;     // Minimal size of a circle (radius)


const gauss = (mid, sd) => mid + sd * Math.cos(2 * Math.PI * Math.random()) * Math.sqrt(-2 * Math.log(Math.random()));
const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive


class Shape {
	mutate() {
		for (let point of this.points) if (Math.random() < MUTA_PNT_MUT) point.mutate();
	}

	clone() {
		return null;
	}
}

class Point {
	constructor(x, y, r, g, b) {
		this.x = x || Math.random();
		this.y = y || Math.random();

		this.r = r || Math.random();
		this.g = g || Math.random();
		this.b = b || Math.random();
	}

	mutate() {
		this.x += gauss(MUTA_GEO_POS_MID, MUTA_GEO_POS_STD);
		this.y += gauss(MUTA_GEO_POS_MID, MUTA_GEO_POS_STD);
		this.r += gauss(MUTA_GEO_COL_MID, MUTA_GEO_COL_STD);
		this.g += gauss(MUTA_GEO_COL_MID, MUTA_GEO_COL_STD);
		this.b += gauss(MUTA_GEO_COL_MID, MUTA_GEO_COL_STD);
	}

	clone() {
		return new Point(this.x, this.y, this.r, this.g, this.b);
	}
}

class Circle extends Shape {
	constructor(points, radius) {
		super();
		this.points = points || [new Point()];
		this.radius = radius || Math.random();
	}
	mutate() {
		super.mutate();
		this.radius = Math.max(MUTA_CIR_MIN_RAD, gauss(this.radius, MUTA_CIR_RAD_STD));
	}

	clone() {
		return new Circle(this.points.map(point => point.clone()), this.radius);
	}
}

class Triangle extends Shape {
	constructor(points) {
		super();
		this.points = points || [new Point(), new Point(), new Point()];
	}

	clone() {
		return new Triangle(this.points.map(point => point.clone()));
	}
}

class Rectangle extends Shape {
	constructor(points) {
		super();
		this.points = points || [new Point(), new Point(), new Point(), new Point()];
	}

	clone() {
		return new Rectangle(this.points.map(point => point.clone()));
	}
}

class Objects {
	constructor(objects) {
		if (objects) {
			this.objects = objects;
		} else {
			this.objects = [];
			let numObjects = randInt(INIT_OBJ_AMNT_MIN, INIT_OBJ_AMNT_MAX + 1);
			for (let i = 0; i < numObjects; i++) {
				this.addRandom();
			}
		}
	}

	clone() {
		return new Objects(this.objects.map(obj => obj.clone()));
	}

	addRandom() {
		switch (randInt(0, 3)) {
			case 0:
				this.objects.push(new Triangle());
				break;
			case 1:
				this.objects.push(new Rectangle());
				break;
			case 2:
				this.objects.push(new Circle());
				break;
		}
	}

	removeRandom() {
		this.objects.splice(randInt(0, this.objects.length), 1);
	}

	mutate() {
		for (let obj of this.objects) if (Math.random() < MUTA_OBJ_MUT) obj.mutate();
		if (Math.random() < MUTA_OBJ_ADD) this.addRandom();
		if (Math.random() < MUTA_OBJ_REM) this.removeRandom();
	}
}

export const next = (cur) => {
	if (!cur) cur = new Objects();
	let newObjects = [];
	for (let i = 0; i < EVOL_GENERATION_SIZE; i++) {
		newObjects[i] = cur.clone();
		if (i > 0) newObjects[i].mutate();
	}
	return newObjects;
};

