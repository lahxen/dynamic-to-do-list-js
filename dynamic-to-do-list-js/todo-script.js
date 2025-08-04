/**
 * Dynamic To-Do List Application
 * This script manages a dynamic to-do list with add and remove functionality
 * 
 * Features:
 * - Add tasks via button click or Enter key
 * - Remove individual tasks
 * - Input validation for empty tasks
 * - Responsive user interface
 */

// DOM Element Selection
// Select the "Add Task" button and store it in a constant named addButton
const addButton = document.getElementById('add-button');

// Select the input field where users enter tasks (id="task-input") and store it in taskInput
const taskInput = document.getElementById('task-input');

// Select the unordered list (id="task-list") that will display the tasks and store it in taskList
const taskList = document.getElementById('task-list');

/**
 * Add Task Function
 * Creates and adds a new task to the to-do list
 * Validates input and provides user feedback for empty tasks
 */
function addTask() {
    // Retrieve and trim the value from the task input field to remove whitespace
    const taskText = taskInput.value.trim();
    
    // Input validation: Check if taskText is not empty
    if (taskText === "") {
        // Alert user to enter a task if input is empty
        alert("Please enter a task!");
        return; // Exit function early if validation fails
    }
    
    // Task Creation: Create a new list item element
    const li = document.createElement('li');
    li.textContent = taskText; // Set the task text as the content
    
    // Remove Button Creation: Create a button for removing the task
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove'; // Set button text
    removeButton.className = 'remove-btn'; // Add CSS class for styling
    
    // Remove Button Functionality: Assign click event to remove the task
    removeButton.onclick = function() {
        // Remove the specific li element from the task list
        taskList.removeChild(li);
    };
    
    // DOM Manipulation: Build the task structure
    li.appendChild(removeButton); // Add remove button to the list item
    taskList.appendChild(li); // Add the complete task to the task list
    
    // Input Field Cleanup: Clear the input field for next task entry
    taskInput.value = '';
}

/**
 * Event Listeners Setup
 * Initializes all event listeners when the DOM is fully loaded
 * Ensures all elements are available before attaching events
 */
document.addEventListener('DOMContentLoaded', function() {
    // Debug: Log successful DOM element selection
    console.log('DOM elements selected successfully:');
    console.log('Add Button:', addButton);
    console.log('Task Input:', taskInput);
    console.log('Task List:', taskList);
    
    // Button Click Event: Add event listener to addButton for click events
    addButton.addEventListener('click', addTask);
    
    // Keyboard Event: Add event listener to taskInput for Enter key functionality
    taskInput.addEventListener('keypress', function(event) {
        // Check if the pressed key is 'Enter'
        if (event.key === 'Enter') {
            addTask(); // Call addTask function when Enter is pressed
        }
    });
    
    // Application ready notification
    console.log('To-Do List application initialized successfully!');
});
