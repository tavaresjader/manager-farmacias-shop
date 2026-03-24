import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Pesquisar...",
  value: controlledValue,
  onSearch,
  onFilter,
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const value = controlledValue ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleClear = () => {
    setInternalValue("");
    onSearch?.("");
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input pl-10 pr-10"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {onFilter && (
        <button onClick={onFilter} className="btn-filter">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtros</span>
        </button>
      )}
    </div>
  );
}
