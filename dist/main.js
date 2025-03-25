"use strict";
function activeHandler(elements, currentElement, keyName) {
    elements.forEach((el) => {
        el.classList.remove("active");
    });
    currentElement.classList.add("active");
    let key = Object.keys(currentElement.dataset)[0];
    let value = currentElement.dataset[key];
    window.sessionStorage.setItem(keyName, value);
}
function sessionActiveHandler(elements, currentElement, keyName) {
    if (window.sessionStorage.getItem(keyName)) {
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
const sections = document.querySelectorAll("header .container ul li");
sections.forEach((section) => {
    sessionActiveHandler(sections, section, "section");
    section.addEventListener("click", () => {
        var _a;
        activeHandler(sections, section, "section");
        if (section.dataset.section !== "home") {
            (_a = document.querySelector(`.${section.dataset.section}`)) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});
const icon = document.querySelector("header .container .icon");
const sectionsList = document.querySelector("header .container ul");
document.addEventListener("click", (e) => {
    if (icon.contains(e.target)) {
        icon.classList.toggle("active");
        sectionsList.classList.toggle("show");
    }
    else {
        icon.classList.remove("active");
        sectionsList.classList.remove("show");
    }
});
const taskInput = document.querySelector("form .container .add input");
if (window.sessionStorage.getItem("task")) {
    taskInput.value = window.sessionStorage.getItem("task") || "";
}
taskInput.addEventListener("input", () => {
    window.sessionStorage.setItem("task", taskInput.value);
});
const addBtn = document.querySelector("form .container .add button");
const tasksContainer = document.querySelector("form .container .list");
function getTasksData() {
    return JSON.parse(window.localStorage.getItem("task-data") || "[]");
}
if (window.localStorage.getItem("task-data")) {
    let data = getTasksData();
    for (let i = 0; i < data.length; i++) {
        add(data[i]["title"], false, data[i]["completed"]);
    }
}
function add(taskTitle, toLocalStorage, completed = false) {
    if (!taskTitle.trim())
        return;
    let data = getTasksData();
    if (toLocalStorage && data.some(task => task.title === taskTitle))
        return;
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
        }
        else {
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
            data.push({ title: task.textContent, completed: false });
            window.localStorage.setItem("task-data", JSON.stringify(data));
        }
        else {
            window.localStorage.setItem("task-data", JSON.stringify([{ title: task.textContent, completed: false }]));
        }
    }
}
function removeTask(element, task) {
    var _a;
    (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
    let data = getTasksData();
    for (let i = 0; i < data.length; i++) {
        if (data[i]["title"] === task.textContent) {
            data.splice(i, 1);
        }
    }
    window.localStorage.setItem("task-data", JSON.stringify(data));
}
function completeHandler(elements, option) {
    elements.forEach((el) => {
        if (option === "add") {
            el.classList.add("completed");
        }
        else {
            el.classList.toggle("completed");
        }
    });
}
addBtn.addEventListener("click", () => add(taskInput.value, true));
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        add(taskInput.value, true);
    }
});
let year = document.querySelector("footer .container .copyright span.year");
year.textContent = new Date().getFullYear().toString();
//# sourceMappingURL=main.js.map