const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const clearAllBtn = document.getElementById('clearAllBtn');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');


let tasks = [];
let taskIdCounter = 1;
function init() {
   
    const storedTasks = localStorage.getItem('tasks');
    const storedCounter = localStorage.getItem('taskIdCounter');

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }

    if (storedCounter) {
        taskIdCounter = parseInt(storedCounter, 10);
    }

    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', handleKeyPress);
    clearAllBtn.addEventListener('click', clearAllTasks);
    updateUI();
}



function handleKeyPress(e){
if(e.key === 'Enter'){
    addTask();
}

}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('please enter a tassk!');
        return;
    }

    const newTask = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: new Date()
    }
    tasks.push(newTask);

    taskInput.value = '';
    updateUI();
    taskInput.focus();
}



function toggleTask(taskId){
    const task = tasks.find(t => t.id === taskId);
    if(task){
        const wasCompleted = task.completed; 
        task.completed = !task.completed;

        updateUI();

        
        if (!wasCompleted && task.completed) {
            showCelebration();
        }
    }
}


function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    updateUI();
}


function clearAllTasks(){
    if(tasks.length ===0) return ;
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        taskIdCounter = 1;
        updateUI();
    }
}


function createTaskElement(task) {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-task-id', task.id);

            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                <span class="task-text">${escapeHtml(task.text)}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    Delete
                </button>
            `;

            return li;
        }



         function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }



        function updateUI() {
    todoList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        clearAllBtn.disabled = true;
    } else {
        emptyState.style.display = 'none';
        clearAllBtn.disabled = false;
    }

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        todoList.appendChild(taskElement);
    });

    updateStats();

    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('taskIdCounter', taskIdCounter.toString());
}




        function updateStats() {
            const total = tasks.length;
            const completed = tasks.filter(task => task.completed).length;
            const pending = total - completed;

            totalCount.textContent = total;
            completedCount.textContent = completed;
            pendingCount.textContent = pending;
        }





function showCelebration() {
    const message = document.getElementById('celebrationMessage');
    if (!message) return; 
    
    message.classList.add('show');

   
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}




        init();


        