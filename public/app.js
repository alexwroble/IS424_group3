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
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        // making the modal active
        signupModal.classList.remove("is-active");

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
    accountButton.classList.remove("is-hidden");
  } 
  else {
    // User is signed out
    signinBtn.classList.remove("is-hidden");
    signupBtn.classList.remove("is-hidden");
    signoutButton.classList.add("is-hidden");
    accountButton.classList.add("is-hidden");
  }
});

// Select the input element using
// document.querySelector
  var input = document.querySelector(
    "#file-upload>.file-label>.file-input"
  );

// Bind an listener to onChange event of the input
  input.onchange = function () {
      if(input.files.length > 0){
          var fileNameContainer =
              document.querySelector(
                "#file-upload>.file-label>.file-name"
              );
          // set the inner text of fileNameContainer
          // to the name of the file
          fileNameContainer.textContent =
            input.files[0].name;
      }
  }