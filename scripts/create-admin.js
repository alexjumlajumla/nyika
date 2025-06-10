require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  const email = 'admin@nyikasafaris.com';
  const password = 'Admin@1234';
  const fullName = 'Admin User';

  try {
    console.log('Creating admin user...');
    
    // Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: fullName,
        role: 'admin',
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
