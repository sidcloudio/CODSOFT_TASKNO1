import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 p-4 space-y-4">
      {/* Image box */}
      <div className="w-full h-48 rounded-xl skeleton" />
      {/* Title */}
      <div className="h-5 w-3/4 rounded-lg skeleton" />
      {/* Rating */}
      <div className="h-4 w-1/3 rounded-lg skeleton" />
      {/* Bottom block */}
      <div className="flex items-center justify-between pt-2">
        <div className="h-6 w-1/4 rounded-lg skeleton" />
        <div className="h-9 w-9 rounded-xl skeleton" />
      </div>
    </div>
  );
};

export const CatalogSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-12">
      {/* Left Gallery */}
      <div className="space-y-4">
        <div className="w-full aspect-square rounded-2xl skeleton" />
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl skeleton" />
          <div className="w-20 h-20 rounded-xl skeleton" />
          <div className="w-20 h-20 rounded-xl skeleton" />
        </div>
      </div>
      {/* Right Content */}
      <div className="space-y-6">
        <div className="h-8 w-2/3 rounded-lg skeleton" />
        <div className="h-4 w-1/4 rounded-lg skeleton" />
        <div className="h-6 w-1/3 rounded-lg skeleton" />
        <div className="space-y-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="h-4 w-full rounded-lg skeleton" />
          <div className="h-4 w-full rounded-lg skeleton" />
          <div className="h-4.5 w-5/6 rounded-lg skeleton" />
        </div>
        <div className="h-12 w-1/2 rounded-xl skeleton pt-6" />
      </div>
    </div>
  );
};
