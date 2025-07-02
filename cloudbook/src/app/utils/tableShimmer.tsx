'use client';

interface TableShimmerProps {
  rows?: number;
  columns?: number;
  loading?: boolean;
  className?: string;
  cellClassName?: string;
}

const TableShimmer = ({ 
  rows = 10, 
  columns = 9, 
  loading = false,
  className = "",
  cellClassName = "td-cell"
}: TableShimmerProps) => {
  if (!loading) return null;

  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr
          key={`shimmer-${index}`}
          className={`animate-pulse ${className}`}
        >
          {Array.from({ length: columns }).map((_, tdIndex) => (
            <td key={tdIndex} className={cellClassName}>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableShimmer;