import { useEffect } from 'react';

export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    const defaultTitle = 'Mubarak — Photographer · Cinematographer · Drone Operator';
    document.title = title ? `${title} — Mubarak` : defaultTitle;
  }, [title]);
}
