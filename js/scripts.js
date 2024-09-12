// Seleção de elementos
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editFormp = document.querySelector("#edit-form p")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#erase-button")
const filterBtn = document.querySelector("#filter-select")
let oldinputvalue;
// Funções
const saveTodo = (text, done=0, save = 1) => {

    const todo = document.createElement("div")
    todo.classList.add("todo")
    const todoTitle = document.createElement("h3")
    todoTitle.innerText = text
    todo.appendChild(todoTitle)
    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)

    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)
    // utilizando dados da localStorage
    if(done) {
        todo.classList.add("done")
    }
    if(save) {
        saveTodoLocalStorage({text, done})
    }
    todoList.appendChild(todo)


    todoInput.value = ""
    todoInput.focus()
}

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

const updateTodo = (text) => {

    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3")
        console.log(todoTitle)

        if(todoTitle.innerText === oldinputvalue) {
            todoTitle.innerText = text
            updateTodoLocalStorage(oldinputvalue, text)
        }
    });

}
const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo")
    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase()
        todo.style.display = "flex"
        if(!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none"
        }
    });
}
const filterTodos = (filterValue) => {
    console.log("chegou")
    const todos = document.querySelectorAll(".todo")
    switch(filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"))
            break;
        case "done":
            todos.forEach((todo) => {
                if(todo.classList.contains("done")) {
                (todo.style.display = "flex")
                }
                else {
                (todo.style.display = "none")
                }
            })
        break;
        case "todo":
            todos.forEach((todo) => {
                if(!todo.classList.contains("done")) {
                 (todo.style.display = "flex")
                }
                else {
                    (todo.style.display = "none")
                }
            })
        break;
        default:
            break;
    }
}

const loadTodos = () => {
    const todos = getTodosLocalStorage();


    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })
}
// eventos
document.addEventListener("click", (e) => {

    const targetE1 = e.target
    const parentE1 = targetE1.closest("div")
    let todoTitle = parentE1.innerText
    if(targetE1.classList.contains("finish-todo")) {
        parentE1.classList.toggle("done")

        updateTodoStatusLocalStorage(todoTitle)
    }

    if(targetE1.classList.contains("remove-todo")) {
        parentE1.remove()
        removeTodoLocalStorage(todoTitle )
    }
    if(targetE1.classList.contains("edit-todo")) {
        toggleForms()
        if(parentE1 && parentE1.querySelector("h3")) {
            editInput.value = todoTitle
            oldinputvalue = todoTitle
        }
    }
})
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault()
    toggleForms()
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const editInputValue = editInput.value

    if(editInputValue) {
        updateTodo(editInputValue)
    }
    toggleForms()
})
// Eventos
todoForm.addEventListener("submit", (e) => {

    e.preventDefault()

    const inputValue = todoInput.value

    if(inputValue) {
        saveTodo(inputValue)
    }
})

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value
    getSearchTodos(search)
})
eraseBtn.addEventListener("click", (e) => {
    e.preventDefault()

    searchInput.value = ""

    searchInput.dispatchEvent(new Event("keyup"))
})
filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value
    filterTodos(filterValue)
})

// local Storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || []

    return todos;

}
const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage()

    todos.push(todo)

    localStorage.setItem("todos", JSON.stringify(todos))
}
const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}
const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
    todos.map((todo) => todo.text === todoText ? todo.done = !todo.done : null)

    localStorage.setItem("todos", JSON.stringify(todos));
}
const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
     todos.map((todo) => todo.text === todoOldText? (todo.text = todoNewText) : null)

     localStorage.setItem("todos", JSON.stringify(todos));
 }
loadTodos()
