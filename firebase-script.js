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

const fbRef = firebase.database().ref();
console.log(fbRef);

// Set h1.htmlTitle
let title = document.getElementById('htmlTitle');
const fbTitleRef = fbRef.child('fbTitle');
fbTitleRef.on('value', (snapshot) => title.innerText = snapshot.val());

/**** Value ****/
// Create Firebase references
const fbObjRef = fbRef.child('fbObject');

//Sync fbObject "value" changes
fbObjRef.on('value', (snapshot) => {
  //displays entire object
  document.getElementById('htmlObject').innerText = JSON.stringify(snapshot.val(), null, 3)
});

/**** Children *****/
// Sync our skills additions
fbObjRef.child('skills').on('child_added', (snapshot) => {
  console.log(snapshot.val());
});

/**** TODOS *****/
// Set our ToDo unordered list
const htmlToDos = document.getElementById('todos');

// Create Firebase references
const fbToDoRef = fbRef.child('todos');

function showNewToDo (taskObj, taskId) {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  const lineBreak = document.createElement('br');
  checkbox.type = 'checkbox';
  // taskId gets snapshot.key
  checkbox.value = taskId;
  // `this` sends through input element
  // http://stackoverflow.com/questions/4471401/getting-value-of-html-checkbox-from-onclick-onchange-events
  checkbox.setAttribute('onchange', 'toggleTask(this)');
  checkbox.checked = taskObj.isDone || false;
  li.style = "display:inline; padding-left: 10px";
  li.innerText = taskObj.task;
  li.id = taskId;
  htmlToDos.appendChild(checkbox);
  htmlToDos.appendChild(li);
  htmlToDos.appendChild(lineBreak);
}

function toggleTask (self) {
  let taskId = self.value;
  let isChecked = self.checked;

  firebase.database().ref('todos/' + taskId + '/isDone').set(isChecked);
}

fbToDoRef.on('child_added', (snapshot) => {
  showNewToDo(snapshot.val(), snapshot.key)
});

// Sync our todos modifications
fbToDoRef.on('child_changed', (snapshot) => {
  const li = document.getElementById(snapshot.key);
  li.innerText = snapshot.val().task;
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
  fbRef.update(updates);
}

function getValue() {
  let task = document.getElementById('listInput').value;
  addNewTask(task);
}
