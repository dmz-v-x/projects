const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const filters = document.querySelectorAll(".filter");
const counter = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompleted");

let currentFilter = "all";

/* ---------------- LOAD ---------------- */

window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => renderTask(task.text, task.completed));
  updateCounter();
};

/* ---------------- ADD TASK ---------------- */

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert("Task cannot be empty!");

  renderTask(text, false);
  saveTasks();
  updateCounter();

  taskInput.value = "";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

/* ---------------- RENDER ---------------- */

function renderTask(text, completed) {
  const li = document.createElement("li");
  li.draggable = true;

  const span = document.createElement("span");
  span.textContent = text;

  if (completed) li.classList.add("completed");

  const actions = document.createElement("div");
  actions.className = "actions";

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✓";
  completeBtn.className = "complete";
  completeBtn.onclick = () => {
    li.classList.toggle("completed");
    saveTasks();
    updateCounter();
    applyFilter();
  };

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit";
  editBtn.onclick = () => editTask(span);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✕";
  deleteBtn.className = "delete";
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
    updateCounter();
  };

  actions.append(completeBtn, editBtn, deleteBtn);

  li.append(span, actions);
  taskList.appendChild(li);

  addDragAndDrop(li);
  applyFilter();
}

/* ---------------- EDIT ---------------- */

function editTask(span) {
  const newText = prompt("Edit task:", span.textContent);
  if (newText !== null && newText.trim() !== "") {
    span.textContent = newText.trim();
    saveTasks();
  }
}

/* ---------------- SAVE ---------------- */

function saveTasks() {
  const tasks = [];

  document.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ---------------- FILTERS ---------------- */

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

function applyFilter() {
  document.querySelectorAll("li").forEach(li => {
    const completed = li.classList.contains("completed");

    li.style.display =
      currentFilter === "all" ? "flex" :
      currentFilter === "active" && !completed ? "flex" :
      currentFilter === "completed" && completed ? "flex" :
      "none";
  });
}

/* ---------------- COUNTER ---------------- */

function updateCounter() {
  const activeTasks = document.querySelectorAll("li:not(.completed)").length;
  counter.textContent = `${activeTasks} tasks left`;
}

/* ---------------- CLEAR COMPLETED ---------------- */

clearCompletedBtn.onclick = () => {
  document.querySelectorAll("li.completed").forEach(li => li.remove());
  saveTasks();
  updateCounter();
};

/* ---------------- DRAG & DROP ---------------- */

function addDragAndDrop(li) {
  li.addEventListener("dragstart", () => {
    li.classList.add("dragging");
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
    saveTasks();
  });
}

taskList.addEventListener("dragover", e => {
  e.preventDefault();

  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(taskList, e.clientY);

  if (afterElement == null) {
    taskList.appendChild(dragging);
  } else {
    taskList.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll("li:not(.dragging)")];

  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
