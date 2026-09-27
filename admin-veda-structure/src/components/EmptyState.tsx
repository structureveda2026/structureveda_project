import React, { isValidElement } from "react";
import { Inbox } from "lucide-react";

interface ActionConfig {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface EmptyStateProps {
  title: string;
  message?: string;
  description?: string;
  icon?: any;
  action?: React.ReactNode | ActionConfig;
}

export default function EmptyState({
  title,
  message,
  description,
  icon,
  action,
}: EmptyStateProps) {
  const displayMessage = message || description;

  const renderIcon = () => {
    if (!icon) {
      return <Inbox className="w-8 h-8 text-charcoal-300" />;
    }
    if (isValidElement(icon)) {
      return icon;
    }
    if (
      typeof icon === "function" ||
      (typeof icon === "object" && icon !== null && ("render" in icon || "$$typeof" in icon))
    ) {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-8 h-8 text-charcoal-300" />;
    }
    return <Inbox className="w-8 h-8 text-charcoal-300" />;
  };

  const renderAction = () => {
    if (!action) return null;
    if (isValidElement(action)) {
      return action;
    }
    if (typeof action === "object" && action !== null && "label" in action) {
      const actionObj = action as ActionConfig;
      return (
        <button
          type="button"
          onClick={actionObj.onClick}
          className="btn-primary"
        >
          {actionObj.label}
        </button>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-base font-semibold text-charcoal-700">{title}</h3>
      {displayMessage && (
        <p className="text-sm text-charcoal-400 mt-1.5 max-w-sm">{displayMessage}</p>
      )}
      {action && <div className="mt-5">{renderAction()}</div>}
    </div>
  );
}

