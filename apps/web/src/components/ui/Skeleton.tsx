import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const baseClasses = "animate-pulse bg-slate-700/50";
  const variantClasses = {
    rect: "rounded-xl",
    circle: "rounded-full",
    text: "rounded-md h-4 w-full"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4">
    <Skeleton className="w-12 h-12 rounded-xl" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-3 w-20" variant="text" />
      <Skeleton className="h-5 w-32" variant="text" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ cols = 5 }: { cols?: number }) => (
  <div className="flex items-center justify-between p-4 border-b border-slate-700/30 gap-4">
    <div className="flex items-center gap-4 flex-1">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/2" variant="text" />
        <Skeleton className="h-3 w-1/4" variant="text" />
      </div>
    </div>
    <div className="hidden md:flex gap-4">
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-20 rounded-full" />
      ))}
    </div>
  </div>
);
