// Select DOM Elements
const addButton = document.getElementById('add-button');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Function to add a new task
function addTask() {
    // Get the task text from input
    const taskText = taskInput.value.trim();
    
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
    removeButton.className = 'remove-btn';
    
    // Add click event to remove button
    removeButton.onclick = function() {
        taskList.removeChild(li);
    };
    
    // Add remove button to list item
    li.appendChild(removeButton);
    
    // Add list item to task list
    taskList.appendChild(li);
    
    // Clear input field
    taskInput.value = '';
}

// Add event listener to button
addButton.addEventListener('click', addTask);

// Add event listener for Enter key
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
