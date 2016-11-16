'use strict';


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA4u-k23ZkQE_pCc5WGbY7b53w8SfkujPo",
    authDomain: "fir-practice-704b9.firebaseapp.com",
    databaseURL: "https://fir-practice-704b9.firebaseio.com",
    storageBucket: "fir-practice-704b9.appspot.com",
    messagingSenderId: "693695430051"
  };
  firebase.initializeApp(config);


// Set h1.htmlTitle
let title = document.getElementById('htmlTitle');
const fbTitleRef = firebase.database().ref().child('fbTitle');
fbTitleRef.on('value', (snapshot) => title.innerText = snapshot.val());


//Set our preObject
const preObject = document.getElementById('htmlObject');


/**** Value ****/
// Create Firebase references
const fbObjectRef = firebase.database().ref().child('fbObject');

//Sync fbObject "value" changes
fbObjectRef.on('value', (snapshot) => {
  // console.log(snapshot.val());

  preObject.innerText = JSON.stringify(snapshot.val(), null, 3)
});


/**** Children *****/
// Create Firebase references
const fbListRef = fbObjectRef.child('skills');

// Sync our skills additions
fbListRef.on('child_added', (snapshot) => {
  console.log(snapshot.val());
});


/**** TODOS *****/
// Set our ToDo unordered list
const htmlToDos = document.getElementById('todos');

// Create Firebase references
const fbToDoRef = firebase.database().ref().child('todos');

// Sync our skills additions
let toDosRef = firebase.database().ref('todos/');

function showNewToDo (task, taskId) {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  const lineBreak = document.createElement('br');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('value', taskId);
  checkbox.setAttribute('onchange', 'toggleTask(this)');
  li.setAttribute('style', 'display:inline; padding-left: 10px');
  li.innerText = taskObj;
  li.id = taskId;
  htmlToDos.appendChild(checkbox);
  htmlToDos.appendChild(li);
  htmlToDos.appendChild(lineBreak);
}

function toggleTask (self) {
  console.log(self.value, 'is checked:', self.checked);
}

toDosRef.on('child_added', (snapshot) => {
  let key = snapshot.key;
  console.log(key);
  console.log(fbToDoRef.child(key));
  showNewToDo(snapshot.val(), snapshot.key)
});

// Sync our todos modifications
fbToDoRef.on('child_changed', (snapshot) => {
  const li = document.getElementById(snapshot.key);
  li.innerText = snapshot.val();
});

// Sync our todos deletions
fbToDoRef.on('child_removed', (snapshot) => {
  const li = document.getElementById(snapshot.key);
  li.remove();
});


// Add new tasks programatically
function addNewTask(task) {
  let todoItem = {
    task: task,
    isDone: false,
  }

  const taskId = fbToDoRef.push().key;

  let updates = {};
  updates['todos/' + taskId] = todoItem;

  firebase.database().ref().update(updates);
}

// function checkThatBox(value) {
//   console.log("You did it! ", value);
//   const newTaskKey = fbToDoRef.push().key;
//
//   let updates = {};
//   updates[newTaskKey] = value;
//
//   fbToDoRef.update(updates);
// }

function getValue() {
  let task = document.getElementById('listInput').value;
  addNewTask(task);
}
