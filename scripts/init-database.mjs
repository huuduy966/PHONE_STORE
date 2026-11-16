import { createClient } from '@libsql/client';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
const url=process.env.TURSO_DATABASE_URL;
if (!url) { console.log('TURSO_DATABASE_URL not set; showing sample catalog.'); process.exit(0); }
if (url.startsWith('file:') && url !== 'file::memory:') await mkdir(path.dirname(url.slice(5)), {recursive:true});
const client=createClient({url,authToken:process.env.TURSO_AUTH_TOKEN});
const sql=await readFile(new URL('../drizzle/0000_careful_maelstrom.sql',import.meta.url),'utf8');
const statements=sql.split('--> statement-breakpoint').map(s=>s.trim()).filter(Boolean).map(s=>s.replace(/^CREATE TABLE /i,'CREATE TABLE IF NOT EXISTS ').replace(/^CREATE UNIQUE INDEX /i,'CREATE UNIQUE INDEX IF NOT EXISTS '));
await client.batch(statements,'write');
client.close();
console.log('Database schema initialized.');
