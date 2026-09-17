import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { publish, type runNode } from './publish.ts';

async function fixture() {
  const root=await mkdtemp(path.join(os.tmpdir(),'portfolio-publish-test-'));
  for(const directory of ['node_modules','src','public/assets/studio','scripts'])await mkdir(path.join(root,directory),{recursive:true});
  for(const file of ['index.html','package.json','vite.config.ts','portfolioMdxSourcePlugin.ts','postcss.config.js','tailwind.config.js','tsconfig.json','tsconfig.app.json','tsconfig.node.json','scripts/validate-portfolio-content.ts'])await writeFile(path.join(root,file),'{}');
  await writeFile(path.join(root,'studio.config.json'),JSON.stringify({projectName:'example',productionBranch:'main',siteUrl:'https://example.com',mediaBucket:'example-assets'}));
  await writeFile(path.join(root,'public/assets/studio/test.png'),'test image');
  return root;
}
test('a failed validation prevents media upload and deployment',async()=>{
  const root=await fixture();const commands:string[][]=[];
  await assert.rejects(()=>publish(root,true,()=>{},async(_root,_script,args)=>{commands.push(args);throw new Error('Invalid content');}),/Invalid content/);
  assert.equal(commands.length,1);assert.deepEqual(commands[0],['scripts/validate-portfolio-content.ts']);
});
test('publishing builds first, uploads media, deploys configured branch, then verifies the release',async()=>{
  const root=await fixture();const commands:string[][]=[];let output='';
  const execute:typeof runNode=async(_root,_script,args)=>{
    commands.push(args);
    if(args[0]==='build'){output=args[2];await mkdir(output,{recursive:true});}
    return args[0]==='pages'?'Deployment complete https://abc.example.pages.dev':'';
  };
  const result=await publish(root,true,()=>{},execute,async()=>new Response(await readFile(path.join(output,'__studio-release.json'),'utf8')));
  assert.deepEqual(commands.map(args=>args[0]),['scripts/validate-portfolio-content.ts','build','r2','pages']);
  assert.ok(commands[2].includes('--remote'));assert.ok(commands[3].includes('main'));
  assert.equal(result.deployed,true);assert.equal(JSON.parse(await readFile(path.join(root,'.studio/last-publish.json'),'utf8')).verified,true);
});
test('build checks never call Cloudflare',async()=>{
  const root=await fixture();const commands:string[][]=[];
  await publish(root,false,()=>{},async(_root,_script,args)=>{commands.push(args);if(args[0]==='build')await mkdir(args[2],{recursive:true});return '';});
  assert.deepEqual(commands.map(args=>args[0]),['scripts/validate-portfolio-content.ts','build']);
});
