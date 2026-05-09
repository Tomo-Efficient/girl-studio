import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center">
        <Link
          href="/"
          className="font-[family-name:var(--font-serif)] text-xl font-semibold tracking-wider no-underline text-[#2c2c2c]"
        >
          Beauty
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center h-8 px-4 rounded-sm text-sm font-light no-underline text-white bg-[#c4736e] hover:bg-[#b0635e] transition-colors"
        >
          进入灵感库
        </Link>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center px-6 md:px-12 pt-24 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-70 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 40%, #e8d5d3 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 70%, #f2ede7 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-[720px]">
          <p className="text-xs tracking-[0.2em] uppercase text-[#c4736e] mb-6 font-light">
            Aesthetic Studio
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-[clamp(48px,7vw,88px)] font-light leading-[1.15] tracking-[0.03em] text-[#2c2c2c]">
            审美
            <br />
            是一种
            <em className="italic text-[#c4736e]">选择</em>
          </h1>
          <p className="mt-8 text-lg text-[var(--muted-foreground)] max-w-[420px] leading-relaxed font-light">
            不被趋势裹挟，不为讨好而存在。
            <br />
            只做经得起时间凝视的作品。
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-10 px-8 py-3 bg-[#c4736e] text-white text-sm tracking-wider rounded-sm no-underline hover:bg-[#b0635e] transition-colors"
          >
            开始记录
          </Link>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-[680px] mx-auto py-32 px-6 md:px-12 text-center">
        <p className="font-[family-name:var(--font-serif)] text-[clamp(22px,3.5vw,32px)] font-light leading-relaxed text-[#2c2c2c]">
          审美是一种积累。
          <br />
          在万千碎片中，找到属于自己的语言。
        </p>
        <span className="block mt-8 font-sans text-xs tracking-[0.15em] text-[var(--muted-foreground)] uppercase">
          — Our Philosophy
        </span>
      </section>

      {/* Feature cards */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { num: "01", title: "图片收藏", desc: "穿搭、摄影、设计——所有视觉灵感，拖拽即存。" },
            { num: "02", title: "文字摘录", desc: "触动你的文案、台词、诗句，随手记录。" },
            { num: "03", title: "链接剪藏", desc: "网页上的灵感，一键保存，自动抓取预览。" },
          ].map(({ num, title, desc }) => (
            <div key={num} className="p-8 bg-white/60 rounded-sm">
              <p className="text-[#c4736e] text-xs tracking-[0.2em] uppercase mb-4">{num}</p>
              <h3 className="font-[family-name:var(--font-serif)] text-xl mb-3">{title}</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex justify-between px-6 md:px-12 py-20 text-xs text-[var(--muted-foreground)] tracking-[0.05em] max-sm:flex-col max-sm:gap-2">
        <span>hello@beauty.studio</span>
        <span>© 2026 Beauty Studio</span>
      </footer>
    </>
  );
}
