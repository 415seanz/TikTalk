TikTalk

This is my chat application similar in nature to Slack. Users will pick a username to begin that will be stored locally. They can then create and use channels to facilitate discussion with others. New comments are broadcast to all users in real time with SocketIO. Users can also upvote comments they agree with. Upvote totals are again broadcast in real time via SocketIO.

##Setting up the code
Download the repository and use your terminal to change directory to the folder.

Install the requirements through your teminal with the command `pip install -r requirements.txt`

Set the environment variable FLASK_APP to be application.py.

- On a Mac or on Linux, the command to do this is `export FLASK_APP=application.py`

- On Windows, the command is instead `set FLASK_APP=application.py`

Start your flask application with `flask run`

Visit http://127.0.0.1:5000
