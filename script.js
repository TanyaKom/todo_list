  
    document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("input");
    const buttonAdd = document.getElementById("button");
    const taskList = document.getElementById("task-list");
    const emptyList = document.getElementById("emptylist");
    const clearButton = document.getElementById("footer-btn");
    let editInput;
    let tasks = [];

    inputText.addEventListener("input", () => {
        if (inputText.value.trim() === "") {
            buttonAdd.disabled = true;
        } else {
            buttonAdd.disabled = false;
        }
    });

    window.onload = function() {
        const storedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (storedTasks && storedTasks.length > 0) {
            emptyList.style.display = "none";
            tasks = storedTasks;
            displayTasks();
        }
    };

    function createEvent({eventName, eventElement, eventHandle}) {
        eventElement.addEventListener(eventName, eventHandle);
    }
    createEvent({
        eventName: "keypress",
        eventElement: inputText,
        eventHandle: function(event) {
            if(event.key === "Enter") {
                addTask();
            }
        }
    });

    buttonAdd.addEventListener("click", () => {
        addTask();
    });
    clearButton.addEventListener("click", () => {
        tasks = [];
        taskList.innerHTML = "";
        emptyList.textContent = "To do list is empty";
        emptyList.style.display = "block";
        localStorage.removeItem("tasks");
    });

    function getInputValue () {
        const textInput = document.getElementById("input");
        return textInput.value.trim();
    }
    function clearInputValue() {
        const inputText = document.getElementById("input");

        inputText.value = "";
    }
    function addTask() {
        const textInput = getInputValue();

        if(textInput !=="") {
            tasks.push({
                text: textInput,
                completed: false
            });

            clearInputValue();

            if (tasks.length > 0) {
                emptyList.style.display = "none";
            }
            displayTasks();
            saveTasksToLocalStorage();
            setCookie("tasks", JSON.stringify(tasks), 7);

        }
    }
    function clearTasksList() {
        taskList.innerHTML = "";
    }
    function createElement({ elementName = 'div', classNames }) {
        let taskItem = document.createElement(elementName);
        classNames && taskItem.classList.add(classNames);
    
        return taskItem;
    }
    
    function createCheckbox(checked, onChange) {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = checked;

     
        checkbox.addEventListener("change", onChange);
        return checkbox;
    }

    function displayTasks() {
        clearTasksList();

        tasks.forEach((task, index) => {
            let taskItem = createElement({elementName: "div", classNames: "task-item"});
            let taskTextElement = document.createElement("div");
            taskTextElement.classList.add("task-text");

            let checkbox = createCheckbox(task.completed, () => {
                tasks[index].completed = checkbox.checked;

                if (tasks.length === 0) {
                    emptyList.style.display = "block";
                    clearButton.style.display = "none";
                } else {
                    emptyList.style.display = "none";
                    clearButton.style.display = "block";
                }
                displayTasks();
            });
            
            taskTextElement.appendChild(checkbox);
            taskTextElement.appendChild(document.createTextNode(task.text));
            if(task.completed) {
                taskTextElement.style.textDecoration = "line-through";
            }
            taskItem.appendChild(taskTextElement);


            const deleteButton = createDeleteButton(index);
            const editButton = editToDo(taskItem, index);

            taskItem.appendChild(deleteButton);
            taskItem.appendChild(editButton);

            taskList.appendChild(taskItem);
        });
    }
    function createDeleteButton(index) {

            const deleteIcon = document.createElement("img");
            deleteIcon.classList.add("delete-icon");
            deleteIcon.src = "/pictures/basket.png";

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn-container");
            deleteButton.appendChild(deleteIcon);

            deleteButton.addEventListener("click", () => {
                tasks.splice(index, 1);
                displayTasks();
            });
            return deleteButton;
        }

    function editToDo(taskItem, index) {

        const editText = document.createElement("img");
        editText.classList.add("edit-icon");
        editText.src = "/pictures/pencil.png";

        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn-container");
        editButton.appendChild(editText);
        
        editButton.addEventListener("click", () => {
            editTask(taskItem, index);
        });
        return editButton;
    }


    function insertText(text) {
        let textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.classList.add('task-text');
        return textElement;
    }
    function insertInput(text) {
        let editInputContainer = document.createElement("div");
        editInputContainer.classList.add("task-text");

        let editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = text;

        editInputContainer.appendChild(editInput);
        return editInputContainer;
    }

    function editTask(taskItem, index) {
        let taskTextElement = taskItem.querySelector(".task-text");
        let originalText = tasks[index].text;
        let editInputContainer = insertInput(originalText);
        taskTextElement.replaceWith(editInputContainer);
        editInput = editInputContainer.querySelector("input");
        editInput.focus();

        // editInput.addEventListener("keypress", function(event) {
        //     if(event.key === "Enter") {
        //         updateTask();
        //     }
        // });
         
    function editEvent({eventName, eventElement, eventHandle}) {
        eventElement.addEventListener(eventName, eventHandle);
    }
    
    editEvent({
        eventName: "keypress",
        eventElement: editInput,
        eventHandle: function(event) {
            if(event.key === "Enter") {
                updateTask(index);
            }
        }
    });
        editInput.addEventListener("blur", () => {
            updateTask(index);
        });
    }
    function updateTask(index) {
        if (editInput.value.trim() === "") {
            tasks.splice(index, 1);
        } else {
            tasks[index].text = editInput.value;
        }
        displayTasks();
        setCookie("tasks", JSON.stringify(tasks), 7);
        saveTasksToLocalStorage();
    }
   
    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});