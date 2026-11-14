'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="container page empty"><h1>PhoneStore cần một chút thời gian.</h1><p>Chưa thể tải dữ liệu. Vui lòng thử lại sau giây lát.</p><button className="button dark" onClick={reset}>Thử lại</button></main>}
