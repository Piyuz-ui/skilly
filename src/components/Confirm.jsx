import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const Ctx = createContext(async () => true);
export const useConfirm = () => useContext(Ctx);

// Accessible modal confirmation built on <dialog>.
export function ConfirmProvider({ children }) {
  const [opts, setOpts] = useState(null);
  const resolver = useRef(null);
  const dialogRef = useRef(null);

  const confirm = useCallback((o) => new Promise((resolve) => {
    resolver.current = resolve;
    setOpts(o);
  }), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (opts && d && !d.open) d.showModal?.();
  }, [opts]);

  const close = (value) => {
    dialogRef.current?.close?.();
    setOpts(null);
    resolver.current?.(value);
    resolver.current = null;
  };

  return (
    <Ctx.Provider value={confirm}>
      {children}
      {opts && (
        <dialog ref={dialogRef} className="dialog glass" aria-labelledby="dlg-title" aria-describedby="dlg-body" onCancel={(e) => { e.preventDefault(); close(false); }}>
          <h2 id="dlg-title">{opts.title}</h2>
          <p id="dlg-body">{opts.body}</p>
          <div className="row end">
            <button type="button" className="btn ghost" onClick={() => close(false)} autoFocus>{opts.cancel || 'Cancel'}</button>
            <button type="button" className={`btn ${opts.danger ? 'danger' : 'primary'}`} onClick={() => close(true)}>{opts.ok || 'Continue'}</button>
          </div>
        </dialog>
      )}
    </Ctx.Provider>
  );
}
