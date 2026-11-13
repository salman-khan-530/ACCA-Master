import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-1.5 text-xs text-slate-500 overflow-x-auto py-1 scrollbar-none ${className}`}
    >
      <Link
        to="/"
        className="inline-flex items-center gap-1 hover:text-blue-600 font-medium transition shrink-0"
        title="Home"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast || !item.to ? (
              <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-[300px]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-blue-600 font-medium transition shrink-0 truncate max-w-[150px] sm:max-w-[200px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
