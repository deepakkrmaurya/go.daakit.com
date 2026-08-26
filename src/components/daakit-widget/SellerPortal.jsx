import { useState, useRef, useEffect } from 'react'
import DeliveryWidget from './DeliveryWidget'
import daakitLogo from '../../assets/daakit_logo.png'
import headphone from '../../assets/headphone.jpg'

const API_BASE   = import.meta.env.VITE_WIDGET_API_BASE || 'http://localhost:5000/api/widget'
const WIDGET_URL = import.meta.env.VITE_WIDGET_URL      || 'http://localhost:5000/widget/widget.js'

const PALETTES = [
  { label: 'Brand blues',    colors: ['#0446DB','#1D4ED8','#0EA5E9','#0891B2','#06B6D4'] },
  { label: 'Greens & teals', colors: ['#16A34A','#059669','#0D9488','#15803D','#047857'] },
  { label: 'Bold accents',   colors: ['#DC2626','#DB2777','#7C3AED','#EA580C','#D97706'] },
  { label: 'Neutrals',       colors: ['#111827','#374151','#475569','#64748B','#94A3B8'] },
]

function getSellerToken(propToken) {
  const candidates = [
    propToken,
    localStorage.getItem('token'),
  ];
 
  for (const raw of candidates) {
    if (!raw) continue;
    try {
      const payload = JSON.parse(atob(raw.split('.')[1]));
      // DaakitGo token has `id` + `userType: "merchant"`
      if (payload?.userType === 'merchant' && payload?.id) return raw;
      // fallback for old seller tokens
      if (payload?.sellerId) return raw;
    } catch {}
  }
  return '';
}

// ─── Integrations Panel ───────────────────────────────────────────────────────
function IntegrationsPanel({ accentColor, token, onKeyReady }) {
  const [keys,       setKeys]       = useState([])
  const [newKey,     setNewKey]     = useState(null)
  const [copied,     setCopied]     = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => { fetchKeys() }, [])

  async function fetchKeys() {
    if (import.meta.env.DEV) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token for:', payload?.email, '| sellerId:', payload?.sellerId);
      } catch {}
    }

    setFetchError(false)
    try {
      const res = await fetch(`${API_BASE}/widget/auth/keys`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setKeys(data.keys || [])
    } catch {
      setFetchError(true)
    }
  }

  async function handleGenerate() {
    setLoading(true)
    setConfirming(false)
    setNewKey(null)

    try {
      const res = await fetch(`${API_BASE}/widget/auth/keys/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (!data?.key) throw new Error('Empty key from server')

      // Refresh masked list first so UI is consistent, then reveal full key
      await fetchKeys()
      setNewKey(data.key)
      onKeyReady(data.key)
    } catch {
      alert('Key generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyKey(text) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeKey = keys.find(k => k.is_active === 1 || k.is_active === true)

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden
                    transition-all duration-300
                    hover:shadow-[0_12px_40px_-12px_rgba(4,70,219,0.12)]
                    hover:border-[#0446DB]/20">
      <div className="p-4 sm:p-[22px]">

        <div className="text-[11px] font-bold tracking-widest uppercase text-[#94A3B8] mb-1">
          API Key
        </div>
        <p className="text-[12px] text-[#64748B] mb-5 leading-relaxed">
          Your widget uses this key to authenticate ETA requests.
          The full key is shown <strong>only once</strong> — copy it before leaving.
        </p>

        {fetchError && (
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[9px] p-3 mb-4
                          text-[12px] text-[#991B1B]">
            Could not load keys. Check your connection and refresh.
          </div>
        )}

        {newKey && (
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] p-4 mb-4">
            <div className="text-[11px] font-bold text-[#065F46] uppercase tracking-widest mb-2.5">
              ✓ New key generated — copy it now
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-[12px] text-[#065F46] break-all
                               bg-white border border-[#BBF7D0] rounded-[7px] p-2.5 leading-relaxed">
                {newKey}
              </code>
              <button
                onClick={() => copyKey(newKey)}
                style={{ backgroundColor: accentColor }}
                className="text-white border-0 rounded-[7px] px-3 py-2 text-[12px]
                           font-bold cursor-pointer font-inherit flex-shrink-0
                           transition-all hover:opacity-90"
              >
                {copied ? '✓ Done' : 'Copy'}
              </button>
            </div>
            <p className="text-[11px] text-[#065F46] mt-2 mb-0">
              This is the only time the full key is visible. Store it securely.
            </p>
          </div>
        )}

        {activeKey && !newKey && (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-4 mb-4">
            <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">
              Active key
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <code className="flex-1 font-mono text-[13px] text-[#0B1220]
                               bg-white border border-[#E2E8F0] rounded-[7px] p-2.5
                               min-w-0 break-all">
                {activeKey.key_preview}
              </code>
              <span className="text-[11px] text-[#94A3B8] flex-shrink-0">
                Created {new Date(activeKey.created_at).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {!activeKey && !newKey && !fetchError && (
          <div className="bg-[#F8FAFC] border border-dashed border-[#CBD5E1]
                          rounded-[10px] p-5 mb-4 text-center text-[13px] text-[#94A3B8]">
            No API key yet. Generate one to activate your widget.
          </div>
        )}

        {!confirming ? (
          <button
            onClick={() => activeKey ? setConfirming(true) : handleGenerate()}
            disabled={loading}
            style={!activeKey ? { backgroundColor: accentColor } : {}}
            className={`inline-flex items-center gap-1.5 border-0 rounded-[9px]
                        p-[10px_20px] text-[13px] font-bold cursor-pointer font-inherit
                        transition-all disabled:opacity-60 disabled:cursor-not-allowed
                        ${activeKey
                          ? 'bg-[#FEF2F2] text-[#DC2626] ring-1 ring-[#FECACA] hover:bg-[#FEE2E2]'
                          : 'text-white hover:opacity-90'}`}
          >
            {loading ? 'Generating…' : activeKey ? '↺  Regenerate Key' : '+ Generate API Key'}
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2
                          bg-[#FEF2F2] border border-[#FECACA] rounded-[9px] p-3">
            <span className="text-[12px] text-[#991B1B] flex-1 min-w-[200px]">
              The old key will be <strong>immediately invalidated</strong>.
              Any live widgets using it will stop working. Continue?
            </span>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleGenerate}
                className="bg-[#DC2626] text-white border-0 rounded-[7px]
                           px-3 py-1.5 text-[12px] font-bold cursor-pointer font-inherit"
              >
                Yes, regenerate
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="bg-transparent text-[#64748B] border border-[#E2E8F0]
                           rounded-[7px] px-3 py-1.5 text-[12px] font-bold
                           cursor-pointer font-inherit hover:border-[#94A3B8]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <p className="text-[11px] text-[#94A3B8] leading-relaxed mt-3 mb-0">
          Regenerating immediately invalidates the previous key.
          Update your embed snippet after any regeneration.
        </p>
      </div>
    </div>
  )
}

// ─── Main SellerPortal ────────────────────────────────────────────────────────
export default function SellerPortal({ token: propToken }) {
  const [embedCopied,   setEmbedCopied]   = useState(false)
  const [accentColor,   setAccentColor]   = useState('#0446DB')
  const [borderRadius,  setBorderRadius]  = useState('12')
  const [activeTab,     setActiveTab]     = useState('theme')
  // Seed from localStorage so embed code is correct even after a page refresh
  const [liveApiKey, setLiveApiKey] = useState(
    () => localStorage.getItem('daakit_api_key') || ''
  )
  const colorDebounce = useRef(null)

  const token = getSellerToken(propToken)

  const embedCode = `<script\n  src="${WIDGET_URL}"\n  data-api-key="${liveApiKey || 'YOUR_API_KEY'}"\n  data-accent="${accentColor}"\n  data-radius="${borderRadius}px">\n<\/script>`

  function copy(text, setFn) {
    navigator.clipboard.writeText(text)
    setFn(true)
    setTimeout(() => setFn(false), 2000)
  }

  function handleColorChange(val) {
    if (colorDebounce.current) clearTimeout(colorDebounce.current)
    colorDebounce.current = setTimeout(() => setAccentColor(val), 0)
    setAccentColor(val)
  }

  const tabs = [
    { id: 'theme',        label: 'Theme',       icon: '◑'   },
    { id: 'embed',        label: 'Embed Code',  icon: '</>' },
    { id: 'integrations', label: 'Integrations',icon: '⚿'  },
  ]

  return (
    <div className="min-h-screen bg-[#F0F4FC] text-[#0B1220] font-sans">
      <div className="px-4 sm:px-7 pt-4 pb-7 max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── Left column ── */}
          <div className="lg:col-span-7 flex flex-col gap-4 w-full">
            <div className="pb-1">
              <h2 className="font-extrabold text-[18px] sm:text-[20px] uppercase
                             text-[#0B1220] tracking-tight mb-1.5">
                Delivery Widget Setup
              </h2>
              <p className="text-[13px] text-[#64748B] leading-relaxed m-0">
                Customise the look of your widget, then paste one line of code onto your product pages.
              </p>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 bg-[#E8EEF9] rounded-[10px] p-1 w-full overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`flex-1 min-w-[85px] sm:min-w-0 flex items-center justify-center
                              gap-1.5 py-2 px-2 sm:px-2.5 bg-transparent border-0 rounded-[7px]
                              text-[12px] sm:text-[13px] font-semibold cursor-pointer
                              transition-all duration-150 font-inherit
                              ${activeTab === tab.id
                                ? 'bg-white text-[#0446DB] shadow-[0_1px_4px_rgba(4,70,219,0.12)]'
                                : 'text-[#64748B] hover:text-[#0446DB]'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="text-[13px] opacity-70">{tab.icon}</span>
                  <span className="block">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* ── Tab: Theme ── */}
            {activeTab === 'theme' && (
              <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden
                              transition-all duration-300
                              hover:shadow-[0_12px_40px_-12px_rgba(4,70,219,0.12)]
                              hover:border-[#0446DB]/20">
                <div className="p-4 sm:p-[22px]">
                  <div className="text-[11px] font-bold tracking-widest uppercase
                                  text-[#94A3B8] mb-2.5">Accent Colour</div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div style={{ background: accentColor }}
                         className="w-9 h-9 rounded-[8px] border border-black/10 flex-shrink-0" />
                    <input type="color" value={accentColor}
                           onChange={e => handleColorChange(e.target.value)}
                           className="w-9 h-9 border border-[#E2E8F0] rounded-[7px]
                                      cursor-pointer p-0 bg-transparent" />
                    <input type="text" value={accentColor} maxLength={7}
                           onChange={e => handleColorChange(e.target.value)}
                           className="border-[1.5px] border-[#E2E8F0] rounded-[7px]
                                      p-[8px_12px] text-[13px] font-mono text-[#0B1220]
                                      outline-none w-24 tracking-widest"
                           spellCheck={false} />
                  </div>

                  <div className="text-[11px] font-bold tracking-widest uppercase
                                  text-[#94A3B8] mb-3">Quick Palettes</div>
                  <div className="flex flex-col gap-3.5">
                    {PALETTES.map(group => (
                      <div key={group.label}
                           className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <span className="text-[11px] text-[#94A3B8] w-full sm:w-[100px] flex-shrink-0">
                          {group.label}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {group.colors.map(c => (
                            <button key={c} title={c} onClick={() => handleColorChange(c)}
                                    style={{
                                      background: c,
                                      outline: accentColor === c ? `2px solid ${c}` : 'none',
                                      outlineOffset: 2,
                                    }}
                                    className="w-6 h-6 rounded-[6px] border border-black/10
                                               cursor-pointer p-0 transition-transform hover:scale-110" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] font-bold tracking-widest uppercase
                                  text-[#94A3B8] mb-2.5 mt-6">Border Radius</div>
                  <div className="flex items-center gap-3.5">
                    <input type="range" min={0} max={24} step={2}
                           value={parseInt(borderRadius)}
                           onChange={e => setBorderRadius(e.target.value)}
                           className="flex-1 cursor-pointer accent-[#0446DB]" />
                    <div style={{ borderRadius: `${borderRadius}px` }}
                         className="w-10 h-10 border-2 border-[#0446DB] flex items-center
                                    justify-center flex-shrink-0 transition-[border-radius] duration-150">
                      <code className="text-[11px] text-[#0446DB] font-mono">{borderRadius}px</code>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] leading-relaxed mt-2.5">
                    Adjust to match your store's design language. Preview updates in real time →
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Embed Code ── */}
            {activeTab === 'embed' && (
              <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden
                              transition-all duration-300
                              hover:shadow-[0_12px_40px_-12px_rgba(4,70,219,0.12)]
                              hover:border-[#0446DB]/20">
                <div className="p-4 sm:p-[22px]">
                  {!liveApiKey && (
                    <div className="flex items-center gap-2 bg-[#FFFBEB] border border-[#FDE68A]
                                    rounded-[9px] p-3 mb-4 text-[12px] text-[#92400E]">
                      <span>⚠</span>
                      <span>
                        Replace <code className="font-mono">YOUR_API_KEY</code> with a real key — go to{' '}
                        <button onClick={() => setActiveTab('integrations')}
                                className="underline font-bold bg-transparent border-0
                                           cursor-pointer text-[#92400E] font-inherit text-[12px] p-0">
                          Integrations
                        </button>{' '}
                        to generate one.
                      </span>
                    </div>
                  )}

                  <div className="text-[11px] font-bold tracking-widest uppercase
                                  text-[#94A3B8] mb-2.5">Your Embed Snippet</div>
                  <div className="bg-[#0B1220] rounded-[10px] p-4 mb-3 overflow-x-auto max-w-full">
                    <pre className="font-mono text-[12px] text-[#7DD3FC] leading-loose m-0 whitespace-pre">
                      {embedCode}
                    </pre>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-3.5">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                      <span className="w-2 h-2 rounded-full flex-shrink-0 inline-block"
                            style={{ background: accentColor }} />
                      <span>Accent: <code className="font-mono text-[12px]">{accentColor}</code></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                      <span className="w-2 h-2 rounded-full bg-[#0446DB] flex-shrink-0 inline-block" />
                      <span>Radius: <code className="font-mono text-[12px]">{borderRadius}px</code></span>
                    </div>
                  </div>
                  <button
                    style={{ backgroundColor: accentColor }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5
                               text-white border-0 rounded-[9px] p-[10px_20px] text-[13px]
                               font-bold cursor-pointer font-inherit tracking-wide
                               transition-all duration-150
                               hover:shadow-[0_4px_14px_0_rgba(4,70,219,0.4)]"
                    onClick={() => copy(embedCode, setEmbedCopied)}
                  >
                    {embedCopied ? '✓  Copied to clipboard!' : '⎘  Copy Embed Code'}
                  </button>
                  <div className="text-[11px] text-[#94A3B8] leading-relaxed mt-2.5">
                    Paste this snippet just above your "Add to Cart" button.
                    The widget injects automatically on every product page.
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Integrations ── */}
            {activeTab === 'integrations' && (
              <IntegrationsPanel
                accentColor={accentColor}
                token={token}
                onKeyReady={(key) => {
                  setLiveApiKey(key)
                  localStorage.setItem('daakit_api_key', key)
                }}
              />
            )}
          </div>

          {/* ── Right column: Live Preview ── */}
          <div className="lg:col-span-5 w-full">
            <div className="sticky top-6">
              <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden
                              transition-all duration-300
                              hover:shadow-[0_12px_40px_-12px_rgba(4,70,219,0.12)]
                              hover:border-[#0446DB]/20">
                <div className="p-4 sm:p-[22px]">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-[11px] font-bold tracking-widest uppercase text-[#94A3B8]">
                      Live Preview
                    </div>
                    <div className="flex items-center gap-1 bg-[#F0FDF4] border border-[#BBF7D0]
                                    rounded-full px-2.5 py-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]
                                      shadow-[0_0_0_2px_rgba(22,163,74,0.25)]" />
                      <span className="text-[10px] font-bold tracking-widest text-[#065F46]">LIVE</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed mt-0 mb-4">
                    Test with real pincodes. Theme changes apply instantly.
                  </p>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] overflow-hidden">
                    <div className="relative w-full h-[240px] sm:h-[300px] overflow-hidden bg-[#F1F5F9]">
                      <img src={headphone} alt="Headphone"
                           className="w-full h-full object-cover object-center
                                      transition-transform duration-300 hover:scale-105"
                           loading="lazy" />
                    </div>
                    <div className="p-3.5">
                      <div className="text-[14px] font-bold text-[#0B1220] mb-1">
                        Premium Cotton T-Shirt
                      </div>
                      <div className="text-[18px] font-extrabold text-[#0B1220] mb-0.5">₹899</div>
                      <div className="my-3">
                        {/* Pass apiKey so the preview widget re-fetches after key generation */}
                        <DeliveryWidget
                          accentColor={accentColor}
                          borderRadius={`${borderRadius}px`}
                          apiKey={liveApiKey}
                        />
                      </div>
                      <button
                        style={{ backgroundColor: accentColor }}
                        className="block w-full text-white border-0 rounded-[9px] p-3
                                   text-[13px] font-bold text-center cursor-pointer font-inherit
                                   mt-2 box-border transition-all duration-150
                                   hover:shadow-[0_4px_14px_0_rgba(4,70,219,0.4)]"
                      >Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}