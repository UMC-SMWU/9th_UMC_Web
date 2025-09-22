const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

type Todo = { id: number; text: string; };
let todos: Todo[] = [];
let doneTasks: Todo[] = [];

const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach(todo => {
        const li = createToolElement(todo, false);
        todoList.appendChild(li);
    });

    doneTasks.forEach(todo => {
        const li = createToolElement(todo, true);
        doneList.appendChild(li);
    });
};

const getTodoText = (): string => todoInput.value.trim();

const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text });
    todoInput.value = '';
    renderTasks();
};

const completeTodo = (todo: Todo): void => {
    todos = todos.filter(t => t.id !== todo.id);
    doneTasks.push(todo);
    renderTasks();
};

const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter(t => t.id !== todo.id);
    renderTasks();
};

const createToolElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
        button.addEventListener('click', () => deleteTodo(todo));
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
        button.addEventListener('click', () => completeTodo(todo));
    }

    li.appendChild(button);
    return li;
};

// 폼 제출 이벤트
todoForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const text = getTodoText();
    if (text) addTodo(text);
});

renderTasks();
