import React from 'react';
import './TournamentCategories.scss';

interface TournamentCategoriesProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

const TournamentCategories: React.FC<TournamentCategoriesProps> = ({
  onCategorySelect,
  selectedCategory
}) => {
  return (
    <div className="category-cards">
      <div
        className={`category-card minor ${selectedCategory === 'minor' ? 'active' : ''}`}
        onClick={() => onCategorySelect('minor')}
      >
        <div className="category-image"></div>
        <h3 className="category-title">Minor</h3>
      </div>
      <div
        className={`category-card major ${selectedCategory === 'major' ? 'active' : ''}`}
        onClick={() => onCategorySelect('major')}
      >
        <div className="category-image"></div>
        <h3 className="category-title">Major</h3>
      </div>
      <div
        className={`category-card external ${selectedCategory === 'external' ? 'active' : ''}`}
        onClick={() => onCategorySelect('external')}
      >
        <div className="category-image"></div>
        <h3 className="category-title">External</h3>
      </div>
    </div>
  );
};

export default TournamentCategories;



