document.getElementById('feedbackSubmit').addEventListener('click', () => {
    postData();
});

function postData() {
    const feedback = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        feedbackVal: document.getElementById('feedback').value
    };

    // validate and send
    if (!validate(feedback)) {
        alert("Please fill the feedback form and Submit!");
    } else {
        loadSpinner("yes");     // Loadspinner ON
        // store data in local storage
        storeInLocal(feedback);

        setTimeout(() => {
            loadSpinner("no");  // Loadspinner OFF
            hideNotification();
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('feedback').value = '';
            console.log(localStorage.getItem('feedbackObject'));
        }, 2000);

    }
}

function storeInLocal(feedback) {
    // Retrieve the current object from local storage
    let storedObj = localStorage.getItem('feedbackObject');

    // If the object doesn't exist, create a new one and store it
    if (storedObj === null) {
        localStorage.setItem('feedbackObject', JSON.stringify(feedback));
    } else {
        // Parse the stored string back to an object
        const parsedObj = JSON.parse(storedObj);

        // Append the new object to the existing object
        parsedObj.people = [...(parsedObj.people || []), feedback];

        // Store the updated object back in local storage
        localStorage.setItem('feedbackObject', JSON.stringify(parsedObj));
    }

}

// form validation
function validate(feedback) {
    let valid = true;
    if ((feedback.name == null || feedback.name == '') || (feedback.email == null || feedback.email == '') || (feedback.feedbackVal == null || feedback.feedbackVal == '')) {
        valid = false;
    }

    return valid;
}


// loading spinner
function loadSpinner(val) {
    if (val == "yes") {
        document.getElementById('spinnerId').style.display = "block";    // load spinner ON
    } else {
        document.getElementById('spinnerId').style.display = "none";    // load spinner ON
    }
}

// hide or show notification
function hideNotification() {
    document.getElementById('thankyouAlert').style.display = "block";  // show Thank You Notificatoin
    setTimeout(() => {
        document.getElementById('thankyouAlert').style.display = "none";   // hide Thank You Notificaion
    }, 3000);
}