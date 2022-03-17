// Settings
let
	size =    3,  // Count of columns and rows
	need =    3,  // How many elements should stand in a row to win
	border =  5;  // Border of cell

// Declaration of elements
const
	game =         document.getElementById('game'),
	cell =         document.getElementsByClassName('cell'),
	message =      document.getElementById('message'),
	content =      document.getElementById('content'),
	sizeNumber =   document.getElementById('size-number'),
	needNumber =   document.getElementById('need-number');

let elements = [];

// Cell building
function cellBuilding() {
	game.innerHTML = '';
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			game.innerHTML += '<div class="cell"></div>';
		}
	}
	elements = [];
	let ic = 0;
	for (let i = 0; i < size; i++) {
		elements[i] = [];
		for (let j = 0; j < size; j++) {
			elements[i][j] = document.getElementsByClassName('cell')[ic];
			ic++;
		}
	}
}

cellBuilding();

// Adaptability
function sizeCorrect() {
	// Creating the style in the header
	let style = document.createElement('style');
	document.head.appendChild(style);
	let styleSheet = style.sheet;
	
	// Game size
	let min;
	if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
		min = document.documentElement.clientHeight;
		
		styleSheet.insertRule(
			'.settings {' +
			'top: 50% !important;' +
			'transform: translate(-13%, -50%) !important;' +
			'}'
		);
		
		styleSheet.insertRule(
			'.settings:hover {' +
			'top: 50% !important;' +
			'transform: translate(-100%, -50%) !important;' +
			'}'
		);
	} else {
		min = document.documentElement.clientWidth;
		
		styleSheet.insertRule(
			'.settings {' +
			'top: 0 !important;' +
			'transform: translate(-13%, 10%) !important;' +
			'}'
		);
		
		styleSheet.insertRule(
			'.settings:hover {' +
			'top: 0 !important;' +
			'transform: translate(-100%, 10%) !important;' +
			'}'
		);
	}
	styleSheet.insertRule(
		'#game {' +
		'width: ' + min + 'px;' +
		'height: ' + min + 'px;' +
		'grid-template-columns: repeat(' + size + ', ' + min / size + 'px);' +
		'grid-template-rows: repeat(' + size + ', ' + min / size + 'px);' +
		'}'
	);
	
	// Cross size
	let cell = min / size - border * 2;
	styleSheet.insertRule(
		'.cross {' +
		'height: ' + cell + 'px;' +
		'width: ' + cell * 0.2 + 'px;' +
		'left: ' + cell * 0.4 + 'px;' +
		'border-radius: ' + cell * 0.1 + 'px;' +
		'}'
	);
	styleSheet.insertRule(
		'.cross::after {' +
		'width: ' + cell + 'px;' +
		'height: ' + cell * 0.2 + 'px;' +
		'left: ' + cell * -0.4 + 'px;' +
		'top: ' + cell * 0.4 + 'px;' +
		'border-radius: ' + cell * 0.1 + 'px;' +
		'}'
	);
	
	// Circle size
	let circleMargin = cell * 0.092;
	styleSheet.insertRule(
		'.circle {' +
		'margin: ' + circleMargin + 'px;' +
		'height: ' + Math.round((cell - 2 * circleMargin) * 10000) / 10000 + 'px;' +
		'width: ' + Math.round((cell - 2 * circleMargin) * 10000) / 10000 + 'px;' +
		'border: ' + cell * 0.14 + 'px solid gray' +
		'}'
	);
	
	// Cell border
	border = cell * 0.05;
	styleSheet.insertRule('.cell {border: ' + border + 'px solid #252526}');
}

sizeCorrect();
window.onresize = sizeCorrect;

// Game logic
let crossStep = true;

game.onclick = function (event) {
	if (event.target.className === 'cell' && event.target.innerHTML === "" && !gameIsOver) {
		let el;
		if (crossStep) {
			el = '<div class="cross"></div>';
			crossStep = false;
		}
		else {
			el = '<div class="circle"></div>';
			crossStep = true;
		}
		event.target.innerHTML = el;
		checkWinner(el);
	}
};

function checkWinner(el) {
	let isEnd;
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			// Check elements in row
			isEnd = true;
			if (j <= size - need) {
				for (let _i = 0; _i < need; _i++) {
					isEnd &= elements[i][j + _i].innerHTML === el;
				}
				if (isEnd) {
					win(el);
					return;
				}
			}
			
			// Check elements in column
			isEnd = true;
			if (i <= size - need) {
				for (let _i = 0; _i < need; _i++) {
					isEnd &= elements[i + _i][j].innerHTML === el;
				}
				if (isEnd) {
					win(el);
					return;
				}
			}
			
			// Check elements in left diagonal
			isEnd = true;
			if (i <= size - need && j <= size - need) {
				for (let _i = 0; _i < need; _i++) {
					isEnd &= elements[i + _i][j + _i].innerHTML === el;
				}
				if (isEnd) {
					win(el);
					return;
				}
			}
			
			// Check elements in right diagonal
			isEnd = true;
			if (i <= size - need && j <= size - need) {
				for (let _i = 0; _i < need; _i++) {
					isEnd &= elements[i + _i][j + need - 1 - _i].innerHTML === el;
				}
				if (isEnd) {
					win(el);
					return;
				}
			}
		}
	}
	
	// Check a draw
	isEnd = true;
	for (let i = 0; i < size && isEnd; i++) {
		for (let j = 0; j < size && isEnd; j++) {
			isEnd &= elements[i][j].innerHTML !== '';
		}
	}
	if (isEnd) {
		draw();
	}
}

function win(el) {
	if (el === '<div class="cross"></div>') {
		content.innerHTML = ('Crosses have won!');
	} else {
		content.innerHTML = ('Zeros have won!');
	}
	message.className = 'display-block';
	gameIsOver = true;
}

function draw() {
	content.innerHTML = ('A draw');
	message.className = 'display-block';
}

let gameIsOver = false;

document.getElementsByClassName('close-button')[0].onclick = closeMessage;

function closeMessage() {
	message.className = 'display-none';
}

const header = document.getElementById('header');
header.onmousedown = function () {
	document.onmousedown = function () {
		return false
	};
	header.style.cursor = 'move';
	document.onmousemove = function (e) {
		let x = e.pageX;
		let y = e.pageY;
		let left = message.offsetLeft;
		let top = message.offsetTop;
		left = x - left;
		top = y - top;
		document.onmousemove = function (e) {
			let x = e.pageX;
			let y = e.pageY;
			message.style.left = x - left + 'px';
			message.style.top = y - top + 'px';
		}
	};
	
	document.onmouseup = function () {
		header.style.cursor = 'default';
		document.onmousedown = function () {
		};
		document.onmousemove = function () {
		};
	};
};

function restart() {
	for (let i = 0; i < cell.length; i++) {
		cell[i].innerHTML = '';
	}
	message.className = 'display-none';
	gameIsOver = false;
	crossStep = true;
}

document.getElementById('restart').onclick = restart;
document.getElementById('restart-message').onclick = restart;

sizeNumber.value = size;
needNumber.value = need;

sizeNumber.onchange = function changeSize() {
	if (sizeNumber.value < 3) {
		sizeNumber.value = 3;
	}
	if (sizeNumber.value > 40) {
		sizeNumber.value = 40;
	}
	size = parseInt(sizeNumber.value);
	cellBuilding();
	sizeCorrect();
	restart();
};

needNumber.onchange = function changeNeed() {
	if (needNumber.value < 3) {
		needNumber.value = 3;
	}
	need = parseInt(needNumber.value);
	restart();
};