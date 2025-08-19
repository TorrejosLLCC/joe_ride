import { type FC } from "react";

interface UserRatingProps {
  rating: number;
  totalRatings?: number;
  showDetails?: boolean;
}

export const UserRating: FC<UserRatingProps> = ({ 
  rating, 
  totalRatings = 0, 
  showDetails = false 
}) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">⭐</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">⭐</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  return (
    <div className="user-rating">
      <div className="stars">
        {renderStars()}
      </div>
      <div className="rating-info">
        <span className="rating-value">{rating.toFixed(1)}</span>
        {showDetails && totalRatings > 0 && (
          <span className="rating-count">({totalRatings} ratings)</span>
        )}
      </div>
    </div>
  );
};