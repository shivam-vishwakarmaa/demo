document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // SVG icons
    const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const deleteIcon = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    function renderTodos() {
        todoList.innerHTML = '';
        
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }

        if (todos.length === 0) {
            todoList.innerHTML = `<li class="empty-state">No tasks yet. Add one above!</li>`;
        } else if (filteredTodos.length === 0) {
            todoList.innerHTML = `<li class="empty-state">No ${currentFilter} tasks found.</li>`;
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;

            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'checkbox';
            checkboxWrapper.innerHTML = checkIcon;
            checkboxWrapper.addEventListener('click', () => toggleTodo(todo.id));

            const textSpan = document.createElement('span');
            textSpan.className = 'todo-text';
            textSpan.textContent = todo.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = deleteIcon;
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
            });

            li.appendChild(checkboxWrapper);
            li.appendChild(textSpan);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });

        // Update stats
        const activeCount = todos.filter(t => !t.completed).length;
        itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
        
        // Show/hide clear completed button
        clearCompletedBtn.style.display = todos.some(t => t.completed) ? 'block' : 'none';
    }

    function addTodo(text) {
        todos.unshift({
            id: Date.now().toString(),
            text,
            completed: false
        });
        saveTodos();
    }

    function toggleTodo(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
    }

    function deleteTodo(id) {
        // Find element to add exit animation
        const el = document.querySelector(`.todo-item[data-id="${id}"]`);
        if (el) {
            el.style.transform = 'translateX(20px)';
            el.style.opacity = '0';
            setTimeout(() => {
                todos = todos.filter(todo => todo.id !== id);
                saveTodos();
            }, 300);
        } else {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
        }
    }

    // Event Listeners
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            addTodo(text);
            todoInput.value = '';
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Initial render
    renderTodos();
});
