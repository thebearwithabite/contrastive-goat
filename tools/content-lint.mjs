#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import process from 'process'
const policy=JSON.parse(fs.readFileSync('ops/policy.json','utf8'))
const maxImgKB=policy.assets.max_image_kb,maxAudioMB=policy.assets.max_audio_mb,requireAlt=policy.assets.require_alt_text
const violations=[]
const kb=n=>n/1024, mb=n=>n/1024/1024
function checkFileSize(file){const s=fs.statSync(file),ext=path.extname(file).toLowerCase();if(['.png','.jpg','.jpeg','.webp','.svg'].includes(ext)&&kb(s.size)>maxImgKB)violations.push(`Image too large: ${file} (${kb(s.size).toFixed(1)} KB > ${maxImgKB} KB)`);if(['.mp3','.m4a','.wav','.aac','.ogg'].includes(ext)&&mb(s.size)>maxAudioMB)violations.push(`Audio too large: ${file} (${mb(s.size).toFixed(2)} MB > ${maxAudioMB} MB)`)}
function walk(dir){for(const n of fs.readdirSync(dir)){const f=path.join(dir,n);const st=fs.statSync(f);st.isDirectory()?walk(f):checkFileSize(f)}}
function checkAlts(){try{const items=JSON.parse(fs.readFileSync('data/feelings_items.json','utf8'));for(const it of items){if(requireAlt&&(!it.alt||!it.alt.trim()))violations.push(`Missing alt in feelings_items.json id=${it.id}`)}}catch{}}
(function(){if(fs.existsSync('public'))walk('public');if(fs.existsSync('assets'))walk('assets');checkAlts();if(violations.length){console.error('Content Lint Violations:');for(const v of violations)console.error(' - '+v);process.exit(1)}else console.log('Content lint passed.')})()
