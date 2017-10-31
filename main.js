let todoList = {
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
    let todo = this.todos[pos];
    todo.completed = !todo.completed;
  },
  clearCompleted() {
    // itterate over array and delete completed todo's
    for (i = 0; i < this.todos.length; ++i) {
      if (this.todos[i].completed === true) this.todos.splice(i--, 1);
    }
  },
  toggleAll() {
    let completedTodos = 0;

    //Get number of completed todos
    this.todos.forEach(function(todo) {
      if (todo.completed) completedTodos++;
    });

    this.todos.forEach(todo => {
      completedTodos === this.todos.length
        ? (todo.completed = false) // If everything it true make everything false
        : (todo.completed = true); // Otherwise make everything true
    });
  },
  // Return the number of Active todo's
  getNumberOfActiveTodos() {
    let todosLeft = 0;
    this.todos.forEach(todo => {
      if (!todo.completed) todosLeft++;
    });
    return todosLeft;
  },
  getDateCreated() {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; // month 10
    let day = dateObj.getUTCDate(); // day 28
    let year = dateObj.getUTCFullYear(); // year 2017

    return day + "/" + month + "/" + year;
  }
};

let viewToggles = document.querySelectorAll("#view-toggles button");

let handlers = {
  addNewTodo: () => {
    const addTodoText = document.querySelector("#todoInput");
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
    document.body.classList.remove("active", "completed");

    viewToggles.forEach(function(element) {
      element.classList.remove("active");
    });

    viewToggles[0].classList.add("active");
  },
  showActive() {
    document.body.classList.remove("completed");
    document.body.classList.add("active");
    viewToggles.forEach(function(element) {
      element.classList.remove("active");
    });
    viewToggles[1].classList.add("active");
  },
  showCompleted() {
    document.body.classList.remove("active");
    document.body.classList.add("completed");
    viewToggles.forEach(function(element) {
      element.classList.remove("active");
    });
    viewToggles[2].classList.add("active");
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

let view = {
  displayTodos: function() {
    // Hide todo list when empty
    let bodyAndFooter = document.querySelector(".body-footer-wrap");
    if (todoList.todos.length > 0) {
      bodyAndFooter.style.display = "block";
    } else {
      bodyAndFooter.style.display = "none";
    }

    const todoUl = document.querySelector("ul");
    todoUl.innerHTML = "";

    // Active todo's counter
    const completedTodoCounter = document.querySelector("#completed-todos");
    let activeTodos = todoList.getNumberOfActiveTodos();
    completedTodoCounter.textContent =
      activeTodos === 0 ? "All caught up" : activeTodos + " Items left";

    let checkSquare = document.querySelector("#check-square");
    if (activeTodos === 0) {
      checkSquare.classList.add("fa-square-o");
    } else {
      checkSquare.classList.remove("fa-square-o");
    }

    todoList.todos.forEach((todo, possition) => {
      let todoLi = document.createElement("li");
      let icon = document.createElement("i");
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
    let button = document.createElement("a");
    button.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
    button.className = "button-danger";
    return button;
  },
  setUpEventListeners: function() {
    const todoUl = document.querySelector("ul");
    todoUl.addEventListener("click", function(event) {
      // Get the element that was clicked
      let elClicked = event.target;

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
  let jsonData = JSON.parse(localStorage.getItem("todos"));
  let result = [];
  // check if a list is already stored in localStorage
  if (jsonData === null) {
    return [];
  } else {
    for (let i in jsonData) result.push(jsonData[i]);
  }
  return result;
}

// Render View on load
view.displayTodos();
