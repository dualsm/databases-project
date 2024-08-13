
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-assignment-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_emp_id = document.getElementById("input-emp-id-edit");
    let input_job_id = document.getElementById("input-job-id-edit");
    let input_ej_id = document.getElementById("input-emp-to-job-id-edit");

    // Get the values from the form fields
    let input_emp_id_value = parseInt(input_emp_id.value);
    let input_job_id_value = parseInt(input_job_id.value);
    let input_ej_id_value = parseInt(input_ej_id.value);

    // Put our data we want to send in a javascript object
    let data = {
        emp_id: input_emp_id_value,
        job_id: input_job_id_value,
        ej_id: input_ej_id_value,
    }

    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-assignment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log(xhttp.response)
            updateRow(JSON.stringify(data), data.emp_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    //DEBUG
    console.log(JSON.stringify(data))

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    
})


function updateRow(data, emp_id){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("employeestojobsTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       console.log(table.rows[i].getAttribute("data-value"))
       if (table.rows[i].getAttribute("data-value") == emp_id) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            console.log(td.value);

            td1.innerHTML = parsedData[0].emp_name; 
            td2.innerHTML = parsedData[0].emp_hire_date; 
       }
    }
}
