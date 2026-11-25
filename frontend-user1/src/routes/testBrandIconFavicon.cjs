const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== VEDA STRUCTURE: OFFICIAL BRAND ICON & FAVICON STANDARDIZATION TEST SUITE ===\n');

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${description}`);
    console.error(`   ${err.message}`);
    failed++;
  }
}

const rootDir = path.resolve(__dirname, '../../../');
const frontendDir = path.join(rootDir, 'frontend-user1');

// 1. Asset Files Existence and Validity
test('Master brand emblem exists in src/assets/images/brand', () => {
  const p = path.join(frontendDir, 'src/assets/images/brand/veda-logo.png');
  assert(fs.existsSync(p), 'File does not exist: ' + p);
  const stat = fs.statSync(p);
  assert(stat.size > 10000, 'File size too small: ' + stat.size);
});

test('Legacy veda-logo.png in src/assets/images replaced with non-zero official emblem', () => {
  const p = path.join(frontendDir, 'src/assets/images/veda-logo.png');
  assert(fs.existsSync(p), 'File does not exist: ' + p);
  const stat = fs.statSync(p);
  assert(stat.size > 10000, 'File size too small (was 0 previously): ' + stat.size);
});

test('public/favicon.svg replaced and contains no purple Vite lightning (#863bff)', () => {
  const p = path.join(frontendDir, 'public/favicon.svg');
  assert(fs.existsSync(p), 'favicon.svg does not exist');
  const content = fs.readFileSync(p, 'utf8');
  assert(!content.includes('#863bff'), 'favicon.svg still contains purple lightning color');
  assert(!content.includes('M25.946 44.938'), 'favicon.svg still contains Vite lightning path');
  assert(content.includes('Veda Structure'), 'favicon.svg title missing');
});

test('public/favicon.ico exists and has valid multi-res size', () => {
  const p = path.join(frontendDir, 'public/favicon.ico');
  assert(fs.existsSync(p), 'favicon.ico does not exist');
  const stat = fs.statSync(p);
  assert(stat.size > 100, 'favicon.ico size too small: ' + stat.size);
});

test('Standard favicon PNGs exist in public directory (16, 32, 180, 192, 512)', () => {
  const required = [
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'site.webmanifest'
  ];
  for (const f of required) {
    const p = path.join(frontendDir, 'public', f);
    assert(fs.existsSync(p), `Missing public file: ${f}`);
    assert(fs.statSync(p).size > 0, `File is empty: ${f}`);
  }
});

// 2. index.html Favicon Configuration
test('index.html properly configured with favicon suite and meta tags', () => {
  const indexHtml = fs.readFileSync(path.join(frontendDir, 'index.html'), 'utf8');
  assert(indexHtml.includes('href="/favicon.svg"'), 'Missing favicon.svg link');
  assert(indexHtml.includes('href="/favicon-32x32.png"'), 'Missing favicon-32x32 link');
  assert(indexHtml.includes('href="/favicon-16x16.png"'), 'Missing favicon-16x16 link');
  assert(indexHtml.includes('href="/favicon.ico"'), 'Missing favicon.ico link');
  assert(indexHtml.includes('href="/apple-touch-icon.png"'), 'Missing apple-touch-icon link');
  assert(indexHtml.includes('href="/site.webmanifest"'), 'Missing site.webmanifest link');
  assert(indexHtml.includes('name="theme-color"'), 'Missing theme-color meta');
});

// 3. Navbar Component
test('Navbar.jsx uses official vedaLogo and retains wordmark', () => {
  const code = fs.readFileSync(path.join(frontendDir, 'src/components/layout/Navbar.jsx'), 'utf8');
  assert(code.includes('import vedaLogo from'), 'Navbar missing vedaLogo import');
  assert(code.includes('src={vedaLogo}'), 'Navbar does not render vedaLogo img');
  assert(code.includes('alt="Veda Structure Emblem"'), 'Navbar img missing proper alt');
  assert(code.includes('VEDA STRUCTURE'), 'Navbar wordmark missing');
  assert(code.includes('WISDOM, WORLDWIDE'), 'Navbar tagline missing');
  assert(!code.includes('M24 4 C29 10 30 15 24 20'), 'Navbar still contains old placeholder SVG');
});

// 4. Footer Component
test('Footer.jsx uses official vedaLogo and retains wordmark', () => {
  const code = fs.readFileSync(path.join(frontendDir, 'src/components/layout/Footer.jsx'), 'utf8');
  assert(code.includes('import vedaLogo from'), 'Footer missing vedaLogo import');
  assert(code.includes('src={vedaLogo}'), 'Footer does not render vedaLogo img');
  assert(code.includes('alt="Veda Structure Emblem"'), 'Footer img missing proper alt');
  assert(code.includes('VEDA STRUCTURE'), 'Footer wordmark missing');
  assert(code.includes('WISDOM, WORLDWIDE'), 'Footer tagline missing');
  assert(!code.includes('C29 8 32 10 37 11'), 'Footer still contains old placeholder SVG');
});

// 5. YagyaPujaNavBar Component
test('YagyaPujaNavBar.jsx uses official vedaLogo and retains wordmark', () => {
  const code = fs.readFileSync(path.join(frontendDir, 'src/features/yagyaPuja/components/YagyaPujaNavBar.jsx'), 'utf8');
  assert(code.includes('import vedaLogo from'), 'YagyaPujaNavBar missing vedaLogo import');
  assert(code.includes('src={vedaLogo}'), 'YagyaPujaNavBar does not render vedaLogo img');
  assert(code.includes('alt="Veda Structure Emblem"'), 'YagyaPujaNavBar img missing proper alt');
  assert(code.includes('VEDA STRUCTURE'), 'YagyaPujaNavBar wordmark missing');
  assert(code.includes('Yagya &amp; Puja'), 'YagyaPujaNavBar submark missing');
  assert(!code.includes('M24 4 C29 10 30 15 24 20'), 'YagyaPujaNavBar still contains old placeholder SVG');
});

// 6. VishalNavbar Component
test('VishalNavbar.jsx uses official vedaLogo and retains wordmark', () => {
  const code = fs.readFileSync(path.join(frontendDir, 'src/components/layout/VishalNavbar.jsx'), 'utf8');
  assert(code.includes('import vedaLogo from'), 'VishalNavbar missing vedaLogo import');
  assert(code.includes('src={vedaLogo}'), 'VishalNavbar does not render vedaLogo img');
  assert(code.includes('alt="Veda Structure Emblem"'), 'VishalNavbar img missing proper alt');
  assert(code.includes('VEDA STRUCTURE'), 'VishalNavbar wordmark missing');
  assert(!code.includes('M24 4 C29 10 30 15 24 20'), 'VishalNavbar still contains old placeholder SVG');
});

// 7. VishalFooter Component
test('VishalFooter.jsx uses official vedaLogo and retains wordmark', () => {
  const code = fs.readFileSync(path.join(frontendDir, 'src/components/layout/VishalFooter.jsx'), 'utf8');
  assert(code.includes('import vedaLogo from'), 'VishalFooter missing vedaLogo import');
  assert(code.includes('src={vedaLogo}'), 'VishalFooter does not render vedaLogo img');
  assert(code.includes('alt="Veda Structure Emblem"'), 'VishalFooter img missing proper alt');
  assert(code.includes('VEDA STRUCTURE'), 'VishalFooter wordmark missing');
  assert(!code.includes('M24 4 C29 10 30 15 24 20'), 'VishalFooter still contains old placeholder SVG');
});

// 8. Zero remaining old placeholder SVG shapes in the whole source tree
test('Zero remaining old placeholder mandala/flower SVG in src directory', () => {
  function scan(dir) {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      if (item.name === 'node_modules' || item.name === '.git' || item.name === 'dist') continue;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) scan(full);
      else if (item.name.endsWith('.jsx') || item.name.endsWith('.js') || item.name.endsWith('.html')) {
        const text = fs.readFileSync(full, 'utf8');
        assert(!text.includes('M24 4 C29 10 30 15 24 20'), `Found old placeholder SVG in ${full}`);
        assert(!text.includes('C29 8 32 10 37 11'), `Found old placeholder SVG in ${full}`);
      }
    }
  }
  scan(path.join(frontendDir, 'src'));
});

console.log('\n========================================');
console.log(`Test Execution Finished: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
