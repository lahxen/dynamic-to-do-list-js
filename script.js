// Setup Event Listener for Page Load
document.addEventListener('DOMContentLoaded', function() {
    // Select DOM Elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Function to load tasks from Local Storage
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        storedTasks.forEach(taskText => addTask(taskText, false)); // 'false' indicates not to save again to Local Storage
    }

    // Function to add a new task
    function addTask(taskText, save = true) {
        // If called from input, get the task text from input
        if (taskText === undefined) {
            taskText = taskInput.value.trim();
        }
        
        // Check if input is empty
        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }
        
        // Create new list item
        const li = document.createElement('li');
        li.textContent = taskText;
        
        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        
        // Add click event to remove button
        removeButton.onclick = function() {
            taskList.removeChild(li);
            
            // Remove from Local Storage
            const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const updatedTasks = storedTasks.filter(task => task !== taskText);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        };
        
        // Add remove button to list item
        li.appendChild(removeButton);
        
        // Add list item to task list
        taskList.appendChild(li);
        
        // Save to Local Storage if this is a new task
        if (save) {
            const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            storedTasks.push(taskText);
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
        }
        
        // Clear input field only when adding from user input
        if (save) {
            taskInput.value = '';
        }
    }

    // Load existing tasks from Local Storage
    loadTasks();

    // Add event listener to button
    addButton.addEventListener('click', function() {
        addTask();
    });

    // Add event listener for Enter key
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
});
