/* global React, PHOTO_SLOTS, getSlotSrc, setSlotFile, clearSlot */
const {
  useState:   usePMS,
  useEffect:  usePME,
  useCallback:usePMC,
  useRef:     usePMR,
  useMemo:    usePMM,
} = React;

const PM_CATS = [
  { id: 'hero',      label: 'Hero',             asp: '16/9',  cols: 5 },
  { id: 'birds',     label: 'Birds',            asp: '3/4',   cols: 4 },
  { id: 'macro',     label: 'Macro',            asp: '3/4',   cols: 4 },
  { id: 'landscape', label: 'Landscape',        asp: '16/9',  cols: 4 },
  { id: 'sunrise',   label: 'Sunrise · Sunset', asp: '16/9',  cols: 4 },
];

/* ─── Single numbered slot ────────────────────────────────────────── */
function PhotoSlot({ slot, asp }) {
  const [src,      setSrc]      = usePMS(null);
  const [dragging, setDragging] = usePMS(false);
  const [loading,  setLoading]  = usePMS(false);
  const [err,      setErr]      = usePMS('');
  const inputRef = usePMR(null);

  /* resolve slot → probe if path loads, show if yes */
  const resolve = usePMC(() => {
    const raw = getSlotSrc(slot.id);
    if (!raw) { setSrc(null); return; }
    if (raw.startsWith('data:')) { setSrc(raw); return; }
    const img = new Image();
    img.onload  = () => setSrc(raw);
    img.onerror = () => setSrc(null);
    img.src = raw;
  }, [slot.id]);

  usePME(() => { resolve(); }, [resolve]);

  usePME(() => {
    const h = (e) => {
      if (!e.detail || e.detail.id === slot.id) resolve();
    };
    window.addEventListener('slots-updated', h);
    return () => window.removeEventListener('slots-updated', h);
  }, [slot.id, resolve]);

  const handleFile = usePMC(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setLoading(true); setErr('');
    try {
      await setSlotFile(slot.id, file);
      resolve();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [slot.id, resolve]);

  const onDrop      = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = ()  => setDragging(false);
  const num = slot.id.replace(/.*-/, ''); /* "01", "02", … */

  return (
    <div
      className="pm-slot"
      style={{ aspectRatio: asp }}
      data-filled={src ? '1' : '0'}
      data-drag={dragging ? '1' : '0'}
      onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
      onClick={() => !src && !loading && inputRef.current && inputRef.current.click()}
    >
      {src && <img src={src} className="pm-slot-img" alt={slot.title} />}

      {!src && !loading && (
        <div className="pm-empty">
          <span className="pm-num">{num}</span>
          <svg className="pm-upload-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="pm-drop-label">Drop or click</span>
        </div>
      )}

      {loading && (
        <div className="pm-empty">
          <span className="pm-num">{num}</span>
          <span className="pm-drop-label">Saving…</span>
        </div>
      )}

      {src && !loading && (
        <div className="pm-slot-hover">
          <span className="pm-num-badge">{num}</span>
          <div className="pm-slot-info">
            <span className="pm-slot-title">{slot.title}</span>
            <span className="pm-slot-loc">{slot.loc}</span>
          </div>
          <div className="pm-slot-btns">
            <button
              title="Replace"
              onClick={(e) => { e.stopPropagation(); inputRef.current && inputRef.current.click(); }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
              </svg>
            </button>
            <button
              title="Remove"
              onClick={(e) => { e.stopPropagation(); clearSlot(slot.id); setSrc(null); }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {err && <div className="pm-slot-err">{err}</div>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}

/* ─── Manager overlay ─────────────────────────────────────────────── */
function PhotosManager({ open, onClose }) {
  const [tab, setTab] = usePMS('hero');
  const [, forceUpdate] = usePMS(0);

  /* re-count badges when slots change */
  usePME(() => {
    const h = () => forceUpdate(v => v + 1);
    window.addEventListener('slots-updated', h);
    return () => window.removeEventListener('slots-updated', h);
  }, []);

  /* close on Esc */
  usePME(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const curCat = PM_CATS.find(c => c.id === tab);
  const slots  = PHOTO_SLOTS[tab] || [];
  const filled = slots.filter(s => getSlotSrc(s.id)).length;

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="pm-header">
          <div className="pm-brand">
            <span className="pm-brand-mark">A</span>
            <div>
              <div className="pm-brand-name">Photo Manager</div>
              <div className="pm-brand-sub">Ashit Gandhi Photography</div>
            </div>
          </div>
          <div className="pm-fill-count">
            <span className="pm-fill-n">{filled}</span>
            <span className="pm-fill-total">/ {slots.length} filled</span>
          </div>
          <button className="pm-close-btn" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="pm-tabs">
          {PM_CATS.map(c => {
            const n     = PHOTO_SLOTS[c.id].filter(s => getSlotSrc(s.id)).length;
            const total = PHOTO_SLOTS[c.id].length;
            const full  = n === total;
            const part  = n > 0 && !full;
            return (
              <button
                key={c.id}
                className="pm-tab"
                data-on={tab === c.id ? '1' : '0'}
                onClick={() => setTab(c.id)}
              >
                {c.label}
                <span className={`pm-tab-pill ${full ? 'full' : part ? 'part' : ''}`}>
                  {n}/{total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Slot grid */}
        <div
          className="pm-grid"
          style={{ gridTemplateColumns: `repeat(${curCat.cols}, 1fr)` }}
        >
          {slots.map(s => (
            <PhotoSlot key={s.id} slot={s} asp={curCat.asp} />
          ))}
        </div>

        {/* Footer hint */}
        <div className="pm-hint">
          Drag a JPEG or PNG onto any slot, or click an empty slot to browse ·
          Changes save instantly · Press <kbd>Esc</kbd> to close
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { PhotosManager, PhotoSlot });
