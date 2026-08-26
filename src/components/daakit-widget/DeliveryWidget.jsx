import React from 'react';
import { useEta } from './useEta';
import daakitLogo from '../../assets/daakit_logo.png';

const DaakitLogo = () => (
  <img
    src={daakitLogo}
    alt="Daakit Logo"
    style={{
      width: '64px',
      height: 'auto',
      display: 'inline-block',
      verticalAlign: 'middle',
      marginLeft: '-3px'
    }}
  />
);

const TruckIcon = ({ color = "white" }) => (
  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <path d="M11.0833 14.9999V4.99992C11.0833 4.55789 10.9164 4.13397 10.6195 3.82141C10.3226 3.50885 9.91984 3.33325 9.49992 3.33325H3.16659C2.74666 3.33325 2.34393 3.50885 2.047 3.82141C1.75007 4.13397 1.58325 4.55789 1.58325 4.99992V14.1666C1.58325 14.3876 1.66666 14.5996 1.81513 14.7558C1.96359 14.9121 2.16496 14.9999 2.37492 14.9999H3.95825" stroke={color} strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.875 15H7.125" stroke={color} strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.0416 15.0001H16.6249C16.8349 15.0001 17.0362 14.9123 17.1847 14.756C17.3332 14.5997 17.4166 14.3878 17.4166 14.1667V11.1251C17.4163 10.936 17.3548 10.7526 17.2424 10.6051L14.4874 6.98008C14.4134 6.88248 14.3194 6.80365 14.2126 6.74941C14.1057 6.69518 13.9886 6.66693 13.8699 6.66675H11.0833" stroke={color} strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.4583 16.6666C14.3328 16.6666 15.0417 15.9204 15.0417 14.9999C15.0417 14.0794 14.3328 13.3333 13.4583 13.3333C12.5839 13.3333 11.875 14.0794 11.875 14.9999C11.875 15.9204 12.5839 16.6666 13.4583 16.6666Z" stroke={color} strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.54159 16.6666C6.41604 16.6666 7.12492 15.9204 7.12492 14.9999C7.12492 14.0794 6.41604 13.3333 5.54159 13.3333C4.66713 13.3333 3.95825 14.0794 3.95825 14.9999C3.95825 15.9204 4.66713 16.6666 5.54159 16.6666Z" stroke={color} strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <path d="M7.35075 12.7162C8.43575 11.7793 11.6668 8.746 11.6668 5.83341C11.6668 4.59574 11.1752 3.40875 10.3 2.53358C9.42482 1.65841 8.23784 1.16675 7.00016 1.16675C5.76249 1.16675 4.5755 1.65841 3.70033 2.53358C2.82516 3.40875 2.3335 4.59574 2.3335 5.83341C2.3335 8.746 5.56458 11.7793 6.64958 12.7162C6.75066 12.7922 6.8737 12.8333 7.00016 12.8333C7.12663 12.8333 7.24967 12.7922 7.35075 12.7162Z" stroke="#DC2626" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 7.58325C7.9665 7.58325 8.75 6.79975 8.75 5.83325C8.75 4.86675 7.9665 4.08325 7 4.08325C6.0335 4.08325 5.25 4.86675 5.25 5.83325C5.25 6.79975 6.0335 7.58325 7 7.58325Z" stroke="#DC2626" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LightningIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <g clipPath="url(#clip0_20_120)">
      <path d="M1.66662 5.83336C1.58777 5.83363 1.51047 5.81152 1.44369 5.7696C1.3769 5.72768 1.32339 5.66768 1.28935 5.59655C1.25532 5.52543 1.24216 5.4461 1.25141 5.3678C1.26067 5.2895 1.29195 5.21543 1.34162 5.15419L5.46662 0.904194C5.49757 0.868478 5.53973 0.844342 5.5862 0.835749C5.63267 0.827156 5.68067 0.834616 5.72234 0.856904C5.76401 0.879192 5.79687 0.914984 5.81551 0.958406C5.83341 1.00183 5.83749 1.0503 5.82496 1.09586L5.02496 3.60419C5.00137 3.66733 4.99344 3.73524 5.00187 3.80211C5.01029 3.86898 5.03481 3.93281 5.07333 3.98812C5.11184 4.04343 5.16319 4.08857 5.22299 4.11968C5.28278 4.15078 5.34922 4.16691 5.41662 4.16669H8.33329C8.41214 4.16643 8.48944 4.18853 8.55622 4.23045C8.62301 4.27237 8.67653 4.33238 8.71056 4.4035C8.7446 4.47463 8.75775 4.55395 8.7485 4.63225C8.73924 4.71056 8.70796 4.78463 8.65829 4.84586L4.53329 9.09586C4.50235 9.13158 4.46018 9.15571 4.41371 9.1643C4.36725 9.1729 4.31924 9.16544 4.27757 9.14315C4.2359 9.12086 4.20305 9.08507 4.1844 9.04165C4.16575 8.99823 4.16242 8.94976 4.17496 8.90419L4.97496 6.39586C4.99855 6.33273 5.00647 6.26481 4.99804 6.19794C4.98962 6.13107 4.9651 6.06724 4.92659 6.01193C4.88807 5.95662 4.83672 5.91148 4.77692 5.88038C4.71713 5.84927 4.65069 5.83314 4.58329 5.83336H1.66662Z" stroke="#15803D" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_20_120"><rect width="10" height="10" fill="white"/></clipPath>
    </defs>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <g clipPath="url(#clip0_30_68)">
      <path d="M10.9003 4.99999C11.1287 6.12064 10.9659 7.28571 10.4392 8.30089C9.91255 9.31608 9.05375 10.12 8.00606 10.5787C6.95837 11.0373 5.78512 11.1229 4.68196 10.8212C3.57879 10.5195 2.6124 9.84869 1.94394 8.92071C1.27549 7.99272 0.945367 6.86361 1.00864 5.72169C1.07191 4.57976 1.52475 3.49404 2.29163 2.64558C3.05852 1.79712 4.0931 1.23721 5.22284 1.05922C6.35258 0.881233 7.5092 1.09592 8.49981 1.66749" stroke="#00BC7D" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 5.5L6 7L11 2" stroke="#00BC7D" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_30_68"><rect width="12" height="12" fill="white"/></clipPath>
    </defs>
  </svg>
);

const BoxIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <g clipPath="url(#clip0_63_120)">
      <path d="M4.58333 9.05421C4.71002 9.12735 4.85372 9.16585 5 9.16585C5.14628 9.16585 5.28998 9.12735 5.41667 9.05421L8.33333 7.38754C8.45989 7.31447 8.56501 7.20941 8.63814 7.08289C8.71127 6.95637 8.74985 6.81284 8.75 6.66671V3.33337C8.74985 3.18724 8.71127 3.04371 8.63814 2.91719C8.56501 2.79067 8.45989 2.68561 8.33333 2.61254L5.41667 0.945874C5.28998 0.872734 5.14628 0.834229 5 0.834229C4.85372 0.834229 4.71002 0.872734 4.58333 0.945874L1.66667 2.61254C1.54011 2.68561 1.43499 2.79067 1.36186 2.91719C1.28873 3.04371 1.25015 3.18724 1.25 3.33337V6.66671C1.25015 6.81284 1.28873 6.95637 1.36186 7.08289C1.43499 7.20941 1.54011 7.31447 1.66667 7.38754L4.58333 9.05421Z" stroke="#92400E" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 9.16667V5" stroke="#92400E" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.37061 2.91675L4.99977 5.00008L8.62894 2.91675" stroke="#92400E" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.125 1.77905L6.875 3.92489" stroke="#92400E" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_63_120"><rect width="10" height="10" fill="white"/></clipPath>
    </defs>
  </svg>
);

const InfoIcon = () => (
  <svg width="11" height="11" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <g clipPath="url(#clip0_61_95)">
      <path d="M5.00016 9.16658C7.30135 9.16658 9.16683 7.30111 9.16683 4.99992C9.16683 2.69873 7.30135 0.833252 5.00016 0.833252C2.69898 0.833252 0.833496 2.69873 0.833496 4.99992C0.833496 7.30111 2.69898 9.16658 5.00016 9.16658Z" stroke="#6B7280" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 3.33325V4.99992" stroke="#6B7280" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 6.66675H5.00417" stroke="#6B7280" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_61_95"><rect width="10" height="10" fill="white"/></clipPath>
    </defs>
  </svg>
);

export default function DeliveryWidget({
  accentColor = '#0446DB',
  borderRadius = '12px',
  apiKey = '',             // ← receive from SellerPortal via liveApiKey
}) {
  const { pincode, setPincode, result, status, handleCheck, handleReset } = useEta(apiKey);

  const isLoading  = status === 'loading';
  const isSuccess  = status === 'success' && result;
  const isUnavail  = status === 'unavailable';
  const isError    = status === 'error';
  const showResult = isSuccess || isUnavail;
  const deliverBy  = typeof result?.deliver_by === 'string' ? result.deliver_by : '';
  const sameDayReadable =
    typeof result?.time_remaining?.readable === 'string' ? result.time_remaining.readable : '';

  const s = {
    card: {
      fontFamily: 'Inter, system-ui, sans-serif',
      border: '1px solid #E2E8F0',
      borderRadius: borderRadius,
      overflow: 'hidden',
      background: '#fff',
      width: '100%',
      boxSizing: 'border-box',
    },
    header: {
      background: accentColor,
      padding: '10px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
      flexWrap: 'wrap',
    },
    livePill: {
      display: 'flex', alignItems: 'center', gap: 5,
      background: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.3)',
      borderRadius: 999, padding: '3px 8px',
      flexShrink: 0,
    },
    liveDot: {
      width: 7, height: 7, borderRadius: '50%',
      background: '#34D399',
      boxShadow: '0 0 0 2px rgba(52,211,153,0.35)',
      flexShrink: 0,
    },
    liveText:     { fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' },
    deliveryCheck: {
      display: 'flex', alignItems: 'center', gap: 5,
      fontSize: 10, fontWeight: 700, color: '#fff',
      letterSpacing: '0.04em', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    },
    poweredBy: {
      display: 'flex', alignItems: 'center', gap: 4,
      fontSize: 10, color: 'rgba(255,255,255,0.85)',
      fontWeight: 500, letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    },
    body:     { padding: '12px 12px', boxSizing: 'border-box' },
    inputRow: {
      display: 'flex', alignItems: 'center',
      border: '1.5px solid #E5EAF2', borderRadius: 8,
      padding: '0 0 0 12px', background: '#fff',
      overflow: 'hidden',
    },
    pinIcon:  { display: 'flex', alignItems: 'center', marginRight: 8, flexShrink: 0 },
    input: {
      flex: 1, border: 0, background: 'transparent',
      fontSize: 14, fontWeight: 400, color: '#0B1220',
      outline: 'none', padding: '11px 0',
      letterSpacing: '0.02em', minWidth: 0,
    },
    checkBtn: {
      background: accentColor, color: '#fff',
      border: 0, padding: '11px 18px',
      fontSize: 13, fontWeight: 700,
      letterSpacing: '0.03em',
      cursor: 'pointer', flexShrink: 0,
    },
    resultRow: {
      display: 'flex', alignItems: 'center',
      border: '1.5px solid #E5EAF2', borderRadius: 8,
      padding: '10px 12px', marginBottom: 10, gap: 8,
      justifyContent: 'space-between',
    },
    savedPin: {
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 14, fontWeight: 500, color: '#0B1220',
    },
    changeBtn: {
      background: 'transparent', border: 0,
      color: accentColor, fontSize: 13, fontWeight: 700,
      cursor: 'pointer', padding: 0, flexShrink: 0,
    },
    sddCard: {
      border: '1px solid #E2E8F0', borderRadius: 8,
      padding: '10px 12px', background: '#fff',
      marginBottom: 8, boxSizing: 'border-box',
    },
    nddCard: {
      border: '1px solid #E2E8F0', borderRadius: 8,
      padding: '10px 12px', background: '#fff',
      marginBottom: 8, boxSizing: 'border-box',
    },
    standardCard: {
      border: '1px solid #FDE68A', borderRadius: 8,
      padding: '10px 12px', background: '#fff',
      marginBottom: 8, boxSizing: 'border-box',
    },
    cardRow1: {
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8, flexWrap: 'wrap', marginBottom: 8,
    },
    sddBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: '#D1FAE5', color: '#065F46',
      fontSize: 11, fontWeight: 700,
      padding: '4px 8px', borderRadius: 6, flexShrink: 0,
    },
    nddBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: '#EEF4FF', color: '#0446DB',
      fontSize: 11, fontWeight: 700,
      padding: '4px 8px', borderRadius: 6, flexShrink: 0,
    },
    standardBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: '#FEF9C3', color: '#92400E',
      fontSize: 11, fontWeight: 700,
      padding: '4px 8px', borderRadius: 6, flexShrink: 0,
    },
    deliverBy: {
      fontSize: 13, fontWeight: 700, color: '#0B1220',
      whiteSpace: 'normal', textAlign: 'right',
    },
    countdownRow: {
      display: 'flex', alignItems: 'start', gap: 6, marginTop: 8,
      background: '#F0FDF4', border: '1px solid #D1FAE5',
      borderRadius: 6, padding: '6px 10px',
      fontSize: 12, color: '#065F46', fontWeight: 500,
    },
    nddSubRow: {
      display: 'flex', alignItems: 'start', gap: 6, marginTop: 8,
      background: '#F4F8FF', border: '1px solid #DBEAFE',
      borderRadius: 6, padding: '6px 10px',
      fontSize: 12, color: '#1E40AF', fontWeight: 500,
    },
    standardSubRow: {
      display: 'flex', alignItems: 'start', gap: 6, marginTop: 8,
      background: '#FFFBEB', border: '1px solid #FDE68A',
      borderRadius: 6, padding: '6px 10px',
      fontSize: 12, color: '#92400E', fontWeight: 500,
    },
    metaRow: {
      display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10,
    },
    metaItem: {
      display: 'flex', alignItems: 'center', gap: 5,
      fontSize: 11, color: '#6B7280', fontWeight: 400,
    },
    unavailCard:  { border: 'none', padding: '0px', background: 'transparent' },
    unavailBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: '#F3F4F6', color: '#4B5563',
      fontSize: 11, fontWeight: 700,
      padding: '4px 8px', borderRadius: 6,
    },
    unavailText: {
      fontSize: 13, color: '#6B7280',
      marginTop: 10, lineHeight: 1.5, fontWeight: 400,
    },
    errorCard: {
      border: '1px solid #FECACA', borderRadius: 8,
      padding: '10px 12px', background: '#FEF2F2',
      color: '#991B1B', fontSize: 13, lineHeight: 1.5,
    },
    skeletonBar: {
      height: 12, borderRadius: 6, marginBottom: 8,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
    },
  };

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={s.livePill}>
            <span style={s.liveDot} />
            <span style={s.liveText}>LIVE</span>
          </span>
          <span style={s.deliveryCheck}>
            <TruckIcon color="white" /> &nbsp;DELIVERY CHECK
          </span>
        </div>
        <span style={s.poweredBy}>
          Powered by&nbsp;<DaakitLogo />
        </span>
      </div>

      <div style={s.body}>
        {!showResult && (
          <div style={s.inputRow}>
            <span style={s.pinIcon}><PinIcon /></span>
            <input
              style={s.input}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter pincode"
              value={pincode || ''}
              onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && (pincode || '').length === 6 && handleCheck()}
            />
            <button
              style={{
                ...s.checkBtn,
                opacity: (pincode || '').length === 6 && !isLoading ? 1 : 0.5,
                cursor: (pincode || '').length === 6 && !isLoading ? 'pointer' : 'not-allowed',
              }}
              disabled={(pincode || '').length !== 6 || isLoading}
              onClick={handleCheck}
            >
              {isLoading ? '...' : 'Check'}
            </button>
          </div>
        )}

        {isLoading && (
          <div>
            <div style={{ ...s.skeletonBar, width: '70%' }} />
            <div style={{ ...s.skeletonBar, width: '50%' }} />
          </div>
        )}

        {isError && (
          <div style={s.errorCard}>
            We could not fetch delivery ETA right now. Please try again in a moment.
          </div>
        )}

        {isSuccess && result.delivery_type === 'same_day' && (
          <div>
            <div style={s.resultRow}>
              <span style={s.savedPin}><PinIcon /> &nbsp;{pincode}</span>
              <button style={s.changeBtn} onClick={handleReset}>Change</button>
            </div>
            <div style={s.sddCard}>
              <div style={s.cardRow1}>
                <span style={s.sddBadge}><LightningIcon /> Same Day</span>
                <span style={s.deliverBy}>{deliverBy || 'Delivery date unavailable'}</span>
              </div>
              {sameDayReadable && (
                <div style={s.countdownRow}>
                  <BoxIcon />
                  <span style={{ lineHeight: '1.4' }}>
                    Order within <strong>{sameDayReadable}</strong> for Same Day delivery
                  </span>
                </div>
              )}
              <div style={s.metaRow}>
                <span style={s.metaItem}><TruckIcon color="#6B7280" /> Ships from nearest darkstore</span>
                <span style={s.metaItem}><CheckIcon /> 100% safe handling</span>
              </div>
            </div>
          </div>
        )}

        {isSuccess && result.delivery_type === 'next_day' && (
          <div>
            <div style={s.resultRow}>
              <span style={s.savedPin}><PinIcon /> &nbsp;{pincode}</span>
              <button style={s.changeBtn} onClick={handleReset}>Change</button>
            </div>
            <div style={s.nddCard}>
              <div style={s.cardRow1}>
                <span style={s.nddBadge}>
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}>
                    <path d="M3.3335 0.833252V2.49992" stroke="#1D4ED8" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.6665 0.833252V2.49992" stroke="#1D4ED8" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.91667 1.66675H2.08333C1.6231 1.66675 1.25 2.03984 1.25 2.50008V8.33341C1.25 8.79365 1.6231 9.16675 2.08333 9.16675H7.91667C8.3769 9.16675 8.75 8.79365 8.75 8.33341V2.50008C8.75 2.03984 8.3769 1.66675 7.91667 1.66675Z" stroke="#1D4ED8" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1.25 4.16675H8.75" stroke="#1D4ED8" strokeWidth="0.833333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Next Day
                </span>
                <span style={s.deliverBy}>{deliverBy || 'Delivery date unavailable'}</span>
              </div>
              <div style={s.nddSubRow}>
                <TruckIcon color="#1E40AF" />
                <span style={{ lineHeight: '1.4' }}>Next Day delivery - order anytime today</span>
              </div>
            </div>
          </div>
        )}

        {isSuccess && result.delivery_type === 'standard' && (
          <div>
            <div style={s.resultRow}>
              <span style={s.savedPin}><PinIcon /> &nbsp;{pincode}</span>
              <button style={s.changeBtn} onClick={handleReset}>Change</button>
            </div>
            <div style={s.standardCard}>
              <div style={s.cardRow1}>
                <span style={s.standardBadge}>
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}>
                    <path d="M5 1L6.2 3.5L9 3.9L7 5.8L7.5 8.5L5 7.2L2.5 8.5L3 5.8L1 3.9L3.8 3.5L5 1Z" stroke="#92400E" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Standard
                </span>
                <span style={s.deliverBy}>{deliverBy || 'Delivery date unavailable'}</span>
              </div>
              <div style={s.standardSubRow}>
                <TruckIcon color="#92400E" />
                <span style={{ lineHeight: '1.4' }}>Standard delivery · 3–5 business days</span>
              </div>
            </div>
          </div>
        )}

        {isUnavail && (
          <div>
            <div style={s.resultRow}>
              <span style={s.savedPin}><PinIcon /> &nbsp;{pincode}</span>
              <button style={s.changeBtn} onClick={handleReset}>Change</button>
            </div>
            <div style={s.unavailCard}>
              <span style={s.unavailBadge}>
                <InfoIcon /> Not Available
              </span>
              <p style={s.unavailText}>
                Delivery not available in your area yet.<br />
                We are expanding - check back soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}