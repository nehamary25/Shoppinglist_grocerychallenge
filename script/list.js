let dropdown = document.getElementById('dropdown');
let table = document.getElementById('table');
let message = document.getElementById('message');
let jsonPath = "./json/list.json";

function buildBox(selectedDept='all'){
    // Read data from json and build dropdown and table
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function(){
        if(this.readyState == 1 || this.readyState == 2 || this.readyState == 3 && this.status == 200){
            message.innerHTML = "<h3 class='text-center'>Loading...</h3>";
            dropdown.innerHTML = "";
            table.innerHTML = "";
        }
        else if(this.readyState == 4 && this.status == 200){
            let msg = "";
            try{
                let items = JSON.parse(this.responseText).items;
                msg = "";
                buildDropdown(items, selectedDept);
                buildTable(items,selectedDept);
            }
            catch(err){
                msg = "<h3 class='text-center'>Sorry! Invalid data in table.</h3>";
                dropdown.innerHTML = "";
                table.innerHTML = "";
            }
            finally {
                message.innerHTML = msg;
            }
        }
        else if(this.status == 404){
            message.innerHTML = "<h3 class='text-center'>404! List not found.</h3>";
            dropdown.innerHTML = "";
            table.innerHTML = "";
        }
        else{
            message.innerHTML = "<h3 class='text-center'>Sorry! Something went wrong.</h3>";
            dropdown.innerHTML = "";
            table.innerHTML = "";
        }
    };
    
    xhttp.open("GET",jsonPath,true);
    xhttp.send();
}

function buildDropdown(itemsList,dept){
    // Build dropdown list from the set of departments in json.
    let uniqueDepts = [];
    let dropdownContent = "<p>Choose category</p>";
    dropdownContent += "<select class='form-control' onchange='buildBox(this.value);' name='dept' id='dept'>";
    dropdownContent += "<option value='all'"; 
    if(dept === 'all'){
        dropdownContent += " selected";
    }
    dropdownContent += ">All</option>";
    for (let i in itemsList){
        if(uniqueDepts.indexOf(itemsList[i].department) === -1){
            dropdownContent += `<option value='${itemsList[i].department}'`;
            if(dept === itemsList[i].department){
                dropdownContent += " selected";
            }
            dropdownContent += `>${itemsList[i].department}</option>`;
            uniqueDepts.push(itemsList[i].department);
        }
    }
    dropdownContent += "</select>";
    dropdown.innerHTML = dropdownContent;
}

function buildTable(itemList,dept){
    // Build table from the objects in json.
    let tableContent = "<table class='table table-borderless table-hover table-responsive-md'>";
    tableContent += "<tr style='background-color:#007965; color:white;'><th>Sl.No.</th><th>Name</th><th>Quantity</th><th>Unit</th><th>Department</th><th>Notes</th></tr>"
    for (let i in itemList){
        if(dept === 'all' || dept === itemList[i].department){
            tableContent += "<tr>"
            tableContent += `<td>${itemList[i].sno}</td>`;
            tableContent += `<td>${itemList[i].name}</td>`;
            tableContent += `<td>${itemList[i].qty}</td>`;
            tableContent += `<td>${itemList[i].unit}</td>`;
            tableContent += `<td>${itemList[i].department}</td>`;
            tableContent += `<td>${itemList[i].notes}</td>`;
            tableContent += "</tr>";
        }
    }
    tableContent += "</table>";
    table.innerHTML = tableContent;
}

window.addEventListener('load',buildBox());
