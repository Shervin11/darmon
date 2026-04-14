'use client';

type FixedRatingProps = {
  rating: number; 
};

const FixedRating = ({ rating }: FixedRatingProps) => {
  const getStarType = (index: number) => {
    if (rating >= index + 1) return 'full';
    if (rating >= index + 0.5) return 'half';
    return 'empty';
  };

  return (
    <div className="flex">
      {[0, 1, 2, 3, 4].map((i) => {
        const type = getStarType(i);

        return (
          <span key={i} className="text-2xl">
            {type === 'full' && <span className="text-yellow-400">★</span>}
            {type === 'half' && (
              <span className="relative inline-block text-yellow-400">
                <span className="text-gray-300">★</span>
                <span className="absolute left-0 w-1/2 overflow-hidden">★</span>
              </span>
            )}
            {type === 'empty' && <span className="text-gray-300">★</span>}
          </span>
        );
      })}
    </div>
  );
};

export default FixedRating;
