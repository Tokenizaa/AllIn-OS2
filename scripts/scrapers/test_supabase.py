"""
Test script to verify Supabase connection.
"""

import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
project_root = Path(__file__).parent.parent.parent
load_dotenv(project_root / ".env")

# Add scrapers directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from supabase import create_client

print("Testing Supabase connection...")

# Get configuration
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    print("✗ Missing Supabase configuration in .env")
    print(f"  SUPABASE_URL: {supabase_url}")
    print(f"  SUPABASE_KEY: {supabase_key}")
    sys.exit(1)

print(f"✓ Configuration loaded")
print(f"  URL: {supabase_url}")
print(f"  Key: {supabase_key[:20]}...")

try:
    print("\n✓ Connecting to Supabase...")
    client = create_client(supabase_url, supabase_key)
    print("  ✓ Client created successfully")
except Exception as e:
    print(f"  ✗ Error creating client: {e}")
    sys.exit(1)

try:
    print("\n✓ Testing connection with simple query...")
    # Try to query a simple table to test connection
    result = client.table("produtos").select("*").limit(1).execute()
    print(f"  ✓ Query successful, returned {len(result.data)} records")
except Exception as e:
    print(f"  ✗ Error querying produtos: {e}")
    print("  Note: This is expected if produtos table doesn't exist yet")

try:
    print("\n✓ Testing pedidos table...")
    result = client.table("pedidos").select("*").limit(1).execute()
    print(f"  ✓ Query successful, returned {len(result.data)} records")
except Exception as e:
    print(f"  ✗ Error querying pedidos: {e}")
    print("  Note: This is expected if pedidos table doesn't exist yet")

try:
    print("\n✓ Testing planos table...")
    result = client.table("planos").select("*").limit(1).execute()
    print(f"  ✓ Query successful, returned {len(result.data)} records")
except Exception as e:
    print(f"  ✗ Error querying planos: {e}")
    print("  Note: This is expected if planos table doesn't exist yet")

print("\n✅ Supabase connection test completed!")
print("\nNext steps:")
print("1. Test scraping (1 page)")
