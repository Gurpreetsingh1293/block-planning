import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlockTooltip from './BlockTooltip';
import BookingModal from './BookingModal';
import {
  parseTimeToMinutes,
  formatDisplayTime,
  getEngineerName,
  BLOCK_COLORS,
  HOUR_ENTRIES,
  getWeekDates,
  getMonthGrid,
  formatWeekRange,
  formatDateLabel,
  isToday,
  getDateForOffset,
} from '../../utils/timeHelpers';
import { getSocket } from '../../services/socket';

// ─── Constants ────────────────────────────────────────────────────────────────
const NAVY   = '#001A33';
const BLUE   = '#2563EB';
const BLUE_L = '#EFF6FF';
const BLUE_M = '#1d4ed8';
const BLUE_B = '#BFDBFE';

const DEPT_COLORS = {
  Civil: '#DCBF7B', Electrical: '#D9968A', Signal: '#7AAFA7',
  'Signal & Telecom': '#AF9DC9', Telecom: '#AF9DC9',
  Mechanical: '#9eafc2', Operations: '#7AAFA7',
};

const DAYS_ABBREV = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const API = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://block-planning-backend.onrender.com' : 'http://localhost:5000');

// Returns 60 dates centred on refDate
function getDateRange(refDate, n = 60) {
  const base  = new Date(refDate + 'T12:00:00');
  const half  = Math.floor(n / 2);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + (i - half));
    return d.toISOString().split('T')[0];
  });
}

// ─── Block Card ───────────────────────────────────────────────────────────────
function BlockCard({ block, isAdmin, view, onDelete, onBook, onHover, onHoverEnd }) {
  const isAvail  = block.status === 'Available';
  const colors   = BLOCK_COLORS[block.colorKey] || BLOCK_COLORS.white;
  const eng      = getEngineerName(block);
  const sd       = formatDisplayTime(block.startTime);
  const ed       = formatDisplayTime(block.endTime);
  const topPx    = parseTimeToMinutes(block.startTime);
  const heightPx = Math.max(block.durationMinutes || 60, 36);

  const absStyle = {
    position: 'absolute', top: `${topPx}px`, height: `${heightPx}px`,
    left: '4px', right: '4px',
    background: isAvail ? '#F0F7FF' : colors.bg,
    border: isAvail ? `2px dashed ${BLUE}` : `1.5px solid ${colors.border}`,
    borderRadius: 8, padding: '7px 9px', cursor: isAvail ? 'pointer' : 'default',
    overflow: 'hidden', boxSizing: 'border-box',
    transition: 'box-shadow .15s', userSelect: 'none',
    boxShadow: isAvail ? '0 1px 6px rgba(37,99,235,.13)' : '0 1px 4px rgba(0,0,0,.08)',
  };

  /* Month chip */
  if (view === 'month') {
    return (
      <div
        style={{ ...absStyle, position:'relative', top:undefined, height:undefined, left:undefined, right:undefined, marginBottom:3, padding:'3px 6px' }}
        onMouseEnter={e => onHover(block, e.currentTarget.getBoundingClientRect())}
        onMouseLeave={onHoverEnd}
        onClick={isAvail ? () => onBook(block) : undefined}
        title={block.title}
      >
        <div style={{ display:'flex', alignItems:'center', gap:4, minWidth:0 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', flexShrink:0, background: isAvail ? BLUE : (DEPT_COLORS[block.department]||'#9eafc2') }} />
          <span style={{ fontSize:10, fontWeight:600, color: isAvail ? BLUE_M : colors.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {sd} {block.title}
          </span>
          {isAdmin && (
            <button type="button" onClick={e=>{e.stopPropagation();onDelete(block);}} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', fontSize:11, padding:'0 2px', color:'#ef4444', flexShrink:0 }}>🗑️</button>
          )}
        </div>
      </div>
    );
  }

  /* Day / Week card */
  return (
    <div
      style={absStyle}
      onMouseEnter={e => onHover(block, e.currentTarget.getBoundingClientRect())}
      onMouseLeave={onHoverEnd}
      onClick={isAvail ? () => onBook(block) : undefined}
    >
      {isAdmin && (
        <button type="button" onClick={e=>{e.stopPropagation();onDelete(block);}}
          style={{ position:'absolute', top:4, right:4, background:'rgba(239,68,68,.12)', border:'1px solid rgba(239,68,68,.3)', borderRadius:4, cursor:'pointer', fontSize:10, padding:'1px 5px', color:'#ef4444', zIndex:2 }}>
          🗑️
        </button>
      )}
      {isAvail ? (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
            <span style={{ width:3, background:BLUE, borderRadius:2, alignSelf:'stretch', minHeight:14, flexShrink:0 }} />
            <div style={{ minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ fontSize:10, fontWeight:700, color:BLUE }}>Available Slot</span>
                <span style={{ background:'#dcfce7', color:'#15803d', fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:10 }}>claim</span>
              </div>
              <div style={{ fontSize:11, fontWeight:600, color:'#1e3a5f', lineHeight:1.2 }}>{block.title}</div>
            </div>
          </div>
          <div style={{ fontSize:10, color:'#4b6fa0' }}>
            {sd} – {ed}
            {block.durationMinutes ? ` · ${block.durationMinutes>=60?`${block.durationMinutes/60} hr`:`${block.durationMinutes} min`}`:''}
            {block.section ? ` · ${block.section}`:''}
          </div>
          <motion.button type="button" whileHover={{scale:1.03}} whileTap={{scale:.97}}
            onClick={e=>{e.stopPropagation();onBook(block);}}
            style={{ marginTop:5, background:BLUE, color:'#fff', border:'none', borderRadius:5, padding:'3px 10px', fontSize:10, fontWeight:700, cursor:'pointer', float:'right' }}>
            Claim Slot →
          </motion.button>
        </>
      ) : (
        <>
          <div style={{ display:'flex', alignItems:'flex-start', gap:6 }}>
            <span style={{ width:3, background:colors.border, borderRadius:2, alignSelf:'stretch', minHeight:14, flexShrink:0 }} />
            <div style={{ minWidth:0, flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, flexWrap:'wrap' }}>
                <span style={{ fontSize:11, fontWeight:700, color:colors.text, lineHeight:1.3 }}>{block.title}</span>
                {block.deptTag && <span style={{ background:colors.border, color:colors.text, fontSize:9, fontWeight:700, padding:'1px 5px', borderRadius:10, opacity:.85 }}>{block.deptTag}</span>}
              </div>
              <div style={{ fontSize:10, color:colors.text, opacity:.8, marginTop:1 }}>
                {sd} – {ed}
                {block.durationMinutes ? ` · ${block.durationMinutes>=60?`${Math.round(block.durationMinutes/60)} hr`:`${block.durationMinutes} min`}`:''}
                {block.track ? ` · ${block.track}`:''}
              </div>
            </div>
          </div>
          {heightPx > 60 && eng !== 'Junior Engineer' && (
            <div style={{ marginTop:6, fontSize:10, color:colors.text, opacity:.75, display:'flex', alignItems:'center', gap:4 }}>
              <span>👤</span><span>{eng}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ block, onConfirm, onCancel }) {
  if (!block) return null;
  return (
    <AnimatePresence>
      <motion.div key="del-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        onClick={onCancel}
        style={{ position:'fixed', inset:0, background:'rgba(0,26,51,.65)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
        <motion.div initial={{opacity:0,scale:.93,y:10}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.9}}
          onClick={e=>e.stopPropagation()}
          style={{ background:'#fff', borderRadius:14, maxWidth:420, width:'100%', boxShadow:'0 24px 60px rgba(0,26,51,.35)', overflow:'hidden' }}>
          <div style={{ background:'#7f1d1d', padding:'14px 20px', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:20 }}>⚠️</span>
            <div>
              <div style={{ color:'#fca5a5', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em' }}>Admin Authorization Required</div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:15 }}>Delete Maintenance Block</div>
            </div>
          </div>
          <div style={{ padding:'18px 20px' }}>
            <div style={{ background:'#fef2f2', borderRadius:8, padding:'10px 14px', marginBottom:14, border:'1px solid #fecaca' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#991b1b' }}>{block.title}</div>
              <div style={{ fontSize:11, color:'#7f1d1d', marginTop:3 }}>{block.deptTag} · {formatDisplayTime(block.startTime)} – {formatDisplayTime(block.endTime)}</div>
              {block.track && <div style={{ fontSize:11, color:'#7f1d1d' }}>Track: {block.track}</div>}
            </div>
            <div style={{ fontSize:12, color:'#4b5563', marginBottom:18 }}>This will permanently remove the block and notify all JEs in real-time.</div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button type="button" onClick={onCancel} style={{ padding:'8px 18px', borderRadius:7, border:'1.5px solid #d1d5db', background:'#fff', color:'#374151', cursor:'pointer', fontSize:13, fontWeight:600 }}>Cancel</button>
              <button type="button" onClick={()=>onConfirm(block)} style={{ padding:'8px 18px', borderRadius:7, border:'none', background:'#dc2626', color:'#fff', cursor:'pointer', fontSize:13, fontWeight:700 }}>🗑️ Confirm & Delete</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Create Slot Modal ────────────────────────────────────────────────────────
function CreateSlotModal({ onClose, onCreated, weekDates }) {
  const [dayDate, setDay]   = useState(weekDates?.[0] || getDateForOffset(0));
  const [startTime, setST]  = useState('10:00');
  const [duration, setDur]  = useState('1 hour');
  const [section, setSec]   = useState('NDLS - AGC Quadruple Corridor');
  const [sub, setSub]       = useState(false);
  const [err, setErr]       = useState('');

  const SECS = ['NDLS - AGC Quadruple Corridor','NDLS - MTJ Outer Yard','Palwal - Ballabgarh','Faridabad - Tuglakabad','Ghaziabad Junction','Agra Cantt - Mathura Junction','Kota Junction Yard','TKJ Outer Yard'];

  const submit = async e => {
    e.preventDefault(); setSub(true); setErr('');
    try {
      const r = await fetch(`${API}/api/blocks/available`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ duration, date:dayDate, section, track:'Main Line', startTime }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message||'Failed');
      onCreated(d.data); onClose();
    } catch(e){ setErr(e.message); } finally { setSub(false); }
  };

  const opts = (weekDates||[]).map(d => ({ value:d, label: new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'}) }));

  return (
    <AnimatePresence>
      <motion.div key="cs-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,26,51,.6)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
        <motion.div initial={{opacity:0,y:16,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10}}
          onClick={e=>e.stopPropagation()}
          style={{ background:'#fff', borderRadius:14, maxWidth:480, width:'100%', boxShadow:'0 24px 60px rgba(0,26,51,.3)', overflow:'hidden' }}>
          <div style={{ background:`linear-gradient(135deg,${NAVY},#0f3460)`, padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ color:'#93c5fd', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em' }}>🛡️ Admin — Create Slot</div>
              <div style={{ color:'#fff', fontWeight:700, fontSize:15 }}>Designate Available Slot</div>
            </div>
            <button type="button" onClick={onClose} style={{ background:'rgba(255,255,255,.15)', border:'none', borderRadius:7, color:'#fff', cursor:'pointer', width:30, height:30, fontSize:17 }}>×</button>
          </div>
          <form onSubmit={submit} style={{ padding:'20px 20px 22px' }}>
            <div style={{ marginBottom:15 }}>
              <label style={LBL}>Day</label>
              <select value={dayDate} onChange={e=>setDay(e.target.value)} style={SEL}>{opts.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>
            </div>
            <div style={{ marginBottom:15 }}>
              <label style={LBL}>Start Time</label>
              <input type="time" value={startTime} onChange={e=>setST(e.target.value)} style={SEL} />
            </div>
            <div style={{ marginBottom:15 }}>
              <label style={LBL}>Duration</label>
              <div style={{ display:'flex', gap:8 }}>
                {['30 mins','1 hour','2 hours','3 hours'].map(d=>(
                  <button key={d} type="button" onClick={()=>setDur(d)}
                    style={{ flex:1, padding:'8px 4px', borderRadius:7, fontSize:12, fontWeight:600, border: duration===d?'none':`1.5px solid ${BLUE_B}`, background: duration===d?BLUE:BLUE_L, color: duration===d?'#fff':BLUE_M, cursor:'pointer' }}>{d}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={LBL}>Section</label>
              <select value={section} onChange={e=>setSec(e.target.value)} style={SEL}>{SECS.map(s=><option key={s} value={s}>{s}</option>)}</select>
            </div>
            {err && <div style={{ color:'#dc2626', fontSize:12, marginBottom:10, padding:'7px 12px', background:'#fef2f2', borderRadius:6 }}>{err}</div>}
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button type="button" onClick={onClose} style={{ padding:'9px 18px', borderRadius:7, border:'1.5px solid #d1d5db', background:'#fff', color:'#374151', cursor:'pointer', fontSize:13, fontWeight:600 }}>Cancel</button>
              <button type="submit" disabled={sub} style={{ padding:'9px 22px', borderRadius:7, border:'none', background: sub?'#94a3b8':BLUE, color:'#fff', cursor: sub?'not-allowed':'pointer', fontSize:13, fontWeight:700 }}>{sub?'Creating…':'Designate Slot'}</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const LBL = { display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 };
const SEL = { width:'100%', padding:'8px 12px', borderRadius:7, border:`1.5px solid ${BLUE_B}`, fontSize:13, color:'#111827', background:'#f9fafb', outline:'none', boxSizing:'border-box', fontFamily:'inherit' };

// ─── Month Popup ──────────────────────────────────────────────────────────────
function MonthPopup({ blocks, selectedDate, onSelectDate, onClose, isAdmin, onDelete, onBook, onHover, onHoverEnd }) {
  const vd  = new Date(selectedDate + 'T12:00:00');
  const [yr, setYr] = useState(vd.getFullYear());
  const [mo, setMo] = useState(vd.getMonth());

  const grid  = getMonthGrid(yr, mo);
  const prev  = () => { mo===0 ? (setYr(y=>y-1),setMo(11)) : setMo(m=>m-1); };
  const next  = () => { mo===11 ? (setYr(y=>y+1),setMo(0)) : setMo(m=>m+1); };
  const bfd   = d => blocks.filter(b=>b.date===d);

  return (
    <AnimatePresence>
      <motion.div key="mp-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,15,40,.55)', backdropFilter:'blur(2px)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <motion.div initial={{opacity:0,scale:.95,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95}}
          onClick={e=>e.stopPropagation()}
          style={{ background:'#fff', borderRadius:16, width:'92vw', maxWidth:1100, maxHeight:'88vh', display:'flex', flexDirection:'column', boxShadow:'0 32px 80px rgba(0,26,51,.3)', overflow:'hidden' }}>

          <div style={{ background:`linear-gradient(135deg,${NAVY},${BLUE_M})`, padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <button type="button" onClick={prev} style={CV}>‹</button>
              <div style={{ color:'#fff', fontWeight:800, fontSize:18, minWidth:220, textAlign:'center' }}>{MONTHS[mo]} {yr}</div>
              <button type="button" onClick={next} style={CV}>›</button>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ color:'#93c5fd', fontSize:12, fontWeight:600 }}>📅 Monthly Overview</span>
              <button type="button" onClick={onClose} style={{ background:'rgba(255,255,255,.15)', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', width:32, height:32, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:BLUE_L, borderBottom:`1px solid ${BLUE_B}`, flexShrink:0 }}>
            {DAYS_ABBREV.map(d=><div key={d} style={{ padding:'8px 0', fontSize:11, fontWeight:700, color:BLUE_M, textAlign:'center' }}>{d}</div>)}
          </div>

          <div style={{ flex:1, overflowY:'auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gridAutoRows:'minmax(100px,1fr)' }}>
              {grid.map(({ date, currentMonth }, idx) => {
                const db   = bfd(date);
                const iT   = isToday(date);
                const iS   = date===selectedDate;
                return (
                  <div key={idx} onClick={()=>{onSelectDate(date);onClose();}}
                    style={{ border:'1px solid #e8f0fe', padding:'6px 7px', background:!currentMonth?'#f8fafc':iT?BLUE_L:'#fff', cursor:'pointer', minHeight:100, overflow:'hidden' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:13, fontWeight:iT||iS?800:500, color:!currentMonth?'#cbd5e1':iT?'#fff':iS?BLUE_M:'#374151', background:iT?BLUE:iS?BLUE_L:'transparent', borderRadius:'50%', width:24, height:24, display:'inline-flex', alignItems:'center', justifyContent:'center', border:iS&&!iT?`2px solid ${BLUE_M}`:'none' }}>
                        {new Date(date+'T12:00:00').getDate()}
                      </span>
                      {db.length>0 && <span style={{ fontSize:9, color:'#fff', background:BLUE, borderRadius:10, padding:'1px 5px', fontWeight:700 }}>{db.length}</span>}
                    </div>
                    {db.slice(0,3).map(b=><BlockCard key={b.slotId||b._id} block={b} isAdmin={isAdmin} view="month" onDelete={onDelete} onBook={onBook} onHover={onHover} onHoverEnd={onHoverEnd} />)}
                    {db.length>3 && <div style={{ fontSize:9, color:BLUE, paddingLeft:4, fontWeight:600 }}>+{db.length-3} more</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background:BLUE_L, borderTop:`1px solid ${BLUE_B}`, padding:'8px 20px', display:'flex', alignItems:'center', gap:20, flexShrink:0, fontSize:11, color:'#475569' }}>
            {[['#DCBF7B','Civil'],['#7AAFA7','Signal & Telecom'],['#D9968A','TRD Electrical'],['#AF9DC9','Telecom']].map(([c,l])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:9, height:9, borderRadius:'50%', background:c }} />{l}</div>
            ))}
            <div style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:9, height:9, borderRadius:'50%', border:`2px dashed ${BLUE}` }} />Available</div>
            <div style={{ marginLeft:'auto', color:BLUE, fontWeight:600 }}>Click any date to jump to it</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const CV = { background:'rgba(255,255,255,.18)', border:'none', borderRadius:6, color:'#fff', cursor:'pointer', width:28, height:28, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', padding:0 };

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position:'fixed', top:14, left:'50%', transform:'translateX(-50%)', zIndex:700, display:'flex', flexDirection:'column', gap:8, minWidth:320 }}>
      <AnimatePresence>
        {toasts.map(t=>(
          <motion.div key={t.id} initial={{opacity:0,y:-14,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-10,scale:.95}}
            style={{ background: t.type==='delete'?'#7f1d1d':t.type==='create'?'#064e3b':NAVY, color:'#fff', padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:600, boxShadow:'0 4px 24px rgba(0,0,0,.3)', display:'flex', alignItems:'center', gap:8, borderLeft:`3px solid ${t.type==='delete'?'#ef4444':t.type==='create'?'#34d399':'#60a5fa'}` }}>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Sliding Date Strip ───────────────────────────────────────────────────────
function DateStrip({ selectedDate, onSelectDate, blocks, onOpenMonth }) {
  const ref    = useRef(null);
  const dates  = getDateRange(selectedDate, 60);
  const bfd    = d => blocks.filter(b => b.date === d);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current.querySelector('[data-sel="true"]');
    if (el) el.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
  }, [selectedDate]);

  const shift = dir => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + dir);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  let lastMo = null;

  return (
    <div style={{ display:'flex', alignItems:'center', background:'#fff', borderBottom:`2px solid ${BLUE_B}`, padding:'0 8px', height:68, flexShrink:0, boxShadow:'0 2px 8px rgba(37,99,235,.07)', gap:4, userSelect:'none' }}>
      {/* ‹ */}
      <button type="button" onClick={()=>shift(-1)} style={ARR}>‹</button>

      {/* Scrollable strip */}
      <div ref={ref} style={{ flex:1, overflowX:'auto', display:'flex', alignItems:'center', gap:3, scrollbarWidth:'none', msOverflowStyle:'none', padding:'4px 2px' }}>
        {dates.map(date => {
          const d      = new Date(date + 'T12:00:00');
          const iT     = isToday(date);
          const iS     = date === selectedDate;
          const dBlks  = bfd(date);
          const mo     = d.getMonth();
          const showMo = mo !== lastMo;
          lastMo = mo;

          return (
            <React.Fragment key={date}>
              {showMo && (
                <div style={{ fontSize:9, fontWeight:800, color:BLUE_M, textTransform:'uppercase', letterSpacing:'.08em', whiteSpace:'nowrap', padding:'0 6px', opacity:.6, flexShrink:0 }}>
                  {MONTHS[mo].slice(0,3)}
                </div>
              )}
              <button type="button" data-sel={iS}
                onClick={()=>onSelectDate(date)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, minWidth:44, height:52, borderRadius:10, border: iS?`2px solid ${BLUE}`:iT?`2px solid ${BLUE_B}`:'2px solid transparent', background: iS?BLUE:iT?BLUE_L:'transparent', cursor:'pointer', flexShrink:0, transition:'all .13s', padding:'4px 6px' }}>
                <span style={{ fontSize:9, fontWeight:600, color: iS?'rgba(255,255,255,.8)':iT?BLUE_M:'#94a3b8', lineHeight:1 }}>
                  {DAYS_ABBREV[d.getDay()]}
                </span>
                <span style={{ fontSize:15, fontWeight: iS||iT?800:500, color: iS?'#fff':iT?BLUE_M:'#1e293b', lineHeight:1 }}>
                  {d.getDate()}
                </span>
                {dBlks.length > 0 && (
                  <span style={{ fontSize:8, fontWeight:700, color: iS?'rgba(255,255,255,.85)':BLUE, lineHeight:1 }}>
                    {'●'.repeat(Math.min(dBlks.length,3))}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* › */}
      <button type="button" onClick={()=>shift(1)} style={ARR}>›</button>

      {/* Month button */}
      <button type="button" onClick={onOpenMonth}
        style={{ background:NAVY, border:'none', borderRadius:8, height:36, padding:'0 12px', cursor:'pointer', fontSize:11, fontWeight:700, color:'#93c5fd', flexShrink:0, display:'flex', alignItems:'center', gap:5 }}>
        📅 Month
      </button>
    </div>
  );
}

const ARR = { background:BLUE_L, border:`1px solid ${BLUE_B}`, borderRadius:8, width:30, height:36, cursor:'pointer', fontSize:16, color:BLUE_M, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 };

// ─── Admin / JE Toggle Button (inline in toolbar) ─────────────────────────────
function ModeToggle({ isAdmin, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale:1.03 }}
      whileTap={{ scale:.96 }}
      style={{
        display:'flex', alignItems:'center', gap:8,
        background: isAdmin
          ? 'linear-gradient(135deg,#1e3a8a,#1d4ed8)'
          : 'linear-gradient(135deg,#14532d,#15803d)',
        border:'none', borderRadius:10,
        padding:'6px 14px', cursor:'pointer',
        boxShadow: isAdmin
          ? '0 3px 12px rgba(29,78,216,.35)'
          : '0 3px 12px rgba(21,128,61,.3)',
        transition:'all .2s',
        flexShrink:0,
      }}
    >
      {/* Left icon */}
      <span style={{ fontSize:16 }}>{isAdmin ? '🛡️' : '👤'}</span>

      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', lineHeight:1.2 }}>
        <span style={{ fontSize:11, fontWeight:800, color:'#fff', letterSpacing:'.02em' }}>
          {isAdmin ? 'Admin Mode' : 'JE Mode'}
        </span>
        <span style={{ fontSize:9, fontWeight:600, color: isAdmin?'#93c5fd':'#86efac' }}>
          {isAdmin ? 'Can Delete & Create' : 'Book Only'}
        </span>
      </div>

      {/* Toggle track */}
      <div style={{ position:'relative', width:34, height:18, background:'rgba(255,255,255,.25)', borderRadius:9, marginLeft:4, flexShrink:0 }}>
        <motion.div
          animate={{ x: isAdmin ? 16 : 0 }}
          transition={{ type:'spring', stiffness:400, damping:28 }}
          style={{ position:'absolute', top:2, left:2, width:14, height:14, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,.25)' }}
        />
      </div>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeamsCalendarTimeline() {
  const today = new Date().toISOString().split('T')[0];

  const [blocks, setBlocks]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [isAdmin, setIsAdmin]         = useState(false);
  const [view, setView]               = useState('week');   // 'day' | 'week'
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekDates, setWeekDates]     = useState(getWeekDates(today));
  const [showMonth, setShowMonth]     = useState(false);

  const [ttBlock, setTTBlock]         = useState(null);
  const [ttRect,  setTTRect]          = useState(null);
  const [booking, setBooking]         = useState(null);
  const [delBlock, setDelBlock]       = useState(null);
  const [showCreate, setShowCreate]   = useState(false);
  const [toasts, setToasts]           = useState([]);

  const scrollRef = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchBlocks = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/blocks`);
      const d = await r.json();
      if (d.success) setBlocks(d.data || []);
    } catch(e){ console.warn('[Blocks]', e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(()=>{ fetchBlocks(); },[fetchBlocks]);

  // ── Socket ─────────────────────────────────────────────────────────────────
  useEffect(()=>{
    const s = getSocket();
    const up  = b => setBlocks(p=>p.map(x=>(x.slotId===b.slotId||x._id===b._id)?b:x));
    const add = b => { setBlocks(p=>[...p,b]); toast('🟢 New slot created by Admin','create'); };
    const del = ({slotId}) => { setBlocks(p=>p.filter(x=>x.slotId!==slotId&&x._id!==slotId)); toast('🗑️ Block removed by Admin','delete'); };
    const bk  = b => { up(b); toast(`⚡ Booked by ${b.department||'Unknown'}`,'book'); };
    const rs  = all => { if(Array.isArray(all)) setBlocks(all); toast('🔄 Timeline reset','book'); };
    s.on('block:booked',bk); s.on('blockUpdated',up); s.on('block:updated',up);
    s.on('block:created',add); s.on('block:deleted',del); s.on('blockDeleted',del); s.on('timeline:reset',rs);
    return ()=>{ s.off('block:booked',bk); s.off('blockUpdated',up); s.off('block:updated',up); s.off('block:created',add); s.off('block:deleted',del); s.off('blockDeleted',del); s.off('timeline:reset',rs); };
  },[]);

  // ── Scroll to 7 AM ─────────────────────────────────────────────────────────
  useEffect(()=>{ if(scrollRef.current) scrollRef.current.scrollTop = 7*60-20; },[view, selectedDate]);

  // ── Sync week ──────────────────────────────────────────────────────────────
  useEffect(()=>{ setWeekDates(getWeekDates(selectedDate)); },[selectedDate]);

  const toast = (message, type='info') => {
    const id = Date.now();
    setToasts(p=>[...p,{id,message,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)), 4500);
  };

  // ── Week navigation ────────────────────────────────────────────────────────
  const goWeek = dir => {
    const b = new Date(weekDates[0]+'T12:00:00');
    b.setDate(b.getDate()+dir*7);
    const nd = b.toISOString().split('T')[0];
    setSelectedDate(nd);
  };

  // ── Book ───────────────────────────────────────────────────────────────────
  const handleBook = async ({ blockId, name, department, description }) => {
    try {
      const r = await fetch(`${API}/api/blocks/book/${blockId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,department,description}) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message||'Failed');
      setBlocks(p=>p.map(b=>(b.slotId===blockId||b._id===blockId)?d.data:b));
      getSocket().emit('book:block', d.data);
      toast(`✅ Booked by ${name} (${department})`,'book');
      setBooking(null);
    } catch(e){ toast(`❌ ${e.message}`,'delete'); }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async block => {
    const id = block.slotId||block._id;
    try {
      const r = await fetch(`${API}/api/blocks/${id}?role=admin`, { method:'DELETE', headers:{'x-user-role':'admin'} });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message||'Failed');
      setBlocks(p=>p.filter(b=>b.slotId!==id&&b._id!==id));
      getSocket().emit('delete:block',{slotId:id});
      toast(`🗑️ "${block.title}" deleted`,'delete');
      setDelBlock(null);
    } catch(e){ toast(`❌ ${e.message}`,'delete'); setDelBlock(null); }
  };

  const bfd  = d => blocks.filter(b=>b.date===d);
  const onH  = (b,r)=>{ setTTBlock(b); setTTRect(r); };
  const offH = ()=>{ setTTBlock(null); setTTRect(null); };

  // Label
  const label = view==='week' ? formatWeekRange(weekDates) : formatDateLabel(selectedDate);

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", background:'#F0F7FF', overflow:'hidden' }}>
      <Toast toasts={toasts} />
      <BlockTooltip block={ttBlock} anchorRect={ttRect} visible={!!ttBlock&&!!ttRect} />

      {showMonth && (
        <MonthPopup
          blocks={blocks} selectedDate={selectedDate}
          onSelectDate={d=>{ setSelectedDate(d); setView('day'); setShowMonth(false); }}
          onClose={()=>setShowMonth(false)}
          isAdmin={isAdmin} onDelete={setDelBlock} onBook={setBooking} onHover={onH} onHoverEnd={offH}
        />
      )}


      {/* ── Main content ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0, background:'#fff' }}>

        {/* ── Toolbar ── */}
        <div style={{ background:'#fff', borderBottom:`1px solid ${BLUE_B}`, padding:'8px 16px', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', boxShadow:'0 1px 4px rgba(37,99,235,.06)', flexShrink:0 }}>

          {/* Today */}
          <button type="button" onClick={()=>{ setSelectedDate(today); setView('week'); }}
            style={{ background:BLUE_L, border:`1.5px solid ${BLUE_B}`, borderRadius:7, padding:'5px 12px', fontSize:12, fontWeight:700, color:BLUE_M, cursor:'pointer' }}>
            Today
          </button>

          {/* Week prev/next (only in week view) */}
          {view==='week' && (
            <div style={{ display:'flex', gap:2 }}>
              <button type="button" onClick={()=>goWeek(-1)} style={TB}>‹</button>
              <button type="button" onClick={()=>goWeek(1)}  style={TB}>›</button>
            </div>
          )}

          {/* Date label */}
          <div style={{ fontSize:14, fontWeight:700, color:'#1e293b', flex:1, minWidth:0 }}>{label}</div>

          {/* Day / Week view toggle */}
          <div style={{ display:'flex', gap:2, background:BLUE_L, borderRadius:8, padding:3, border:`1px solid ${BLUE_B}` }}>
            {['day','week'].map(v=>(
              <button key={v} type="button" onClick={()=>setView(v)}
                style={{ padding:'5px 14px', borderRadius:6, border:'none', fontSize:12, fontWeight:600, background: view===v?BLUE:'transparent', color: view===v?'#fff':BLUE_M, cursor:'pointer', boxShadow: view===v?'0 2px 6px rgba(37,99,235,.3)':'none', textTransform:'capitalize', transition:'all .15s' }}>
                {v.charAt(0).toUpperCase()+v.slice(1)}
              </button>
            ))}
          </div>

          {/* Admin / JE toggle — with slide knob */}
          <ModeToggle isAdmin={isAdmin} onToggle={()=>setIsAdmin(v=>!v)} />

          {/* Create Block — only in admin mode */}
          {isAdmin && (
            <motion.button type="button" whileHover={{scale:1.02,y:-1}} whileTap={{scale:.97}}
              onClick={()=>setShowCreate(true)}
              style={{ background:`linear-gradient(135deg,${NAVY},${BLUE_M})`, color:'#fff', border:'none', borderRadius:9, padding:'8px 16px', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, boxShadow:'0 3px 10px rgba(37,99,235,.3)' }}>
              ＋ Create Block
            </motion.button>
          )}
        </div>

        {/* ── Sliding Date Strip ── */}
        <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} blocks={blocks} onOpenMonth={()=>setShowMonth(true)} />

        {/* ── Calendar Views ── */}
        {loading ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:BLUE_L }}>
            <div style={{ textAlign:'center' }}>
              <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1.5,ease:'linear'}} style={{ fontSize:32, marginBottom:12 }}>🚆</motion.div>
              <div style={{ color:BLUE_M, fontWeight:600 }}>Loading maintenance schedule…</div>
            </div>
          </div>
        ) : (
          <>
            {/* ════ WEEK VIEW ════ */}
            {view==='week' && (
              <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {/* Day header row */}
                <div style={{ display:'grid', gridTemplateColumns:'52px repeat(7,1fr)', borderBottom:`1px solid ${BLUE_B}`, background:BLUE_L, flexShrink:0 }}>
                  <div style={{ borderRight:`1px solid ${BLUE_B}` }} />
                  {weekDates.map(date=>{
                    const d   = new Date(date+'T12:00:00');
                    const iT  = isToday(date);
                    const iS  = date===selectedDate;
                    const cnt = bfd(date).length;
                    return (
                      <div key={date} onClick={()=>{ setSelectedDate(date); setView('day'); }}
                        style={{ padding:'8px 4px', textAlign:'center', cursor:'pointer', borderRight:`1px solid ${BLUE_B}`, background: iT?'#dbeafe':iS?BLUE_L:'transparent', transition:'background .12s' }}>
                        <div style={{ fontSize:10, color: iT?BLUE_M:'#64748b', fontWeight: iT?700:500 }}>{DAYS_ABBREV[d.getDay()]}</div>
                        <div style={{ fontSize:17, fontWeight:700, marginTop:2, color: iT?'#fff':iS?BLUE:'#1e293b', background: iT?BLUE:'transparent', borderRadius:'50%', width:30, height:30, display:'inline-flex', alignItems:'center', justifyContent:'center', border: iS&&!iT?`2px solid ${BLUE}`:'none' }}>
                          {d.getDate()}
                        </div>
                        {cnt>0 && <div style={{ fontSize:9, color:'#fff', background:BLUE, borderRadius:8, padding:'1px 5px', marginTop:2, fontWeight:700, display:'inline-block' }}>{cnt} block{cnt>1?'s':''}</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Scrollable grid */}
                <div ref={scrollRef} style={{ flex:1, overflowY:'auto' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'52px repeat(7,1fr)', minHeight:1440 }}>
                    {/* Time gutter */}
                    <div style={{ borderRight:`1px solid ${BLUE_B}`, background:'#fbfdff', position:'sticky', left:0, zIndex:5 }}>
                      {HOUR_ENTRIES.map(h=>(
                        <div key={h.minutes} style={{ height:60, display:'flex', alignItems:'flex-start', paddingTop:3, paddingRight:6, justifyContent:'flex-end', borderBottom:'1px solid #f0f4ff' }}>
                          <span style={{ fontSize:10, color:'#94a3b8', whiteSpace:'nowrap' }}>{h.label}</span>
                        </div>
                      ))}
                    </div>
                    {/* 7 day columns */}
                    {weekDates.map(date=>{
                      const iT = isToday(date);
                      return (
                        <div key={date} style={{ position:'relative', height:1440, borderRight:'1px solid #e8f0fe', background: iT?'rgba(219,234,254,.18)':'#fff' }}>
                          {HOUR_ENTRIES.map(h=><div key={h.minutes} style={{ position:'absolute', top:h.minutes, left:0, right:0, borderTop:'1px solid #f0f4ff', height:60 }} />)}
                          {iT && (
                            <div style={{ position:'absolute', left:0, right:0, zIndex:3, top:`${new Date().getHours()*60+new Date().getMinutes()}px`, borderTop:'2px solid #ef4444' }}>
                              <span style={{ width:9, height:9, borderRadius:'50%', background:'#ef4444', position:'absolute', left:-4, top:-5, display:'block', boxShadow:'0 0 6px rgba(239,68,68,.5)' }} />
                            </div>
                          )}
                          {bfd(date).map(b=><BlockCard key={b.slotId||b._id} block={b} isAdmin={isAdmin} view="week" onDelete={setDelBlock} onBook={setBooking} onHover={onH} onHoverEnd={offH} />)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ════ DAY VIEW ════ */}
            {view==='day' && (
              <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {/* Thin day label bar */}
                <div style={{ background:BLUE_L, borderBottom:`1px solid ${BLUE_B}`, padding:'6px 16px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                  <div style={{ fontWeight:800, fontSize:14, color:NAVY }}>{formatDateLabel(selectedDate)}</div>
                  {isToday(selectedDate) && <span style={{ background:BLUE, color:'#fff', fontSize:10, fontWeight:700, padding:'2px 10px', borderRadius:10 }}>Today</span>}
                  <span style={{ fontSize:12, color:'#64748b' }}>{bfd(selectedDate).length} block(s)</span>
                  {/* Quick week-day picker */}
                  <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
                    {weekDates.map(date=>{
                      const d  = new Date(date+'T12:00:00');
                      const iT = isToday(date);
                      const iS = date===selectedDate;
                      return (
                        <button key={date} type="button" onClick={()=>setSelectedDate(date)}
                          style={{ width:34, height:28, borderRadius:7, border: iT&&!iS?`1.5px solid ${BLUE_B}`:'none', cursor:'pointer', background: iS?BLUE:iT?BLUE_L:'transparent', color: iS?'#fff':iT?BLUE_M:'#64748b', fontWeight: iS||iT?700:400, fontSize:12 }}>
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div ref={scrollRef} style={{ flex:1, overflowY:'auto' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'52px 1fr', minHeight:1440 }}>
                    {/* Time gutter */}
                    <div style={{ borderRight:`1px solid ${BLUE_B}`, background:'#fbfdff' }}>
                      {HOUR_ENTRIES.map(h=>(
                        <div key={h.minutes} style={{ height:60, display:'flex', alignItems:'flex-start', paddingTop:3, paddingRight:6, justifyContent:'flex-end', borderBottom:'1px solid #f0f4ff' }}>
                          <span style={{ fontSize:10, color:'#94a3b8' }}>{h.label}</span>
                        </div>
                      ))}
                    </div>
                    {/* Full-width day column */}
                    <div style={{ position:'relative', height:1440 }}>
                      {HOUR_ENTRIES.map(h=><div key={h.minutes} style={{ position:'absolute', top:h.minutes, left:0, right:0, borderTop:'1px solid #f0f4ff', height:60 }} />)}
                      {isToday(selectedDate) && (
                        <div style={{ position:'absolute', left:0, right:0, zIndex:3, top:`${new Date().getHours()*60+new Date().getMinutes()}px`, borderTop:'2px solid #ef4444' }}>
                          <span style={{ width:9, height:9, borderRadius:'50%', background:'#ef4444', position:'absolute', left:-4, top:-5, display:'block', boxShadow:'0 0 6px rgba(239,68,68,.5)' }} />
                        </div>
                      )}
                      {bfd(selectedDate).map(b=><BlockCard key={b.slotId||b._id} block={b} isAdmin={isAdmin} view="day" onDelete={setDelBlock} onBook={setBooking} onHover={onH} onHoverEnd={offH} />)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {booking    && <BookingModal block={booking} onClose={()=>setBooking(null)} onBook={handleBook} />}
      {delBlock   && <DeleteModal block={delBlock} onConfirm={handleDelete} onCancel={()=>setDelBlock(null)} />}
      {showCreate && <CreateSlotModal weekDates={weekDates} onClose={()=>setShowCreate(false)} onCreated={b=>{ setBlocks(p=>[...p,b]); toast('🟢 Slot created','create'); }} />}
    </div>
  );
}

// ─── NavIcon ──────────────────────────────────────────────────────────────────
function NavIcon({ icon, label, active }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer' }}>
      <div style={{ width:38, height:38, borderRadius:9, background: active?`linear-gradient(135deg,${BLUE_M},#3b82f6)`:'rgba(255,255,255,.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, boxShadow: active?'0 3px 10px rgba(37,99,235,.4)':'none' }}>
        {icon}
      </div>
      <span style={{ fontSize:8, color: active?'#60a5fa':'#475569', fontWeight: active?700:400 }}>{label}</span>
    </div>
  );
}

const TB = { background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:7, padding:'5px 10px', fontSize:13, fontWeight:600, color:'#374151', cursor:'pointer' };
