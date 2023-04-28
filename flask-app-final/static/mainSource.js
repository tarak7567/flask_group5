//import modules
// fetch data from api call
let accoms = [];

fetch('housing')
  .then(response => response.json())
  .then(jsonData => {
    accoms = jsonData;
    // console.log('Data fetched successfully:', accoms);
  })
  .catch(error => console.error('Error fetching data:', error));

//   console.log(accoms);

// get data on search click
document.getElementById('getDataSubmit').addEventListener('click', () => {
    dispHideDataSection("d-none", "d-none", "d-none");  // hide all blocks
    loadfilteredData();
});

ctr=0;
// load filtered data
function loadfilteredData() {
    // Get data from search box
    let searchData = document.getElementById('search').value;
    // filter data with given value
    let dispData = accoms.filter((e) => {
        if (searchData == "") {
            return;
        } else if (e.AccommodationName.toLowerCase().startsWith(searchData.toLowerCase())) {
            // console.log(ctr+"--"+e);
            return e;
        }
    });

    // if data is present then display table
    if (searchData === "") {
        sendAlert("Please enter data in Search Box!");
    } else {
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
                            <td>${thisRecord.DistancefromCollege}</td>
                        </tr>`
            });
            document.getElementById('tableBodyData').innerHTML = output;
            visualizeData(dispData);    // get bar chart of data
            setTimeout(() => {
                loadSpinner("no");    // load spinner OFF
                dispHideDataSection("d-block", "d-block", "d-none");    // display data section and table
            }, 2000);
        }
        else {
            loadSpinner("yes");     // load spinner ON
            setTimeout(() => {
                loadSpinner("no");    // load spinner OFF
                dispHideDataSection("d-block", "d-none", "d-block");    // display data section and message
            }, 2000);
        }
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

    // get avg rent values
    let rentVals = [];
    accomNamesUniq.forEach((eachName) => {
        let ac = dispData.filter((item) => {
            if (item.AccommodationName == eachName) {
                return item;
            }
        });
        let ren = 0;
        let len = 0;
        Object.entries(ac).forEach((item) => {
            ren += item[1].Rent;
            len++;
        })
        rentVals = rentVals.concat(ren / len);
    });


    // bar chart
    const ctx = document.getElementById('myChart').getContext('2d');
    if(myChart != null){
        myChart.destroy();
    }
    myChart =  new Chart(ctx, {
        type: 'bar',
        data: {
            labels: accomNamesUniq,
            datasets: [{
                label: 'Avg. Rent of an Accommodation',
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
                title: {
                    display: true,
                    text: "Avg. Rent per Accommodation",
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
function dispHideDataSection(dSec, dTableSec, dMessage) {
    document.getElementById('data-disp-section').setAttribute("class", dSec);
    document.getElementById('dataTable').setAttribute("class", dTableSec);
    document.getElementById('message').setAttribute("class", dMessage);
}

// loading spinner
function loadSpinner(val) {
    if (val == "yes") {
        document.getElementById('spinnerId').style.display = "block";    // load spinner ON
    } else {
        document.getElementById('spinnerId').style.display = "none";    // load spinner ON
    }
}


// data
