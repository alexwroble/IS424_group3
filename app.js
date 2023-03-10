

// Global constant values
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const signupBtn = document.getElementById('signup');
const signinBtn = document.getElementById('signin');
const signoutBtn = document.getElementById('signout');



// Sign up button

signupBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const email = emailInput.value; 
  const password = passwordInput.value;

  // Create user with email and password
  auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
    // Signed up successfully
    const user = userCredential.user;
    console.log('Signed up: ', user);
  }).catch(error => {
    // Error occurred during sign up
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('Error: ', errorCode, errorMessage);
  });
});


// Sign in button

signinBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const email = emailInput.value; 
  const password = passwordInput.value; 

  // Sign in user with email and password
  auth.signInWithEmailAndPassword(email, password).then(userCredential => {
    // Signed in successfully
    const user = userCredential.user;
    console.log('Signed in: ', user);
  }).catch(error => {
    // Error occurred during sign in
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('Error: ', errorCode, errorMessage);
  });
});

// Sign out button

signoutBtn.addEventListener('click', (e) => {
  e.preventDefault();

  // Sign out user
  auth.signOut().then(() => {
    // Signed out successfully
    console.log('Signed out');
  }).catch(error => {
    // Error occurred during sign out
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('Error: ', errorCode, errorMessage);
  });
});