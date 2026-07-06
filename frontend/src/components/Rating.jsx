import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color = 'text-amber-400' }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((index) => {
          const ratingVal = index;
          return (
            <span key={index}>
              {value >= ratingVal ? (
                <Star className={`w-4 h-4 fill-current ${color}`} />
              ) : value >= ratingVal - 0.5 ? (
                <StarHalf className={`w-4 h-4 fill-current ${color}`} />
              ) : (
                <Star className="w-4 h-4 text-slate-300 dark:text-slate-700" />
              )}
            </span>
          );
        })}
      </div>
      {text && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{text}</span>}
    </div>
  );
};

export default Rating;
