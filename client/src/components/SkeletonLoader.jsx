// Skeleton Loader Components for Lazy Loading

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden animate-pulse">
    <div className="bg-gray-200 dark:bg-gray-600 h-48 w-full" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-16" />
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-16" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 12 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-3xl mb-4" />
    <div className="space-y-2">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-xl" />
    ))}
  </div>
);
