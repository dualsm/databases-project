
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-employee-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_emp_id = document.getElementById("input-emp-id-update");
    let input_emp_name = document.getElementById("input-emp-name-update");
    let input_hire_date = document.getElementById("input-hire-date-update");

    // Get the values from the form fields
    let input_emp_id_value = input_emp_id.value;
    let input_emp_name_value = input_emp_name.value;
    let input_hire_date_value = input_hire_date.value;
    
    // console.log(input_emp_id.value + input_emp_name.value + input_hire_date.value);
    // currently the database table for bsg_people doesnot allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld
    if (input_emp_id_value === undefined){
        input_emp_name_value = "ERRORERRORERROR";
    }


    // Put our data we want to send in a javascript object
    let data = {
        emp_id: input_emp_id_value,
        emp_name: input_emp_name_value,
        emp_hire_date: input_hire_date_value,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-employee-ajax", true);
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
    let table = document.getElementById("employees-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       console.log(table.rows[i].getAttribute("data-value"))
       if (table.rows[i].getAttribute("data-value") == emp_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            console.log(td.value);

            td1.innerHTML = parsedData[0].emp_name; 
            td2.innerHTML = parsedData[0].emp_hire_date; 
       }
    }
}
