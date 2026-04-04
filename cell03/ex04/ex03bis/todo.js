$(document).ready(function() {
    // Select the button using jQuery and attach the click event
    $('#new-todo-button').click(function() {
        let task = prompt("Enter a new task:");
        if (task && task.trim() !== "") {
            createTodoElement(task);
            saveToCookie();
        }
    });

    function createTodoElement(text) {
        // Create a new div and set its text using jQuery
        const $div = $('<div></div>').text(text);
        
        // Use jQuery's .click() for the removal logic
        $div.click(function() {
            if (confirm("Do you really want to remove this TO DO?")) {
                $(this).remove(); // jQuery removal
                saveToCookie();
            }
        });
        
        // Use .prepend() to place it at the top of the #ft_list
        $('#ft_list').prepend($div);
    }
});