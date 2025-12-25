// Quick test script to debug Google Sheets HTML
const cheerio = require('cheerio');

async function testGoogleSheets() {
  const url = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit';
  
  console.log('Fetching:', url);
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });
  
  console.log('Status:', response.status);
  console.log('Content-Type:', response.headers.get('content-type'));
  
  const html = await response.text();
  console.log('HTML length:', html.length);
  console.log('\nFirst 1000 chars:');
  console.log(html.substring(0, 1000));
  
  const $ = cheerio.load(html);
  
  console.log('\n=== Favicon Tags ===');
  console.log('Total <link> tags:', $('link').length);
  
  $('link').each((i, el) => {
    const rel = $(el).attr('rel');
    const href = $(el).attr('href');
    if (rel && (rel.includes('icon') || rel.includes('shortcut'))) {
      console.log(`Found: rel="${rel}" href="${href}"`);
    }
  });
  
  console.log('\n=== All relevant link tags ===');
  $('link').each((i, el) => {
    const rel = $(el).attr('rel');
    const href = $(el).attr('href');
    if (rel && (rel.includes('icon') || rel.includes('image'))) {
      console.log(`<link rel="${rel}" href="${href}">`);
    }
  });
}

testGoogleSheets().catch(console.error);
