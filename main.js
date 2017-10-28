var todoList = {
  todos: [],
  addTodos(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
  },
  changeTodo(pos, todoText) {
    this.todos[pos].todoText = todoText;
  },
  deleteTodo(pos) {
    this.todos.splice(pos, 1);
  },
  toggleCompleted(pos) {
    var todo = this.todos[pos];
    todo.completed = !todo.completed;
  },
  toggleAll() {
    var completedTodos = 0;
    var totalTodos = this.todos.length;

    //Get number of completed todos
    this.todos.forEach(function(todo) {
      if (todo.completed) {
        completedTodos++;
      }
    });

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
  getNumberOfCompletedTodos() {
    var completedTodoNumber = 0;
    this.todos.forEach(function(todo) {
      if (todo.completed === true) {
        completedTodoNumber++;
      }
    });
    return completedTodoNumber;
  }
};

var handlers = {
  addNewTodo: () => {
    var addTodoText = document.querySelector("#todoInput");
    if (addTodoText.value === "") {
      console.log("Error: Input is empty");
    } else {
      todoList.addTodos(addTodoText.value);
      // Clear input after adding new todo
      addTodoText.value = "";
      view.displayTodos();
    }
  },
  deleteTodo(possition) {
    todoList.deleteTodo(possition);
    view.displayTodos();
  },
  completeTodo(possition) {
    todoList.toggleCompleted(possition);
    view.displayTodos();
  },
  toggleAll: () => {
    todoList.toggleAll();
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
  }
};

// Add new todo when enter is pressed
document.querySelector("#todoInput").addEventListener("keypress", function(e) {
  if (e.keyCode == 13) {
    handlers.addNewTodo();
  }
});

var view = {
  displayTodos: function() {
    var todoUl = document.querySelector("ul");
    todoUl.innerHTML = "";

    var completedTodoCounter = document.querySelector("#completed-todos");
    completedTodoCounter.innerHTML = todoList.getNumberOfCompletedTodos();

    todoList.todos.forEach((todo, possition) => {
      var todoLi = document.createElement("li");
      if (todo.completed) {
        todoLi.classList.add("completed");
      } else {
        todoLi.classList.remove("completed");
      }
      todoLi.id = possition;
      todoLi.textContent = todo.todoText;
      todoLi.appendChild(this.createDeleteButton());
      todoUl.appendChild(todoLi);
    });
  },
  createDeleteButton: function() {
    var button = document.createElement("button");
    button.textContent = "X";
    button.className = "button-danger";
    return button;
  },
  setUpEventListeners: function() {
    var todoUl = document.querySelector("ul");
    todoUl.addEventListener("click", function(event) {
      // Get the element that was clicked
      var elementClicked = event.target;
      // Check if element clicked was the delete button
      if (elementClicked.className === "button-danger") {
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
      }
      if (elementClicked.nodeName === "LI") {
        handlers.completeTodo(parseInt(elementClicked.id));
      }
    });
  }
};

view.setUpEventListeners();
