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

// Get the signout and Account button
const signoutButton = document.getElementById("signout");
const accountButton = document.getElementById("account");

//Get contact button
const contactButton = document.getElementById("contact");

//Get photoshoot dropdown selection option
const photoshootOption = document.getElementById("photoshootSelector");


//configure message bar
function configure_message_bar(msg) {

  //enforce message bar being visible
  r_e('message_bar').classList.remove('is-hidden')


  r_e('message_bar').innerHTML = msg;


  //now hide the message bar after some time 
  setTimeout(() => {
    r_e('message_bar').innerHTM = ""; //clears the text from message bar
    r_e('message_bar').classList.add('is-hidden');
  }, 6000)
}



document.addEventListener('DOMContentLoaded', () => {

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      r_e('message_bar').classList.add('is-hidden')
    } else {

      configure_message_bar("If you are wanting to contact Kevin or view your photoshoots, please sign into the website!")
    }
  })
});









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

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Create a new user document in Firestore with a generated ID
        const userId = userCredential.user.uid;
        const userRef = db.collection("users").doc(userId);
        userRef.set({
          email: email,
          admin: 0
        });
        // making the modal active
        signupModal.classList.remove("is-active");
        r_e('signup-form').reset();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error creating user: ${errorCode} - ${errorMessage}`);
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
  firebase.auth().signOut()
    // Redirect to index.html after signing out
    .then(() => {
      location.href = "index.html"
    });
});



// Check signed in status to determine buttons on nav


firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    signinBtn.classList.add("is-hidden");
    accountButton.classList.add("is-hidden");
    signupBtn.classList.add("is-hidden");
    signoutButton.classList.remove("is-hidden");
    contactButton.classList.remove("is-hidden");
    photoshootOption.classList.remove("is-hidden");
    //displays user in navbar
    r_e("user_email").innerHTML += auth.currentUser.email;





    //ADMIN CHECK: Checks if the email is Kevin's account, and if it is, then he can access the account button
    if (user.email === 'youtseofficial@gmail.com') {
      accountButton.classList.remove("is-hidden")
    } else {
      accountButton.classList.add("is-hidden");
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

  fileRef.put(file).then(() => {
    // Get the download URL of the uploaded image
    fileRef.getDownloadURL().then((url) => {
      // Add the image URL and timestamp to Firestore
      const collectionRef = firebase.firestore().collection(folder);
      collectionRef.add({
        name: file.name,
        url: url,
        timestamp: Date.now(),
      }).then(() => {
        alert("File uploaded successfully!");
      }).catch((error) => {
        console.error(error);
        alert("Error uploading file to Firestore.");
      });
    }).catch((error) => {
      console.error(error);
      alert("Error getting download URL.");
    });
  }).catch((error) => {
    console.error(error);
    alert("Error uploading file to Firebase Storage.");
  });
}





//uploading photoshoots
function uploadFolder() {
  // Get the folder and new folder name
  const folderInput = document.getElementById("folder");
  const newFolderName = document.getElementById("photoshootName").value;
  const newFolderEmail = document.getElementById("clientEmail").value;


  // Create a storage reference to the new folder in the photoshoot folder
  const newFolderRef = storage.ref().child("Photoshoots").child(newFolderName);

  // Upload the folder to Firebase
  const files = Array.from(folderInput.files);

  const loadingMsg = document.getElementById("loading-msg");
  loadingMsg.innerHTML = `Uploading files... 0/${files.length}`;

  function uploadFile(file, index) {
    const fileRef = newFolderRef.child(file.name);
    fileRef.put(file).then(() => {
      console.log(`${file.name} uploaded successfully!`);
      loadingMsg.innerHTML = `Uploading files... ${index + 1}/${files.length}`;

      loadingMsg.classList.remove('has-text-danger-dark');
      loadingMsg.classList.add('has-text-success');
      loadingMsg.innerHTML = "All Files Uploaded";
      if (index === files.length - 1) {
        // Add data to Firestore collection
        const photoshootsCollection = db.collection("Photoshoots");
        const data = {
          photoshootName: newFolderName,
          clientEmail: newFolderEmail,
          timestamp: Date.now(),
        };
        photoshootsCollection.add(data).then(() => {
          console.log("Data added to Firestore collection");
        }).catch((error) => {
          console.error(error);
        });

        alert("Folder created, wait for files");
        //loadingMsg.innerHTML = "";
      }
    }).catch((error) => {
      console.error(error);
      alert(`Error uploading ${file.name}.`);
      loadingMsg.innerHTML = "";
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

    // Get the Firestore database collection name that matches all the letters before the first slash in prefix.fullPath
    const collectionName = checkbox.value.split("/")[0];
    const photoName = checkbox.value.split("/")[1];

    console.log(photoName);

    // Delete the photo from Firebase Storage
    fileRef.delete().then(() => {
      alert(`File/Folder ${checkbox.value} deleted successfully`);

      // Delete the photo from Firestore database collection
      db.collection(collectionName).where("name", "==", photoName)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        })
        .catch((error) => {
          console.error(`Error deleting photo from Firestore collection ${collectionName}: ${error.message}`);
        });
    }).catch((error) => {
      console.error(`Error deleting file/folder ${checkbox.value}: ${error.message}`);
    });
  });
}

//deleting photoshoots
function deleteFolder(buttonID) {
  const storageRef = storage.ref();
  const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const folderPath = checkbox.value;
      const folderRef = storageRef.child(folderPath);

      folderRef.listAll().then((listResult) => {
        listResult.items.forEach((item) => {
          if (item.isDirectory) {
            deleteFolder(item.fullPath);
          } else {
            item.delete().then(() => {
              console.log(`File ${item.fullPath} deleted successfully`);
            }).catch((error) => {
              console.error(`Error deleting file ${item.fullPath}: ${error.message}`);
            });
          }
        });

        // Delete data from Firestore collection
        const photoshootsCollection = db.collection("Photoshoots");
        const photoshootName = folderPath.split("/")[1];
        const photoshootDoc = photoshootsCollection.where("photoshootName", "==", photoshootName).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete();
              console.log(`Document with ID ${doc.id} deleted from Firestore collection`);
            });
          })
          .catch((error) => {
            console.error(`Error getting document: ${error}`);
          });

        alert(`Folder ${folderPath} deleted successfully`)
      }).catch((error) => {
        console.error(`Error listing items in folder ${folderPath}: ${error.message}`);
      });
    }
  });
}







//displaying hotos from storage
function displayPhotosFromFolder(folderName) {
  var storageRef = storage.ref();
  var photosRef = storageRef.child(folderName);

  // List all the items in the folder
  photosRef.listAll().then(function (res) {
    // Create a new row div
    var rowDiv = document.createElement('div');
    rowDiv.className = 'columns is-multiline';

    // Create a new image object for each photo
    var imageObjects = res.items.map(function (itemRef) {
      return new Promise(function (resolve, reject) {
        itemRef.getDownloadURL().then(function (url) {
          var img = new Image();
          img.onload = function () {
            resolve({
              img: img,
              url: url
            });
          };
          img.onerror = function () {
            reject(new Error('Failed to load image ' + url));
          };
          img.src = url;
        });
      });
    });

    // Wait for all images to load
    Promise.all(imageObjects).then(function (images) {
      images.forEach(function (image, index) {
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
    }).catch(function (error) {
      console.log(error);
    });
  }).catch(function (error) {
    console.log(error);
  });
}


function displayPhotoshoots() {
    //displaying the photoshoots

  var storageRef = storage.ref().child('Photoshoots');

  // Get a reference to the gallery element in the HTML
  var galleryElement = document.getElementById('gallery');

  // Function to display a folder with its cover photo
  // Function to display a folder with its cover photo
// Function to display a folder with its cover photo
function displayFolder(folderName, coverPhotoUrl) {
  var folderDiv = document.createElement('div');
  folderDiv.classList.add('column', 'is-one-third');

  var folderLink = document.createElement('a');
  folderLink.href = '#';
  folderLink.addEventListener('click', function() {
    openModal(folderName);
  });

  var folderImage = document.createElement('div');
  folderImage.classList.add('folder-image');
  folderImage.style.backgroundImage = 'url(' + coverPhotoUrl + ')';

  var folderNameElement = document.createElement('div');
  folderNameElement.classList.add('folder-name');
  folderNameElement.textContent = folderName;

  folderLink.appendChild(folderImage);
  folderLink.appendChild(folderNameElement);
  folderDiv.appendChild(folderLink);
  galleryElement.appendChild(folderDiv);
}

// Function to open the modal and display all photos in a folder
function openModal(folderName) {
  var folderRef = storageRef.child(folderName);
  var photoModal = document.getElementById('modal');
  var photoModalContent = document.querySelector('#modal .modal-content .columns');
  photoModalContent.innerHTML = '';

  folderRef.listAll().then(function(res) {
    var imgElements = [];
  
    res.items.forEach(function(itemRef) {
      itemRef.getDownloadURL().then(function(photoUrl) {
        console.log(photoUrl)
        console.log(imgElements.length)

        var img = document.createElement('img');
        img.src = photoUrl;
        img.classList.add('modal-photo');
        imgElements.push(img);
  
        if (imgElements.length === res.items.length) {
          // create rows and columns when all images have been loaded
          var row = document.createElement('div');
          row.classList.add('row1');
          photoModalContent.appendChild(row);
  
          for (var i = 0; i < imgElements.length; i++) {
            var col = document.createElement('div');
            col.classList.add('column', 'is-one-third');
            col.appendChild(imgElements[i]);
            row.appendChild(col);
  
            if ((i + 1) % 3 === 0) {
              // create a new row for every third image, except for the last image
              row = document.createElement('div');
              row.classList.add('row1', 'is-flex-wrap-wrap', 'is-justify-content-center');
              photoModalContent.appendChild(row);
            } else if (i === imgElements.length - 1 && (i + 1) % 3 !== 0) {
              // if the last row has less than 3 images, add it to the modal content
              photoModalContent.appendChild(row);
            }
          }
        }
      }).catch(function(error) {
        console.error('Error getting download URL:', error);
      });
    });
  }).catch(function(error) {
    console.error('Error listing items in folder:', error);
  });
  

  photoModal.classList.add('is-active');
  photoModal.querySelector('.modal-close').addEventListener('click', function() {
    photoModal.classList.remove('is-active');
  });
}


  

// Function to display all folders in the storage bucket
storageRef.listAll().then(function(res) {
  // Loop through all folders and display them
  res.prefixes.forEach(function(folderRef) {
    // Get the cover photo for the folder
    folderRef.list().then(function(res) {
      if (res.items.length > 0) {
        res.items[0].getDownloadURL().then(function(url) {
          displayFolder(folderRef.name, url);
        }).catch(function(error) {
          console.error('Error getting download URL:', error);
        });
      }
    }).catch(function(error) {
      console.error('Error listing items in folder:', error);
    });
  });
}).catch(function(error) {
  console.error('Error listing items in bucket:', error);
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

  //Check if the current page is the photoshoots page
  if (currentUrl.indexOf('PhotoHub.html') !== -1) {
    displayPhotoshoots();
  }
}

// Add an event listener to the window object that listens for the load event
window.addEventListener('load', function () {
  // Call the function that checks the current page URL and calls the displayPhotosFromFolder function with the appropriate folder name
  displayPhotosBasedOnPage();
});


