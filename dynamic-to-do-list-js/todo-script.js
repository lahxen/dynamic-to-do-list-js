// Dynamic To-Do List Application
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.init();
    }

    init() {
        this.setupElements();
        this.bindEvents();
        this.render();
        this.updateTaskCounter();
    }

    setupElements() {
        this.taskInput = document.getElementById('task-input');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.taskList = document.getElementById('task-list');
        this.taskCount = document.getElementById('task-count');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    bindEvents() {
        // Add task events
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Input validation
        this.taskInput.addEventListener('input', () => {
            this.addTaskBtn.disabled = this.taskInput.value.trim().length === 0;
        });

        // Filter events
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Clear completed tasks
        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompletedTasks();
        });

        // Initial button state
        this.addTaskBtn.disabled = true;
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (!taskText) {
            this.showNotification('Please enter a task', 'error');
            return;
        }

        if (taskText.length > 100) {
            this.showNotification('Task is too long (max 100 characters)', 'error');
            return;
        }

        const newTask = {
            id: this.generateId(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(newTask); // Add to beginning of array
        this.saveTasks();
        this.taskInput.value = '';
        this.addTaskBtn.disabled = true;
        this.render();
        this.updateTaskCounter();
        this.showNotification('Task added successfully!', 'success');
    }

    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskElement) {
                taskElement.classList.add('removing');
                setTimeout(() => {
                    this.tasks.splice(taskIndex, 1);
                    this.saveTasks();
                    this.render();
                    this.updateTaskCounter();
                    this.showNotification('Task deleted', 'info');
                }, 300);
            }
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.render();
            this.updateTaskCounter();
            
            const message = task.completed ? 'Task completed!' : 'Task marked as active';
            this.showNotification(message, 'success');
        }
    }

    editTask(taskId) {
        if (this.editingTaskId) {
            this.cancelEdit();
        }
        
        this.editingTaskId = taskId;
        this.render();
    }

    saveEdit(taskId, newText) {
        const task = this.tasks.find(task => task.id === taskId);
        const trimmedText = newText.trim();
        
        if (!trimmedText) {
            this.showNotification('Task cannot be empty', 'error');
            return;
        }

        if (trimmedText.length > 100) {
            this.showNotification('Task is too long (max 100 characters)', 'error');
            return;
        }

        if (task) {
            task.text = trimmedText;
            task.updatedAt = new Date().toISOString();
            this.editingTaskId = null;
            this.saveTasks();
            this.render();
            this.showNotification('Task updated successfully!', 'success');
        }
    }

    cancelEdit() {
        this.editingTaskId = null;
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        this.render();
    }

    clearCompletedTasks() {
        const completedTasks = this.tasks.filter(task => task.completed);
        
        if (completedTasks.length === 0) {
            this.showNotification('No completed tasks to clear', 'info');
            return;
        }

        if (confirm(`Are you sure you want to delete ${completedTasks.length} completed task(s)?`)) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.render();
            this.updateTaskCounter();
            this.showNotification(`${completedTasks.length} completed task(s) deleted`, 'success');
        }
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.taskList.innerHTML = '';
        
        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;

        if (this.editingTaskId === task.id) {
            li.innerHTML = this.createEditTemplate(task);
        } else {
            li.innerHTML = this.createTaskTemplate(task);
        }

        // Add animation class
        setTimeout(() => li.classList.add('adding'), 10);

        return li;
    }

    createTaskTemplate(task) {
        return `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="todoApp.toggleTask('${task.id}')"></div>
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="edit-btn" onclick="todoApp.editTask('${task.id}')">Edit</button>
                <button class="delete-btn" onclick="todoApp.deleteTask('${task.id}')">Delete</button>
            </div>
        `;
    }

    createEditTemplate(task) {
        return `
            <input type="text" class="task-edit-input" value="${this.escapeHtml(task.text)}" 
                   maxlength="100" onkeypress="if(event.key==='Enter') todoApp.saveEditFromInput('${task.id}', this.value)">
            <div class="edit-actions">
                <button class="save-btn" onclick="todoApp.saveEditFromInput('${task.id}', this.parentElement.previousElementSibling.value)">Save</button>
                <button class="cancel-btn" onclick="todoApp.cancelEdit()">Cancel</button>
            </div>
        `;
    }

    saveEditFromInput(taskId, newText) {
        this.saveEdit(taskId, newText);
    }

    renderEmptyState() {
        const emptyMessage = this.getEmptyStateMessage();
        this.taskList.innerHTML = `
            <div class="empty-state">
                <h3>${emptyMessage.title}</h3>
                <p>${emptyMessage.description}</p>
            </div>
        `;
    }

    getEmptyStateMessage() {
        switch (this.currentFilter) {
            case 'active':
                return {
                    title: 'No active tasks',
                    description: 'All your tasks are completed! 🎉'
                };
            case 'completed':
                return {
                    title: 'No completed tasks',
                    description: 'Complete some tasks to see them here.'
                };
            default:
                return {
                    title: 'No tasks yet',
                    description: 'Add your first task above to get started!'
                };
        }
    }

    updateTaskCounter() {
        const activeTasks = this.tasks.filter(task => !task.completed).length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        
        this.taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} remaining`;
        this.clearCompletedBtn.disabled = completedTasks === 0;
        this.clearCompletedBtn.textContent = `Clear Completed (${completedTasks})`;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#00b894',
            error: '#e17055',
            info: '#74b9ff'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            font-weight: 500;
            animation: slideInFromRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutToRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('todoTasks');
            return savedTasks ? JSON.parse(savedTasks) : [];
        } catch (error) {
            console.warn('Error loading tasks from localStorage:', error);
            return [];
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.warn('Error saving tasks to localStorage:', error);
            this.showNotification('Unable to save tasks locally', 'error');
        }
    }

    // Export/Import functionality
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `todo-tasks-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('Tasks exported successfully!', 'success');
    }

    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    this.tasks = importedTasks;
                    this.saveTasks();
                    this.render();
                    this.updateTaskCounter();
                    this.showNotification('Tasks imported successfully!', 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showNotification('Error importing tasks. Invalid file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.taskInput.focus();
                        break;
                    case 'a':
                        e.preventDefault();
                        this.setFilter('all');
                        break;
                    case 'c':
                        e.preventDefault();
                        this.setFilter('completed');
                        break;
                    case 'd':
                        e.preventDefault();
                        this.setFilter('active');
                        break;
                }
            }
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutToRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
let todoApp;
document.addEventListener('DOMContentLoaded', function() {
    todoApp = new TodoApp();
    todoApp.setupKeyboardShortcuts();
    
    console.log('Dynamic To-Do List Application initialized');
    console.log('Keyboard shortcuts: Ctrl+N (new task), Ctrl+A (all), Ctrl+C (completed), Ctrl+D (active)');
});
