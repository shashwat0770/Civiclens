import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Keep-Alive] Running keep-alive check at:', new Date().toISOString());

    // Perform a lightweight DB query to keep the project active
    const { data, error } = await supabase
      .from('complaints')
      .select('id')
      .limit(1);

    if (error) {
      console.error('[Keep-Alive] Database query error:', error);
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: error.message,
          time: new Date().toISOString() 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('[Keep-Alive] Success - project is active');

    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: 'Keep-alive successful',
        time: new Date().toISOString(),
        recordsChecked: data?.length || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (err) {
    console.error('[Keep-Alive] Unexpected error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: errorMessage,
        time: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
