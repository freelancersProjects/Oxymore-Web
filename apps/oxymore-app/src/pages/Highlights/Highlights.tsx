import React, { useState } from "react";
import "./Highlights.scss";
import { FaHeart, FaComment, FaShare, FaTimes } from "react-icons/fa";

const videos = [
  {
    id: 1,
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    user: "clutchKing",
    caption: "1v4 insane retake 💥",
    tags: ["#Clutch", "#Valorant"],
    comments: [
      { user: "fanboy123", text: "insane!" },
      { user: "proplayer", text: "What a play 🔥" },
    ],
  },
  {
    id: 2,
    url: "https://www.w3schools.com/html/movie.mp4",
    user: "sniperOne",
    caption: "Quickscope de l’espace 🌌",
    tags: ["#Sniper", "#CS2"],
    comments: [{ user: "clipmaster", text: "clean bro 💯" }],
  },
];

export default function Highlights() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="highlights-container">
      <div className="top-bar">
        <input type="text" placeholder="Rechercher un joueur, un hashtag..." />
        <div className="tags">
          {["#ForYou", "#Valorant", "#CS2", "#Apex", "#Clutch", "#Sniper"].map(
            (tag) => (
              <span key={tag}>{tag}</span>
            )
          )}
        </div>
      </div>

      <div className="videos">
        {videos.map((video, index) => (
          <div className="video-card" key={video.id}>
            <video src={video.url} controls autoPlay muted loop />

            <div className="video-overlay">
              <div className="info">
                <p className="user">@{video.user}</p>
                <p className="caption">{video.caption}</p>
                <div className="tags">
                  {video.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="actions">
                <button
                  onClick={() => toggleLike(video.id)}
                  className={liked.includes(video.id) ? "liked" : ""}
                >
                  <FaHeart />
                </button>
                <button onClick={() => setShowComments(true)}>
                  <FaComment />
                </button>
                <button>
                  <FaShare />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showComments && (
        <div className="comments-panel">
          <button className="close" onClick={() => setShowComments(false)}>
            <FaTimes />
          </button>
          <h3>Commentaires</h3>
          {videos[activeIndex].comments.map((c, i) => (
            <p key={i}>
              <span>@{c.user}</span> {c.text}
            </p>
          ))}
          <div className="comment-input">
            <input type="text" placeholder="Ajouter un commentaire..." />
            <button>Envoyer</button>
          </div>
        </div>
      )}
    </div>
  );
}
