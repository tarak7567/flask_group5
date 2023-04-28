//import modules
// import accoms from "../Scripts/HouseABullPro.json" assert {'type': 'json'};

let accoms = [];

fetch('http://127.0.0.1:5000/housing')
  .then(response => response.json())
  .then(jsonData => {
    accoms = jsonData;
    console.log('Data fetched successfully:', accoms);
  })
  .catch(error => console.error('Error fetching data:', error));

console.log(accoms);

// get data on filter submit
document.getElementById('filterSubmit').addEventListener('click', () => {
    dispHideDataSection("none", "none", "none");  // hide all blocks
    getFilters();
});

// get all filters data from html form
function getFilters() {
    const accommodation = {
        minRent: document.getElementById('minPriceVal').value,
        maxRent: document.getElementById('maxPriceVal').value,
        distColl: document.getElementById('distVal').value,
        isFurnished: radioBtnVal('furnish'),
        tyHouses: radioBtnVal('typhse'),
        tyAmnies: radioBtnVal('tyam')
    }

    // // validate form
    if (!validate(accommodation)) {
        sendAlert("Please fill the mandatory fields!");
    } else {
        // get json Data and display
        getDataFrmJson(accommodation);
    }

}


// return selected radio button value
function radioBtnVal(radioBtnName) {
    let radioButtons = document.getElementsByName(radioBtnName);
    let selectedValue = '';

    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            selectedValue = radioButtons[i].value;
        }
    }

    return selectedValue;
}

// validate form
function validate(accommodation) {
    let valid = 0;
    Object.keys(accommodation).forEach(item => {
        if (accommodation[item] == null || accommodation[item] == 0 || accommodation[item] == '') {
            valid++;
        }
    });

    if (valid > 0) {
        return false;
    } else {
        return true;
    }
}

// get json data
function getDataFrmJson(accommodation) {
    let dispData = accoms.filter((e) => {
        if ((e.Rent > accommodation.minRent && e.Rent < accommodation.maxRent) && e.DistancefromCollege <= accommodation.distColl && 
        e.Furnished.toLowerCase() == accommodation.isFurnished.toLowerCase() && 
        e.TypesofHouses.toLowerCase() == accommodation.tyHouses.toLowerCase() &&
        e.TypesofAmenities.toLowerCase().includes(accommodation.tyAmnies.toLowerCase())){
            return e;
        } else {
            return;
        }
    });

    // if there is data
    if (dispData.length > 0) {
        loadSpinner("yes");    // load spinner ON
        let output = '';
        dispData.forEach((thisRecord) => {
            output +=
                `<tr>
                        <td>${thisRecord.AccommodationName}</td>
                        <td>${thisRecord.PetsAllowed}</td>
                        <td>${thisRecord.TypesofHouses}</td>
                        <td>${thisRecord.TypesofAmenities}</td>
                        <td>$ ${thisRecord.Rent}</td>
                        <td>${thisRecord.AvailabilityMonth}</td>
                        <td>${thisRecord.DistancefromCollege} miles</td>
                    </tr>`
        });
        document.getElementById('tableBodyData').innerHTML = output;
        visualizeData(dispData);    // get bar chart of data
        setTimeout(() => {
            loadSpinner("no");    // load spinner OFF
            dispHideDataSection("block", "block", "none");    // display data section and table
        }, 2000);
    }
    else {
        loadSpinner("yes");     // load spinner ON
        setTimeout(() => {
            loadSpinner("no");    // load spinner OFF
            dispHideDataSection("block", "none", "block");    // display data section and message
        }, 2000);
    }

}

let myChart = null;
// data chart
function visualizeData(dispData) {
    // get proper data
    let accomNames = [];
    Object.entries(dispData).forEach((item) => {
        accomNames = accomNames.concat(item[1].AccommodationName);
    });
    // remove duplicates in accomNames
    let accomNamesUniq = accomNames.filter((item, index) => accomNames.indexOf(item) === index);
    console.log(accomNamesUniq);

    // get avg rent values
    let rentVals = [];
    accomNamesUniq.forEach((eachName) => {
        let ac = dispData.filter((item) => {
            if(item.AccommodationName == eachName){
                return item;
            }
        });
        let ren = 0;
        let len = 0;
        Object.entries(ac).forEach((item) => {
            ren += item[1].Rent;
            len++;
        })
        rentVals = rentVals.concat(ren/len);
    });
    console.log(rentVals);

    const ctx = document.getElementById('myChart').getContext('2d');
    if(myChart != null){
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: accomNamesUniq,
            datasets: [{
                label: 'Rent',
                data: rentVals,
                backgroundColor: ['rgba(43, 10, 255, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title:{
                    display: true,
                    text: "Rent of an Accommodation",
                    fullSize: true,
                    color: 'black'
                }
            }
        }
    });
}



// UI Elements
// send alert
function sendAlert(msg) {
    alert(msg);
}

// display or hide data section
function dispHideDataSection(dSec, dTableSec, dMessage){
    document.getElementById('data-disp-section').style.display = dSec;
    document.getElementById('dataTable').style.display = dTableSec;
    document.getElementById('message').style.display = dMessage;
}

// loading spinner
function loadSpinner(val){
    if (val == "yes"){
        document.getElementById('spinnerId').style.display = "block";    // load spinner ON
    } else {
        document.getElementById('spinnerId').style.display = "none";    // load spinner ON
    }
}