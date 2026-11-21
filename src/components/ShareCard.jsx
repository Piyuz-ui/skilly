import { useEffect, useRef, useState } from 'react';
import { FORMATS, drawCard, ensureFonts, caption, canvasToBlob, siteUrl } from '../lib/shareCard.js';
import { trackEvent } from '../lib/analytics.js';
import { useAccount } from '../lib/account.js';

const FORMAT_KEY = 'skilly:cardFormat';
const readFormat = () => { try { return localStorage.getItem(FORMAT_KEY) === 'square' ? 'square' : 'wide'; } catch { return 'wide'; } };

// A button that opens the share dialog for one card.
export function ShareButton({ getCard, label = 'Share', className = 'btn ghost', kind }) {
  const [card, setCard] = useState(null); // frozen when the dialog opens
  return (
    <>
      <button type="button" className={className} onClick={() => setCard(getCard())} aria-haspopup="dialog">📤 {label}</button>
      {card && <ShareDialog card={card} kind={kind} onClose={() => setCard(null)} />}
    </>
  );
}

function ShareDialog({ card, kind, onClose }) {
  const acct = useAccount();
  const userName = acct.status === 'signedIn' ? acct.user?.name : '';
  const [format, setFormat] = useState(readFormat);
  const [withName, setWithName] = useState(false);
  const [img, setImg] = useState('');
  const [msg, setMsg] = useState('');
  const dialogRef = useRef(null);
  const canvasRef = useRef(null);
  const text = caption(card);

  useEffect(() => { dialogRef.current?.showModal?.(); }, []);

  // Redraw whenever the format or name option changes.
  useEffect(() => {
    let alive = true;
    (async () => {
      await ensureFonts();
      if (!alive) return;
      const c = canvasRef.current || (canvasRef.current = document.createElement('canvas'));
      drawCard(c, card, { format, name: withName ? userName : '' });
      setImg(c.toDataURL('image/png'));
    })();
    return () => { alive = false; };
  }, [card, format, withName, userName]);

  const setFmt = (f) => { setFormat(f); try { localStorage.setItem(FORMAT_KEY, f); } catch { /* ignore */ } };
  const close = () => { dialogRef.current?.close?.(); onClose(); };
  const filename = `skilly-${card.kind === 'report' ? 'result' : 'progress'}.png`;

  const file = async () => {
    const blob = await canvasToBlob(canvasRef.current);
    return new File([blob], filename, { type: 'image/png' });
  };

  const canShareFiles = typeof navigator !== 'undefined' && !!navigator.canShare && (() => {
    try { return navigator.canShare({ files: [new File([new Blob(['x'])], 'x.png', { type: 'image/png' })] }); } catch { return false; }
  })();

  const share = async () => {
    try {
      await navigator.share({ files: [await file()], text, title: 'My Skilly progress' });
      trackEvent(`share-${kind}-native`);
      setMsg('Shared!');
    } catch (e) {
      if (e?.name !== 'AbortError') setMsg('Sharing didn’t work here. Download the image instead.');
    }
  };

  const download = async () => {
    const url = URL.createObjectURL(await canvasToBlob(canvasRef.current));
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    trackEvent(`share-${kind}-download`);
    setMsg('Image downloaded. Attach it to your post.');
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setMsg('Caption copied.'); }
    catch { setMsg('Couldn’t copy automatically. Select the caption text and copy it.'); }
    trackEvent(`share-${kind}-copy`);
  };

  const enc = encodeURIComponent;
  const links = [
    ['WhatsApp', `https://wa.me/?text=${enc(text)}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${enc(siteUrl())}`],
    ['X', `https://twitter.com/intent/tweet?text=${enc(text)}`],
  ];

  return (
    <dialog ref={dialogRef} className="dialog glass share-dialog" aria-labelledby="share-title" onCancel={(e) => { e.preventDefault(); close(); }}>
      <div className="row between share-head">
        <h2 id="share-title">Share your {card.kind === 'report' ? 'result' : 'progress'}</h2>
        <button type="button" className="icon-close" onClick={close} aria-label="Close">✕</button>
      </div>
      <div className={`share-preview ${format}`}>
        {img ? <img src={img} alt={`Preview: ${text}`} /> : <div className="share-loading">Making your card…</div>}
      </div>
      <div className="row share-options">
        <div className="lang-toggle" role="radiogroup" aria-label="Card shape">
          {Object.entries(FORMATS).map(([id, f]) => (
            <button key={id} type="button" role="radio" aria-checked={format === id} className={format === id ? 'on' : ''} onClick={() => setFmt(id)}>{f.label.split(' · ')[0]}</button>
          ))}
        </div>
        {userName && (
          <label className="wn-check share-name">
            <input type="checkbox" checked={withName} onChange={(e) => setWithName(e.target.checked)} />
            <span>Show my name</span>
          </label>
        )}
      </div>
      <p className="share-caption" aria-label="Caption">{text}</p>
      <div className="row share-actions">
        {canShareFiles && <button type="button" className="btn primary" onClick={share} disabled={!img}>Share…</button>}
        <button type="button" className={`btn ${canShareFiles ? 'ghost' : 'primary'}`} onClick={download} disabled={!img}>⬇ Download image</button>
        <button type="button" className="btn ghost" onClick={copy}>Copy caption</button>
      </div>
      <div className="row share-links">
        {links.map(([label, href]) => (
          <a key={label} className="btn ghost sm" href={href} target="_blank" rel="noreferrer" onClick={() => trackEvent(`share-${kind}-${label.toLowerCase()}`)}>{label}</a>
        ))}
      </div>
      <p className="muted small">LinkedIn only shares the link, so download the image and attach it to your post. The card is made on your device; nothing is uploaded.</p>
      {msg && <p className="small ok-text" role="status">{msg}</p>}
    </dialog>
  );
}
