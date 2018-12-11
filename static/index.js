// if username is already set, just display username
if (localStorage.getItem('currChannel')) {
  var redirect = '/' + localStorage.getItem('currChannel');
  window.location.href = redirect;
} else {

  document.addEventListener('DOMContentLoaded', () => {

      // if username is already set, just display username
      if (localStorage.getItem('username')) {
        document.querySelector('#usernameForm').style.display = "none";
        document.querySelector('h3').innerHTML = "Your username is " + localStorage.getItem('username');
      }
        // when username form is submitted, display new username and store it locally
        document.querySelector('#usernameForm').onsubmit = () => {
            // Increment current counter
            let username = document.querySelector('#username').value.trim();
            localStorage.setItem('username', username);

            // Update counter
            document.querySelector('h3').innerHTML = "Your username is " + username;
            document.querySelector('#usernameForm').style.display = "none";
            document.querySelector('#channelNavBar').style.visibility = "visible";

            return false;
        }
  });
}
