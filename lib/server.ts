import { database } from './database';
import { hash, compare } from 'bcryptjs';
import { z } from 'zod';
import { catalog, seedVariants, transitions, totals, type Product } from './catalog';
import {isValidLocation} from './vietnam-locations';

class HttpError extends Error { constructor(public status:number,message:string){super(message)} }
const fail=(status:number,message:string):never=>{throw new HttpError(status,message)};
const db=()=>{if(!database) return fail(503,'Cơ sở dữ liệu chưa sẵn sàng. Vui lòng thử lại.');return database};
let seeded=false;
async function seed(){
  if(seeded)return;
  const existing=await db().prepare('SELECT id FROM products').all<{id:string}>();
  const missing=catalog.filter(p=>!existing.results.some(row=>row.id===p.id));
  if(missing.length || !existing.results.length){
    const stmts=missing.flatMap(p=>[db().prepare('INSERT OR IGNORE INTO products (id,data,visible) VALUES (?,?,1)').bind(p.id,JSON.stringify(p)),...seedVariants(p).map(v=>db().prepare('INSERT OR IGNORE INTO variants (id,product_id,color,storage,image,price,stock) VALUES (?,?,?,?,?,?,?)').bind(v.id,v.productId,v.color,v.storage,v.image,v.price,v.stock))]);
    stmts.push(db().prepare('INSERT OR IGNORE INTO coupons (code,amount,minimum,expires,remaining) VALUES (?,?,?,?,?)').bind('HELLO200',200000,5000000,'2027-12-31T16:59:59.000Z',100));
    await db().batch(stmts);
  }
  seeded=true;
}
const uid=()=>crypto.randomUUID();
async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(n=>n.toString(16).padStart(2,'0')).join('')}
type User={id:string;name:string;email:string;role:string;phone:string;addresses:string;wishlist:string;password?:string};
const publicUser=(u:User)=>({id:u.id,name:u.name,email:u.email,role:u.role,phone:u.phone,addresses:JSON.parse(u.addresses),wishlist:JSON.parse(u.wishlist)});
function token(req:Request){return req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('ps_session='))?.slice(11)||''}
async function currentUser(req:Request){const t=token(req);if(!t)return null;return await db().prepare('SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token=? AND s.expires>?').bind(await digest(t),Date.now()).first<User>()}
async function requireUser(req:Request,admin=false){const u=await currentUser(req);if(!u)fail(401,'Vui lòng đăng nhập để tiếp tục.');if(admin&&u!.role!=='admin')fail(403,'Bạn không có quyền quản trị.');return u!;}
function json(value:unknown,status=200,headers:Record<string,string>={}){return Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}})}
async function body(req:Request){const raw=await req.text();if(raw.length>50000)fail(413,'Dữ liệu quá lớn.');try{return JSON.parse(raw)}catch{fail(400,'Dữ liệu không hợp lệ.')}}
async function rate(req:Request,key:string,max=10,windowMs=900000,perIp=true){const ip=process.env.VERCEL?req.headers.get('x-forwarded-for')?.split(',')[0].trim():req.headers.get('cf-connecting-ip');const id=await digest(perIp?`${key}:${ip||'local'}`:key);const now=Date.now();await db().prepare('INSERT INTO rate_limits (key,attempts,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN expires<? THEN 1 ELSE attempts+1 END, expires=CASE WHEN expires<? THEN ? ELSE expires END').bind(id,now+windowMs,now,now,now+windowMs).run();const row=await db().prepare('SELECT attempts FROM rate_limits WHERE key=?').bind(id).first<{attempts:number}>();if(row!.attempts>max)fail(429,'Bạn thao tác quá nhiều lần. Vui lòng thử lại sau.');}
const phone=z.string().regex(/^(0[35789]\d{8}|\+84[35789]\d{8})$/,'Số điện thoại Việt Nam không hợp lệ.');
const orderCode=z.string().trim().toUpperCase().regex(/^PS[A-F0-9]{10}$/,'Mã đơn hàng không hợp lệ.');
const registerSchema=z.object({name:z.string().trim().min(2).max(100),email:z.string().email().max(150).transform(s=>s.toLowerCase().trim()),password:z.string().min(10,'Mật khẩu cần ít nhất 10 ký tự.').max(72).regex(/[A-Z]/,'Cần ít nhất một chữ hoa.').regex(/[a-z]/,'Cần ít nhất một chữ thường.').regex(/\d/,'Cần ít nhất một chữ số.'),setupToken:z.string().min(1).max(200).optional()}).strict();
const recipientSchema=z.object({name:z.string().trim().min(2).max(100),phone,email:z.union([z.string().email().max(150),z.literal('')]),city:z.string().trim().min(2).max(80),district:z.string().trim().max(80).default(''),ward:z.string().trim().min(1).max(80),address:z.string().trim().min(5).max(250),note:z.string().max(500).default(''),delivery:z.enum(['delivery','pickup']),company:z.string().max(150).default(''),taxCode:z.string().max(20).default(''),companyAddress:z.string().max(250).default('')}).strict().refine(data=>isValidLocation(data.city,data.ward),{path:['ward'],message:'Vui lòng chọn tỉnh/thành phố và phường/xã hợp lệ.'});
const orderSchema=z.object({items:z.array(z.object({variantId:z.string().min(1).max(100),quantity:z.number().int().min(1).max(5),price:z.number().int().positive()}).strict()).min(1).max(30),recipient:recipientSchema,payment:z.literal('COD'),coupon:z.string().max(30).default('')}).strict();
const orderView=(o:Record<string,unknown>)=>({code:o.code,recipient:JSON.parse(o.recipient as string),items:JSON.parse(o.items as string),subtotal:o.subtotal,discount:o.discount,shipping:o.shipping,total:o.total,payment:o.payment,status:o.status,createdAt:o.created_at,history:JSON.parse(o.history as string)});
async function couponFor(code:string,subtotal:number){if(!code)return 0;const c=await db().prepare('SELECT * FROM coupons WHERE code=?').bind(code.toUpperCase()).first<{amount:number;minimum:number;expires:string;remaining:number}>();if(!c)fail(400,'Mã giảm giá không tồn tại.');if(new Date(c!.expires).getTime()<Date.now()||c!.remaining<1)fail(400,'Mã giảm giá đã hết hạn hoặc hết lượt sử dụng.');if(subtotal<c!.minimum)fail(400,`Mã áp dụng cho đơn từ ${c!.minimum.toLocaleString('vi-VN')}đ.`);return c!.amount;}
async function productList(includeHidden=false){
  const productsQuery=includeHidden?'SELECT * FROM products':'SELECT * FROM products WHERE visible=1';
  const [p,v]=await Promise.all([db().prepare(productsQuery).all<{id:string;data:string;visible:number}>(),db().prepare('SELECT id,product_id as productId,color,storage,image,price,stock FROM variants').all()]);
  return p.results.map(row=>{const variants=v.results.filter(x=>x.productId===row.id);return {...JSON.parse(row.data),visible:row.visible,variants,price:Math.min(...variants.map(x=>Number(x.price)))}});
}
export async function getStoreProducts():Promise<Product[]>{if(!database)return catalog.map(p=>({...p,variants:seedVariants(p)}));await seed();return await productList();}
async function audit(user:User,action:string,details:unknown){return db().prepare('INSERT INTO audit_logs (id,user_id,action,details,created_at) VALUES (?,?,?,?,?)').bind(uid(),user.id,action,JSON.stringify(details),new Date().toISOString()).run()}

export async function handleApi(req:Request){try{
  if(!['GET','HEAD'].includes(req.method)){
    const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)fail(403,'Yêu cầu từ nguồn không được phép.');
    if(!req.headers.get('content-type')?.includes('application/json'))fail(415,'Yêu cầu phải có định dạng JSON.');
  }
  await seed();
  const url=new URL(req.url);if(url.search)fail(400,'Tham số truy vấn không hợp lệ.');
  const path=url.pathname.replace(/^\/api\/v1\//,'');const method=req.method;
  if(path==='ai'||path.startsWith('ai/'))await rate(req,'ai',20,60000);
  if(path==='products'&&method==='GET')return json({products:await productList()});
  if(path==='me'&&method==='GET'){const u=await currentUser(req);return json({user:u?publicUser(u):null})}
  if(path==='auth/register'&&method==='POST'){
    await rate(req,'register',10);const data=registerSchema.parse(await body(req));
    let role='customer';
    if(data.setupToken){
      const setupSecret = process.env.ADMIN_SETUP_TOKEN;
      if(!setupSecret||await digest(data.setupToken)!==await digest(setupSecret))fail(403,'Mã thiết lập quản trị không hợp lệ.');
      if(await db().prepare("SELECT id FROM users WHERE role='admin'").first())fail(409,'Tài khoản quản trị đã được thiết lập.');
      role='admin';
    }
    const id=uid();try{await db().prepare('INSERT INTO users (id,name,email,password,role) VALUES (?,?,?,?,?)').bind(id,data.name,data.email,await hash(data.password,12),role).run()}catch{fail(409,'Email đã được đăng ký hoặc quản trị đã được thiết lập.');}
    return await loginResponse(req,id);
  }
  if(path==='auth/login'&&method==='POST'){
    await rate(req,'login');const data=z.object({email:z.string().email().max(150),password:z.string().min(1).max(72)}).strict().parse(await body(req));
    const email=data.email.toLowerCase().trim();await rate(req,`login-account:${email}`,5,900000,false);
    const u=await db().prepare('SELECT * FROM users WHERE email=?').bind(email).first<User>();
    if(!u||!await compare(data.password,u.password!))fail(401,'Email hoặc mật khẩu không đúng.');await db().prepare('DELETE FROM rate_limits WHERE key=?').bind(await digest(`login-account:${email}`)).run();return await loginResponse(req,u!.id);
  }
  if(path==='auth/logout'&&method==='POST'){z.object({}).strict().parse(await body(req));await db().prepare('DELETE FROM sessions WHERE token=?').bind(await digest(token(req))).run();return json({ok:true},200,{'Set-Cookie':'ps_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'});}
  if(path==='me'&&method==='PATCH'){
    const u=await requireUser(req);const data=z.object({name:z.string().trim().min(2).max(100),phone:z.union([phone,z.literal('')]),addresses:z.array(z.string().max(300)).max(10),wishlist:z.array(z.string().max(100)).max(100)}).strict().parse(await body(req));
    await db().prepare('UPDATE users SET name=?,phone=?,addresses=?,wishlist=? WHERE id=?').bind(data.name,data.phone,JSON.stringify(data.addresses),JSON.stringify(data.wishlist),u.id).run();return json({ok:true});
  }
  if(path==='me/password'&&method==='POST'){
    const u=await requireUser(req);await rate(req,'password');const d=z.object({oldPassword:z.string().min(1).max(72),password:registerSchema.shape.password}).strict().parse(await body(req));if(!await compare(d.oldPassword,u.password!))fail(400,'Mật khẩu hiện tại không đúng.');await db().batch([db().prepare('UPDATE users SET password=? WHERE id=?').bind(await hash(d.password,12),u.id),db().prepare('DELETE FROM sessions WHERE user_id=?').bind(u.id)]);return await loginResponse(req,u.id);
  }
  if(path==='coupons'&&method==='GET'){await requireUser(req);const rows=await db().prepare('SELECT code,amount,minimum,expires FROM coupons WHERE remaining>0 AND expires>? ORDER BY expires ASC').bind(new Date().toISOString()).all();return json({coupons:rows.results});}
  if(path==='coupons/validate'&&method==='POST'){const d=z.object({code:z.string().max(30),subtotal:z.number().int().nonnegative()}).strict().parse(await body(req));return json({discount:await couponFor(d.code,d.subtotal)});}
  if(path==='orders'&&method==='POST'){
    await rate(req,'order',30);const d=orderSchema.parse(await body(req));const key=req.headers.get('idempotency-key')||'';if(!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(key))fail(400,'Mã chống tạo đơn trùng không hợp lệ.');
    const user=await currentUser(req);const requestHash=await digest(JSON.stringify({...d,userId:user?.id||null}));
    const old=await db().prepare('SELECT * FROM orders WHERE idempotency_key=?').bind(key).first();if(old){if(old.request_hash!==requestHash)fail(409,'Mã đặt hàng đã dùng cho nội dung khác.');return json({order:orderView(old)})}
    if(new Set(d.items.map(i=>i.variantId)).size!==d.items.length)fail(400,'Biến thể bị trùng trong giỏ hàng.');
    const rows=await db().prepare('SELECT v.*,p.data,p.visible FROM variants v JOIN products p ON p.id=v.product_id').all<Record<string,unknown>>();
    const items=d.items.map(i=>{const v=rows.results.find(v=>v.id===i.variantId);if(!v||v.visible!==1||Number(v.stock)<i.quantity)fail(409,'Một sản phẩm không đủ tồn kho. Vui lòng cập nhật giỏ hàng.');if(v!.price!==i.price)fail(409,'Giá sản phẩm vừa thay đổi. Vui lòng cập nhật giỏ hàng.');return {variantId:i.variantId,quantity:i.quantity,price:Number(v!.price),name:JSON.parse(v!.data as string).name,productId:v!.product_id,color:v!.color,storage:v!.storage,image:v!.image}});
    const sub=totals(items).subtotal;const discount=await couponFor(d.coupon,sub);const total=totals(items,discount,d.recipient.delivery==='pickup');const id=uid();const code='PS'+crypto.randomUUID().replace(/-/g,'').slice(0,10).toUpperCase();const created=new Date().toISOString();
    // The database batch is atomic; constraints roll back stock or price races.
    const stmts=items.map(i=>db().prepare('UPDATE variants SET stock=CASE WHEN price=? AND EXISTS(SELECT 1 FROM products p WHERE p.id=variants.product_id AND p.visible=1) THEN stock-? ELSE -1 END WHERE id=?').bind(i.price,i.quantity,i.variantId));
    if(d.coupon)stmts.push(db().prepare('UPDATE coupons SET remaining=CASE WHEN expires>? AND amount=? AND minimum<=? THEN remaining-1 ELSE -1 END WHERE code=?').bind(created,discount,sub,d.coupon.toUpperCase()));
    stmts.push(db().prepare('INSERT INTO orders (id,code,user_id,idempotency_key,request_hash,recipient,phone,items,subtotal,discount,shipping,total,payment,status,created_at,history) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,code,user?.id||null,key,requestHash,JSON.stringify(d.recipient),d.recipient.phone,JSON.stringify(items),total.subtotal,total.discount,total.shipping,total.total,'COD','Chờ xác nhận',created,JSON.stringify([{status:'Chờ xác nhận',time:created,note:'Đơn hàng được tạo'}])));
    try{await db().batch(stmts)}catch{const retry=await db().prepare('SELECT * FROM orders WHERE idempotency_key=?').bind(key).first();if(retry&&retry.request_hash===requestHash)return json({order:orderView(retry)});fail(409,'Tồn kho, giá hoặc mã giảm giá vừa thay đổi. Vui lòng kiểm tra lại.');}
    return json({order:orderView((await db().prepare('SELECT * FROM orders WHERE id=?').bind(id).first())!)},201);
  }
  if(path==='orders'&&method==='GET'){const u=await requireUser(req);const rows=await db().prepare('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 100').bind(u.id).all();return json({orders:rows.results.map(orderView)});}
  if(path==='orders/lookup'&&method==='POST'){await rate(req,'lookup',20);const d=z.object({code:orderCode,phone}).strict().parse(await body(req));const o=await db().prepare('SELECT * FROM orders WHERE code=? AND phone=?').bind(d.code,d.phone).first();if(!o)fail(404,'Không tìm thấy đơn hàng với mã và số điện thoại này.');return json({order:orderView(o!)});}
  if(/^orders\/[^/]+\/cancel$/.test(path)&&method==='POST'){const u=await requireUser(req);const code=orderCode.parse(path.split('/')[1]);z.object({}).strict().parse(await body(req));return await updateStatus(u,code,'Đã hủy','Khách hàng yêu cầu hủy',false);}
  if(path.startsWith('admin/')){
    const u=await requireUser(req,true);
    if(path==='admin/overview'&&method==='GET'){const [orders,products,customers,logs,coupons]=await Promise.all([db().prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500').all(),productList(true),db().prepare('SELECT id,name,email,phone,role FROM users').all(),db().prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50').all(),db().prepare('SELECT * FROM coupons').all()]);return json({orders:orders.results.map(orderView),products,customers:customers.results,logs:logs.results,coupons:coupons.results});}
    if(path==='admin/orders/status'&&method==='POST'){const d=z.object({code:orderCode,status:z.string().refine(s=>Object.hasOwn(transitions,s),'Trạng thái không hợp lệ.'),note:z.string().trim().min(2).max(300)}).strict().parse(await body(req));return await updateStatus(u,d.code,d.status,d.note,true);}
    if(path==='admin/products'&&method==='POST'){
      const d=z.object({name:z.string().min(2).max(120),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),brand:z.enum(['Apple','Samsung','Xiaomi','OPPO']),category:z.enum(['Điện thoại','Máy tính bảng','Phụ kiện']),color:z.string().min(1).max(50),storage:z.string().min(1).max(30),price:z.number().int().min(1000).max(200000000),original:z.number().int().min(1000).max(200000000),stock:z.number().int().min(0).max(100000),ram:z.number().int().min(0).max(64),screen:z.number().min(0).max(30),battery:z.number().int().min(0).max(30000),chip:z.string().max(100),camera:z.string().max(100),os:z.string().max(40),image:z.string(),description:z.string().max(3000)}).strict().parse(await body(req));
      if(!catalog.some(p=>p.images.includes(d.image)))fail(400,'Ảnh không nằm trong thư viện đã duyệt.');if(d.original<d.price)fail(400,'Giá gốc phải lớn hơn hoặc bằng giá bán.');
      const p:Product={id:d.slug,name:d.name,brand:d.brand,category:d.category,price:d.price,original:d.original,image:d.image,colors:['#cccccc'],colorNames:[d.color],images:[d.image],storages:[d.storage],tag:'Mới',rating:0,reviews:0,chip:d.chip,ram:d.ram,screen:d.screen,battery:d.battery,camera:d.camera,os:d.os,fiveG:false,description:d.description};
      try{await db().batch([db().prepare('INSERT INTO products (id,data,visible) VALUES (?,?,1)').bind(p.id,JSON.stringify(p)),db().prepare('INSERT INTO variants (id,product_id,color,storage,image,price,stock) VALUES (?,?,?,?,?,?,?)').bind(p.id+'-0-0',p.id,d.color,d.storage,d.image,d.price,d.stock),db().prepare('INSERT INTO audit_logs VALUES (?,?,?,?,?)').bind(uid(),u.id,'Thêm sản phẩm',JSON.stringify(p),new Date().toISOString())]);}catch{fail(409,'Slug đã tồn tại. Hãy chọn slug khác.');}return json({ok:true},201);
    }
    if(path==='admin/products'&&method==='PATCH'){
      const d=z.object({id:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),name:z.string().min(2).max(120),description:z.string().max(3000),visible:z.boolean(),variants:z.array(z.object({id:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),price:z.number().int().min(1000).max(200000000),stock:z.number().int().min(0).max(100000)}).strict()).min(1).max(50)}).strict().parse(await body(req));
      const p=await db().prepare('SELECT data FROM products WHERE id=?').bind(d.id).first<{data:string}>();if(!p)fail(404,'Không tìm thấy sản phẩm.');
      const data={...JSON.parse(p!.data),name:d.name,description:d.description};await db().batch([db().prepare('UPDATE products SET data=?,visible=? WHERE id=?').bind(JSON.stringify(data),d.visible?1:0,d.id),...d.variants.map(v=>db().prepare('UPDATE variants SET price=?,stock=? WHERE id=? AND product_id=?').bind(v.price,v.stock,v.id,d.id)),db().prepare('INSERT INTO audit_logs VALUES (?,?,?,?,?)').bind(uid(),u.id,'Cập nhật sản phẩm',JSON.stringify(d),new Date().toISOString())]);return json({ok:true});
    }
    if(path==='admin/coupons'&&method==='POST'){const d=z.object({code:z.string().regex(/^[A-Z0-9]{3,20}$/),amount:z.number().int().positive().max(5000000),minimum:z.number().int().nonnegative(),expires:z.string().datetime(),remaining:z.number().int().min(0).max(100000)}).strict().parse(await body(req));await db().prepare('INSERT INTO coupons (code,amount,minimum,expires,remaining) VALUES (?,?,?,?,?) ON CONFLICT(code) DO UPDATE SET amount=excluded.amount,minimum=excluded.minimum,expires=excluded.expires,remaining=excluded.remaining').bind(d.code,d.amount,d.minimum,d.expires,d.remaining).run();await audit(u,'Cập nhật mã giảm giá',d);return json({ok:true});}
  }
  fail(404,'Không tìm thấy chức năng này.');
}catch(error){if(error instanceof HttpError)return json({error:error.message},error.status);if(error instanceof z.ZodError)return json({error:error.issues[0]?.message||'Vui lòng kiểm tra thông tin.'},400);console.error('PhoneStore API:',error instanceof Error?error.message:'Unknown error');return json({error:'Hệ thống tạm thời chưa sẵn sàng. Vui lòng thử lại.'},500);}}

async function loginResponse(req:Request,id:string){const t=uid()+uid();await db().prepare('INSERT INTO sessions (token,user_id,expires) VALUES (?,?,?)').bind(await digest(t),id,Date.now()+7*86400000).run();const u=await db().prepare('SELECT * FROM users WHERE id=?').bind(id).first<User>();return json({user:publicUser(u!)},200,{'Set-Cookie':`ps_session=${t}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${new URL(req.url).protocol==='https:'?'; Secure':''}`});}
async function updateStatus(u:User,code:string,status:string,note:string,admin:boolean){
  const o=await db().prepare('SELECT * FROM orders WHERE code=?').bind(code).first<{user_id:string|null;status:string;items:string;history:string}>();if(!o)fail(404,'Không tìm thấy đơn hàng.');if(!admin&&o!.user_id!==u.id)fail(403,'Bạn không có quyền với đơn hàng này.');
  if(!transitions[o!.status as string]?.includes(status)||(!admin&&!['Chờ xác nhận','Đã xác nhận'].includes(o!.status as string)))fail(409,'Không thể chuyển trạng thái đơn hàng này.');
  const stmts=[];if(status==='Đã hủy')for(const item of JSON.parse(o!.items as string))stmts.push(db().prepare('UPDATE variants SET stock=stock+? WHERE id=? AND EXISTS(SELECT 1 FROM orders WHERE code=? AND status=?)').bind(item.quantity,item.variantId,code,o!.status));
  const history=[...JSON.parse(o!.history as string),{status,time:new Date().toISOString(),note,by:u.name}];
  stmts.push(db().prepare('UPDATE orders SET status=?,history=? WHERE code=? AND status=?').bind(status,JSON.stringify(history),code,o!.status));
  const result=await db().batch(stmts);if(!result[result.length-1].meta.changes)fail(409,'Đơn đã được cập nhật, vui lòng tải lại.');await audit(u,'Cập nhật đơn',{code,status,note});return json({ok:true});
}

