import { useCallback, useState } from "react";

export function useConfirmDialog<T>() {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<T | null>(null);

  const openWith = useCallback((nextItem: T) => {
    setItem(nextItem);
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setItem(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setItem(null);
  }, []);

  return { open, item, openWith, handleOpenChange, close };
}
