import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_WIDGET_BASE;
const STORAGE_KEY = 'daakit_pincode';
const STORAGE_KEY_API = 'daakit_api_key';
const VALID_DELIVERY_TYPES = new Set(['same_day', 'next_day', 'standard', 'unavailable']);

function toSafeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeEtaResponse(data) {
  if (!data || typeof data !== 'object') return null;

  const deliveryType = toSafeString(data.delivery_type);
  if (!VALID_DELIVERY_TYPES.has(deliveryType)) return null;

  const deliverBy = toSafeString(data.deliver_by);
  const readable =
    data.time_remaining && typeof data.time_remaining === 'object'
      ? toSafeString(data.time_remaining.readable)
      : '';

  return {
    delivery_type: deliveryType,
    deliver_by: deliverBy,
    time_remaining: readable ? { readable } : null,
  };
}

export function useEta(apiKey = '') {
  const [pincode, setPincode] = useState('');
  const [result,  setResult]  = useState(null);
  const [status,  setStatus]  = useState('idle');
  // idle | loading | success | unavailable | error

  // On mount: restore saved pincode and re-fetch if we have a key
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPincode(saved);
      if (apiKey) fetchEta(saved, apiKey);  // only fetch if key is present
    }
  }, [apiKey]); // re-runs when key becomes available after generation

  async function fetchEta(pin, keyOverride) {
    if (!/^\d{6}$/.test(pin)) return;
    setStatus('loading');
    setResult(null);

    // keyOverride is passed explicitly on auto-fetch; fallback to localStorage
    // for manual checks where no override is passed
    const resolvedKey = keyOverride || localStorage.getItem(STORAGE_KEY_API) || '';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch(`${API_BASE}?pincode=${pin}`, {
        signal: controller.signal,
        headers: resolvedKey ? { 'x-api-key': resolvedKey } : undefined,
      });
      clearTimeout(timeout);

      if (res.status === 401) {
        // Key missing or invalid — stay idle, don't show error to end-user
        setStatus('idle');
        return;
      }

      if (!res.ok) {
        setStatus('error');
        return;
      }

      const data = sanitizeEtaResponse(await res.json());
      if (!data) {
        setStatus('error');
        return;
      }

      localStorage.setItem(STORAGE_KEY, pin);

      if (data.delivery_type === 'unavailable') {
        setStatus('unavailable');
        setResult(data); // keep result so the widget can show the pincode in resultRow
        return;
      }

      setResult(data);
      setStatus('success');
    } catch {
      clearTimeout(timeout);
      setStatus('error');
    }
  }

  function handleCheck() { fetchEta(pincode); }

  function handleReset() {
    setPincode('');
    setResult(null);
    setStatus('idle');
    localStorage.removeItem(STORAGE_KEY);
  }

  return { pincode, setPincode, result, status, handleCheck, handleReset };
}