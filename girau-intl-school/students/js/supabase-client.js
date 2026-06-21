// Lightweight Supabase client factory used across pages
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

export function initSupabase(url, key) {
	if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
	return createClient(url, key);
}

// Convenience: export a cached client if the same url/key are requested repeatedly.
const _clients = new Map();
export function getOrCreateClient(url, key) {
	const cacheKey = `${url}::${key}`;
	if (_clients.has(cacheKey)) return _clients.get(cacheKey);
	const client = initSupabase(url, key);
	_clients.set(cacheKey, client);
	return client;
}
