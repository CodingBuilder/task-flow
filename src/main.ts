// My First Project After Learning Typescript

// A Function To Activate The Desired Element
function activeHandler(

  elements: NodeListOf<HTMLElement>,
  currentElement: HTMLElement,
  keyName: string

): void {

  // Loop On Each Element And Remove The "active" Class
  elements.forEach((el) => {
    el.classList.remove("active");
  });

  // Add The "active" Class To The Desired Element
  currentElement.classList.add("active");

  // Get The Value Of The Element's Dataset
  let key = Object.keys(currentElement.dataset)[0];
  let value = currentElement.dataset[key];
  window.sessionStorage.setItem(keyName, value as string);

}

// A Function To Get The "active" Class Elements From The Session Storage
function sessionActiveHandler(

  elements: NodeListOf<HTMLElement>,
  currentElement: HTMLElement,
  keyName: string

): void {
  if (window.sessionStorage.getItem(keyName)) {

    // Get The Value Of The Element's Dataset
    let key = Object.keys(currentElement.dataset)[0];
    let value = currentElement.dataset[key];

    if (value === window.sessionStorage.getItem(keyName)) {

      elements.forEach((el) => {
        el.classList.remove("active");
      });
      
      currentElement.classList.add("active");

    }
  }
}

const sections = document.querySelectorAll("header .container ul li") as NodeListOf<Element>;

sections.forEach((section) => {

  sessionActiveHandler(sections as NodeListOf<HTMLElement>, section as HTMLElement, "section");

  section.addEventListener("click", (): void => {

    activeHandler(sections as NodeListOf<HTMLElement>, section as HTMLElement, "section");

    // Go To The Section That The Li Refers To
    if ((section as HTMLElement).dataset.section !== "home") {
      document.querySelector(`.${(section as HTMLElement).dataset.section}`)?.scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});

const icon = document.querySelector("header .container .icon") as HTMLSpanElement;
const sectionsList = document.querySelector("header .container ul") as HTMLUListElement;

// Show The List When Pressing The Icon On The Phones View
document.addEventListener("click", (e) => {

  if (icon.contains(e.target as Node)) {

    icon.classList.toggle("active");
    sectionsList.classList.toggle("show");

  } else {

    icon.classList.remove("active");
    sectionsList.classList.remove("show");

  }

});

const taskInput = document.querySelector("form .container .add input") as HTMLInputElement;

if (window.sessionStorage.getItem("task")) {
  taskInput.value = window.sessionStorage.getItem("task") || "";
}

taskInput.addEventListener("input", () => {
  window.sessionStorage.setItem("task", taskInput.value);
});

const addBtn = document.querySelector("form .container .add button") as HTMLButtonElement;
const tasksContainer = document.querySelector("form .container .list") as HTMLDivElement;

interface Task {
  title: string,
  completed: boolean
}

function getTasksData(): Task[] {
  return JSON.parse(window.localStorage.getItem("task-data") || "[]");
}

if (window.localStorage.getItem("task-data")) {

  let data = getTasksData();

  for (let i = 0; i < data.length; i++) {
    add(data[i]["title"], false, data[i]["completed"]);
  }

}

function add(taskTitle: string, toLocalStorage: boolean, completed: boolean = false): void {

  if (!taskTitle.trim()) return;

  let data = getTasksData();

  if (toLocalStorage && data.some(task => task.title === taskTitle)) return;

  let taskContainer = document.createElement("div");
  taskContainer.className = "task";

  let title = document.createElement("div");
  title.className = "title";
  taskContainer.appendChild(title);

  let task = document.createElement("p");
  task.textContent = taskTitle;

  let checkBtn = document.createElement("span");
  checkBtn.className = "finished";
  
  title.appendChild(checkBtn);
  title.appendChild(task);
  
  let removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.setAttribute("type", "button");
  
  removeBtn.addEventListener("click", () => removeTask(removeBtn, task));
  
  taskContainer.appendChild(removeBtn);
  tasksContainer.appendChild(taskContainer);
  
  if (completed) {
    completeHandler([checkBtn, task, taskContainer], "add");
  }

  taskContainer.addEventListener("click", () => {
    completeHandler([checkBtn, task, taskContainer], "toggle");

    let data = getTasksData();

    if (checkBtn.classList.contains("completed")) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]["title"] === task.textContent) {
          data[i]["completed"] = true;
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i]["title"] === task.textContent) {
          data[i]["completed"] = false;
        }
      }
    }
    window.localStorage.setItem("task-data", JSON.stringify(data));
  });

  if (toLocalStorage) {
    if (window.localStorage.getItem("task-data")) {
      let data = getTasksData();
      data.push({title: task.textContent, completed: false});
      window.localStorage.setItem("task-data", JSON.stringify(data));
    } else {
      window.localStorage.setItem("task-data", JSON.stringify([{title: task.textContent, completed: false}]));
    }
  }

}

function removeTask(element: HTMLElement, task: HTMLParagraphElement): void {
  element.parentElement?.remove();

  let data = getTasksData();

  for (let i = 0; i < data.length; i++) {
    if (data[i]["title"] === task.textContent) {
      data.splice(i, 1);
    }
  }

  window.localStorage.setItem("task-data", JSON.stringify(data));
}

// Add Or Toggle The Class "completed" To Every Element In The Given Array
function completeHandler(elements: Array<HTMLElement>, option: ("add" | "toggle")): void {
  elements.forEach((el) => {
    if (option === "add") {
      el.classList.add("completed");
    } else {
      el.classList.toggle("completed");
    }
  });
}

// If The User Pressed The Add Button, Add A New Task
addBtn.addEventListener("click", () => add(taskInput.value, true));

// If The User Pressed Enter, Add A New Task
taskInput.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
    add(taskInput.value, true);
  }
});

// Get The Current Year Dynamically
let year = document.querySelector("footer .container .copyright span.year") as HTMLSpanElement;

year.textContent = new Date().getFullYear().toString();