document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("task");
  const datetimeInput = document.getElementById("datetime");
  const taskList = document.getElementById("taskList");
  const historyLink = document.getElementById("historyLink");
  const homeLink = document.getElementById("homeLink");
  const historyContent = document.getElementById("historyContent");
  const homeContent = document.getElementById("homeContent");
  
  const historyTable = document.getElementById("historyTable").getElementsByTagName("tbody")[0];
  const backToHomeBtn = document.getElementById("backToHomeBtn");

  let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

  // Display saved tasks on load in the home content
  savedTasks.forEach(task => {
    displayTask(task);
  });

  // Handle form submission to add a task
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskText = taskInput.value;
    const taskTime = datetimeInput.value;

    if (taskText && taskTime) {
      const task = {
        text: taskText,
        time: taskTime,
        completed: false,
        id: Date.now(), // Unique ID for each task
      };

      savedTasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(savedTasks));

      displayTask(task);
      setReminder(task);
    }

    taskInput.value = '';
    datetimeInput.value = '';
  });

  // Display task in the list
  function displayTask(task) {
    const taskItem = document.createElement("li");
    taskItem.dataset.id = task.id;
    taskItem.classList.toggle("completed", task.completed);

    const taskText = document.createElement("span");
    taskText.textContent = `${task.text} - ${dayjs(task.time).format("MMM D, YYYY h:mm A")}`;
    taskItem.appendChild(taskText);

    const completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.textContent = task.completed ? "Undo" : "Complete";
    completeButton.addEventListener("click", () => toggleComplete(task));
    taskItem.appendChild(completeButton);

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeTask(task));
    taskItem.appendChild(removeButton);

    taskList.appendChild(taskItem);
  }

  // Mark task as completed or undo
  function toggleComplete(task) {
    task.completed = !task.completed;
    const taskIndex = savedTasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      savedTasks[taskIndex].completed = task.completed;
      localStorage.setItem("tasks", JSON.stringify(savedTasks));
    }

    const taskItem = document.querySelector(`[data-id="${task.id}"]`);
    taskItem.classList.toggle("completed", task.completed);
    const completeButton = taskItem.querySelector(".complete");
    completeButton.textContent = task.completed ? "Undo" : "Complete";

    if (task.completed) {
      completedTasks.push({ ...task, completedAt: new Date() });
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    } else {
      completedTasks = completedTasks.filter(t => t.id !== task.id);
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    }
  }

  // Remove task from list and localStorage
  function removeTask(task) {
    savedTasks = savedTasks.filter(t => t.id !== task.id);
    localStorage.setItem("tasks", JSON.stringify(savedTasks));
    const taskItem = document.querySelector(`[data-id="${task.id}"]`);
    taskItem.remove();
  }

  // Set reminder for task
  function setReminder(task) {
    const taskTime = dayjs(task.time).toDate();
    const now = new Date();
    const timeDifference = taskTime - now;

    if (timeDifference > 0) {
      setTimeout(() => {
        alert(`Reminder: It's time to do "${task.text}"!`);
        new Notification("Task Reminder", {
          body: `It's time to do "${task.text}"!`,
        });
      }, timeDifference);
    }
  }

  // Show the history of completed tasks
  historyLink.addEventListener("click", function() {
    homeContent.style.display = "none";
    historyContent.style.display = "block";

    // Clear tasks older than 48 hours from history
    const now = new Date();
    const filteredHistory = completedTasks.filter(task => {
      const timeDiff = now - new Date(task.completedAt);
      return timeDiff <= 48 * 60 * 60 * 1000; // 48 hours in milliseconds
    });

    // Save updated history in localStorage
    localStorage.setItem("completedTasks", JSON.stringify(filteredHistory));

    // Display the history
    historyTable.innerHTML = ""; // Clear existing table content
    filteredHistory.forEach(task => {
      const row = historyTable.insertRow();
      const taskCell = row.insertCell(0);
      const timeCell = row.insertCell(1);
      const timePassedCell = row.insertCell(2);

      taskCell.textContent = task.text;
      timeCell.textContent = dayjs(task.completedAt).format("MMM D, YYYY h:mm A");
      const timePassed = Math.floor((now - new Date(task.completedAt)) / (1000 * 60 * 60)) + " hours ago";
      timePassedCell.textContent = timePassed;
    });
  });

  // Show the calendar
  calendarLink.addEventListener("click", function() {
    homeContent.style.display = "none";
    historyContent.style.display = "none";
    calendarContent.style.display = "block";
  });

  // Go back to home from history or calendar
  backToHomeBtn.addEventListener("click", function() {
    homeContent.style.display = "block";
    historyContent.style.display = "none";
    calendarContent.style.display = "none";
  });

  // Go to home when clicking the Home link
  homeLink.addEventListener("click", function() {
    homeContent.style.display = "block";
    historyContent.style.display = "none";
    calendarContent.style.display = "none";
  });

  // Optionally, request notification permission
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});

let hr = document.querySelector('#hr');
let mn = document.querySelector('#mn');
let sc = document.querySelector('#sc');

setInterval(() => {
    let day = new Date();
    let hh = day.getHours() * 30;
    let mm = day.getMinutes() * 6;
    let ss = day.getSeconds() * 6;

    hr.style.transform = `rotateZ(${hh + (mm / 12)}deg)`
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;


    // digital clock
    let hours = document.getElementById('hours');
    let minutes = document.getElementById('minutes');
    let seconds = document.getElementById('seconds');
    let ampm = document.getElementById('ampm');

    let h = new Date().getHours();
    let m = new Date().getMinutes();
    let s = new Date().getSeconds();

    let am = h >= 12 ? "PM" : "AM";

    // convert 24h clock to 12hr clock
    if (h > 12) {
        h = h - 12;
    }

    // add zero before single digit number
    h = (h < 10) ? "0" + h : h
    m = (m < 10) ? "0" + m : m
    s = (s < 10) ? "0" + s : s

    hours.innerHTML = h;
    minutes.innerHTML = m;
    seconds.innerHTML = s;
    ampm.innerHTML = am;

});

import { neonCursor } from
https://unpkg.com/threejs-toy,
neonCursor({
  el: document.getElementById ('cursor'),
  shaderPoints: 16,
  curvePoints: 80,
  curveLerp: 0.5,
  radius1: 5,
  radius2: 30,
  velocityTreshold: 10,
  sleepRadiusX: 100,
  sleepRadiusY: 100,
  sleepTimeCoefX: 0.0025,
  sleepTimeCoefY: 0.0025
})