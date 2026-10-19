import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  action?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  description,
  actions,
  action,
}: PageHeaderProps) {
  const renderedSubtitle = subtitle || description;
  const renderedActions = actions || action;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-800">{title}</h1>
        {renderedSubtitle && (
          <div className="text-sm text-charcoal-400 mt-1">{renderedSubtitle}</div>
        )}
      </div>
      {renderedActions && <div className="flex items-center gap-3">{renderedActions}</div>}
    </div>
  );
}
