import os
import datetime
import sys
import json

from flask import Flask, flash, redirect, render_template, request, session, abort, jsonify, url_for, abort
from flask_session import Session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []
comments = []

#comments = [{name: channel1, comments: [{id: #, time: x, user: user1, text: thisistext, votes: [user1 user2 user3]}, {id: #, time: x, user: user1, text: thisistext, votes: [user1 user2 user3]}}]}]

@app.route("/", methods=["GET", "POST"])
def index():

    # If form has been submitted, add channel to channel list and return index page
    if request.method == "POST":
        channelName = request.form.get("channelName").strip().replace(" ","_")
        channelDict = {"name": channelName, "comments": []}
        comments.append(channelDict)
        channels.append(channelName)
        channels.sort(key=str.casefold)
        return redirect(url_for('channelsRoute', channel=channelName, channels=channels, comments=channelDict["comments"]))

    else:
        return render_template("/index.html",channels=channels,comments=comments)

# used to find server-side comments for a particular channel
def search(channel):
    for channelDict in comments:
        if channelDict['name'] == channel:
            return channelDict

# Show all data for the selected channel
@app.route("/<string:channel>", methods=["GET"])
def channelsRoute(channel):
    channelDict = search(channel)
    return render_template("channel.html",channels=channels, channel=channel,comments=channelDict["comments"])

# When a comment has been submited, add the comment data to the server and broadcast the comment widely
@socketio.on("submit comment")
def addComment(commentData):

    #find correct channel
    channelDict = search(commentData["channel"])
    votes = [commentData["username"]]
    numComments = len(channelDict["comments"])
    maxComments = 100

    #if at max comments, delete first comment and make id one more than last comment id
    if numComments == maxComments:
        del channelDict["comments"][0]
        id = channelDict["comments"][(maxComments - 1)]["id"] + 1
    else:
        id = numComments

    #build comment entry and add to dictionary
    commentDict = {'id': id, 'username': commentData["username"], 'timestamp': commentData["timestamp"], 'commentText': commentData["commentText"], 'votes': votes}
    channelDict["comments"].append(commentDict)

    #broadcast data
    emit("broadcast comment", channelDict, broadcast=True)

# used to find server-side comments for a particular channel
def searchComm(commentDict, id):
    for comment in commentDict:
        if comment["id"] == id:
            return comment


# When a comment has been submited, add the comment data to the server and broadcast the comment widely
@socketio.on("downvote comment")
def downvote(commentData):

    #find correct channel
    channelDict = search(commentData["channel"])
    commentDict = channelDict["comments"]
    user = commentData["username"]
    id = int(commentData["passId"])
    comment = searchComm(commentDict, id)

    #remove user from votes list
    comment["votes"].remove(user)

    #broadcast channelDict
    emit("broadcast downvote", {'channelDict': channelDict, 'comment': comment, 'voteUser': user}, broadcast=True)

# When a comment has been submited, add the comment data to the server and broadcast the comment widely
@socketio.on("upvote comment")
def upvote(commentData):

    #find correct channel
    channelDict = search(commentData["channel"])
    commentDict = channelDict["comments"]
    user = commentData["username"]
    id = int(commentData["passId"])
    comment = searchComm(commentDict, id)

    #remove user from votes list
    comment["votes"].append(user)

    #broadcast channelDict
    emit("broadcast upvote", {'channelDict': channelDict, 'comment': comment, 'voteUser': user}, broadcast=True)
