const unit = 24;
const score = document.querySelector('.score');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const clearRect = () => context.clearRect(0, 0, canvas.width, canvas.height);
canvas.width = unit * 12;
canvas.height = unit * 20;

const nCanvas = document.querySelector('.next-element');
const nContext = nCanvas.getContext('2d');
nCanvas.width = unit * 12;
nCanvas.height = unit * 2 + 8;


const colors = {
	iElement: '#EDA041',
	jElement: '#7E9AD9',
	sElement: '#86B384',
	zElement: '#F7C94D',
	oElement: '#5FC7CB',
	lElement: '#C695BF',
	tElement: '#FF6E6E'
};

const iElement = [
	[[0, 0], [3, 0], [1, 0], [2, 0]],
	[[2, -1], [2, 0], [2, 1], [2, 2]],
	[[0, 1], [3, 1], [1, 1], [2, 1]],
	[[1, -1], [1, 0], [1, 1], [1, 2]]
];
const jElement = [
	[[0, 0], [2, 1], [0, 1], [1, 1]],
	[[1, 0], [2, 0], [1, 2], [1, 1]],
	[[2, 2], [2, 1], [0, 1], [1, 1]],
	[[1, 0], [0, 2], [1, 2], [1, 1]]
];
const sElement = [
	[[0, 1], [2, 0], [1, 0], [1, 1]],
	[[2, 2], [2, 1], [1, 0], [1, 1]],
	[[0, 2], [2, 1], [1, 1], [1, 2]],
	[[1, 2], [1, 1], [0, 0], [0, 1]]
];
const zElement = [
	[[0, 0], [2, 1], [1, 0], [1, 1]],
	[[1, 1], [1, 2], [2, 0], [2, 1]],
	[[0, 1], [2, 2], [1, 1], [1, 2]],
	[[0, 1], [0, 2], [1, 0], [1, 1]]
];
const oElement = [
	[[1, 0], [2, 0], [1, 1], [2, 1]],
	[[1, 0], [2, 0], [1, 1], [2, 1]],
	[[1, 0], [2, 0], [1, 1], [2, 1]],
	[[1, 0], [2, 0], [1, 1], [2, 1]]
];
const lElement = [
	[[0, 1], [2, 0], [1, 1], [2, 1]],
	[[1, 0], [2, 2], [1, 1], [1, 2]],
	[[0, 1], [0, 2], [1, 1], [2, 1]],
	[[1, 0], [0, 0], [1, 1], [1, 2]]
];
const tElement = [
	[[0, 1], [2, 1], [1, 0], [1, 1]],
	[[1, 2], [2, 1], [1, 0], [1, 1]],
	[[0, 1], [2, 1], [1, 2], [1, 1]],
	[[1, 2], [0, 1], [1, 0], [1, 1]]
];

const elements = {iElement, jElement, sElement, zElement, oElement, lElement, tElement};

const settings = {
	fps: 50,
	then: Date.now(),
	acceleration : false,
	speed: 20000,
	interval() {
	return this.acceleration ? 1 : this.speed / this.fps
	}
};

class Tetris {
	constructor() {
	this.restart();
	}

	restart() {
	this.allElements = [];
	this.projection = [];
	this.fullLines = [];
	this.rotation = 0;
	this.line = [canvas.width / unit / 2 - 2, 0];
	this.gameOver = false;
	this.score = 0;
	this.nextElement = this.getRandomElement();
	this.removedLines = 0;

	score.textContent = this.score;

	settings.acceleration = false;

	document.querySelector('.game-over').classList.add('hidden');

	this.setNextElement();
	this.getRandomElement();
	this.requestAnimation();
	}

	setNextElement() {
	const values = Object.values(elements);
	const random = Math.floor(Math.random() * (values.length));

	this.nextElement = values[random][0];
	this.nextElementTitle = Object.keys(elements)[random];

	this.drawNextElement();
	}

	getRandomElement(next) {
	const values = Object.values(elements);
	const random = Math.floor(Math.random() * (values.length));

	this.rotation = 0;
	this.activeElement = next ? this.nextElement : values[random][0];
	this.activeElementTitle = next ? this.nextElementTitle : Object.keys(elements)[random];

	next && this.setNextElement();

	this.moveToCenter();
	}

	activeElementSettings(a = 0, b = 0) {
	this.activeElement = this.activeElement.map(item => [item[0] + a, item[1] + b]);
	}

	moveToCenter() {
	this.activeElementSettings(canvas.width / unit / 2 - 2);
	}

	drawRect(item, color = colors[this.activeElementTitle], opacity = '0.07', ctx = context, moveToRight = false, moveDown = false) {
	const x = (item[0] + (moveToRight && nCanvas.width / unit / 2 - 2)) * unit;
	const y = (item [1] + (moveDown && 0.5)) * unit;

	ctx.fillStyle = color;
	ctx.fillRect(x , y, unit, unit);

	ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
	ctx.fillRect(x + 9, y + 9, unit - 18, unit - 18);

	ctx.lineWidth = 4;
	ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
	ctx.strokeRect(x + 4, y + 4, unit - 8, unit - 8);

	ctx.lineWidth = 2;
	ctx.strokeStyle = '#E4E4E4';
	ctx.strokeRect(x , y , unit, unit);
	}

	drawNextElement() {
	nContext.clearRect(0, 0, nCanvas.width, nCanvas.height, true);
	const moveDown = this.nextElementTitle === 'iElement';

	this.nextElement.map(item => this.drawRect(item, 'rgba(0, 0, 0, 0.01)', '0.05', nContext, true, moveDown));

	const borderSize = nCanvas.width / 4;
	for (let i = 0; i < borderSize; i++) {
		nContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
		nContext.fillRect(i * 9, nCanvas.height - 6, 6, 6);
	}
	}

	drawElements() {
	this.allElements && this.allElements.map(item => this.drawRect(item[0], item[1]));

	this.projection && this.projection.map(item => this.drawRect(item, 'rgba(0, 0, 0, 0.01)', '0.05'));

	this.activeElement.map(item => this.drawRect(item));

	const borderSize = canvas.width / 4;
	for (let i = 0; i < borderSize; i++) {
		context.fillStyle = 'rgba(0, 0, 0, 0.05)';
		context.fillRect(i * 9, canvas.height - 22, 6, 6);
	}
	}

	isEqual(external, internal) {
	const isArray = elem => JSON.stringify(Array.isArray(elem[0]) ? elem[0] : elem);
	return external.some(a => internal.some(b => isArray(a) === isArray(b)));
	}

	getProjection() {
	let projection = this.activeElement;
	const maxY = Math.max(...projection.map(a => a[1]));

	for (let y = 0; y < (canvas.height - 24) / unit - maxY - 1; y++) {
		const moveDown = projection.map(item => [item[0], item[1] + 1]);

		const collision = this.allElements && this.isEqual(this.allElements, moveDown);

		if (collision) break;
		projection = moveDown;
	}

	this.projection = projection;
	}

	rotateElement() {
	const rotation = this.rotation === 3 ? 0 : this.rotation + 1;
	let active = elements[this.activeElementTitle][rotation];
	active = active.map(item => [item[0] + this.line[0], item[1] + this.line[1]]);

	const maxY = Math.max(...active.map(a => a[1]));
	const maxX = Math.max(...active.map(a => a[0]));
	const minX = Math.min(...active.map(a => a[0]));

	if (
		this.detectCollision('rotate') ||
		maxY + 1 > (canvas.height - 24) / unit ||
		this.isUpArrowPressed
	) return;


	this.rotation = rotation;
	this.activeElement = elements[this.activeElementTitle][this.rotation];

	if (maxX + 1 >= canvas.width / unit) {
		const difference = (maxX + 1) - canvas.width / unit;
		this.activeElement = this.activeElement.map(item => [item[0] - difference, item[1]])
	}

	if (minX <= 0) {
		this.activeElement = this.activeElement.map(item => [item[0] - minX, item[1]])
	}

	this.activeElementSettings(this.line[0], this.line[1]);
	}

	detectCollision(direction) {
	let active;

	if (direction === 'left') {
		active = this.activeElement.map(item => [item[0] - 1, item[1]]);
	}

	if (direction === 'right') {
		active = this.activeElement.map(item => [item[0] + 1, item[1]]);
	}

	if (direction === 'down') {
		active = this.activeElement.map(item => [item[0], item[1] + 1]);
	}

	if (direction === 'rotate') {
		active = elements[this.activeElementTitle][this.rotation === 3 ? 0 : this.rotation + 1];
		active = active.map(item => [item[0] + this.line[0], item[1] + this.line[1]]);
	}

	return this.isEqual(this.allElements, active);
	}

	removeFullLine() {
	for (let x = 0; x < canvas.width / unit; x++) {
		for (let y = 0; y < this.fullLines.length; y++) {
		this.allElements = this.allElements.filter(item => {
			return JSON.stringify([x, this.fullLines[y]]) !== JSON.stringify(item[0]);
		});
		}
	}

	this.fullLines.map(line => {
		this.allElements = this.allElements.map(item => (
		item[0][1] <= line ? [[item[0][0], item[0][1] + 1], item[1]] : [[item[0][0], item[0][1]], item[1]]
		))
	});

	this.score = this.score + (10 * this.fullLines.length);
	score.textContent = this.score;
	this.removedLines = this.removedLines + this.fullLines.length;

	if (this.removedLines % 5 === 0 && this.removedLines > 0) {
		settings.speed = settings.speed > 0 ? settings.speed - 200 : settings.speed;
	}

	this.fullLines = [];
	}

	isFullLine() {
	for (let y = 0; y < (canvas.height - 24) / unit; y++) {
		let isFullLine;
		for (let x = 0; x < canvas.width / unit; x++) {
		isFullLine = this.allElements.some(item => JSON.stringify(item[0]) === JSON.stringify([x, y]));

		if (!isFullLine) break;
		}

		isFullLine && this.fullLines.push(y);
	}

	this.fullLines.length > 0 && this.removeFullLine();
	}

	upArrow(keyCode) {
	if (keyCode === 38 ) {
		this.isUpArrowPressed = false;
	}
	}

	keyEvent(keyCode) {
	const maxX = Math.max(...this.activeElement.map(a => a[0]));
	const minX = Math.min(...this.activeElement.map(a => a[0]));

	if (keyCode === 38) {
		this.rotateElement();
		this.isUpArrowPressed = true;
	}

	if (keyCode === 37 && minX > 0 && !this.detectCollision('left')) {
		this.activeElementSettings(-1);
		this.line[0] = this.line[0] - 1;
	}

	if (keyCode === 39 && maxX + 1 < canvas.width / unit && !this.detectCollision('right')) {
		this.activeElementSettings(1);
		this.line[0] = this.line[0] + 1;
	}

	if (keyCode === 32) {
		settings.acceleration = true;
	}
	}

	moveDown() {
	const maxY = Math.max(...this.activeElement.map(a => a[1]));
	const collision = this.isEqual(this.activeElement, this.allElements);

	if (collision) {
		this.gameOver = true;
		return;
	}

	if (maxY + 1 < (canvas.height - 24) / unit && !this.detectCollision('down')) {
		this.activeElementSettings(0, 1);
		this.line[1] = this.line[1] + 1;
	} else {
		this.line = [canvas.width / unit / 2 - 2, 0];
		this.activeElement.map(item => this.allElements.push([item, colors[this.activeElementTitle]]));
		this.isFullLine();
		this.score++;

		score.textContent = this.score;
		settings.acceleration = false;

		this.getRandomElement('next');
	}
	}

	changePosition(keyCode) {
	if (this.gameOver) return;

	clearRect();

	keyCode && keyCode !== 40 ? this.keyEvent(keyCode) : this.moveDown();

	const collision = this.isEqual(this.activeElement, this.allElements);
	if (collision) {
		this.isGameOver = true;
		document.querySelector('.game-over').classList.remove('hidden');
		document.querySelector('.game-over-score').textContent = this.score;
		return;
	}

	this.getProjection();
	this.drawElements();
	}

	requestAnimation() {
	if (this.gameOver) {
		clearRect();
		nContext.clearRect(0, 0, nCanvas.width, nCanvas.height);
		return;
	}

	const now = Date.now();
	const delta = now - settings.then;

	if (delta > settings.interval()) {
		settings.then = now - (delta % settings.interval() + 1);

		this.changePosition();
	}

	window.requestAnimationFrame(this.requestAnimation.bind(this));
	}
}

const tetris = new Tetris();
tetris.requestAnimation();

window.addEventListener('keydown', e => tetris.changePosition(e.keyCode));
window.addEventListener('keyup', e => tetris.upArrow(e.keyCode));

document.querySelector('button').addEventListener('click', () => tetris.restart());
