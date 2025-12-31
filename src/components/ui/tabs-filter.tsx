import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsFilterProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TabsFilter({ tabs, activeTab, onTabChange }: TabsFilterProps) {
  return (
    <div className="flex items-center gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "tab-item",
            activeTab === tab.id && "tab-item-active"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-xs text-muted-foreground">
              {tab.count.toString().padStart(2, "0")}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
