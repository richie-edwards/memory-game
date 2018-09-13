
let cardNodeList = document.querySelectorAll('.card');
let cards = [...cardNodeList];
let activeCards = [];
let exposedCards = [];
let pendingCard;
let currentCard;
let totalMoves = 0;
let maxFailedMoves = 3;
let failedMoves = 0;
let stars = document.querySelectorAll('fa-star');

let resetButton = document.querySelector('.fa-repeat');
let intervalId;
let clickCount = 0;

document.body.onload = startGame();

// starts game and also used to reset
function startGame(){
	// game board
	const gameBoard = document.querySelector(".deck");

	// shuffle cards
	shuffledCards = shuffle(cards);
	shuffledCards.forEach(function(card){
		gameBoard.appendChild(card);
	});

	resetTotalMoves();	
	resetTimer();

	//fill empty stars
	let stars = getAllStars();
	stars.forEach(function(element, index) {
		element.classList.remove('fa-star-o');
	});

	// cover cards 
	cards.forEach(function(card){
		coverCard(card);
	});
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// wanted to win game automtically to test code
function winGame() {
	for (var i = 0; i < cards.length; i++) {
		cards[i].click();
		for (var j = i + 1; j < cards.length; j++) {

		}
	}
}

function showCard(card) {
	card.classList.add('open');
	card.classList.add('show');
	exposedCards.push(card);
}

function coverCard(card) {
	card.classList.remove('show');
	card.classList.remove('open');
	let cardIndex = exposedCards.indexOf(card);
	exposedCards.splice(cardIndex, 1);
}

function resetGame(){	
	//startGame();
	location.reload(true);
}

function startTimer(){
	let time = 0;
	intervalId = window.setInterval(function(){
		time++;
		let timer = document.getElementById('timer')
		timer.innerText = time;
	}, 1000);

}

function stopTimer(){
	clearInterval(intervalId);
}

function resetTimer(){
	clearInterval(intervalId);
	document.getElementById('timer').innerText = 0;
}

function checkForMatches(card){
	let myCard = card;
	if (pendingCard != undefined) {
		currentCard = myCard;

		//increase totalMoves by 1
		increaseMoves();

		//add new card to activeCards array
		activeCards.push(currentCard);

		// get class of current card
		let typeOfPendingCard = pendingCard.getAttribute('title');
		let typeOfCurrentCard = currentCard.getAttribute('title');

		// are cards the same type?
		if (typeOfCurrentCard == typeOfPendingCard) {
			pendingCard.classList.add('match');
			currentCard.classList.add('match');
			activeCards.forEach(function(currentCard){
				removeListener(currentCard, 'click', validateCard);
			});
		}
		else{
				failTurn(currentCard);
		}
		resetActiveAndPendingCards();
	}
	else{
		pendingCard = myCard;
		removeListener(pendingCard, 'click', validateCard);
		activeCards.push(pendingCard);
	}
}

function checkForWinOrLoss(){
	let coveredCards = document.querySelectorAll('li.card:not(.show)');
	if (coveredCards.length == 0) 
	{
		let response = confirm("You win! \n# of Moves: " + totalMoves + " \nTotal Time: " + document.getElementById('timer').innerText + " seconds,\nStar Rating: " + getStarRating() + "\nWould you like to play again?");
		if (response) {
			resetGame();
		}
		else {
			stopTimer();
		}
	}
}

function failTurn(card){
	failedMoves++;	
	activeCards.forEach(function(card){
		window.setTimeout(function(){
			coverCard(card)
		}, 1000);
		addListener(card, 'click', validateCard)
	});
	// remove a star every 3rd failed move
	if (failedMoves % 3 == 0) {
		removeStar();	
	}	
}

function removeStar() {
	let emptyStarClass = 'fa-star-o';
	let stars = getAllStars();
	let emptiedStars = getEmptiedStarsCount();
	
	switch(emptiedStars) {
	case 0:
		stars[2].classList.add(emptyStarClass);
		break;
	case 1:
		stars[1].classList.add(emptyStarClass);
		break;
	case 2:
		stars[0].classList.add(emptyStarClass);
		break;
	}
	
}

function getAllStars() {
	let stars = document.querySelectorAll('.fa-star');
	return stars;
}

function getEmptiedStarsCount() {
	let emptiedStars = document.querySelectorAll('.fa-star-o');
	return emptiedStars.length;
}


function getStarRating() {
	let totalRating = getAllStars().length - getEmptiedStarsCount();
	return totalRating;
}

function increaseMoves(){
	totalMoves += 1;
	let totalMovesElement = getMovesElement();
	totalMovesElement.innerText = totalMoves;
}

function resetTotalMoves(){
	totalMoves = 0;	
	failedMoves = 0;
	clickCount = 0;
	let totalMovesElement = getMovesElement();
	totalMovesElement.innerText = totalMoves;
}

function getMovesElement(){
	let totalMovesElement = document.querySelector('.moves');
	return totalMovesElement;	
}

function resetActiveAndPendingCards(){
	activeCards = [];
	pendingCard = undefined;
}

// starts timer, keeps track of clicks and shows card 
let openCard = function(e){
	clickCount++;
	if (clickCount == 1){
		startTimer();
	}
 	showCard(e.target);
}

let validateCard = function(e){
	checkForMatches(e.target);
	checkForWinOrLoss();
}

// Event listeners
function addListener(card, event, func) {
	card.addEventListener(event, validateCard);
}

function removeListener(card, event, func){
	card.removeEventListener(event, func);
}

for (let i = 0; i < cards.length; i++){
	cards[i].addEventListener('click', openCard);
	cards[i].addEventListener('click', validateCard);
}

resetButton.addEventListener('click', resetGame);
