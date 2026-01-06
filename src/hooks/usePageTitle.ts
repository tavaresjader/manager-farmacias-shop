import { useEffect } from "react";

export const usePageTitle = (pageTitle?: string) => {
  useEffect(() => {
    document.title = pageTitle 
      ? `Farmácias Shop | ${pageTitle}` 
      : "Farmácias Shop";
  }, [pageTitle]);
};
