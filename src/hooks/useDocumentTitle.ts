import { useEffect } from 'react';

export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    const defaultTitle = 'Prism Pulse — Photographer · Cinematographer · Drone Operator';
    document.title = title ? `${title} — Prism Pulse` : defaultTitle;
  }, [title]);
}
