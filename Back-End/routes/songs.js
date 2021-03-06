const express = require("express");
const router = express.Router();
const Song = require("../models/song");
const Comment = require("../models/comment");
const User = require("../models/user");

// Getting current song
router.get("/current", async function (req, res) {
  let nowPlaying = {
    songId: "",
  };

  spotifyApi
    .getMyCurrentPlaybackState()
    .then((response) => {
      if (response.body) {
        nowPlaying = {
          songId: response.body.item.id,
        };
        res.json(nowPlaying);
      } else {
        res.json(nowPlaying);
      }
    })
    .catch((err) => {
      console.log("Error when retrieving song - ", err);
      if (err.statusCode === 401) {
        res.json({
          name: "Unauthorised access - sign in using Spotify again",
          albumArt: "",
          message: "Unauthorised access - sign in using Spotify again",
        });
      }
    });
});

// Search for a song
router.get("/search/:query", async function (req, res) {
  let searchQuery = req.params.query;
  let tracks = [];
  spotifyApi.searchTracks(searchQuery).then((response) => {
    let searchResults = response.body.tracks.items;
    if (searchResults.length > 0) {
      for (var i = 0; i < searchResults.length; i++) {
        try {
          let track = {
            songId: searchResults[i].id,
            name: searchResults[i].name,
            artist: searchResults[i].artists.map((artist) => artist.name),
            albumName: searchResults[i].album.name,
            image: searchResults[i].album.images[0].url,
            previewURL: searchResults[i].preview_url,
          };
          tracks.push(track);
        } catch (err) {
          continue;
        }
      }
      res.json(tracks);
    } else {
      res.status(404).json({ message: "No search results found" });
    }
  });
});

router.get("/:id", getSong, (req, res) => {
  res.json(res.song);
});

async function getSong(req, res, next) {
  let song;
  try {
    let songData = await spotifyApi.getTrack(req.params.id);
    song = {
      songId: songData.body.id,
      songName: songData.body.name,
      artistsName: songData.body.artists.map((artist) => artist.name),
      albumName: songData.body.album.name,
      albumArt: songData.body.album.images[0].url,
      previewURL: songData.body.preview_url,
      comments: [],
    };

    let songComments = await getSongComments(req.params.id);
    if (songComments.message) {
      song.comments = [];
    } else {
      song.comments = songComments;
    }

    res.song = song;
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  next();
}

async function getSongComments(id) {
  let comments;
  try {
    comments = await Comment.find({ songId: id });
    if (comments == null) {
      return { message: "Cannot find comments" };
    }

    let userInfo;

    for (var i = 0; i < comments.length; i++) {
      userInfo = await User.find({ userId: comments[i].userId });

      let formattedReplies = [];
      for (var j = 0; j < comments[i].replies.length; j++) {
        try {
          let replyUserInfo = await User.find({
            userId: comments[i].replies[j].userId,
          });
          formattedReplies[j] = {
            ...comments[i].replies[j],
            userName: replyUserInfo[0].name,
            userImage: replyUserInfo[0].image,
            userLink: replyUserInfo[0].link,
          };
        } catch (err) {
          continue;
        }
      }

      comments[i] = {
        ...comments[i].toObject(),
        userName: userInfo[0].name,
        userImage: userInfo[0].image,
        userLink: userInfo[0].link,
        replies: formattedReplies,
      };
    }

    return comments.reverse();
  } catch (err) {
    return { message: err.message };
  }
}

module.exports = router;
