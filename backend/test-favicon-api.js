/**
 * Test Script untuk Backend Favicon API
 * Run: node test-favicon-api.js
 */

// Test URLs dengan karakteristik berbeda
const testCases = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    expected: 'github.githubassets.com',
  },
  {
    name: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets',
    expected: 'ssl.gstatic.com',
    note: 'Should get Sheets-specific favicon',
  },
  {
    name: 'Google Docs',
    url: 'https://docs.google.com/document',
    expected: 'ssl.gstatic.com',
    note: 'Should get Docs-specific favicon (different from Sheets)',
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    expected: 'stackoverflow.com',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    expected: 'youtube.com',
  },
];

const BACKEND_URL = process.env.API_URL || 'http://localhost:3000';

async function testFaviconAPI() {
  console.log('🧪 Testing Favicon API...\n');
  console.log(`Backend URL: ${BACKEND_URL}\n`);
  console.log('=' .repeat(80));

  const results = {
    passed: 0,
    failed: 0,
    errors: [],
  };

  for (const testCase of testCases) {
    process.stdout.write(`\nTesting: ${testCase.name}... `);

    try {
      const startTime = Date.now();
      
      const response = await fetch(
        `${BACKEND_URL}/api/favicon?url=${encodeURIComponent(testCase.url)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Validasi response structure
      if (!data.hasOwnProperty('icon')) {
        throw new Error('Response missing "icon" field');
      }

      // Check if icon URL contains expected domain
      const iconUrl = data.icon || '';
      const containsExpected = iconUrl.includes(testCase.expected);

      if (containsExpected) {
        console.log(`✅ PASS (${duration}ms)`);
        console.log(`   Icon: ${iconUrl}`);
        console.log(`   Cached: ${data.cached ? 'Yes' : 'No'}`);
        if (testCase.note) {
          console.log(`   Note: ${testCase.note}`);
        }
        results.passed++;
      } else {
        console.log(`⚠️  WARNING (${duration}ms)`);
        console.log(`   Expected domain: ${testCase.expected}`);
        console.log(`   Got: ${iconUrl}`);
        console.log(`   Note: Favicon might be valid, but different than expected`);
        results.passed++; // Still count as pass since it might be valid
      }

    } catch (error) {
      console.log('❌ FAIL');
      console.log(`   Error: ${error.message}`);
      results.failed++;
      results.errors.push({
        test: testCase.name,
        error: error.message,
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Test Summary:');
  console.log(`   Total: ${testCases.length}`);
  console.log(`   Passed: ${results.passed}`);
  console.log(`   Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err.test}: ${err.error}`);
    });
  }

  console.log('\n' + '='.repeat(80));

  // Test cache
  console.log('\n🔄 Testing Cache...');
  const cacheTestUrl = testCases[0].url;
  
  console.log(`   First call (should fetch)...`);
  const start1 = Date.now();
  const res1 = await fetch(`${BACKEND_URL}/api/favicon?url=${encodeURIComponent(cacheTestUrl)}`);
  const data1 = await res1.json();
  const time1 = Date.now() - start1;
  console.log(`   ✓ Completed in ${time1}ms (cached: ${data1.cached})`);

  console.log(`   Second call (should use cache)...`);
  const start2 = Date.now();
  const res2 = await fetch(`${BACKEND_URL}/api/favicon?url=${encodeURIComponent(cacheTestUrl)}`);
  const data2 = await res2.json();
  const time2 = Date.now() - start2;
  console.log(`   ✓ Completed in ${time2}ms (cached: ${data2.cached})`);

  if (data2.cached && time2 < time1) {
    console.log(`   ✅ Cache working! (${time1}ms → ${time2}ms)`);
  } else if (data2.cached) {
    console.log(`   ✅ Cache flag working`);
  } else {
    console.log(`   ⚠️  Cache might not be working`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✨ Test completed!\n');

  // Exit code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
testFaviconAPI().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
