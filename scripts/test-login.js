const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🧪 Testing Admin Login Credentials...\n');
    
    const response = await fetch('http://localhost:3000/api/test-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'alpsingh03@gmail.com',
        password: 'Aa2275aA'
      })
    });
    
    const result = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(result, null, 2));
    
    if (result.success && result.passwordValid) {
      console.log('\n✅ Admin login credentials are working!');
      console.log(`✅ User role: ${result.user.role}`);
      console.log(`✅ User email: ${result.user.email}`);
    } else {
      console.log('\n❌ Login failed');
      console.log('❌ Reason:', result.message || result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('   npm run dev');
  }
}

async function testDemoLogin() {
  try {
    console.log('\n🧪 Testing Demo User Login Credentials...\n');
    
    const response = await fetch('http://localhost:3000/api/test-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@example.com',
        password: 'demo123'
      })
    });
    
    const result = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(result, null, 2));
    
    if (result.success && result.passwordValid) {
      console.log('\n✅ Demo user login credentials are working!');
      console.log(`✅ User role: ${result.user.role}`);
      console.log(`✅ User email: ${result.user.email}`);
    } else {
      console.log('\n❌ Demo login failed');
      console.log('❌ Reason:', result.message || result.error);
    }
    
  } catch (error) {
    console.error('❌ Demo test failed:', error.message);
  }
}

async function main() {
  await testLogin();
  await testDemoLogin();
  
  console.log('\n📋 Manual Testing Steps:');
  console.log('1. Visit: http://localhost:3000/auth/login');
  console.log('2. Try admin login: alpsingh03@gmail.com / Aa2275aA');
  console.log('3. Should redirect to: /dashboard/admin');
  console.log('4. Try Google OAuth with alpsingh03@gmail.com');
  console.log('5. Try demo login: demo@example.com / demo123');
  console.log('6. Should redirect to: /dashboard/home');
}

main().catch(console.error);
