const fs = require('fs');

const projects = [
  { id: 'credify', accent: '#7CFC00', title: 'Credify' },
  { id: 'citizen-voice', accent: '#22d3ee', title: 'CitizenVoice' },
  { id: 'smartnest', accent: '#a78bfa', title: 'Smartnest' },
  { id: 'stock-tracker', accent: '#60a5fa', title: 'Stock Tracker' },
  { id: 'munky', accent: '#facc15', title: '$Munky' },
];

for (const p of projects) {
  const vLines = Array.from({ length: 16 }, (_, i) => `<line x1='${i * 50}' y1='0' x2='${i * 50}' y2='500'/>`).join('');
  const hLines = Array.from({ length: 10 }, (_, i) => `<line x1='0' y1='${i * 50}' x2='800' y2='${i * 50}'/>`).join('');
  const menu = Array.from({ length: 6 }, (_, i) => `<rect x='106' y='${140 + i * 44}' width='148' height='14' rx='7' fill='#94a3b8' fill-opacity='${i === 0 ? 0.35 : 0.12}'/>`).join('');
  const bars = Array.from({ length: 7 }, (_, i) => `<rect x='${530 + i * 24}' y='${370 - ((i * 37) % 70)}' width='12' height='${30 + ((i * 37) % 70)}' rx='3' fill='${p.accent}' fill-opacity='0.7'/>`).join('');

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#0a101c'/><stop offset='1' stop-color='#060a12'/>
    </linearGradient>
    <radialGradient id='glow' cx='0.7' cy='0.3' r='0.8'>
      <stop offset='0' stop-color='${p.accent}' stop-opacity='0.22'/><stop offset='1' stop-color='${p.accent}' stop-opacity='0'/>
    </radialGradient>
  </defs>
  <rect width='800' height='500' fill='url(#bg)'/>
  <rect width='800' height='500' fill='url(#glow)'/>
  <g stroke='#94a3b8' stroke-opacity='0.08'>${vLines}${hLines}</g>
  <rect x='60' y='60' width='680' height='380' rx='14' fill='#0d1524' stroke='#94a3b8' stroke-opacity='0.18'/>
  <rect x='60' y='60' width='680' height='34' rx='14' fill='#0a101c'/>
  <circle cx='84' cy='77' r='5' fill='#f87171'/><circle cx='102' cy='77' r='5' fill='#facc15'/><circle cx='120' cy='77' r='5' fill='#4ade80'/>
  <rect x='90' y='120' width='180' height='290' rx='8' fill='#0a101c' stroke='#94a3b8' stroke-opacity='0.12'/>
  ${menu}
  <rect x='300' y='120' width='410' height='120' rx='8' fill='#0a101c' stroke='#94a3b8' stroke-opacity='0.12'/>
  <polyline points='320,220 360,180 400,200 440,150 480,170 520,130 560,160 600,120 640,140 690,110' fill='none' stroke='${p.accent}' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/>
  <rect x='300' y='260' width='200' height='150' rx='8' fill='#0a101c' stroke='#94a3b8' stroke-opacity='0.12'/>
  <rect x='510' y='260' width='200' height='150' rx='8' fill='#0a101c' stroke='#94a3b8' stroke-opacity='0.12'/>
  <circle cx='400' cy='335' r='42' fill='none' stroke='${p.accent}' stroke-width='8' stroke-dasharray='180 90' stroke-linecap='round' transform='rotate(-90 400 335)'/>
  ${bars}
  <text x='90' y='470' font-family='monospace' font-size='20' fill='${p.accent}' fill-opacity='0.85'>${p.title} — preview</text>
</svg>`;

  fs.writeFileSync('public/screenshots/' + p.id + '.svg', svg);
}
console.log('Generated', projects.length, 'previews');
