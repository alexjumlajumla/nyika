import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser(email: string, password: string, fullName: string) {
  try {
    // 1. Create the auth user
    console.log('Creating admin user...');
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation for admin
      user_metadata: { role: 'admin' },
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('No user returned from auth');

    console.log('Auth user created, creating profile...');

    // 2. Create the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) throw profileError;

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', authData.user.id);
    
    return authData.user;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

// Get admin email and password from command line arguments or use defaults
const adminEmail = process.argv[2] || 'admin@nyikasafaris.com';
const adminPassword = process.argv[3] || 'NyikaAdmin2024!';
const adminName = process.argv[4] || 'Admin User';

// Run the script
createAdminUser(adminEmail, adminPassword, adminName)
  .then(() => {
    console.log('✅ Admin setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Admin setup failed:', error);
    process.exit(1);
  });
