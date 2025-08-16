import { Play, Heart, MessageCircle } from "lucide-react";
import authorIcon from "../../../assets/svg/author.svg";
import "./CommunityHighlights.scss";

interface Highlight {
  id: number;
  username: string;
  title: string;
  tags: string;
  thumbnail: string;
  views: string;
  comments: number;
}

const highlights: Highlight[] = [
  {
    id: 1,
    username: "@FlashFury",
    title: "Clutch Ace on Inferno",
    tags: "CS2 #Inferno #Ace",
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80",
    views: "1.2K",
    comments: 87,
  },
  {
    id: 2,
    username: "@SilentShot",
    title: "Ninja Defuse in 1v4",
    tags: "CS2 #Defuse #Clutch",
    thumbnail:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    views: "980",
    comments: 50,
  },
];

const CommunityHighlights = () => {
  return (
    <section className="community-highlights">
      <h2 className="section-title orbitron">Community Highlights</h2>

      <div className="highlights-grid">
        {highlights.map((highlight) => (
          <div key={highlight.id} className="highlight-card">
            <div className="highlight-thumbnail">
              <img src={highlight.thumbnail} alt={highlight.title} />
              <div className="play-overlay">
                <Play size={24} />
              </div>
            </div>

            <div className="highlight-content">
              <div className="highlight-info">
                <div className="highlight-user">
                  <img src={authorIcon} alt="Author" className="author-icon" />
                  {highlight.username}
                </div>
                <div className="highlight-title orbitron">
                  {highlight.title}
                </div>
              </div>

              <div className="highlight-bottom">
                <div className="highlight-tags">{highlight.tags}</div>
                <div className="highlight-metrics">
                  <div className="metric">
                    <Heart size={16} />
                    <span>{highlight.views}</span>
                  </div>
                  <div className="metric">
                    <MessageCircle size={16} />
                    <span>{highlight.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="view-more-btn">View More</button>
    </section>
  );
};

export default CommunityHighlights;
