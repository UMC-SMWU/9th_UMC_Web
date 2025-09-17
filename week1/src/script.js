var todoForm = document.getElementById('todo-form');
var todoInput = document.getElementById('todo-input');
var todoList = document.getElementById('todo-list');
var doneList = document.getElementById('done-list');
var todos = [];
var doneTasks = [];
var renderTasks = function () {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach(function (todo) {
        var li = createToolElement(todo, false);
        todoList.appendChild(li);
    });
    doneTasks.forEach(function (todo) {
        var li = createToolElement(todo, true);
        doneList.appendChild(li);
    });
};
var getTodoText = function () { return todoInput.value.trim(); };
var addTodo = function (text) {
    todos.push({ id: Date.now(), text: text });
    todoInput.value = '';
    renderTasks();
};
var completeTodo = function (todo) {
    todos = todos.filter(function (t) { return t.id !== todo.id; });
    doneTasks.push(todo);
    renderTasks();
};
var deleteTodo = function (todo) {
    doneTasks = doneTasks.filter(function (t) { return t.id !== todo.id; });
    renderTasks();
};
var createToolElement = function (todo, isDone) {
    var li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;
    var button = document.createElement('button');
    button.classList.add('render-container__item-button');
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
        button.addEventListener('click', function () { return deleteTodo(todo); });
    }
    else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
        button.addEventListener('click', function () { return completeTodo(todo); });
    }
    li.appendChild(button);
    return li;
};
// 폼 제출 이벤트
todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = getTodoText();
    if (text)
        addTodo(text);
});
renderTasks();
