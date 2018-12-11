// Load current value of  counter
document.addEventListener('DOMContentLoaded', () => {
  // if username is already set, just display username
  if (!localStorage.getItem('username')) {
    document.querySelector('#channelNavBar').style.visibility = "hidden";
  }


  // when add channel form is submitted, check whether channel already exists. otherwise, add channel
  document.querySelector('#addChannel').onsubmit = () => {

      var newChannel = document.querySelector('#channelName').value;
      for (i = 0; i < channels.length; i++) {
        if (newChannel.toLowerCase().trim() == channels[i].toLowerCase().trim()) {
          alert(`The channel ${newChannel.toLowerCase().trim()} already exists! Try a new name.`);
          return false;
        }
      }
  }

});
