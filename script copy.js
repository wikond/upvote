//'use strict'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDg9dYq-UD0-UVMR0HXAmBGK1J5Jgh9u1E",
    authDomain: "upvotetopic.firebaseapp.com",
    databaseURL: "https://upvotetopic-default-rtdb.firebaseio.com",
    projectId: "upvotetopic",
    storageBucket: "upvotetopic.appspot.com",
    messagingSenderId: "47701147936",
    appId: "1:47701147936:web:86c606312489752dca9745",
    measurementId: "G-GLW2RZPFRD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

//Global variables 
//task object constructor
function Task(boardID, nameID, pinID, headerTxt, descTxt, statusID, priorityID, columnID, taskID, categoryID, owner, timeStamp) {
    this.boardID = boardID;
    this.pin = pinID;
    this.nameID = nameID;
    this.header = headerTxt;
    this.desc = descTxt;
    this.columnID = columnID;
    this.taskID = taskID;
    this.priorityID = priorityID;
    this.status = statusID;
    this.categoryID = categoryID;
    this.owner = owner;
    this.timeStamp = timeStamp;
}
function Scores() {
    this.scores = $MyScoresTab;
    this.userName = $myBoard.nameID;
}
const $MyScores = new Map();
const $MyScoresTab = [];
let $allScoresTab = [];
let $allScoresMap = new Map();
let $MyTopicsTab = [];
const $taskMap = new Map();
let $taskBoxes;     // DOM elements - div-s for dynymic collection of tasks
let $addTaskBtns;   // collection of add new task buttons in columns

//icons set
const iconSet = {
    leftArrow: `<svg xmlns=" http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path fill-rule="evenodd"
    d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" /></svg>`,
    rightArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path fill-rule="evenodd"
    d="M4 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5A.5.5 0 0 0 4 8z" /> </svg>`,
    upArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" /> </svg>`,
    downArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" /> </svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class= "bi bi-x-circle" viewBox="0 0 16 16" > <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" /> </svg >`,
    thumb: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
    </svg>`
}

// ----------------------------------
//Global variables 
//main board room data object constructor
const myBoard = function (boardID, nameID, pinID, statusID, userID) {
    this.boardID = boardID;
    this.pinID = pinID;
    this.nameID = nameID;
    this.statusID = statusID;
    this.userID = userID
}
let $myBoard = new myBoard(0, 0, 0, 0, 0);


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

function updateScores() {
    console.log($allScoresTab);
    console.log($allScoresTab[0]);

}

function submitForm(e, i) {
    e.preventDefault();
    //Get values from form
    let boardID = getInputValue('inputBoard');
    let pinID = getInputValue('inputPIN');
    let nameID = getInputValue('inputUser');

    if ((boardID != '') && (pinID != '')) {
        $myBoard.boardID = boardID;
        $myBoard.pinID = pinID;
        $myBoard.nameID = nameID;
        displayBoard();
        setTimeout(readData('scores'), 1000);
        setTimeout(updateScores(), 1000);
        setTimeout(readData('topics'), 1000);

    }
}

//Form for collecting room login information
const boardForm = () => {
    const formEl = document.querySelector('#inputForm');
    formEl.addEventListener('submit', e => {
        let i = 0; //join
        submitForm(e, i)
    });

}
//----------------------------------------------

//Save to firebase
function saveData(hive, selector, dataObj) {
    // ($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', textAreaEl.value, 1, 1, 1, taskID, 1, 'owner', timeStamp);
    //refer to specific database
    const roomDB = firebase.database().ref(hive + $myBoard.boardID + $myBoard.pinID + '/' + selector);
    roomDB.set({
        dataObj: dataObj
    });
}

function deleteData(hive, taskID) {
    // ($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', textAreaEl.value, 1, 1, 1, taskID, 1, 'owner', timeStamp);
    //refer to specific database
    const roomDB = firebase.database().ref(hive + $myBoard.boardID + $myBoard.pinID + '/' + taskID);
    roomDB.remove();
}

//Update firebase
function updateData(hive) {
    //console.log($myBoard);
    const roomDB = firebase.database().ref(hive + $myBoard.boardID + $myBoard.pinID + '/' + $myBoard.name);  //refer to specific database
    roomDB.update({
        //room: room,
        //name: name,
        //pin: pin,
        deck: $myBoard.deck,
        score: $myBoard.score,
        status: $myBoard.status
    });
    //readData(topic);
}

function updateAllData(hive) {
    //console.log($myBoard);
    const roomDB = firebase.database().ref(hive + $myBoard.boardID + $myBoard.pinID);  //refer to specific database
    roomDB.once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            //console.log(child.val().userID);
            if (child.val().userID != $myBoard.userID) {
                child.ref.update({
                    deck: $myBoard.deck,
                    status: 0
                })
            }
        })
    })
    //readData(topic);
}


//Read from Firebase
function readData(hive) {
    let dataObjTab = [];
    firebase.database().ref(hive + $myBoard.boardID + $myBoard.pinID).once('value', function (snapshot) {
        snapshot.forEach(
            function (ChildSnapshot) {
                let dataObj;
                dataObj = ChildSnapshot.val().dataObj;
                // console.log(ChildSnapshot.val());
                //dataObjTab.push(dataObj);
                // console.log(hive);
                // console.log(dataObj);
                if (hive == 'topics') displayTask(dataObj.taskID, dataObj);
                if (hive == 'scores') {
                    let newScoreObj = new Scores();
                    newScoreObj.userName = dataObj.userName;
                    newScoreObj.scores = dataObj.scores;
                    $allScoresTab.push(newScoreObj);
                    newScoreObj.scores.forEach(el => {
                        console.log(el);
                        if ($allScoresMap.has(el)) {
                            let newScore = $allScoresMap.get(el)++;
                            $allScoresMap.set(el, newScore);
                        }
                        else $allScoresMap.set(el, 1);
                        if (dataObj.userName == $myBoard.nameID) {
                            $MyScoresTab.push(el);
                        }
                    })
                }

                //$taskMap.set(taskObj.taskID, taskObj);
                //displayTask(taskObj.taskID, taskObj);
            }
        );
        //setTimeout(displayBoard, 100);
    });
}

const displayTask = (taskID, newTaskObj) => {
    const colEl = document.getElementById(newTaskObj.columnID + 'colBox');
    let newTask = document.getElementById(taskID);
    if (newTask == null) {
        newTask = document.createElement('div');
        colEl.appendChild(newTask);
    }
    else newTask.innerHTML = ``;

    const colTxt = document.createElement('div');
    const colBtns = document.createElement('div');
    const taskTextArea = document.createElement('textarea');
    //const taskID = generateID();
    const headerTask = document.createElement('div');
    const spanX = document.createElement('button');
    const spanLA = document.createElement('button');
    const spanT = document.createElement('button');
    const scoreEl = document.createElement('button');
    const timeNow = new Date();
    const timeStamp = timeNow.getTime();

    colTxt.classList.add('col-9');
    colBtns.classList.add('col-3', 'px-1');
    spanX.innerHTML = iconSet.x;
    spanX.classList.add('delete', 'taskBtn', 'text-danger');
    spanT.innerHTML = iconSet.thumb;
    spanT.classList.add('right', 'taskBtn', 'text-success');

    //btnEl.after(newTask);
    newTask.classList.add('task', 'row');
    newTask.id = taskID;

    scoreEl.classList.add('btn', 'score');

    if ($MyScoresTab.includes(Number(taskID))) {
        scoreEl.classList.add('btn-success');
    }
    else scoreEl.classList.add('btn-primary');

    let scoreTotal = 0;
    if ($allScoresMap.has(taskID)) scoreTotal = $allScoresMap.get(taskID);
    scoreEl.innerText = scoreTotal;
    // colTxt.classList.add('border');
    // colBtns.classList.add('border');

    headerTask.textContent = "Id:" + taskID + "";
    headerTask.classList.add('fw-lighter', 'taskID')
    //newTask.append(spanLA);
    newTask.appendChild(colTxt);
    newTask.appendChild(colBtns);
    colTxt.appendChild(taskTextArea);
    colTxt.appendChild(headerTask);
    colBtns.appendChild(scoreEl);
    colBtns.appendChild(spanX);
    //colBtns.appendChild(spanT); //thumb svg
    taskTextArea.classList.add('taskText');
    if (newTaskObj.desc == null) {
        taskTextArea.placeholder = 'Please add here your topic';
    }
    else taskTextArea.value = newTaskObj.desc;
    //taskTextArea.rows = 2;
    //let owner = '';
    //Task(boardID, nameID, pinID, headerTxt, descTxt, statusID, priorityID, columnID, taskID, categoryID, owner)
    //let newTaskObj = new Task($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', 'As a...', 1, 1, 1, taskID, 1, owner, timeStamp);
    //$taskMap.set(taskID, newTaskObj);

}


const displayBoard = () => {
    const containerEl = document.querySelector('#board');
    containerEl.innerHTML = ``;
    colHeaders = ['Topics:']
    for (let i = 0; i < 1; i++) {
        let divEl = document.createElement('div');
        //divEl.classList.add('colBox');
        if (i < 6) divEl.classList.add('raw');
        else divEl.classList.add('raw');
        divEl.id = i + 'colBox';
        let h3El = document.createElement('h3');

        containerEl.appendChild(divEl);
        divEl.appendChild(h3El);
        h3El.textContent = colHeaders[i];
        //<button type="" class="btn btn-secondary pl-2 taskAddBtn" id="1taskAdd">Add new task</button>
        if (i == 0) {
            let buttEl = document.createElement('button');
            buttEl.classList.add('btn', 'btn-primary', 'pl-2', 'taskAddBtn');
            buttEl.id = '1taskAdd';
            buttEl.innerText = 'Add new topic';
            divEl.appendChild(buttEl);
            h3El.classList.add('fw-lighter');
        }
        else h3El.classList.add('fw-light');
    }
    let divEl = document.createElement('div');
    divEl.classList.add('row', 'footerSpace');
    containerEl.appendChild(divEl);
}

function generateID() {
    let newID;
    let timeSet = new Date();

    newID = timeSet.getTime();
    newID = newID + Math.floor(Math.random() * 100000000000);
    return newID;
}

const setScore = (taskID, scoreVal) => {
    let scoreTotal = scoreVal;
    if ($allScoresMap.has(taskID)) {
        scoreTotal = $allScoresMap.get(taskID);
        scoreTotal += scoreVal;
    }
    $allScoresMap.set(taskID, scoreTotal);
    return scoreTotal;
}
const clickActions = (e) => {
    e.preventDefault();
    //e.stopPropagation();
    //New task
    // if ($myBoard.boardID == 0) alert('Please join your board first')
    if ((e.target.closest('button') !== null)) {
        //&& ($myBoard.boardID !== 0)) {
        // && $myBoard.boardID == 0) {  // !!! change to !==
        if (e.target.closest('button').classList.contains('taskAddBtn')) {
            const taskID = generateID();
            const timeNow = new Date();
            const timeStamp = timeNow.getTime();
            let owner = '';
            // //Task(boardID, nameID, pinID, headerTxt, descTxt, statusID, priorityID, columnID, taskID, categoryID, owner, timestamp)
            let newTaskObj = new Task($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', null, 1, 1, 0, taskID, 1, owner, timeStamp);
            $taskMap.set(taskID, newTaskObj);
            $MyScores.set(taskID, 1);
            $MyScoresTab.push(taskID);
            saveData('topics', taskID, newTaskObj);
            displayTask(taskID, newTaskObj);

        }

        if (e.target.closest('button').classList.contains('delete')) {
            let taskID = e.target.closest('button').parentElement.parentElement.id;
            let mapKey = Number(taskID);
            if ($MyScoresTab.includes(Number(taskID))) {
                $MyScoresTab.splice($MyScoresTab.indexOf(Number(taskID)), 1);
            }
            $taskMap.delete(mapKey); // remove task from map tabble 
            e.target.closest('button').parentElement.parentElement.remove(); // remove task from board
            deleteData('topics', mapKey);
        }
        if (e.target.closest('button').classList.contains('score')) {
            let taskEl = e.target.closest('div').parentElement;
            let taskID = Number(e.target.closest('div').parentElement.id);
            const timeNow = new Date();
            let timeStamp = timeNow.getTime();
            let taskObj = $taskMap.get(taskID);
            let scoreVal;

            if ($MyScoresTab.includes(Number(taskID))) {
                $MyScoresTab.splice($MyScoresTab.indexOf(Number(taskID)), 1);
                scoreVal = setScore(taskID, -1);
            }
            else {
                $MyScoresTab.push(taskID);
                scoreVal = setScore(taskID, 1);
            }


            //let descTxt = taskObj.desc;
            let descTxt = "What is the idea?";
            let newTaskObj = new Task($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', descTxt, 1, scoreVal, 0, taskID, 1, 'owner', timeStamp);
            $taskMap.set(taskID, newTaskObj);


            const MyScoresObj = new Scores();
            MyScoresObj.scores = $MyScoresTab;
            MyScoresObj.userName = $myBoard.nameID;
            //console.log($myBoard);

            saveData('scores', $myBoard.nameID, MyScoresObj);

            saveData('topics', taskID, newTaskObj);
            displayTask(taskID, newTaskObj);
        }


    }

    if (e.target.closest('textarea')) {
        let textAreaEl = e.target.closest('textarea');
        let mapKey = Number(textAreaEl.parentElement.id);

        textAreaEl.addEventListener('change', (e) => {
            const timeNow = new Date();
            let timeStamp = timeNow.getTime();
            let taskID = Number(textAreaEl.parentElement.parentElement.id);
            let colName = textAreaEl.parentElement.parentElement.parentElement.id;
            let colID = Number(colName[0]);

            let newTaskObj = new Task($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', textAreaEl.value, 1, 1, colID, taskID, 1, 'owner', timeStamp);
            $taskMap.set(taskID, newTaskObj);
            saveData('topics', taskID, newTaskObj);
            displayTask(taskID, newTaskObj);
        });
    }
}

function darkLight() {
    containerBox = document.querySelector('body');
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
}

const prepareDOMElements = () => {
    $cardList = document.querySelector('#board');
    $taskBoxes = document.getElementsByClassName('taskBox');
}

const prepareDOMEvents = () => {
    let darkLightBtn = document.querySelector('#darkLight');
    let boardEl = document.getElementById('board');
    darkLightBtn.addEventListener('click', darkLight);
    boardEl.addEventListener('click', clickActions);
}

const main = () => {
    displayBoard();
    darkLight()
    boardForm();
    prepareDOMElements();
    prepareDOMEvents();
}

document.addEventListener('DOMContentLoaded', main);