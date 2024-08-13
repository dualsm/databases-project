// app.delete in Employee section of app.js

// URL: https://github.com/osu-cs340-ecampus
// Date Retrieved: 7/31/2024
// Title: CS340 Node-js Starter App
// Type: Tutorial Github Repo
// Authors: gkochera, cortona1, currym-osu, dmgs11

function deleteAssignment(emp_to_job_id) {
    console.log(emp_to_job_id);
    let link = "/delete-assignment-ajax/";
    let data = {
        emp_to_job_id: emp_to_job_id,
    };
    $.ajax({
        url: link,
        type: "DELETE",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(emp_to_job_id);
        },
    });
}

function deleteRow(emp_to_job_id) {
    let table = document.getElementById("employeestojobsTable");
    console.log(table.rows)
    for (let i = 0, row; (row = table.rows[i]); i++) {
        if (table.rows[i].getAttribute("data-value") == emp_to_job_id) {
            table.deleteRow(i);
            break;
            
        }
    }
}
