import "./News.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import SoldierOverlay from "../../../assets/images/imagenewscsgo2.webp";
import { OXMButton } from "@oxymore/ui";
import { articleService } from "../../../services/articleService";
import type { Article } from "../../../types/article";

const News = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        let loadedArticles = await articleService.getAllArticles(true);
        
        if (!loadedArticles || loadedArticles.length === 0) {
          loadedArticles = await articleService.getAllArticles(false);
        }
        
        console.log('Articles loaded:', loadedArticles);
        setArticles(loadedArticles || []);
      } catch (error) {
        console.error('Error loading articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageY - scrollContainerRef.current.offsetTop);
    setScrollLeft(scrollContainerRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walk = (y - startX) * 2;
    scrollContainerRef.current.scrollTop = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="news-layout">
      <div className="tournament-card">
        <div className="background-image" />
        <img src={SoldierOverlay} alt="Soldiers" className="overlay-img" />
        <div className="tournament-content">
          <h2 className="tournament-title">Join Your First Tournament</h2>
          <p className="tournament-desc">
            Browse and join tournaments to get started with your competitive
            journey.
          </p>
          <OXMButton onClick={() => navigate("/tournaments")}>View Tournaments</OXMButton>
        </div>
      </div>

      <div className="news-side">
        <h3 className="news-side-title">What's New at Oxymore?</h3>

        <div
          ref={scrollContainerRef}
          className="news-articles-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {loading ? (
            <div className="news-box">
              <p>Chargement...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="news-box">
              <p>Aucun article disponible</p>
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id_article}
                className="news-box"
              >
                <h4>{article.title}</h4>
                <p>{article.excerpt || article.content.substring(0, 100) + '...'}</p>
                <span className="read-more">Read More</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
