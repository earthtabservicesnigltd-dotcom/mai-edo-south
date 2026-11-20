
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const envVars = {};
env.split('\n').forEach(l => {
  const parts = l.split('=');
  const k = parts[0];
  const v = parts.slice(1).join('=');
  if (k && v) envVars[k.trim()] = v.trim().replace(/^["']|["']$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('id', '41fb948b-d0b6-48c7-a50b-44851f95cb50')
    .single();

  console.log('DATA:', data);
  if (error) console.log('ERROR:', error);
}

run();
