document.addEventListener('DOMContentLoaded', function(){
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar'); 
    const searchInput = document.getElementById('searchInput'); 
    const searchClose = document.getElementById('searchClose'); 

    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].addEventListener('click', function(){
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        });
    }
    searchClose.addEventListener('click', function(){
        searchBar.style.visibility = 'hidden';
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'false');
    });
});


// Function to check if user is logged in (you can check the token in localStorage or cookies)
function isLoggedIn() {
  return localStorage.getItem('token');  // Assuming you're storing a token in localStorage
}

// Function to handle logging out
function logout() {
  localStorage.removeItem('token'); // Clear token
  window.location.href = '/login'; // Redirect to login page
}

// Update button text and behavior
function updateAuthButton() {
  const authButton = document.getElementById('authButton');

  if (isLoggedIn()) {
    authButton.textContent = 'Logout';
    authButton.onclick = logout;
  } else {
    authButton.textContent = 'Login';
    authButton.onclick = function() {
      window.location.href = '/login';  // Redirect to login page
    };
  }
}

// Call the function to update the button based on login status
updateAuthButton();
