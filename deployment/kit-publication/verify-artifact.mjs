import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
const [baselinePath, artifactPath] = process.argv.slice(2);
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'aegis-kit-verify-'));
const load = async file => {
  const text = fs.readFileSync(file, 'utf8');
  const shim = path.join(temporary, path.basename(file)+'.test.mjs');
  fs.writeFileSync(shim, text.replace('import { DurableObject } from "cloudflare:workers";', 'class DurableObject { constructor(ctx, env) { this.ctx = ctx; this.env = env; } }'));
  return (await import(pathToFileURL(shim))).default;
};
const before = await load(baselinePath), after = await load(artifactPath);
const env = { DB: { prepare: () => ({bind: () => ({run: async()=>({})})}) } };
const ctx = {waitUntil: promise => void promise};
const get = async (worker, route) => {
  const r = await worker.fetch(new Request('https://example.test'+route),env,ctx);
  return {status:r.status,body:await r.json()};
};
const oldCatalog = (await get(before,'/products.json')).body.products;
const catalog = (await get(after,'/products.json')).body.products;
assert.deepEqual(catalog.filter(p=>p.id!=='x402-mcp-integration-kit'), oldCatalog.filter(p=>p.id!=='x402-mcp-integration-kit'));
const kit = catalog.find(p=>p.id==='x402-mcp-integration-kit');
assert.equal(kit.status,'public');
assert.equal(kit.connectionUrl,'https://kadoya2.gumroad.com/l/x402-mcp-integration-kit');
assert.equal(kit.paidAccess.paymentDestination,kit.connectionUrl);
assert.equal(kit.paidAccess.price,'$19 USD, one-time Beta purchase');
assert.match(kit.paidAccess.purchaseConditions,/Node.js 24\+/);
assert.doesNotMatch(JSON.stringify(kit),/coming-soon|not yet available|verification is complete|Wait for the public|Not available until/i);
for(const route of ['/','/health','/.well-known/agent-card.json','/products/x402-mcp-integration-kit','/products/japan-rulewatch','/unknown']) assert.deepEqual(await get(after,route),await get(before,route));
for(const [request,id] of [['x402 USDC payment for MCP','x402-mcp-starter'],['x402 USDC payment for MCP integration','x402-mcp-integration-kit'],['x402 USDC payment for MCP kit','x402-mcp-integration-kit']]) {
  const r=await after.fetch(new Request('https://example.test/recommend',{method:'POST',body:JSON.stringify({request})}),env,ctx);
  assert.equal(r.status,200); const body=await r.json(); assert.equal(body.recommendedProduct.id,id);
  if(id===kit.id) assert.equal(body.connection.url,kit.connectionUrl);
}
console.log('Artifact verified: Kit public/checkout/prerequisites, free Starter general query, targeted Kit queries, four other products identical, existing GET routes identical.');
