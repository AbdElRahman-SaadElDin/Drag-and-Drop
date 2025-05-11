const textInput = document.getElementById("textVal");
const sections = document.querySelectorAll(".tasksSection");
const addButton = document.querySelector(".add-project-btn");

let tasksList = JSON.parse(localStorage.getItem("tasksList")) || [];

// save tasksList to local storage
function saveTasks() {
  localStorage.setItem("tasksList", JSON.stringify(tasksList));
}

// create task as a li element
function createTask(task) {
  const li = document.createElement("li");
  li.textContent = task.name;
  li.setAttribute("draggable", true);
  li.className = "task-card";
  li.id = task.id;
  // add event to the task when start dragging
  li.addEventListener("dragstart", dragStart);
  return li;
}

// display tasks in the correct section
function displayTasks() {
  sections.forEach((section) => (section.innerHTML = ""));
  tasksList.forEach((task) => {
    const section = document.querySelector(
      `.tasksSection[data-type="${task.category}"]`
    );
    if (section) {
      const li = createTask(task);
      section.appendChild(li);
    }
  });
}

// add task function
function addTask(name) {
  const task = {
    id: Date.now().toString(),
    name,
    category: "progress",
  };
  tasksList.push(task);
  saveTasks();
  displayTasks();
}

// add task button when click
addButton.addEventListener("click", (e) => {
  e.preventDefault();
  const value = textInput.value.trim();
  if (value) {
    addTask(value);
    textInput.value = "";
  }
});

let draggedTaskId = null;

// drag tasks function to get the task id
function dragStart(e) {
  e.dataTransfer.setData("text", e.target.id);
}

sections.forEach((section) => {
  section.addEventListener("dragover", (e) => e.preventDefault());

  // drop tasks function to get the task id and give it the new category
  section.addEventListener("drop", (e) => {
    e.preventDefault();
    const category = section.dataset.type;
    const taskId = e.dataTransfer.getData("text");
    const taskIndex = tasksList.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      tasksList[taskIndex].category = category;
      saveTasks();
      displayTasks();
    }
  });
});

// display tasks once the page loads
displayTasks();
