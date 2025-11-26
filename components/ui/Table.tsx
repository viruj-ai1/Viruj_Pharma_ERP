import React from 'react';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={`w-full caption-bottom text-sm text-text-primary dark:text-text-primary ${className}`} {...props} />
    </div>
  )
);

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={`[&_tr]:border-b [&_tr]:border-ui-border ${className}`} {...props} />
  )
);

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
  )
);

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={`bg-primary text-primary-foreground font-medium ${className}`} {...props} />
  )
);

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={`border-b border-ui-border transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50 ${className}`}
      {...props}
    />
  )
);

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={`h-12 px-4 text-left align-middle font-medium text-text-muted [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  )
);

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
  )
);
