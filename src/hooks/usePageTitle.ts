import { useEffect } from "react";

export const usePageTitle = (pageTitle?: string) => {
  useEffect(() => {
    document.title = pageTitle 
      ? `Go Engage | ${pageTitle}` 
      : "Go Engage";
  }, [pageTitle]);
};
