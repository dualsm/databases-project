
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-salary-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_job_id = document.getElementById("input-job-id");
    let input_salary_id = document.getElementById("input-salary-id");
    let input_salary = document.getElementById("input-salary");
    let input_bonus = document.getElementById("input-bonus");
    

    // Get the values from the form fields
    let input_salary_value = parseInt(input_salary.value);
    let input_salary_id_value = parseInt(input_salary_id.value);
    let input_bonus_value = parseInt(input_bonus.value);


    // Error check inputs because open text box
    if (isNaN(input_salary_value) || input_salary_value <= 0) {
        alert("Please enter a valid salary value.");
        return; 
    }

    if (isNaN(input_bonus_value) || input_bonus_value < 0) {
        alert("Please enter a valid bonus value.");
        return;
    }

    let input_job_id_value = input_job_id.value;

    // to allow for nullable salaries. 
    if (input_job_id_value != 'NULL'){
        input_job_id_value = parseInt(input_job_id_value);
    }
    
    // Put our data we want to send in a javascript object
    let data = {
        job_id: input_job_id_value,
        salary: input_salary_value,
        salary_id: input_salary_id_value,
        bonus: input_bonus_value 
    }

    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-salary-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log(xhttp.response)
            updateRow(JSON.stringify(data), data.salary_id);

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


function updateRow(data, salary_id){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("salaries-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       console.log(table.rows[i].getAttribute("data-value"))
       if (table.rows[i].getAttribute("data-value") == salary_id) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            console.log(td.value);

            td1.innerHTML = parsedData[0].emp_name; 
            td2.innerHTML = parsedData[0].emp_hire_date; 
       }
    }
}
