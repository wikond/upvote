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

let $taskBoxes;     // DOM elements - div-s for dynymic collection of tasks
let $addTaskBtns;   // collection of add new task buttons in columns

const $taskMap = new Map();
//icons set
const iconSet = {
    leftArrow: `<svg xmlns=" http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path fill-rule="evenodd"
    d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" /></svg>`,
    rightArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path fill-rule="evenodd"
    d="M4 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5A.5.5 0 0 0 4 8z" /> </svg>`,
    upArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" /> </svg>`,
    downArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" /> </svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class= "bi bi-x-circle" viewBox="0 0 16 16" > <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /> <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" /> </svg >`
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
        readData();
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
function saveData(taskID, taskObj) {
    // ($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', textAreaEl.value, 1, 1, 1, taskID, 1, 'owner', timeStamp);
    //refer to specific database
    const roomDB = firebase.database().ref('boards/' + $myBoard.boardID + $myBoard.pinID + '/' + taskID);
    roomDB.set({
        taskObj: taskObj
    });
}

function deleteData(taskID) {
    // ($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', textAreaEl.value, 1, 1, 1, taskID, 1, 'owner', timeStamp);
    //refer to specific database
    const roomDB = firebase.database().ref('boards/' + $myBoard.boardID + $myBoard.pinID + '/' + taskID);
    roomDB.remove();
}

//Update firebase
function updateData() {
    //console.log($myBoard);
    const roomDB = firebase.database().ref('boards/' + $myBoard.boardID + $myBoard.pinID + '/' + $myBoard.name);  //refer to specific database
    roomDB.update({
        //room: room,
        //name: name,
        //pin: pin,
        deck: $myBoard.deck,
        score: $myBoard.score,
        status: $myBoard.status
    });
    //readData();
}

function updateAllData() {
    //console.log($myBoard);
    const roomDB = firebase.database().ref('boards/' + $myBoard.boardID + $myBoard.pinID);  //refer to specific database
    roomDB.once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            //console.log(child.val().userID);
            if (child.val().userID != $myBoard.userID) {
                child.ref.update({
                    deck: $myBoard.deck,
                    score: 16,
                    status: 0
                })
            }
        })
    })
    //readData();
}


//Read from Firebase
function readData() {
    console.log($myBoard);
    firebase.database().ref('boards/' + $myBoard.boardID + $myBoard.pinID).once('value', function (snapshot) {
        let userData = new Array;
        snapshot.forEach(
            function (ChildSnapshot) {
                // let headerTxt = ChildSnapshot.val().headerTxt;
                // let descTxt = ChildSnapshot.val().descTxt;
                // let statusID = ChildSnapshot.val().statusID;
                // let priorityID = ChildSnapshot.val().priorityID;
                // let columnID = ChildSnapshot.val().columnID;
                // let taskID = ChildSnapshot.val().taskID;
                // let categoryID = ChildSnapshot.val().categoryID;
                // let owner = ChildSnapshot.val().owner;
                // let timeStamp = ChildSnapshot.val().timeStamp;
                let taskObj;
                taskObj = ChildSnapshot.val().taskObj;
                //userData.push([name, score, status, deck, room, userID]);

                //Task(boardID, nameID, pinID, headerTxt, descTxt, statusID, priorityID, columnID, taskID, categoryID, owner)
                //let newTaskObj = new Task($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, headerTxt, descTxt, statusID, priorityID, columnID, taskID, categoryID, owner, timeStamp);
                console.log(taskObj);
                $taskMap.set(taskObj.taskID, taskObj);
                console.log($taskMap);
                displayTask(taskObj.taskID, taskObj);
            }
        );

        //setTimeout(displayBoard, 100);
    });

}



const displayTask = (taskID, newTaskObj) => {
    console.log(' Display task')
    console.log(newTaskObj);
    const colEl = document.getElementById(newTaskObj.columnID + 'colBox');
    const newTask = document.createElement('div');
    const taskTextArea = document.createElement('textarea');
    //const taskID = generateID();
    const spanX = document.createElement('button');
    const spanLA = document.createElement('button');
    const spanRA = document.createElement('button');
    const headerTask = document.createElement('span');
    const timeNow = new Date();
    const timeStamp = timeNow.getTime();
    spanX.innerHTML = iconSet.x;
    spanX.classList.add('delete', 'taskBtn');
    spanLA.innerHTML = iconSet.leftArrow;
    spanLA.classList.add('left', 'taskBtn');
    spanRA.innerHTML = iconSet.rightArrow;
    spanRA.classList.add('right', 'taskBtn');
    //btnEl.after(newTask);
    colEl.appendChild(newTask);
    newTask.classList = 'task';
    newTask.id = taskID;
    headerTask.textContent = "Id:" + taskID + "";
    headerTask.classList.add('fw-lighter', 'taskID')
    newTask.append(spanLA);
    newTask.appendChild(headerTask);
    newTask.appendChild(spanRA);
    newTask.appendChild(spanX);
    newTask.appendChild(taskTextArea);
    taskTextArea.classList.add('taskText');
    //taskTextArea.placeholder = 'As a ... \n I (want to)... \n so that...';
    taskTextArea.value = newTaskObj.desc;
    taskTextArea.rows = 5;
    //let owner = '';
    //Task(boardID, nameID, pinID, headerTxt, descTxt, statusID, priorityID, columnID, taskID, categoryID, owner)
    //let newTaskObj = new Task($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', 'As a...', 1, 1, 1, taskID, 1, owner, timeStamp);
    //$taskMap.set(taskID, newTaskObj);

}


const displayBoard = () => {
    const containerEl = document.querySelector('#board');
    colHeaders = ['Product Backlog', 'Sprint Backlog', 'To Do', 'Doing', 'Verify', 'Done', 'Increment']
    for (let i = 0; i < 7; i++) {
        let divEl = document.createElement('div');
        divEl.classList.add('border', 'colBox');
        if (i < 6) divEl.classList.add('col-2');
        else divEl.classList.add('col-12');
        divEl.id = i + 'colBox';
        let h3El = document.createElement('h3');

        containerEl.appendChild(divEl);
        divEl.appendChild(h3El);
        h3El.textContent = colHeaders[i];
        //<button type="" class="btn btn-secondary pl-2 taskAddBtn" id="1taskAdd">Add new task</button>
        if (i == 0) {
            let buttEl = document.createElement('button');
            buttEl.classList.add('btn', 'btn-secondary', 'pl-2', 'taskAddBtn');
            buttEl.id = '1taskAdd';
            buttEl.innerText = 'Add new task';
            divEl.appendChild(buttEl);
            h3El.classList.add('fw-lighter');
        }
        else h3El.classList.add('fw-light');
    }
    let divEl = document.createElement('div');
    divEl.classList.add('row', 'footerSpace');
    containerEl.appendChild(divEl);
    console.log(containerEl);
}

function generateID() {
    let newID;
    let timeSet = new Date();

    newID = timeSet.getTime();
    newID = newID + Math.floor(Math.random() * 100000000000);
    return newID;
}

const clickActions = (e) => {
    e.preventDefault();
    //e.stopPropagation();
    //New task
    //console.log(e.target.closest('button'));
    //console.log($myBoard);
    if ((e.target.closest('button') !== null)) {
        // && $myBoard.boardID == 0) {  // !!! change to !==
        if (e.target.closest('button').classList.contains('taskAddBtn')) {
            // const btnEl = document.getElementById(e.target.closest('button').id);
            // const newTask = document.createElement('div');
            // const taskTextArea = document.createElement('textarea');
            const taskID = generateID();
            // const spanX = document.createElement('button');
            // const spanLA = document.createElement('button');
            // const spanRA = document.createElement('button');
            // const headerTask = document.createElement('span');
            const timeNow = new Date();
            const timeStamp = timeNow.getTime();
            // spanX.innerHTML = iconSet.x;
            // spanX.classList.add('delete', 'taskBtn');
            // spanLA.innerHTML = iconSet.leftArrow;
            // spanLA.classList.add('left', 'taskBtn');
            // spanRA.innerHTML = iconSet.rightArrow;
            // spanRA.classList.add('right', 'taskBtn');
            // //btnEl.after(newTask);
            // btnEl.parentElement.appendChild(newTask);
            // newTask.classList = 'task';
            // newTask.id = taskID;
            // headerTask.textContent = "Id:" + taskID + "";
            // headerTask.classList.add('fw-lighter', 'fs-6')
            // newTask.append(spanLA);
            // newTask.appendChild(headerTask);
            // newTask.appendChild(spanRA);
            // newTask.appendChild(spanX);
            // newTask.appendChild(taskTextArea);
            // taskTextArea.classList.add('taskText');
            // taskTextArea.placeholder =
            //     'As a ... \n I (want to)... \n so that...';
            // taskTextArea.rows = 5;
            let owner = '';
            // //Task(boardID, nameID, pinID, headerTxt, descTxt, statusID, priorityID, columnID, taskID, categoryID, owner, timestamp)
            let newTaskObj = new Task($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', 'As a...', 1, 1, 0, taskID, 1, owner, timeStamp);
            displayTask(taskID, newTaskObj);
            // $taskMap.set(taskID, newTaskObj);

        }
        // if (e.target.parentElement.parentElement.classList.contains('delete')) {
        //     e.target.parentElement.parentElement.parentElement.remove();
        // }
        // if (e.target.parentElement.classList.contains('delete')) {
        //     e.target.parentElement.parentElement.remove();
        // }
        if (e.target.closest('button').classList.contains('delete')) {
            let taskID = e.target.closest('button').parentElement.id;
            let mapKey = Number(taskID);
            $taskMap.delete(mapKey); // remove task from map tabble 
            e.target.closest('button').parentElement.remove(); // remove task from board
            deleteData(mapKey);
        }
        if ((e.target.closest('button').classList.contains('left')) || (e.target.closest('button').classList.contains('right'))) {
            let taskEl = e.target.closest('button').parentElement;
            let taskID = Number(e.target.closest('button').parentElement.id);
            let colEl = e.target.closest('button').parentElement.parentElement;
            let colElPrev = colEl.previousElementSibling;
            let colElNext = colEl.nextElementSibling;
            const timeNow = new Date();
            let timeStamp = timeNow.getTime();

            if ((e.target.closest('button').classList.contains('left')) && (colElPrev !== null)) colElPrev.appendChild(taskEl);
            console.log(colElPrev);
            if ((e.target.closest('button').classList.contains('right')) && (colElNext !== null)) colElNext.appendChild(taskEl);

            let colName = taskEl.parentElement.id;
            let colID = Number(colName[0]);
            let taskObj = $taskMap.get(taskID);
            let newTaskObj = new Task($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', taskObj.desc, 1, 1, colID, taskID, 1, 'owner', timeStamp);
            $taskMap.set(taskID, newTaskObj);
            saveData(taskID, newTaskObj);
        }


    }

    if (e.target.closest('textarea')) {
        let textAreaEl = e.target.closest('textarea');
        let mapKey = Number(textAreaEl.parentElement.id);

        textAreaEl.addEventListener('change', (e) => {
            const timeNow = new Date();
            let timeStamp = timeNow.getTime();
            let taskID = Number(textAreaEl.parentElement.id);
            let colName = textAreaEl.parentElement.parentElement.id;
            let colID = Number(colName[0]);

            let newTaskObj = new Task($myBoard.boardID, $myBoard.nameID, $myBoard.pinID, 'headerTxt', textAreaEl.value, 1, 1, colID, taskID, 1, 'owner', timeStamp);
            $taskMap.set(taskID, newTaskObj);
            saveData(taskID, newTaskObj);
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