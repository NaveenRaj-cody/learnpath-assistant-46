
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  showNumber?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  className = "",
  showNumber = true 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(maxRating)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-amber-500 text-amber-500' : 'fill-none text-amber-500'}`} 
        />
      ))}
      {showNumber && <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
