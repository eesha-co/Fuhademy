/**
 * ============================================
 * JUANOVA CORTEX - SUPABASE BOOTSTRAP
 * Initializes Supabase client for the application
 * ============================================
 * 
 * This file must be loaded AFTER the inline script that sets:
 * - window.SUPABASE_URL
 * - window.SUPABASE_ANON_KEY
 */

(function() {
    'use strict';
    
    console.log('🔧 Supabase Bootstrap: Starting...');
    
    // Check if credentials are defined
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
        console.error('❌ Supabase Bootstrap: SUPABASE_URL or SUPABASE_ANON_KEY not defined!');
        console.error('Make sure to set window.SUPABASE_URL and window.SUPABASE_ANON_KEY before loading this script.');
        return;
    }
    
    console.log('✅ Supabase Bootstrap: Credentials found');
    console.log('   URL:', window.SUPABASE_URL);
    
    // Initialize Supabase using ES modules (more reliable)
    async function initSupabase() {
        try {
            console.log('🔧 Supabase Bootstrap: Loading Supabase library...');
            
            // Import Supabase from CDN using ES modules
            const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
            
            console.log('✅ Supabase Bootstrap: Library loaded from esm.sh');
            
            // Create the client
            console.log('🔧 Supabase Bootstrap: Creating client...');
            
            const client = createClient(
                window.SUPABASE_URL,
                window.SUPABASE_ANON_KEY,
                {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: true
                    }
                }
            );
            
            // Store globally
            window.supabaseClient = client;
            
            // Also store the createClient function for fallback
            window.supabaseCreateClient = createClient;
            
            console.log('✅ Supabase Bootstrap: Client created successfully!');
            
            // Check if user is authenticated
            const { data: { user }, error } = await client.auth.getUser();
            
            if (error) {
                console.log('ℹ️ Supabase Bootstrap: No authenticated user or session expired');
                console.log('   Error:', error.message);
            } else if (user) {
                console.log('✅ Supabase Bootstrap: User authenticated:', user.email);
            } else {
                console.log('ℹ️ Supabase Bootstrap: No user session found');
            }
            
            // Dispatch event to notify other scripts that Supabase is ready
            window.dispatchEvent(new CustomEvent('supabaseReady', { 
                detail: { 
                    client: client,
                    user: user 
                } 
            }));
            
            return client;
            
        } catch (err) {
            console.error('❌ Supabase Bootstrap: Initialization failed:', err);
            
            // Try fallback with older CDN
            try {
                console.log('🔧 Supabase Bootstrap: Trying fallback CDN...');
                
                // Load script synchronously
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.min.js';
                script.async = false;
                
                document.head.appendChild(script);
                
                // Wait for it to load
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });
                
                // Check for global supabase object
                if (window.supabase && window.supabase.createClient) {
                    const client = window.supabase.createClient(
                        window.SUPABASE_URL,
                        window.SUPABASE_ANON_KEY
                    );
                    
                    window.supabaseClient = client;
                    
                    console.log('✅ Supabase Bootstrap: Client created via fallback!');
                    
                    window.dispatchEvent(new CustomEvent('supabaseReady', { 
                        detail: { client: client } 
                    }));
                    
                    return client;
                }
            } catch (fallbackErr) {
                console.error('❌ Supabase Bootstrap: Fallback also failed:', fallbackErr);
            }
            
            // Dispatch error event
            window.dispatchEvent(new CustomEvent('supabaseError', { 
                detail: { error: err } 
            }));
            
            throw err;
        }
    }
    
    // Start initialization
    initSupabase().catch(err => {
        console.error('Supabase initialization error:', err);
    });
    
    // Expose init function for manual re-initialization if needed
    window.initSupabase = initSupabase;
    
})();
