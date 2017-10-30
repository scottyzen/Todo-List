var todoList = {
  todos: getLocalTodoList(),
  addTodos(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false,
      date: this.getDateCreated()
    });
  },
  changeTodo(pos, todoText) {
    // Edit todo text
    this.todos[pos].todoText = todoText;
  },
  deleteTodo(pos) {
    // Delete todo buy its possition on array
    this.todos.splice(pos, 1);
  },
  toggleCompleted(pos) {
    var todo = this.todos[pos];
    todo.completed = !todo.completed;
  },
  clearCompleted() {
    // itterate over array and delete completed todo's
    for (i = 0; i < this.todos.length; ++i) {
      if (this.todos[i].completed === true) this.todos.splice(i--, 1);
    }
  },
  toggleAll() {
    var totalTodos = this.todos.length;

    // If everything it true make everything false
    this.todos.forEach(function(todo) {
      if (completedTodos === totalTodos) {
        todo.completed = false;
      } else {
        // Otherwise make everything true
        todo.completed = true;
      }
    });
  },
  // Return the number of Active todo's
  getNumberOfActiveTodos() {
    var todosLeft = 0;
    this.todos.forEach(todo => {
      if (!todo.completed) todosLeft++;
    });
    return todosLeft;
  },
  getDateCreated() {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; // month 10
    var day = dateObj.getUTCDate(); // day 28
    var year = dateObj.getUTCFullYear(); // year 2017

    return day + "/" + month + "/" + year;
  }
};

var handlers = {
  addNewTodo: () => {
    var addTodoText = document.querySelector("#todoInput");
    if (addTodoText.value !== "") {
      todoList.addTodos(addTodoText.value);
      // Clear input after adding new todo
      addTodoText.value = "";
      view.displayTodos();
    }
  },
  toggleAll: () => {
    // Show Everything
    todoList.toggleAll();
    view.displayTodos();
  },
  deleteTodo(possition) {
    // Show all todos that are not completed
    todoList.deleteTodo(possition);
    view.displayTodos();
  },
  completeTodo(possition) {
    // Show completed todos only
    todoList.toggleCompleted(possition);
    view.displayTodos();
  },
  showAll() {
    document.querySelector("ul").classList.remove("active", "completed");
  },
  showActive() {
    document.querySelector("ul").classList.remove("completed");
    document.querySelector("ul").classList.add("active");
  },
  showCompleted() {
    document.querySelector("ul").classList.remove("active");
    document.querySelector("ul").classList.add("completed");
  },
  clearCompleted() {
    todoList.clearCompleted();
    view.displayTodos();
  }
};

// Add new todo when ENTER is pressed
document.querySelector("#todoInput").addEventListener("keypress", function(e) {
  if (e.keyCode == 13) handlers.addNewTodo();
});

var view = {
  displayTodos: function() {
    // Remove "List is empty" message
    var emptyList = document.querySelector("#empty-list");
    if (emptyList) emptyList.remove();

    var todoUl = document.querySelector("ul");
    todoUl.innerHTML = "";
    var completedTodoCounter = document.querySelector("#completed-todos");

    completedTodoCounter.textContent =
      todoList.getNumberOfActiveTodos() + " Items left";

    todoList.todos.forEach((todo, possition) => {
      var todoLi = document.createElement("li");
      var icon = document.createElement("i");
      if (todo.completed) {
        todoLi.classList.add("completed");
        icon.classList.add("fa", "fa-check-square-o");
      } else {
        todoLi.classList.remove("completed");
        icon.classList.add("fa", "fa-square-o");
      }
      todoLi.id = possition;
      todoLi.innerHTML = `<span>${todo.todoText}</span> <small>${todo.date}</small>`;
      todoLi.prepend(icon);

      // Create buttons to updated and distroy todos
      todoLi.appendChild(this.createDeleteButton());

      // Add each todo list item to the unordered list
      todoUl.appendChild(todoLi);
    });

    // Update localStorage
    localStorage.setItem("todos", JSON.stringify(todoList.todos));
  },
  createDeleteButton: function() {
    // Create DELETE Button
    var button = document.createElement("a");
    button.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
    button.className = "button-danger";
    return button;
  },
  setUpEventListeners: function() {
    var todoUl = document.querySelector("ul");
    todoUl.addEventListener("click", function(event) {
      // Get the element that was clicked
      var elClicked = event.target;

      // Check if element clicked was the delete button
      if (elClicked.className === "button-danger") {
        handlers.deleteTodo(parseInt(elClicked.parentNode.id));
      }
      if (elClicked.nodeName === "LI") {
        handlers.completeTodo(parseInt(elClicked.id));
      }
    });
  }
};

view.setUpEventListeners();

function getLocalTodoList() {
  // get json data from localStorage
  var jsonData = JSON.parse(localStorage.getItem("todos"));
  var result = [];
  // check if a list is already stored in localStorage
  if (jsonData === null) {
    return [];
  } else {
    for (var i in jsonData) result.push(jsonData[i]);
  }
  return result;
}
view.displayTodos();
