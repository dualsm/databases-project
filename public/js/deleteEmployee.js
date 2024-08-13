// app.delete in Employee section of app.js

// URL: https://github.com/osu-cs340-ecampus
// Date Retrieved: 7/31/2024
// Title: CS340 Node-js Starter App
// Type: Tutorial Github Repo
// Authors: gkochera, cortona1, currym-osu, dmgs11

function deleteEmployee(emp_id) {
    console.log(emp_id);
    let link = "/delete-employees-ajax/";
    let data = {
        emp_id: emp_id,
    };
    $.ajax({
        url: link,
        type: "DELETE",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(emp_id);
        },
    });
}

function deleteRow(emp_id) {
    let table = document.getElementById("employees-table");
    console.log(table.rows)
    for (let i = 0, row; (row = table.rows[i]); i++) {
        if (table.rows[i].getAttribute("data-value") == emp_id) {
            table.deleteRow(i);
            break;
            
        }
    }
}
