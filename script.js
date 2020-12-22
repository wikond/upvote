//'use strict'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAUUrngGkVeNpuvZSpARcwNgLeJwpzMeY",
    authDomain: "simple-scrum-board.firebaseapp.com",
    databaseURL: "https://simple-scrum-board-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "simple-scrum-board",
    storageBucket: "simple-scrum-board.appspot.com",
    messagingSenderId: "328654708319",
    appId: "1:328654708319:web:f5b5c139423a97f736c5ea",
    measurementId: "G-DKBLFP07GQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();


//Global variables 
//task object constructor
function Task(roomID, nameID, pinID, headerTxt, descTxt, statusID, userID, priorityID, columnID) {
    this.userID = userID
    this.room = roomID;
    this.pin = pinID;
    this.name = nameID;
    this.header = headerTxt;
    this.desc = descTxt;
    this.columnID = columnID;
    this.priorityID = priorityID
    this.status = statusID;
}


let $taskBoxes;     // DOM elements - div-s for dynymic collection of tasks
let $addTaskBtns;   // collection of add new task buttons in columns

//icons set
const iconSet = {
    leftArrow: `<svg xmlns=" http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
<path fill-rule="evenodd"
    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
<path fill-rule="evenodd"
    d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
</svg>`,
    rightArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
<path fill-rule="evenodd"
    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
<path fill-rule="evenodd"
    d="M4 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5A.5.5 0 0 0 4 8z" />
</svg>`,
    upArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
class="bi bi-arrow-up-circle" viewBox="0 0 16 16">
<path fill-rule="evenodd"
    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
<path fill-rule="evenodd"
    d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
</svg>`,
    downArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
<path fill-rule="evenodd"
    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
<path fill-rule="evenodd"
    d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
</svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
class= "bi bi-x-circle" viewBox="0 0 16 16" >
<path fill-rule="evenodd"
    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
<path fill-rule="evenodd"
    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
</svg >`
}

















// ----------------------------------
//Global variables 
//main user data object constructor
const myRoom = function (roomID, nameID, pinID, scoreID, deckID, statusID, userID) {
    this.room = roomID;
    this.pin = pinID;
    this.name = nameID;
    this.score = scoreID;
    this.deck = deckID;
    this.status = statusID;
    this.userID = userID
}



























let $myRoom = new myRoom();
let $cardList;
// show hide scores in room window based on status of supervisor from show button
let $showHide = false;
let $resultsTab = [];
$myRoom.deck = 0; //set default deck of Fibonacci to the user
for (let i = 0; i < 17; i++) $resultsTab.push(0);
const $cardDeck = [];

function displayDeck() {

}

class Cards {
    constructor(value, name) {
        this.value = value;
        this.name = name;
    }
    showCard() {
        const el = document.createElement('div');
        const carDiv = document.querySelector('#board');
        el.id = 'card' + this.value;
        el.classList.add('cardBox');
        el.textContent = this.name;
        carDiv.appendChild(el);
    }
    updateCards() {
        let cardsEl;
        let j;
        cardsEl = document.querySelectorAll('#board>div');
        this.value.forEach((el, i) => {
            j++;
        });
    }
    updateResults() {
        let cardsEl;
        cardsEl = document.querySelectorAll('#results>span');
        this.value.forEach((el, i) => {
            if (i < 12) cardsEl[i].textContent = el;
        });
    }
}

function deckDisplay(i) {
    //console.log(i)
    if ($myRoom.room !== undefined) displayResults();
    const row3 = document.querySelector('#cardRow3');
    const rowResSpan = document.querySelectorAll('.hideshowSpan');
    const rowResDiv = document.querySelectorAll('.hideshowDiv');
    if (i > 1) {
        row3.classList.add('dispNone');
        rowResSpan.forEach(e => {
            e.classList.add('dispNone')
        })
        rowResDiv.forEach(e => {
            e.classList.add('dispNone')
        })
    }
    else {
        row3.classList.remove('dispNone');
        rowResSpan.forEach(e => {
            e.classList.remove('dispNone')
        })
        rowResDiv.forEach(e => {
            e.classList.remove('dispNone')
        })
    }
    if (i < 12) $cardDeck[i].updateCards();
    //console.log($cardDeck[i]);
    $cardDeck[i].updateResults();

}

const displayCards = () => {
    displayDeck();
    $cardDeck.push(new Cards([0, 0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '', '', '', ''], 'Fibonacci'));
    $cardDeck.push(new Cards([0, '1/2', 1, 2, 3, 5, 8, 13, 20, 40, 100, 150, '', '', '', ''], 'Modified Fibonacci'));
    $cardDeck.push(new Cards([0, 1, 2, 4, 8, 16, 32, 64, '', '', '', '', '', '', '', ''], 'Powers'));
    $cardDeck.push(new Cards([0, 'xs', 's', 'm', 'L', 'XL', '2XL', '3XL', '', '', '', '', '', '', '', ''], 'TShirts'));
    $cardDeck[$myRoom.deck].updateCards();

}
//Display results from all participants in the bottom Result section
function displayResults() {

}

function getInputValue(id) {
    return document.getElementById(id).value;
}

function setUserID() {
    let userID;
    let timeSet = new Date();

    userID = timeSet.getTime();
    userID = userID + Math.floor(Math.random() * 1000000);
    //console.log(userID);
    return userID;
}


function submitForm(e, i) {
    e.preventDefault();
    //Get values from form
    let roomID = getInputValue('inputRoom');
    let pinID = getInputValue('inputPIN');
    let nameID = getInputValue('inputUser');
    let scoreID;
    //if ($myRoom.score = undefined) $myRoom.score = 16;
    if ($myRoom.score >= 0) scoreID = $myRoom.score;
    else $myRoom.score = 16;
    //console.log($myRoom, scoreID);
    if ((roomID != '') && (pinID != '') && (nameID != '')) {
        let userID;
        //let elMng = document.getElementById('mngBox');
        $myRoom.room = roomID;
        $myRoom.pin = pinID;
        $myRoom.name = nameID;
        $myRoom.status = i;
        userID = setUserID();
        $myRoom.userID = userID;
        saveData(roomID, nameID, pinID, $myRoom.score, $myRoom.deck, i, userID);

    }
}

//Form for collecting room login information
const roomForm = () => {
    const formEl = document.querySelector('#inputForm');
    formEl.addEventListener('submit', e => {
        let i = 0; //join
        submitForm(e, i)
    });

}

//Save to firebase
function saveData(room, name, pin, score, deck, status, userID) {
    //refer to specific database
    const roomDB = firebase.database().ref('rooms/' + room + pin + '/' + name);
    roomDB.set({
        room: room,
        name: name,
        pin: pin,
        score: score,
        deck: deck,
        status: status,
        userID: userID
    });
}

//Update firebase
function updateData() {
    //console.log($myRoom);
    const roomDB = firebase.database().ref('rooms/' + $myRoom.room + $myRoom.pin + '/' + $myRoom.name);  //refer to specific database
    roomDB.update({
        //room: room,
        //name: name,
        //pin: pin,
        deck: $myRoom.deck,
        score: $myRoom.score,
        status: $myRoom.status
    });
    //readData();
}

function updateAllData() {
    //console.log($myRoom);
    const roomDB = firebase.database().ref('rooms/' + $myRoom.room + $myRoom.pin);  //refer to specific database
    roomDB.once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            //console.log(child.val().userID);
            if (child.val().userID != $myRoom.userID) {
                child.ref.update({
                    deck: $myRoom.deck,
                    score: 16,
                    status: 0
                })
            }
        })
    })
    readData();
}


//Read from Firebase
function readData() {
    let roomNr = document.getElementById('roomNr');
    let statusChange = false;
    let roomID = $myRoom.room;
    let pinID = $myRoom.pin;
    let scoreEl = document.getElementById('scores');
    for (let i = 0; i < $resultsTab.length; i++) $resultsTab[i] = 0;

    scoreEl.innerHTML = ``;
    roomNr.textContent = roomID;

    //let roomJoin = 
    firebase.database().ref('rooms/' + roomID + pinID).once('value', function (snapshot) {
        let userData = new Array;
        snapshot.forEach(
            function (ChildSnapshot) {
                let name = ChildSnapshot.val().name;
                let pin = ChildSnapshot.val().pin;
                let room = ChildSnapshot.val().room;
                let score = ChildSnapshot.val().score;
                let deck = ChildSnapshot.val().deck;
                let status = ChildSnapshot.val().status;
                let userID = ChildSnapshot.val().userID;
                userData.push([name, score, status, deck, room, userID]);
                if (status > 0) {
                    $myRoom.deck = deck;
                    //console.log(name, score, deck, status);
                    if (status > 1) $showHide = true;
                    if (status == 1) $showHide = false;
                }
                $resultsTab[score]++;
            }
        );
        //console.log($myRoom);
        userData.forEach(e => {
            if ((e[2] > 0 && $myRoom.status > 0) && (e[5] !== $myRoom.userID)) {
                $myRoom.status = 0;
                statusChange = true;
            }
        })


        //console.log($myRoom.room, $myRoom.name, $myRoom.pin, $myRoom.score, $myRoom.deck, $myRoom.status);
        if (statusChange) {
            updateData();
        }
        else {
            let scoreEl = document.getElementById('scores');
            scoreEl.innerHTML = ``;
            userData.forEach(e => {
                updateScores(e);
            })
        }
        //if (statusChange) updateData($myRoom.room, $myRoom.name, $myRoom.pin, $myRoom.score, $myRoom.deck, $myRoom.status)
        setTimeout(displayResults, 100);
        setTimeout(deckDisplay($myRoom.deck), 100);
    });

}

function selectResult(selectedID) {
    if (selectedID !== '116-box') {
        //console.log(selectedID);
        //console.log($myRoom);
        if ($myRoom.selectedID !== undefined) {
            let selectedEl = document.getElementById($myRoom.selectedID);
            selectedEl.classList.remove('selected');
        }
        selectedEl = document.getElementById(selectedID);
        selectedEl.classList.add('selected');
        $myRoom.selectedID = selectedID;
        $myRoom.score = Number(selectedID[1] + selectedID[2]) - 1;
        //console.log($myRoom);
        if ($myRoom.room !== undefined && $myRoom.score >= 0) updateData()
        readData();
    }
    else if ($myRoom.room !== '') {
        //selectedEl.classList.remove('selected');
        if ($myRoom.status > 0) updateAllData();
        readData();
    }
}

//collecting score result from clicks on cards
const checkCard = (e) => {
    let selectedEl;
    let selectedID = e.target.closest('div').id;
    selectedEl = document.getElementById(selectedID);
    if (selectedEl.classList.contains('cardBox')) {
        selectResult(selectedID);
    }
}

function generateID() {
    let newID;
    let timeSet = new Date();

    newID = timeSet.getTime();
    newID = newID + Math.floor(Math.random() * 1000000000000);
    //console.log(userID);
    return newID;
}

const clickActions = (e) => {
    e.preventDefault();
    //e.stopPropagation();
    console.log(e)
    console.log(e.target)
    console.log(e.target.parentElement)
    //New task
    if (e.target.closest('button').classList.contains('taskAddBtn')) {
        const btnEl = document.getElementById(e.target.closest('button').id);
        const newTask = document.createElement('div');
        const taskTextArea = document.createElement('textarea');
        const taskID = generateID();
        const spanX = document.createElement('button');
        const spanLA = document.createElement('button');
        const spanRA = document.createElement('button');
        const headerTask = document.createElement('span');
        spanX.innerHTML = iconSet.x;
        spanX.classList.add('delete', 'taskBtn');
        spanLA.innerHTML = iconSet.leftArrow;
        spanLA.classList.add('left', 'taskBtn');
        spanRA.innerHTML = iconSet.rightArrow;
        spanRA.classList.add('right', 'taskBtn');
        btnEl.after(newTask);
        newTask.classList = 'task';
        newTask.id = taskID;
        headerTask.textContent = " Id: " + taskID + " ";
        newTask.append(spanLA);
        newTask.appendChild(headerTask);
        newTask.appendChild(spanRA);
        newTask.appendChild(spanX);
        newTask.appendChild(taskTextArea);
        taskTextArea.classList.add('taskText');
        taskTextArea.placeholder =
            'As a ... I want to... So that...';
        taskTextArea.rows = 5;
    }
    if (e.target.parentElement.parentElement.classList.contains('delete')) {
        e.target.parentElement.parentElement.parentElement.remove();
    }
    if (e.target.parentElement.classList.contains('delete')) {
        e.target.parentElement.parentElement.remove();
    }
    if (e.target.classList.contains('delete')) {
        e.target.parentElement.remove();
    }

    if (e.target.parentElement.classList.contains('left')) {
        console.log('left')
    }
    if (e.target.parentElement.classList.contains('right')) {
        console.log('right')
    }

}

function darkLight() {
    containerBox = document.querySelector('#container');
    if (containerBox.classList.contains('darkMode')) {
        containerBox.classList.remove('darkMode');
        document.documentElement.style.setProperty('--color', 'black');
        document.documentElement.style.setProperty('--background-color', 'white');
    }
    else {
        containerBox.classList.add('darkMode');
        document.documentElement.style.setProperty('--color', 'white');
        document.documentElement.style.setProperty('--background-color', ' rgb(44, 44, 44)');
    }
}

const addTask = (e) => {
    const divElID = e.target.closest('div').id;
    const divEl = getElementById('divElID');
    console.log(divElID);
    console.log(divEl);
}


const prepareDOMElements = () => {
    $cardList = document.querySelector('#board');
    $taskBoxes = document.getElementsByClassName('taskBox');
    console.log($taskBoxes);
}

const prepareDOMEvents = () => {
    let darkLightBtn = document.querySelector('#darkLight');
    let boardEl = document.getElementById('board');
    darkLightBtn.addEventListener('click', darkLight);
    boardEl.addEventListener('click', clickActions);
}

const main = () => {
    darkLight()
    roomForm();
    //displayCards();
    //displayResults();
    prepareDOMElements();
    prepareDOMEvents();
}

document.addEventListener('DOMContentLoaded', main);