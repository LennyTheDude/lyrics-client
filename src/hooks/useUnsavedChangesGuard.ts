import { useCallback, useEffect, useRef, useState } from 'react';
import { useBlocker } from 'react-router-dom';

const ALLOW_NAV_RESET_MS = 100;

export interface UseUnsavedChangesGuardReturn {
  showModal: boolean;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
  /** Run action now if no unsaved changes; otherwise show modal and run on confirm. */
  tryLeave: (action: () => void) => void;
}

/**
 * Guards against leaving with unsaved changes: useBlocker for in-app nav,
 * beforeunload for refresh/tab close, custom modal for Cancel etc.
 */
export function useUnsavedChangesGuard(hasUnsavedChanges: boolean): UseUnsavedChangesGuardReturn {
  const allowNextRef = useRef(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const [manualOpen, setManualOpen] = useState(false);

  const blocker = useBlocker(() => !allowNextRef.current && hasUnsavedChanges);
  const showModal = blocker.state === 'blocked' || manualOpen;

  const allowThenReset = useCallback((fn: () => void) => {
    allowNextRef.current = true;
    fn();
    setTimeout(() => { allowNextRef.current = false; }, ALLOW_NAV_RESET_MS);
  }, []);

  const confirmNavigation = useCallback(() => {
    if (blocker.state === 'blocked') {
      allowThenReset(() => blocker.proceed());
    } else if (manualOpen && pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      setManualOpen(false);
      allowThenReset(action);
    }
  }, [blocker, manualOpen, allowThenReset]);

  const cancelNavigation = useCallback(() => {
    if (blocker.state === 'blocked') blocker.reset();
    pendingActionRef.current = null;
    setManualOpen(false);
  }, [blocker]);

  const tryLeave = useCallback((action: () => void) => {
    if (!hasUnsavedChanges) {
      action();
      return;
    }
    pendingActionRef.current = action;
    setManualOpen(true);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasUnsavedChanges]);

  return { showModal, confirmNavigation, cancelNavigation, tryLeave };
}
