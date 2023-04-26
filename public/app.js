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

  // Upload the folder to Firebase Storage
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