const firebaseConfig = {
  apiKey: "AIzaSyDOMKx-CFQUpcSjCzM248VujvTgCFhHydw",
  authDomain: "youtsephotography-542fa.firebaseapp.com",
  projectId: "youtsephotography-542fa",
  storageBucket: "youtsephotography-542fa.appspot.com",
  messagingSenderId: "804419696590",
  appId: "1:804419696590:web:bfee8cc5a8d44952e15d9f",
  measurementId: "G-PJV30F7QSJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// define authentication variable
let auth = firebase.auth();
let db = firebase.firestore();

// return the HTML element with a given ID
function r_e(id) {
  return document.querySelector(`#${id}`)
}



// Get the modals
const signupModal = document.getElementById("signup-modal");
const signinModal = document.getElementById("signin-modal");

// Get the buttons that open modals
const signupBtn = document.getElementById("signup");
const signinBtn = document.getElementById("signin");

// Get th close buttons for the modals
const signupClose = document.getElementById("signup-close");
const signinClose = document.getElementById("signin-close");

// Get the signup form fields
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirmPassword = document.getElementById("signup-confirm-password");
const signupButton = document.getElementById("signup-button");

// Get the signin form fields
const signinEmail = document.getElementById("signin-email");
const signinPassword = document.getElementById("signin-password");
const signinButton = document.getElementById("signin-button");

// Get the signout adn Account button
const signoutButton = document.getElementById("signout");
const accountButton = document.getElementById("account");

// Add event listeners to the buttons
signupBtn.addEventListener("click", () => {
  signupModal.classList.add("is-active");
});

signinBtn.addEventListener("click", () => {
  signinModal.classList.add("is-active");
});

signupClose.addEventListener("click", () => {
  signupModal.classList.remove("is-active");
});

signinClose.addEventListener("click", () => {
  signinModal.classList.remove("is-active");
});

signupButton.addEventListener("click", (event) => {
  event.preventDefault();
  const email = signupEmail.value;
  const password = signupPassword.value;
  const confirmPassword = signupConfirmPassword.value;

  if (password === confirmPassword) {

    // Check if password is at least 6 characters long
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      // making the modal active
      signupModal.classList.remove("is-active");
      r_e('signup-form').reset();

    });
  }

  // Password error
  else {
    alert("Passwords do not match");
  }
});

signinButton.addEventListener("click", (event) => {
  event.preventDefault();
  const email = signinEmail.value;
  const password = signinPassword.value;

  firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
    signinModal.classList.remove("is-active");
    r_e('signin-form').reset()
  });
});

signoutButton.addEventListener("click", () => {
  firebase.auth().signOut();
});



// Check signed in status to determine buttons on nav
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    signinBtn.classList.add("is-hidden");
    signupBtn.classList.add("is-hidden");
    signoutButton.classList.remove("is-hidden");
    //displays user in navbar
    r_e("user_email").innerHTML += auth.currentUser.email;

    //ADMIN CHECK: Checks if the email is Kevin's account, and if it is, then he can access the account button
    if (user.email === 'youtseofficial@gmail.com') {
      accountButton.classList.remove("is-hidden")
    };
  } else {
    // User is signed out

    signinBtn.classList.remove("is-hidden");
    signupBtn.classList.remove("is-hidden");
    signoutButton.classList.add("is-hidden");
    accountButton.classList.add("is-hidden");
    //removes user from navbar
    r_e("user_email").innerHTML = ""
  }
});




//uploading files functions
const storage = firebase.storage();

function uploadImage(folder, inputID) {
  console.log(inputID)
  // Get the file
  const file = document.getElementById(inputID).files[0];

  // Create a storage reference to the folder where the file will be uploaded
  const folderRef = storage.ref().child(folder);

  // Create a reference to the file's location in the folder
  const fileRef = folderRef.child(file.name);

  // Upload the file to Firebase Storage
  fileRef.put(file).then(() => {
    alert("File uploaded successfully!");
  }).catch((error) => {
    console.error(error);
    alert("Error uploading file.");
  });
}

//uploading photoshoots
function uploadFolder() {
  // Get the folder and new folder name
  const folderInput = document.getElementById("folder");
  const newFolderName = document.getElementById("photoshootName").value;
  const newFolderEmail = document.getElementById("clientEmail").value;

  console.log(newFolderEmail);
  console.log(folder);

  // Create a storage reference to the new folder in the photoshoot folder
  const newFolderRef = storage.ref().child("Photoshoots").child(newFolderName);

  // Upload the folder to Firebase
  const files = Array.from(folderInput.files);

  function uploadFile(file, index) {
    const fileRef = newFolderRef.child(file.name);
    fileRef.put(file).then(() => {
      console.log(`${file.name} uploaded successfully!`);
      if (index === files.length - 1) {
        alert("Folder uploaded successfully!");
      }
    }).catch((error) => {
      console.error(error);
      alert(`Error uploading ${file.name}.`);
    });
  }

  if (files.length > 0) {
    files.forEach((file, index) => {
      if (file.type.match("image.*")) {
        uploadFile(file, index);
      } else {
        //not sure if we need this, but a good failsafe
        alert(`${file.name} is not an image file.`);
      }
    });
  } else {
    alert("Please select a folder.");
  }
}


//listing items in storage
function listFiles(divID, folder) {
  storageRef = storage.ref().child(folder)

  // clear current list
  document.getElementById(divID).innerHTML = "";


  // Display the list of files and folders in Firebase Storage
  storageRef.listAll().then((result) => {
    const fileList = document.getElementById(divID);

    result.items.forEach((item) => {
      const listItem = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = item.fullPath;
      listItem.appendChild(checkbox);
      listItem.appendChild(document.createTextNode(item.fullPath));
      fileList.appendChild(listItem);
    });

    result.prefixes.forEach((prefix) => {
      const listItem = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = prefix.fullPath;
      listItem.appendChild(checkbox);
      listItem.appendChild(document.createTextNode(prefix.fullPath));
      fileList.appendChild(listItem);
    });
  });
}




// Handle the delete button click event
function deleteFile(buttonID) {
  const deleteButton = document.getElementById(buttonID);
  const storageRef = storage.ref();


  const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
  checkboxes.forEach((checkbox) => {
    const fileRef = storageRef.child(checkbox.value);

    fileRef.delete().then(() => {
      alert(`File/Folder ${checkbox.value} deleted successfully`);
    }).catch((error) => {
      console.error(`Error deleting file/folder ${checkbox.value}: ${error.message}`);
    });
  });
}

function deleteFolder(buttonID) {
  const deleteButton = document.getElementById(buttonID);
  const storageRef = storage.ref();


  const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
  checkboxes.forEach((checkbox) => {
    const fileRef = storageRef.child(checkbox.value);
    console.log(fileRef)

    fileRef.delete().then(() => {
      alert(`File/Folder ${checkbox.value} deleted successfully`);
    }).catch((error) => {
      console.error(`Error deleting file/folder ${checkbox.value}: ${error.message}`);
    });
  });
}


//displaying hotos from storage
function displayPhotosFromFolder(folderName) {
  var storageRef = storage.ref();
  var photosRef = storageRef.child(folderName);

  // List all the items in the folder
  photosRef.listAll().then(function(res) {
    // Create a new row div
    var rowDiv = document.createElement('div');
    rowDiv.className = 'columns is-multiline';

    // Create a new image object for each photo
    var imageObjects = res.items.map(function(itemRef) {
      return new Promise(function(resolve, reject) {
        itemRef.getDownloadURL().then(function(url) {
          var img = new Image();
          img.onload = function() {
            resolve({ img: img, url: url });
          };
          img.onerror = function() {
            reject(new Error('Failed to load image ' + url));
          };
          img.src = url;
        });
      });
    });

    // Wait for all images to load
    Promise.all(imageObjects).then(function(images) {
      images.forEach(function(image, index) {
        // Check if the row is full (i.e., 3 photos per row)
        if (rowDiv.childElementCount === 3) {
          // Add the row div to the container
          document.getElementById('photo-container').appendChild(rowDiv);

          // Create a new row div
          rowDiv = document.createElement('div');
          rowDiv.className = 'columns is-multiline';
        }

        // Create an image element for each photo
        var img = document.createElement('img');
        img.className = 'p-2'
        img.src = image.url;

        // Create a new column div
        var colDiv = document.createElement('div');
        colDiv.className = 'column is-one-third';

        colDiv.appendChild(img);
        rowDiv.appendChild(colDiv);
      });

      // Check if there are any remaining photos that haven't been added to a row
      if (rowDiv.childElementCount > 0) {
        // Add the row div to the container
        document.getElementById('photo-container').appendChild(rowDiv);
      }
    }).catch(function(error) {
      console.log(error);
    });
  }).catch(function(error) {
    console.log(error);
  });
}


// Define the function that checks the current page URL and calls the displayPhotosFromFolder function with the appropriate folder name
function displayPhotosBasedOnPage() {
  var currentUrl = window.location.href;

  // Check if the current page is the home page
  if (currentUrl.indexOf('index.html') !== -1 || currentUrl === '/') {
    displayPhotosFromFolder('HomePage');
  }

  if (currentUrl.indexOf('urban.html') !== -1) {
    displayPhotosFromFolder('Urban');
  }

  if (currentUrl.indexOf('nature.html') !== -1) {
    displayPhotosFromFolder('Nature');
  }

  // Check if the current page is the about page
  // if (currentUrl.indexOf('about.html') !== -1) {
  //   displayPhotosFromFolder('about-page-photos');
  // }
}

// Add an event listener to the window object that listens for the load event
window.addEventListener('load', function() {
  // Call the function that checks the current page URL and calls the displayPhotosFromFolder function with the appropriate folder name
  displayPhotosBasedOnPage();
});
