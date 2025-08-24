const fs = require("fs");
const path = require("path");

const db_path = path.join(__dirname, "db.txt");
function readTodos() {
  if (!fs.existsSync(db_path)) {
    fs.writeFileSync(db_path, "");
  }

  const data = fs.readFileSync(db_path, "utf-8").trim();
  if (!data) {
    return []
  }
  return data.split("\n"),map(line => JSON.parse(line))
}
function writeTodos(todos) {
    const data = todos.map(todo => JSON.stringify(todo,null,2)).join("\n")
    fs.writeFileSync(db_path,data+(todos.length ? "\n" : ""))
}

function createTodoSync(title) {
    const newTodo = {
        id : Date.now(),
        title,
        isCompleted : false,
        createdAt : new Date().toISOString(),
        updatedAt : new Date().toISOString
    }
    const todoStr = JSON.stringify(newTodo,null,2)
    fs.appendFileSync(db_path,todoStr+"\n")

    return newTodo
}

function getTodosSync() {
    if (!fs.existsSync(db_path)) {
        return ""
    }
    return fs.readFileSync(db_path,"utf-8")
}

function getTodoSync(id) {
    const todos = readTodos();
    const todo = todos.find(t => t.id === id)
    return todo ? JSON.stringify(todo,null,2) : null 

}
function updateTodoSync(id,updates) {
    const todos = readTodos()
    const index = todos.find(t=> t.id === id)
    if (index === -1) {
        return null
    }
    todos[index] =  {
        ...todos[index],
        updates,
        updatedAt : new Date().toISOString()
    }
    writeTodos(todos);
    return todos[index];

}

function deleteTodoSync(id) {
    const todos = readTodos();
    const filtered = todos.filter(t=> t.id !== id)
    writeTodos(filtered)
    return todos.length !== filtered.length
}
module.exports = {
    createTodoSync,
    getTodosSync,
    getTodoSync,
    updateTodoSync,
    deleteTodoSync

}