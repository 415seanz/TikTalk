document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Save the current channel for this user
    localStorage.setItem('currChannel', channel);

    var localUsername = localStorage.getItem('username');

    console.log(comments);
    upVotes(localUsername,comments);
    assignOnClick(channel,localUsername);

    // When connected, configure buttons
    socket.on('connect', () => {
      // When the submit button is clicked, send the comment data from client to server
      document.getElementById('commentForm').onsubmit = () => {
        var commentText = document.getElementById('commentText').value;
        document.getElementById('commentText').value='';
        socket.emit('submit comment', {'timestamp': Date(Date.now()), 'channel': channel, 'username': localUsername, 'commentText': commentText});
        return false;
      };
    });

    // When a new comment is submitted, add it to the top of the list
    socket.on('broadcast comment', jsonDict => {
        if (jsonDict.name == channel) {
          comments = jsonDict.comments;
          var len = comments.length - 1;
          var votes = comments[len].votes.length
          //var str = '<div class="seanDiv" style="text-align:center;">User ' + jsonDict.comments[len].username + ' at ' + jsonDict.comments[len].timestamp + ' wrote: ' + jsonDict.comments[len].commentText + '</div>';
          var str = '<div class="row" style="width:95%; padding-top:10px;">'
            + '<div class="border col-md-4" style="text-align: left;">'
            + comments[len].username
            + ' @ '
            + comments[len].timestamp.substring(0,24)
            + '</div> <div class="border border-left-0 col-md-7" style="text-align: left;">'
            + comments[len].commentText
            + '</div> <div class="container-fluid border border-left-0 col-md-1"><div class="row"><div id='
            + comments[len].id
            + ' class="col-md-4">'
            + votes
            + '</div><div id=button-'
            + comments[len].id
            + ' class="UpvoteUnclicked" data-id='
            + comments[len].id
            + '></div></div></div>';
          document.getElementById('commentSection').insertAdjacentHTML('afterbegin', str);
          console.log('about to run upvotes');
          upVotes(localUsername,comments);
          console.log('done running upvotes');
          assignOnClick(channel,localUsername);
        }
    });

    // When a downvote is submitted, decrement the upvote count and turn upvote arrow to gray for user
    socket.on('broadcast downvote', jsonDict => {
        if (jsonDict.channelDict.name == channel) {
          document.getElementById(jsonDict.comment.id).innerHTML = jsonDict.comment.votes.length;
          comments = jsonDict.channelDict.comments;
          //let voteUser = jsonDict.user;

          // Turn upvote arrow to gray for downvoting user
          //if (voteUser == localUsername) {
            //let buttonName = 'button-' + jsonDict.comment.id;
            //document.getElementById(buttonName).classList.remove('UpvoteClicked');
            //document.getElementById(buttonName).onclick = null;
            //document.getElementById(buttonName).classList.add('UpvoteUnclicked');
          //}
        upVotes(localUsername,comments);
        assignOnClick(channel,localUsername);
        }

    });

    // When a downvote is submitted, decrement the upvote count and turn upvote arrow to gray for user
    socket.on('broadcast upvote', jsonDict => {
        if (jsonDict.channelDict.name == channel) {
          document.getElementById(jsonDict.comment.id).innerHTML = jsonDict.comment.votes.length;
          comments = jsonDict.channelDict.comments;
          //let voteUser = jsonDict.user;

          // Turn upvote arrow to gray for downvoting user
          //if (voteUser == localUsername) {
            //let buttonName = 'button-' + jsonDict.comment.id;
            //document.getElementById(buttonName).classList.remove('UpvoteUnclicked');
            //document.getElementById(buttonName).onclick = null;
            //document.getElementById(buttonName).classList.add('UpvoteClicked');
          //}
        upVotes(localUsername,comments);
        assignOnClick(channel,localUsername);
        }
    });

function assignOnClick(channel,username) {
  Array.from(document.getElementsByClassName('UpvoteClicked')).forEach(div => {
    div.onclick = function down() {
      var passId = div.dataset.id;
      socket.emit('downvote comment', {'passId': passId, 'channel': channel, 'username': username});
    };
  });
  Array.from(document.getElementsByClassName('UpvoteUnclicked')).forEach(div => {
    div.onclick = function up() {
      var passId = div.dataset.id;
      socket.emit('upvote comment', {'passId': passId, 'channel': channel, 'username': username});
    };
  });
}

// Send this function a username and a set of comments, it will change any unclicked values that have been clicked
function upVotes(localUsername,searchComments) {
  console.log(searchComments);
  for (i = 0; i < searchComments.length; i++) {
    console.log(searchComments[i]);
    var resultFound = 0;
    var buttonName = 'button-' + i;
    if (searchComments[i].votes == undefined || searchComments[i].votes.length == 0) {
      document.getElementById(buttonName).classList.remove('UpvoteClicked');
      document.getElementById(buttonName).removeAttribute("onclick");
      document.getElementById(buttonName).classList.add('UpvoteUnclicked');
      console.log(buttonName);
      console.log(resultFound);
    }
    else {
      for (j = 0; j < searchComments[i].votes.length; j++) {
        if (searchComments[i].votes[j] == localUsername) {
          document.getElementById(buttonName).classList.remove('UpvoteUnclicked');
          document.getElementById(buttonName).removeAttribute("onclick");
          document.getElementById(buttonName).classList.add('UpvoteClicked');
          resultFound = 1;
          console.log(buttonName);
          console.log(resultFound);
          break;
        }
        else if ((j == (searchComments[i].votes.length - 1)) && resultFound == 0) {
          document.getElementById(buttonName).classList.remove('UpvoteClicked');
          document.getElementById(buttonName).removeAttribute("onclick");
          document.getElementById(buttonName).classList.add('UpvoteUnclicked');
          console.log(buttonName);
          console.log(resultFound);
        }
      }
    }
  }
}

});
