import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://imeadfnlgzphumuawdyt.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZWFkZm5sZ3pwaHVtdWF3ZHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTgyOTAsImV4cCI6MjA5Njc3NDI5MH0.SGPJajfqa3B3x9KDalSaux1RLDSoxdoF0LCmqLVfZMY";

const backendClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testSchemaPattern() {
  console.log("Testing .schema('mlm').from('distribuidores') pattern...");
  
  const { data, error } = await backendClient
    .schema('mlm')
    .from('distribuidores')
    .select('*')
    .limit(1);

  console.log("Error:", error);
  console.log("Data:", data);

  if (error) {
    console.error("❌ Test failed - pattern doesn't work");
    process.exit(1);
  } else {
    console.log("✅ Test passed - pattern works correctly");
    process.exit(0);
  }
}

testSchemaPattern();
