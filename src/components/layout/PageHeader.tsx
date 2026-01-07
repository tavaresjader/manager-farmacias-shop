import { ReactNode } from "react";
import { Breadcrumb } from "./Breadcrumb";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: ReactNode;
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  const showBreadcrumb = breadcrumbs.length > 0;
  
  return (
    <div className="mb-6">
      {(showBreadcrumb || actions) && (
        <div className="flex items-center justify-between mb-4">
          {showBreadcrumb ? <Breadcrumb items={breadcrumbs} /> : <div />}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        {title}
      </h1>
    </div>
  );
}
