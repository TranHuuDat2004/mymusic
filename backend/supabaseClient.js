// backend/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('WARNING: SUPABASE_URL hoặc SUPABASE_KEY không được khai báo trong file .env!');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false // Vì chạy trên Node.js backend
    },
    realtime: {
        transport: ws
    }
});

module.exports = supabase;
