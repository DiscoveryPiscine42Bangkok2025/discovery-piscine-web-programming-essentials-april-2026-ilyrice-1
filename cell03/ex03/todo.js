function addNewTodo() {
    let task = prompt("Enter a new task:");
    if (task != null && task.trim() !== "") {
        createTodoElement(task);
        saveToCookie();
    }
}

function createTodoElement(text) {
    const list = document.getElementById('ft_list');
    const div = document.createElement('div');
    div.textContent = text;
    
    // Clicking removes the task after confirmation
    div.onclick = function() {
        if (confirm("Do you really want to remove this TO DO?")) {
            this.remove(); // Removes permanently from DOM
            saveToCookie();
        }
    };
    
    // Place at the top of the list
    list.prepend(div);
}