document.getElementById("addTaskButton").onclick = () => addtask();
document.getElementById("taskInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addtask();
    }
});

const addtask = () => {
    const taskInput = document.querySelector("#taskInput");
    const taskText = taskInput.value.trim();
    const errorMsg = document.getElementById("errorMsg");
    let errorMessage = "";

    if (taskText.length < 5) {
        errorMessage = "Task must be at least 5 characters long";
    } else if (!isNaN(taskText.charAt(0))) {
        errorMessage = "Task cannot start with a number";
    }

    if (errorMessage !== "") {
        errorMsg.textContent = errorMessage;
        errorMsg.style.display = "block";
        return;
    }

    errorMsg.textContent = "";
    errorMsg.style.display = "none";

    const taskObj = { text: taskText, done: false };
    renderTask(taskObj);
    saveTaskToLocalStorage(taskObj);
    taskInput.value = "";
    checkIfNoTasks();
};

const renderTask = (task) => {
    if (!task || !task.text) return;

    const taskDiv = document.createElement("div");
    taskDiv.className = "task";

    const isChecked = task.done ? "checked" : "";
    const lineThrough = task.done ? "text-decoration: line-through;" : "";
    const color = task.done ? "color: red;" : "color: black;";

    taskDiv.innerHTML = `
    <div class="cart">
        <div class="CartText">
             <span style="${lineThrough} ${color}">${task.text}</span>
        </div>
        <div class="cartBtn">
        <input type="checkbox" class="taskCheckbox" onchange="toggleDone(this)" ${isChecked}>

            <button onclick="deleteTask(this)" class="cartDeletBtn">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
            </button>
            
            <button onclick="editTask(this)" class="cartEditBtn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
            </button>
            
           
        </div>
    </div>
    `;

    document.getElementById("taskList").appendChild(taskDiv);
};

const toggleDone = (checkbox) => {
    const taskDiv = checkbox.closest(".task");
    const span = taskDiv.querySelector("span");
    const taskText = span.textContent;

    span.style.textDecoration = checkbox.checked ? "line-through" : "none";
    span.style.color = checkbox.checked ? "red" : "black";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const index = tasks.findIndex(t => t.text === taskText);
    if (index !== -1) {
        tasks[index].done = checkbox.checked;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
};

const saveTaskToLocalStorage = (taskObj) => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const checkIfNoTasks = () => {
    const taskList = document.getElementById("taskList");
    const noTasksMsg = document.getElementById("noTasksMsg");
    const taskCount = taskList.querySelectorAll(".task").length;

    if (taskCount === 0) {
        noTasksMsg.style.display = "block";
        noTasksMsg.style.textAlign = "center";
    } else {
        noTasksMsg.style.display = "none";
    }
};

let taskToDeleteElement = null;
let taskToDeleteText = "";

const deleteTask = (btn) => {
    taskToDeleteElement = btn.closest(".task");
    taskToDeleteText = taskToDeleteElement.querySelector("span").textContent;
    document.getElementById("deleteConfirm").style.display = "flex";
};

document.getElementById("deleteConfirmYes").onclick = () => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.text !== taskToDeleteText);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    if (taskToDeleteElement) {
        taskToDeleteElement.remove();
    }

    document.getElementById("deleteConfirm").style.display = "none";
    checkIfNoTasks();
};

document.getElementById("deleteConfirmNo").onclick = () => {
    document.getElementById("deleteConfirm").style.display = "none";
};

let taskToEditElement = null;
let taskToEditText = "";

const editTask = (btn) => {
    taskToEditElement = btn.closest(".task");
    taskToEditText = taskToEditElement.querySelector("span").textContent;

    const input = document.getElementById("editTaskInput");
    input.value = taskToEditText;

    const editError = document.getElementById("editErrorMsg");
    editError.style.display = "none";
    editError.textContent = "";

    document.getElementById("editTask").style.display = "flex";
};

document.getElementById("editConfirmSave").onclick = () => {
    const newText = document.getElementById("editTaskInput").value.trim();
    const editError = document.getElementById("editErrorMsg");

    if (newText.length < 5) {
        editError.textContent = "Task must be at least 5 characters long";
        editError.style.display = "block";
        return;
    }
    if (!isNaN(newText.charAt(0))) {
        editError.textContent = "Task cannot start with a number";
        editError.style.display = "block";
        return;
    }

    if (taskToEditElement) {
        taskToEditElement.querySelector("span").textContent = newText;

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const index = tasks.findIndex(t => t.text === taskToEditText);
        if (index !== -1) {
            tasks[index].text = newText;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }

    editError.style.display = "none";
    editError.textContent = "";
    document.getElementById("editTask").style.display = "none";
};

document.getElementById("editConfirmCancel").onclick = () => {
    const editError = document.getElementById("editErrorMsg");
    editError.style.display = "none";
    editError.textContent = "";

    document.getElementById("editTask").style.display = "none";
};

const loadTasksFromLocalStorage = () => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => renderTask(task));
    checkIfNoTasks();
};

window.onload = () => {
    loadTasksFromLocalStorage();
};

document.getElementById("deleteAllBtn").onclick = () => {
    localStorage.removeItem("tasks");

    const taskList = document.getElementById("taskList");
    const tasks = taskList.querySelectorAll(".task");
    tasks.forEach(task => task.remove());

    checkIfNoTasks();
};

document.getElementById("deleteDoneBtn").onclick = () => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(task => !task.done);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const taskElements = document.querySelectorAll(".task");
    taskElements.forEach(taskEl => {
        const checkbox = taskEl.querySelector("input[type='checkbox']");
        if (checkbox && checkbox.checked) {
            taskEl.remove();
        }
    });

    checkIfNoTasks();
};

document.getElementById("all-btn").addEventListener("click", () => {
    filterTasks("all");
});

document.getElementById("done-btn").addEventListener("click", () => {
    filterTasks("done");
});

document.getElementById("todo-btn").addEventListener("click", () => {
    filterTasks("todo");
});

const filterTasks = (filterType) => {
    const tasks = taskList.querySelectorAll('.task');
    tasks.forEach(taskEl => {
        const checkbox = taskEl.querySelector('input[type="checkbox"]');
        if (filterType === "all") {
            taskEl.style.display = "";
        } else if (filterType === "done") {
            taskEl.style.display = checkbox.checked ? "" : "none";
        } else if (filterType === "todo") {
            taskEl.style.display = !checkbox.checked ? "" : "none";
        }
    });
};
