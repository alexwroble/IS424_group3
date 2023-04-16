
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

// Get the signout button
const signoutButton = document.getElementById("signout");

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
  } 
  else {
    // User is signed out
    signinBtn.classList.remove("is-hidden");
    signupBtn.classList.remove("is-hidden");
    signoutButton.classList.add("is-hidden");
  }
});

// db.collection('users').doc("exUser").set({
//     userID: "SampleID",
//     firstName: "Tim",
//     lastName: "Johnson",
//     email: "sample@sample.com"
// })

db.collection('photos').doc("exPhoto").delete()