// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { useState, useRef, useEffect, useCallback } from "react";
// import logo from "../../assets/Chatbot_homescreen_logo.svg"
// import logo2 from "../../assets/Chatbot_in_chat_logo.svg"

// import headerBg from "../../assets/chatbot_header_bg.png";

// const API_BASE = "https://aiassistant.daakit.com";
// const WS_BASE = API_BASE.replace(/^https/, "wss");

// const BRAND   = "#0446db";
// const BRAND_D = "#0336b0";

// const WELCOME_MSG = {
//   role: "model",
//   content: "Hi! I'm DAAKit Assistant 👋 I can help you with shipment tracking, NDR resolution, COD wallet, freight quotes, and more. What can I help you with today?",
// };

// function getHostContext() {
//   return window.__DAAKIT_CTX__ || {};
// }

// /* ─────────────────────────────────────────────
//    Avatar image component — replaces RoundBot
// ───────────────────────────────────────────── */
// const AVATAR_SRC = "data:image/png;base64,PLACEHOLDER";

// function AvatarImg({ size = 30, spinning = false }) {
//   return (
//     <div style={{
//       position: "relative",
//       top: -12, left: 0,
//       width: size, height: size,
//       display: "inline-block", flexShrink: 0,
//     }}>
//       {spinning && (
//         <div style={{
//           position: "absolute", inset: -3, borderRadius: "50%",
//           animation: "daakitSpin 0.7s linear infinite",
//           zIndex: 0, pointerEvents: "none",
//         }} />
//       )}
//       <img
//         src={logo2}
//         alt="DAAKit Assistant"
//         style={{
//           width: size, height: size,
//           border:"2px solid #fff",
//           borderRadius: "100%",
//           objectFit: "contain",
//           display: "block",
//           position: "relative", zIndex: 1,
//           animation: spinning
//             ? "daakitFloat 3s ease-in-out infinite"
//             : "daakitFloat 3s ease-in-out infinite",
//           filter: "drop-shadow(0 6px 14px rgba(4,30,100,0.28))",
//         }}
//       />
//     </div>
//   );
// }
// function HomeLogo({ size = 30, spinning = false }) {
//   return (
//     <div style={{
//       position: "relative",
//       top: -90, left: -5,
//       width: size, height: size,
//       display: "inline-block", flexShrink: 0,
//     }}>
//       {spinning && (
//         <div style={{
//           position: "absolute", inset: -5, borderRadius: "50%",
//           background: "conic-gradient(rgba(255,255,255,0.9) 0deg, rgba(255,255,255,0) 240deg)",
//           animation: "daakitSpin 0.85s linear infinite",
//           zIndex: 0, pointerEvents: "none",
//         }} />
//       )}
//       <img
//         src={logo}
//         alt="DAAKit Assistant"
//         style={{
//           width: size, height: size,
//           borderRadius: 0,
//           objectFit: "contain",
//           display: "block",
//           position: "relative", zIndex: 1,
//           filter: "drop-shadow(0 6px 14px rgba(4,30,100,0.28))",
//         }}
//       />
//     </div>
//   );
// }

// /* Avatar for message bubbles */
// function BotAvatar() {
//   return (
//     <div style={{ flexShrink: 0, marginRight: 6, alignSelf: "flex-end", marginBottom: 2 }}>
//       <AvatarImg size={30} spinning={false}/>
//     </div>
//   );
// }
// function HomeBotAvatar() {
//   return (
//     <div style={{ flexShrink: 0, marginRight: 6, alignSelf: "flex-end", marginBottom: 2 }}>
//       <HomeLogo size={90} spinning={false}/>
//     </div>
//   );
// }

// /* Renders action buttons attached to a bot message (e.g. "Raise a Ticket" → redirect) */
// function MessageActions({ actions }) {
//   if (!actions || actions.length === 0) return null;
//   return (
//     <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
//       {actions.map((action, i) => {
//         if (action.type === "redirect_button") {
//           return (
//             <button
//               key={i}
//               className="dk-action-btn"
//               onClick={() => window.open(action.url, "_blank", "noopener,noreferrer")}
//               style={{
//                 background: BRAND, color: "#fff", border: "none",
//                 borderRadius: 10, padding: "9px 16px", fontSize: 13,
//                 fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
//                 display: "inline-flex", alignItems: "center", gap: 6,
//                 transition: "background .15s, transform .15s",
//               }}
//             >
//               {action.label || "Continue"}
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
//                 <path d="M7 17L17 7M17 7H9M17 7V15" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </button>
//           );
//         }
//         return null;
//       })}
//     </div>
//   );
// }

// function Message({ msg }) {
//   const isUser = msg.role === "user";
//   return (
//     <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12, alignItems: "flex-end" }}>
//       {!isUser && <BotAvatar/>}
//       <div style={{
//         maxWidth: "72%",
//         background: isUser ? BRAND : "#eef2ff",
//         color: isUser ? "#fff" : "#1a1f36",
//         borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
//         padding: "10px 14px", fontSize: 13.5, lineHeight: 1.55,
//         border: isUser ? "none" : "1px solid #d4ddff",
//       }}>
//         {isUser ? (
//           <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
//         ) : (
//           <ReactMarkdown
//             remarkPlugins={[remarkGfm]}
//             components={{
//               p: ({ children }) => <p style={{ margin: "0 0 6px 0" }}>{children}</p>,
//               pre: ({ children }) => (
//                 <pre style={{
//                   background: "#1a1f36", color: "#e2e8f0",
//                   borderRadius: 8, padding: "10px 12px",
//                   overflowX: "auto", fontSize: 12.5, margin: "6px 0",
//                 }}>{children}</pre>
//               ),
//               code: ({ inline, children }) => inline ? (
//                 <code style={{
//                   background: "#d4ddff", color: "#1a1f36",
//                   borderRadius: 4, padding: "1px 5px", fontSize: 12.5,
//                 }}>{children}</code>
//               ) : <code>{children}</code>,
//               ul: ({ children }) => <ul style={{ margin: "4px 0", paddingLeft: 18 }}>{children}</ul>,
//               ol: ({ children }) => <ol style={{ margin: "4px 0", paddingLeft: 18 }}>{children}</ol>,
//               li: ({ children }) => <li style={{ marginBottom: 2 }}>{children}</li>,
//               a: ({ href, children }) => (
//                 <a href={href} target="_blank" rel="noreferrer"
//                   style={{ color: isUser ? "#c7d8ff" : "#4361ee", textDecoration: "underline" }}>
//                   {children}
//                 </a>
//               ),
//             }}
//           >
//             {msg.content}
//           </ReactMarkdown>
//         )}
//         {msg.streaming && <span style={{ opacity: 0.4, marginLeft: 2 }}>▋</span>}
//         {!isUser && !msg.streaming && <MessageActions actions={msg.actions}/>}
//       </div>
//     </div>
//   );
// }

// function TypingDots() {
//   return (
//     <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 12 }}>
//       <BotAvatar/>
//       <div style={{
//         background: "#eef2ff", border: "1px solid #d4ddff",
//         borderRadius: "18px 18px 18px 4px", padding: "12px 16px",
//         display: "flex", gap: 5, alignItems: "center",
//       }}>
//         {[0,1,2].map(i => (
//           <div key={i} style={{
//             width: 6, height: 6, borderRadius: "50%", background: BRAND,
//             animation: `daakitDot 1s ease-in-out ${i * 0.18}s infinite`,
//           }}/>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function ChatWidget() {
//   const [open, setOpen]         = useState(false);
//   const [messages, setMessages] = useState([WELCOME_MSG]);
//   const [input, setInput]       = useState("");
//   const [loading, setLoading]   = useState(false);
//   const [pulse, setPulse]       = useState(false);
//   const wsRef     = useRef(null);
//   const bottomRef = useRef(null);
//   const ctx = getHostContext();

//   useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

//   useEffect(() => {
//     if (!open && messages[messages.length-1]?.role === "model" && messages.length > 1) {
//       setPulse(true);
//       const t = setTimeout(() => setPulse(false), 2200);
//       return () => clearTimeout(t);
//     }
//   }, [messages, open]);

//   const connectWS = useCallback(() => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) return wsRef.current;
//     const ws = new WebSocket("wss://aiassistant.daakit.com/api/v1/ws/chat");
//     wsRef.current = ws;
//     ws.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       if (data.type === "chunk") {
//         setMessages(prev => {
//           const last = prev[prev.length-1];
//           if (last?.streaming) return [...prev.slice(0,-1), { ...last, content: last.content + data.text }];
//           return [...prev, { role: "model", content: data.text, streaming: true }];
//         });
//       } else if (data.type === "done") {
//         setMessages(prev => {
//           const last = prev[prev.length-1];
//           if (last?.streaming) return [...prev.slice(0,-1), { ...last, streaming: false, content: last.content + (data.text||""), actions: data.actions || last.actions }];
//           if (data.text) return [...prev, { role: "model", content: data.text, actions: data.actions || [] }];
//           return prev;
//         });
//         setLoading(false);
//       } else if (data.type === "error") {
//         setMessages(prev => [...prev, { role: "model", content: data.text || "Something went wrong." }]);
//         setLoading(false);
//       }
//     };
//     ws.onerror = () => setLoading(false);
//     return ws;
//   }, []);

//   const sendMessage = useCallback(async () => {
//     const text = input.trim();
//     if (!text || loading) return;
//     const history = messages.map(m => ({ role: m.role, content: m.content }));
//     setMessages(prev => [...prev, { role: "user", content: text }]);
//     setInput(""); setLoading(true);
//     const ws = connectWS();
//     const payload = JSON.stringify({
//       message: text, history,
//       merchant_id: ctx.merchant_id || null,
//       auth_token: ctx.auth_token || null,
//       site: ctx.site || window.location.hostname,
//     });
//     if (ws.readyState === WebSocket.OPEN) ws.send(payload);
//     else ws.onopen = () => ws.send(payload);
//   }, [input, loading, messages, connectWS, ctx]);

//   const handleKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

//   return (
//     <div style={{ position: "fixed", bottom: 120, right: 24, zIndex: 9999, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
//       <style>{`
//         @keyframes daakitFloat {
//           0%,100% { transform: translateY(0); }
//           50%      { transform: translateY(-6px); }
//         }
//         @keyframes daakitOpen {
//           from { opacity:0; transform: scale(0.88) translateY(18px); }
//           to   { opacity:1; transform: scale(1) translateY(0); }
//         }
//         @keyframes daakitDot {
//           0%,80%,100% { transform:translateY(0); opacity:.35; }
//           40%          { transform:translateY(-5px); opacity:1; }
//         }
//         @keyframes daakitOnlinePulse {
//           0%,100% { opacity: 1; transform: scale(1); }
//           50%     { opacity: 0.55; transform: scale(0.82); }
//         }
//         @keyframes daakitPulse {
//           0%  { box-shadow: 0 0 0 0   rgba(4,70,219,.55); }
//           70% { box-shadow: 0 0 0 12px rgba(4,70,219,0); }
//           100%{ box-shadow: 0 0 0 0   rgba(4,70,219,0); }
//         }
//         .dk-input:focus {
//           border-color: ${BRAND} !important;
//           box-shadow: 0 0 0 3px rgba(4,70,219,.12) !important;
//           outline: none;
//         }
//         .dk-send:hover:not(:disabled){ background: ${BRAND_D} !important; transform:scale(1.07); }
//         .dk-send{ transition: background .18s, transform .15s; }
//         .dk-msgs::-webkit-scrollbar{ width:4px; }
//         .dk-msgs::-webkit-scrollbar-thumb{ background:#c7d3ff; border-radius:4px; }
//         .dk-chip:hover{ background:#dde5ff !important; }
//         .dk-action-btn:hover{ background: ${BRAND_D} !important; transform: translateY(-1px); }
//       `}</style>

//       {/* ── Chat window ── */}
//       {open && (
//         <div style={{
//           width: 368, height: 548,
//           background: "#fff", borderRadius: 20,
//           boxShadow: "0 12px 48px rgba(4,70,219,.16), 0 2px 10px rgba(0,0,0,.07)",
//           display: "flex", flexDirection: "column",
//           marginBottom: 14, overflow: "hidden",
//           animation: "daakitOpen .28s cubic-bezier(.34,1.56,.64,1) both",
//         }}>

//           {/* ── HEADER ── */}
//           <div style={{
//             background: "#0446db",
//             backgroundImage: headerBg ? `url(${headerBg})` : undefined,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             backgroundBlendMode: headerBg ? "overlay" : undefined,
//             padding: "0",
//             position: "relative", overflow: "hidden",
//             minHeight: 95,
//             display: "flex", flexDirection: "column",
//           }}>
//             <div style={{
//               display: "flex", alignItems: "flex-end", gap: 10,
//               padding: "14px 14px 0 14px",
//               position: "relative", zIndex: 3, flex: 1,
//             }}>
//               {/* Avatar sitting on the bottom edge of the header, peeking up */}
//               <div style={{ flexShrink: 0, marginBottom: 0 }}>
//                 <AvatarImg size={58} spinning={loading}/>
//               </div>

//               <div style={{ flex: 1, paddingBottom: 14 }}>
//                 <div style={{
//                   position: "relative",
//                   top: -12, left: 0,
//                   color: "#fff", fontWeight: 800, fontSize: 17,
//                   letterSpacing: "-0.01em", lineHeight: 1.2,
//                   textShadow: "0 1px 8px rgba(0,0,0,0.3)",
//                 }}>
//                   DAAKit Assistant
//                 </div>
//                 <div style={{
//                   display: "flex", alignItems: "center", gap: 5, marginTop: 3,
//                 }}>
//                   <div style={{
//                     position: "relative",
//                     top: -12, left: 0,
//                     width: 7, height: 7, borderRadius: "50%",
//                     background: "#4ade80",
//                     boxShadow: "0 0 6px #4ade80",
//                     animation: "daakitOnlinePulse 2s ease-in-out infinite",
//                   }}/>
//                   <span style={{
//                     position: "relative",
//                     top: -12, left: 0,
//                     color: "rgba(255,255,255,0.75)", fontSize: 11.5,
//                     fontWeight: 400, letterSpacing: "0.02em",
//                   }}>Online · Logistics &amp; Fulfillment</span>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setOpen(false)}
//                 style={{
//                   background: "rgba(255,255,255,0.12)",
//                   border: "1px solid rgba(255,255,255,0.22)",
//                   color: "#fff", width: 26, height: 26, borderRadius: "50%",
//                   fontSize: 16, cursor: "pointer",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   flexShrink: 0, transition: "background 0.18s",
//                   lineHeight: 1, alignSelf: "flex-start", marginTop: 2,
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
//                 onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
//               >×</button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="dk-msgs" style={{ flex: 1, overflowY: "auto", padding: "20px 12px 8px" }}>
//             {messages.map((m,i) => <Message key={i} msg={m}/>)}
//             {loading && !messages[messages.length-1]?.streaming && <TypingDots/>}
//             <div ref={bottomRef}/>
//           </div>

//           {/* Quick chips */}
//           {messages.length === 1 && (
//             <div style={{ padding: "0 12px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
//               {["Track shipment","Check ticket status", "Raise a ticket"].map(chip => (
//                 <button key={chip} className="dk-chip" onClick={() => setInput(chip)} style={{
//                   background: "#eef2ff", color: BRAND, border: "1px solid #c7d3ff",
//                   borderRadius: 20, padding: "5px 11px", fontSize: 12,
//                   cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
//                   transition: "background .15s",
//                 }}>{chip}</button>
//               ))}
//             </div>
//           )}

//           {/* Input */}
//           <div style={{
//             padding: "10px 12px", borderTop: "1px solid #eef0ff",
//             display: "flex", gap: 8, alignItems: "flex-end",
//             background: "#fafbff",
//           }}>
//             <textarea
//               className="dk-input"
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={handleKey}
//               placeholder="Ask me anything…"
//               rows={1}
//               style={{
//                 flex: 1, border: "1.5px solid #dde5ff", borderRadius: 14,
//                 padding: "9px 13px", fontSize: 13.5, resize: "none",
//                 fontFamily: "inherit", lineHeight: 1.45,
//                 background: "#fff", color: "#1a1f36",
//                 transition: "border-color .2s, box-shadow .2s",
//               }}
//             />
//             <button
//               className="dk-send"
//               onClick={sendMessage}
//               disabled={!input.trim() || loading}
//               style={{
//                 background: BRAND, color: "#fff", border: "none", borderRadius: "50%",
//                 width: 38, height: 38, cursor: "pointer",
//                 flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
//                 opacity: !input.trim() || loading ? 0.45 : 1,
//               }}
//             >
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
//                 <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ── FAB ── */}
//       <div style={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
//         <button
//           onClick={() => setOpen(o => !o)}
//           style={{
//             width: open ? 44 : 68, height: open ? 44 : 68,
//             borderRadius: open ? "50%" : "0",
//             background: open
//               ? `linear-gradient(135deg, ${BRAND} 0%, #0233ab 100%)`
//               : "transparent",
//             border: "none", cursor: "pointer",
//             boxShadow: open
//               ? "0 4px 16px rgba(4,70,219,.45)"
//               : "none",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             padding: 0,
//             transform: open ? "scale(1)" : "scale(1)",
//             transition: "transform .22s cubic-bezier(0.175, 0.885, 0.32, 1.275), width .22s, height .22s, border-radius .22s, background .22s",
//           }}
//           onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
//           onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
//           title="Chat with DAAKit Assistant"
//         >
//           {open
//             ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                 <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
//               </svg>
//             : <HomeBotAvatar size={68} spinning={loading}/>
//           }
//         </button>

//         {!open && messages.length > 1 && (
//           <div style={{
//             position: "absolute", bottom:95, right: -8,
//             width: 8, height: 8, borderRadius: "50%",
//             background: "#4ade80",
//           }}/>
//         )}
//       </div>
//     </div>
//   );
// }




import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import logo from "../../assets/Chatbot_homescreen_logo.svg";
import logo2 from "../../assets/Chatbot_in_chat_logo.svg";
import headerBg from "../../assets/chatbot_header_bg.png";

const API_BASE = "https://aiassistant.daakit.com";
const WS_BASE = API_BASE.replace(/^https/, "wss");

const BRAND = "#0446db";
const BRAND_D = "#0336b0";

const WELCOME_MSG = {
  role: "model",
  content:
    "Hi! I'm DAAKit Assistant 👋 I can help you with shipment tracking, NDR resolution, COD wallet, freight quotes, and more. What can I help you with today?",
};

function getHostContext() {
  return window.__DAAKIT_CTX__ || {};
}

/* =========================================================
   CHAT AVATAR
========================================================= */

function AvatarImg({
  size = 30,
  spinning = false,
}) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {spinning && (
        <div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            background:
              "conic-gradient(rgba(255,255,255,.95) 0deg, rgba(255,255,255,0) 240deg)",
            animation: "daakitSpin .85s linear infinite",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      <img
        src={logo2}
        alt="DAAKit Assistant"
        style={{
          width: size,
          height: size,
          border: "2px solid #fff",
          borderRadius: "50%",
          objectFit: "contain",
          display: "block",
          position: "relative",
          zIndex: 1,
          animation:
            "daakitFloat 3s ease-in-out infinite",
          filter:
            "drop-shadow(0 6px 14px rgba(4,30,100,.28))",
        }}
      />
    </div>
  );
}

/* =========================================================
   HOME FLOATING LOGO
========================================================= */

function HomeLogo({
  size = 58,
  spinning = false,
}) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {spinning && (
        <div
          style={{
            position: "absolute",
            inset: -3,
            borderRadius: "50%",
            background:
              "conic-gradient(rgba(4,70,219,.75) 0deg, rgba(4,70,219,0) 240deg)",
            animation: "daakitSpin .85s linear infinite",
            pointerEvents: "none",
          }}
        />
      )}

      <img
        src={logo}
        alt="DAAKit Assistant"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          display: "block",
          position: "relative",
          zIndex: 1,
          filter:
            "drop-shadow(0 6px 14px rgba(4,30,100,.28))",
        }}
      />
    </div>
  );
}

/* =========================================================
   BOT AVATAR
========================================================= */

function BotAvatar() {
  return (
    <div
      style={{
        flexShrink: 0,
        marginRight: 6,
        alignSelf: "flex-end",
        marginBottom: 2,
      }}
    >
      <AvatarImg size={30} />
    </div>
  );
}

/* =========================================================
   MESSAGE ACTIONS
========================================================= */

function MessageActions({ actions }) {
  if (!actions?.length) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 8,
      }}
    >
      {actions.map((action, index) => {
        if (
          action.type !==
          "redirect_button"
        ) {
          return null;
        }

        return (
          <button
            key={index}
            type="button"
            className="dk-action-btn"
            onClick={() =>
              window.open(
                action.url,
                "_blank",
                "noopener,noreferrer"
              )
            }
            style={{
              background: BRAND,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "9px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition:
                "background .15s, transform .15s",
            }}
          >
            {action.label || "Continue"}

            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7 17L17 7M17 7H9M17 7V15"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   MESSAGE
========================================================= */

function Message({ msg }) {
  const isUser =
    msg.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser
          ? "flex-end"
          : "flex-start",
        alignItems: "flex-end",
        marginBottom: 12,
      }}
    >
      {!isUser && <BotAvatar />}

      <div
        style={{
          maxWidth: "76%",
          background: isUser
            ? BRAND
            : "#eef2ff",
          color: isUser
            ? "#fff"
            : "#1a1f36",
          borderRadius: isUser
            ? "18px 18px 4px 18px"
            : "18px 18px 18px 4px",
          padding: "10px 14px",
          fontSize: 13.5,
          lineHeight: 1.55,
          border: isUser
            ? "none"
            : "1px solid #d4ddff",
          wordBreak: "break-word",
        }}
      >
        {isUser ? (
          <span
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {msg.content}
          </span>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p
                  style={{
                    margin: "0 0 6px",
                  }}
                >
                  {children}
                </p>
              ),

              pre: ({ children }) => (
                <pre
                  style={{
                    background: "#1a1f36",
                    color: "#e2e8f0",
                    borderRadius: 8,
                    padding: "10px 12px",
                    overflowX: "auto",
                    fontSize: 12.5,
                    margin: "6px 0",
                  }}
                >
                  {children}
                </pre>
              ),

              code: ({
                inline,
                children,
              }) =>
                inline ? (
                  <code
                    style={{
                      background: "#d4ddff",
                      color: "#1a1f36",
                      borderRadius: 4,
                      padding: "1px 5px",
                      fontSize: 12.5,
                    }}
                  >
                    {children}
                  </code>
                ) : (
                  <code>
                    {children}
                  </code>
                ),

              ul: ({ children }) => (
                <ul
                  style={{
                    margin: "4px 0",
                    paddingLeft: 18,
                  }}
                >
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol
                  style={{
                    margin: "4px 0",
                    paddingLeft: 18,
                  }}
                >
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li
                  style={{
                    marginBottom: 2,
                  }}
                >
                  {children}
                </li>
              ),

              a: ({
                href,
                children,
              }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#4361ee",
                    textDecoration:
                      "underline",
                  }}
                >
                  {children}
                </a>
              ),
            }}
          >
            {msg.content}
          </ReactMarkdown>
        )}

        {msg.streaming && (
          <span
            style={{
              opacity: 0.4,
              marginLeft: 2,
            }}
          >
            ▋
          </span>
        )}

        {!isUser &&
          !msg.streaming && (
            <MessageActions
              actions={msg.actions}
            />
          )}
      </div>
    </div>
  );
}

/* =========================================================
   TYPING DOTS
========================================================= */

function TypingDots() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        marginBottom: 12,
      }}
    >
      <BotAvatar />

      <div
        style={{
          background: "#eef2ff",
          border:
            "1px solid #d4ddff",
          borderRadius:
            "18px 18px 18px 4px",
          padding: "12px 16px",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map(
          (index) => (
            <div
              key={index}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: BRAND,
                animation: `daakitDot 1s ease-in-out ${
                  index * 0.18
                }s infinite`,
              }}
            />
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CHAT WIDGET
========================================================= */

export default function ChatWidget() {
  const [open, setOpen] =
    useState(false);

  const [
    messages,
    setMessages,
  ] = useState([WELCOME_MSG]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [pulse, setPulse] =
    useState(false);

  const wsRef = useRef(null);
  const bottomRef =
    useRef(null);

  const ctx = getHostContext();

  /* =====================================================
     AUTO SCROLL
  ===================================================== */

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  /* =====================================================
     NEW MESSAGE PULSE
  ===================================================== */

  useEffect(() => {
    const lastMessage =
      messages[
        messages.length - 1
      ];

    if (
      !open &&
      lastMessage?.role ===
        "model" &&
      messages.length > 1
    ) {
      setPulse(true);

      const timer =
        setTimeout(() => {
          setPulse(false);
        }, 2200);

      return () =>
        clearTimeout(timer);
    }
  }, [messages, open]);

  /* =====================================================
     WEBSOCKET
  ===================================================== */

  const connectWS =
    useCallback(() => {
      if (
        wsRef.current
          ?.readyState ===
        WebSocket.OPEN
      ) {
        return wsRef.current;
      }

      const ws =
        new WebSocket(
          `${WS_BASE}/api/v1/ws/chat`
        );

      wsRef.current = ws;

      ws.onmessage = (
        event
      ) => {
        try {
          const data =
            JSON.parse(
              event.data
            );

          if (
            data.type ===
            "chunk"
          ) {
            setMessages(
              (prev) => {
                const last =
                  prev[
                    prev.length -
                      1
                  ];

                if (
                  last?.streaming
                ) {
                  return [
                    ...prev.slice(
                      0,
                      -1
                    ),
                    {
                      ...last,
                      content:
                        last.content +
                        (
                          data.text ||
                          ""
                        ),
                    },
                  ];
                }

                return [
                  ...prev,
                  {
                    role:
                      "model",
                    content:
                      data.text ||
                      "",
                    streaming:
                      true,
                  },
                ];
              }
            );
          }

          if (
            data.type ===
            "done"
          ) {
            setMessages(
              (prev) => {
                const last =
                  prev[
                    prev.length -
                      1
                  ];

                if (
                  last?.streaming
                ) {
                  return [
                    ...prev.slice(
                      0,
                      -1
                    ),
                    {
                      ...last,
                      streaming:
                        false,
                      content:
                        last.content +
                        (
                          data.text ||
                          ""
                        ),
                      actions:
                        data.actions ||
                        last.actions ||
                        [],
                    },
                  ];
                }

                if (
                  data.text
                ) {
                  return [
                    ...prev,
                    {
                      role:
                        "model",
                      content:
                        data.text,
                      actions:
                        data.actions ||
                        [],
                    },
                  ];
                }

                return prev;
              }
            );

            setLoading(false);
          }

          if (
            data.type ===
            "error"
          ) {
            setMessages(
              (prev) => [
                ...prev,
                {
                  role:
                    "model",
                  content:
                    data.text ||
                    "Something went wrong.",
                },
              ]
            );

            setLoading(false);
          }
        } catch (error) {
          console.error(
            "WebSocket parse error:",
            error
          );

          setLoading(false);
        }
      };

      ws.onerror = (
        error
      ) => {
        console.error(
          "WebSocket error:",
          error
        );

        setLoading(false);
      };

      ws.onclose = () => {
        wsRef.current =
          null;
      };

      return ws;
    }, []);

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const sendMessage =
    useCallback(async () => {
      const text =
        input.trim();

      if (!text || loading) {
        return;
      }

      const history =
        messages.map(
          (message) => ({
            role:
              message.role,
            content:
              message.content,
          })
        );

      setMessages(
        (prev) => [
          ...prev,
          {
            role: "user",
            content: text,
          },
        ]
      );

      setInput("");
      setLoading(true);

      const ws =
        connectWS();

      const payload =
        JSON.stringify({
          message: text,
          history,

          merchant_id:
            ctx.merchant_id ||
            null,

          auth_token:
            ctx.auth_token ||
            null,

          site:
            ctx.site ||
            window.location
              .hostname,
        });

      if (
        ws.readyState ===
        WebSocket.OPEN
      ) {
        ws.send(payload);
      } else {
        ws.onopen = () => {
          ws.send(payload);
        };
      }
    }, [
      input,
      loading,
      messages,
      connectWS,
      ctx,
    ]);

  /* =====================================================
     ENTER SEND
  ===================================================== */

  const handleKey = (
    event
  ) => {
    if (
      event.key ===
        "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  const quickChips = [
    "Track shipment",
    "Check ticket status",
    "Raise a ticket",
  ];

  return (
    <div
      className={`daakit-widget-root ${
        open
          ? "dk-widget-open"
          : "dk-widget-closed"
      }`}
      style={{
        position: "fixed",
        zIndex: 9999,

        fontFamily:
          "'Segoe UI', system-ui, sans-serif",

        ...(open
          ? {
              right: 24,
              bottom: 24,
              top: "auto",
              transform:
                "none",
            }
          : {
              right: 8,
              top: "50%",
              bottom: "auto",
              transform:
                "translateY(-50%)",
            }),
      }}
    >
      {/* =================================================
          GLOBAL CSS
      ================================================= */}

      <style>{`
        @keyframes daakitFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes daakitOpen {
          from {
            opacity: 0;
            transform: scale(.9) translateY(18px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes daakitDot {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: .35;
          }

          40% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        @keyframes daakitOnlinePulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: .55;
            transform: scale(.82);
          }
        }

        @keyframes daakitPulse {
          0% {
            box-shadow:
              0 0 0 0 rgba(4,70,219,.5);
          }

          70% {
            box-shadow:
              0 0 0 12px rgba(4,70,219,0);
          }

          100% {
            box-shadow:
              0 0 0 0 rgba(4,70,219,0);
          }
        }

        @keyframes daakitSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .dk-input:focus {
          border-color: ${BRAND} !important;

          box-shadow:
            0 0 0 3px rgba(4,70,219,.12) !important;

          outline: none;
        }

        .dk-send {
          transition:
            background .18s,
            transform .15s;
        }

        .dk-send:hover:not(:disabled) {
          background:
            ${BRAND_D} !important;

          transform:
            scale(1.06);
        }

        .dk-msgs::-webkit-scrollbar {
          width: 4px;
        }

        .dk-msgs::-webkit-scrollbar-thumb {
          background:
            #c7d3ff;

          border-radius:
            4px;
        }

        .dk-chip:hover {
          background:
            #dde5ff !important;
        }

        .dk-action-btn:hover {
          background:
            ${BRAND_D} !important;

          transform:
            translateY(-1px);
        }

        .dk-widget-closed {
          transition:
            top .25s ease,
            right .25s ease,
            bottom .25s ease;
        }

        /*
         * MOBILE
         *
         * Mobile par right-center nahi rakhenge
         * kyunki thumb / content issue ho sakta hai.
         *
         * Bottom controls se upar 90px rahega.
         */
        @media (max-width: 640px) {
          .dk-widget-closed {
            top: auto !important;
            right: 10px !important;
            bottom: 90px !important;
            transform: none !important;
          }

          .dk-widget-open {
            top: auto !important;
            right: 10px !important;
            bottom: 10px !important;
            transform: none !important;
          }

          .daakit-chat-window {
            width:
              calc(100vw - 20px) !important;

            height:
              min(
                620px,
                calc(100dvh - 85px)
              ) !important;

            max-height:
              calc(100dvh - 85px) !important;

            border-radius:
              18px !important;
          }
        }
      `}</style>

      {/* =================================================
          OPEN CHAT WINDOW
      ================================================= */}

      {open && (
        <div
          className="daakit-chat-window"
          style={{
            width: 368,
            height: 548,

            background:
              "#fff",

            borderRadius:
              20,

            boxShadow:
              "0 12px 48px rgba(4,70,219,.16), 0 2px 10px rgba(0,0,0,.07)",

            display:
              "flex",

            flexDirection:
              "column",

            marginBottom:
              14,

            overflow:
              "hidden",

            animation:
              "daakitOpen .28s cubic-bezier(.34,1.56,.64,1) both",
          }}
        >
          {/* =============================================
              HEADER
          ============================================= */}

          <div
            style={{
              background:
                BRAND,

              backgroundImage:
                headerBg
                  ? `url(${headerBg})`
                  : undefined,

              backgroundSize:
                "cover",

              backgroundPosition:
                "center",

              position:
                "relative",

              overflow:
                "hidden",

              minHeight:
                94,

              display:
                "flex",

              flexDirection:
                "column",
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: 12,

                padding:
                  "14px",

                position:
                  "relative",

                zIndex: 3,

                flex: 1,
              }}
            >
              {/* AVATAR */}

              <div
                style={{
                  flexShrink:
                    0,
                }}
              >
                <AvatarImg
                  size={58}
                  spinning={
                    loading
                  }
                />
              </div>

              {/* TITLE */}

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    color:
                      "#fff",

                    fontWeight:
                      800,

                    fontSize:
                      17,

                    letterSpacing:
                      "-.01em",

                    lineHeight:
                      1.2,

                    textShadow:
                      "0 1px 8px rgba(0,0,0,.25)",
                  }}
                >
                  DAAKit Assistant
                </div>

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: 6,

                    marginTop:
                      5,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,

                      borderRadius:
                        "50%",

                      background:
                        "#4ade80",

                      boxShadow:
                        "0 0 6px #4ade80",

                      animation:
                        "daakitOnlinePulse 2s ease-in-out infinite",
                    }}
                  />

                  <span
                    style={{
                      color:
                        "rgba(255,255,255,.78)",

                      fontSize:
                        11.5,

                      fontWeight:
                        400,

                      letterSpacing:
                        ".02em",
                    }}
                  >
                    Online · Logistics &amp;
                    Fulfillment
                  </span>
                </div>
              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                style={{
                  width: 30,
                  height: 30,

                  borderRadius:
                    "50%",

                  background:
                    "rgba(255,255,255,.12)",

                  border:
                    "1px solid rgba(255,255,255,.22)",

                  color:
                    "#fff",

                  cursor:
                    "pointer",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  flexShrink:
                    0,

                  fontSize:
                    18,

                  lineHeight:
                    1,

                  transition:
                    "background .18s",
                }}
                onMouseEnter={(
                  event
                ) => {
                  event.currentTarget.style.background =
                    "rgba(255,255,255,.25)";
                }}
                onMouseLeave={(
                  event
                ) => {
                  event.currentTarget.style.background =
                    "rgba(255,255,255,.12)";
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* =============================================
              MESSAGES
          ============================================= */}

          <div
            className="dk-msgs"
            style={{
              flex: 1,

              overflowY:
                "auto",

              padding:
                "18px 12px 8px",

              background:
                "#fff",
            }}
          >
            {messages.map(
              (message, index) => (
                <Message
                  key={index}
                  msg={message}
                />
              )
            )}

            {loading &&
              !messages[
                messages.length -
                  1
              ]?.streaming && (
                <TypingDots />
              )}

            <div
              ref={bottomRef}
            />
          </div>

          {/* =============================================
              QUICK BUTTONS
          ============================================= */}

          {messages.length ===
            1 && (
            <div
              style={{
                padding:
                  "0 12px 10px",

                display:
                  "flex",

                gap: 6,

                flexWrap:
                  "wrap",
              }}
            >
              {quickChips.map(
                (chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="dk-chip"
                    onClick={() =>
                      setInput(
                        chip
                      )
                    }
                    style={{
                      background:
                        "#eef2ff",

                      color:
                        BRAND,

                      border:
                        "1px solid #c7d3ff",

                      borderRadius:
                        20,

                      padding:
                        "6px 11px",

                      fontSize:
                        12,

                      cursor:
                        "pointer",

                      fontFamily:
                        "inherit",

                      fontWeight:
                        500,

                      transition:
                        "background .15s",
                    }}
                  >
                    {chip}
                  </button>
                )
              )}
            </div>
          )}

          {/* =============================================
              INPUT
          ============================================= */}

          <div
            style={{
              padding:
                "10px 12px",

              borderTop:
                "1px solid #eef0ff",

              display:
                "flex",

              gap: 8,

              alignItems:
                "flex-end",

              background:
                "#fafbff",
            }}
          >
            <textarea
              className="dk-input"
              value={input}
              onChange={(event) =>
                setInput(
                  event.target
                    .value
                )
              }
              onKeyDown={
                handleKey
              }
              placeholder="Ask me anything…"
              rows={1}
              style={{
                flex: 1,

                minHeight:
                  40,

                maxHeight:
                  100,

                border:
                  "1.5px solid #dde5ff",

                borderRadius:
                  14,

                padding:
                  "9px 13px",

                fontSize:
                  13.5,

                resize:
                  "none",

                fontFamily:
                  "inherit",

                lineHeight:
                  1.45,

                background:
                  "#fff",

                color:
                  "#1a1f36",

                transition:
                  "border-color .2s, box-shadow .2s",
              }}
            />

            <button
              type="button"
              className="dk-send"
              onClick={
                sendMessage
              }
              disabled={
                !input.trim() ||
                loading
              }
              style={{
                width: 40,
                height: 40,

                borderRadius:
                  "50%",

                background:
                  BRAND,

                color:
                  "#fff",

                border:
                  "none",

                cursor:
                  !input.trim() ||
                  loading
                    ? "not-allowed"
                    : "pointer",

                flexShrink:
                  0,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                opacity:
                  !input.trim() ||
                  loading
                    ? 0.45
                    : 1,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M22 2L11 13"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          FLOATING BUTTON
      ================================================= */}

      <div
        style={{
          position:
            "relative",

          display:
            "flex",

          justifyContent:
            "flex-end",

          alignItems:
            "center",
        }}
      >
        <button
          type="button"
          onClick={() =>
            setOpen(
              (previous) =>
                !previous
            )
          }
          title="Chat with DAAKit Assistant"
          style={{
            width: open
              ? 48
              : 58,

            height: open
              ? 48
              : 58,

            borderRadius:
              "50%",

            background:
              open
                ? `linear-gradient(
                    135deg,
                    ${BRAND} 0%,
                    #0233ab 100%
                  )`
                : "transparent",

            border: "none",

            cursor:
              "pointer",

            boxShadow:
              open
                ? "0 6px 20px rgba(4,70,219,.35)"
                : "none",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            padding: 0,

            animation:
              pulse &&
              !open
                ? "daakitPulse 1.2s ease-out"
                : "none",

            transition:
              "transform .2s ease, width .2s ease, height .2s ease",
          }}
          onMouseEnter={(
            event
          ) => {
            event.currentTarget.style.transform =
              "scale(1.06)";
          }}
          onMouseLeave={(
            event
          ) => {
            event.currentTarget.style.transform =
              "scale(1)";
          }}
        >
          {open ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <HomeLogo
              size={58}
              spinning={
                loading
              }
            />
          )}
        </button>

        {/* NEW MESSAGE DOT */}

        {!open &&
          messages.length >
            1 && (
            <div
              style={{
                position:
                  "absolute",

                top: 1,

                right: 1,

                width: 10,

                height: 10,

                borderRadius:
                  "50%",

                background:
                  "#4ade80",

                border:
                  "2px solid #fff",

                boxShadow:
                  "0 2px 6px rgba(0,0,0,.16)",

                pointerEvents:
                  "none",
              }}
            />
          )}
      </div>
    </div>
  );
}