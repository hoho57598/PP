"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Mock Data ─── */
const BRANDS = [
  { name: "파타고니아", logo: "🏔️" },
  { name: "나이키", logo: "✓" },
  { name: "프라이탁", logo: "🟧" },
  { name: "아디다스", logo: "△" },
  { name: "이케아", logo: "🟡" },
  { name: "RUS", logo: "R" },
];

const CATEGORIES = [
  { icon: "👕", name: "패션" },
  { icon: "👜", name: "패션소품" },
  { icon: "🏠", name: "라이프스타일" },
  { icon: "🎨", name: "취미" },
  { icon: "👶", name: "키즈" },
  { icon: "💻", name: "디지털테크" },
  { icon: "🧸", name: "리퍼" },
  { icon: "🐾", name: "반려동물" },
];

const PRODUCTS = [
  { name: "업사이클링 크로스백", brand: "프라이탁", price: "172,800", discount: "10%", img: "👜" },
  { name: "재생 폴리 자켓", brand: "파타고니아", price: "356,000", discount: "", img: "🧥" },
  { name: "오가닉 코튼 후디", brand: "나이키", price: "128,000", discount: "15%", img: "👕" },
  { name: "리사이클 백팩", brand: "RUS", price: "89,000", discount: "20%", img: "🎒" },
  { name: "재활용 원단 토트백", brand: "아디다스", price: "65,000", discount: "", img: "👝" },
  { name: "업사이클 스니커즈", brand: "나이키", price: "198,000", discount: "5%", img: "👟" },
];

const EXPERIENCES = [
  { title: "플라스틱 병으로 화분 제작", date: "매주 토요일", price: "15,900", rating: "4.9", img: "🌱" },
  { title: "데님 리메이크 워크숍", date: "격주 일요일", price: "25,000", rating: "4.8", img: "✂️" },
  { title: "페트병 업사이클 클래스", date: "매주 수요일", price: "19,900", rating: "4.7", img: "♻️" },
];

const CAMPAIGNS = [
  { title: "지역 가구 보수 프로젝트", participants: "1,234", progress: 72, amount: "19,900" },
  { title: "해양 플라스틱 수거 챌린지", participants: "3,456", progress: 85, amount: "49,900" },
  { title: "제로웨이스트 체험 박스", participants: "892", progress: 45, amount: "39,900" },
];

const NAV_ITEMS = ["카테고리", "업사이클 체험", "지구 살리기", "도서관", "커뮤니티", "소식"];

export default function ReusefulDemo() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  const toggleLike = (idx: number) => {
    setLikedProducts((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Back to portfolio */}
      <a
        href="/portfolio/re-useful"
        className="fixed top-4 left-4 z-50 px-3 py-1.5 bg-black/80 text-white text-xs rounded-full backdrop-blur-sm hover:bg-black transition-colors"
      >
        ← 포트폴리오로
      </a>

      {/* ─── Header ─── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <span className="text-lg font-black tracking-tight">RE:USEFUL</span>
              <div className="hidden md:flex items-center gap-4">
                {NAV_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-gray-500 hover:text-black cursor-pointer transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-400">
                <span>🔍</span>
                <span>재활용 제품을 검색해보세요</span>
              </div>
              <button
                className="relative"
                onClick={() => setCartCount((c) => c + 1)}
              >
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Hero Banner ─── */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 text-white">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm opacity-70 mb-2">파타고니아 × RE:USEFUL</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                협업 단독 발매
              </h1>
              <p className="text-base opacity-80 max-w-md mb-6">
                지속가능한 소재로 만든 한정판 컬렉션을 만나보세요.
              </p>
              <button className="px-6 py-2.5 bg-white text-emerald-900 font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors">
                자세히 보기
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 지구를 살리는 추천 제품 ─── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-1">🌿 지구를 살리는 추천 제품</h2>
        <p className="text-sm text-gray-400 mb-6">
          업사이클링/리사이클링을 활용한 제품을 소개합니다.
        </p>

        {/* Brand strip */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {BRANDS.map((b) => (
            <motion.div
              key={b.name}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-gray-50 cursor-pointer flex-shrink-0 hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">{b.logo}</span>
              <span className="text-xs text-gray-500">{b.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group rounded-xl overflow-hidden border border-gray-100 bg-white cursor-pointer"
            >
              <div className="relative aspect-square bg-gray-50 flex items-center justify-center text-6xl">
                {p.img}
                {p.discount && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                    {p.discount}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(i);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-lg transition-transform hover:scale-110"
                >
                  {likedProducts.has(i) ? "❤️" : "🤍"}
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400">{p.brand}</p>
                <p className="text-sm font-medium mt-0.5 truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {p.discount && (
                    <span className="text-red-500 text-sm font-bold">{p.discount}</span>
                  )}
                  <span className="text-sm font-bold">{p.price}원</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-6">카테고리</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map((c, i) => (
              <motion.button
                key={c.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(i)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all ${
                  activeCategory === i
                    ? "bg-emerald-50 ring-2 ring-emerald-400"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs font-medium">{c.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 업사이클링 체험 ─── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-1">🌀 업사이클링 체험/봉사</h2>
        <p className="text-sm text-gray-400 mb-6">
          직접 만들고, 배우고, 함께 실천하세요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPERIENCES.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-gray-100 overflow-hidden bg-white cursor-pointer"
            >
              <div className="aspect-[16/10] bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-5xl">
                {e.img}
              </div>
              <div className="p-4">
                <p className="font-medium text-sm mb-1">{e.title}</p>
                <p className="text-xs text-gray-400 mb-2">{e.date}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-600">
                    {e.price}원
                  </span>
                  <span className="text-xs text-gray-400">⭐ {e.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 기부 캠페인 ─── */}
      <section className="bg-gradient-to-br from-blue-50 to-emerald-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-1">🌍 지구 살리기 캠페인</h2>
          <p className="text-sm text-gray-400 mb-6">
            참여하면 포인트가 자동으로 기부됩니다.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: "총 참여자", value: "35,125명" },
              { label: "누적 기부금", value: "212,341,000원" },
              { label: "캠페인 수", value: "2,240개" },
              { label: "참여율", value: "85.63%" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl p-4 text-center"
              >
                <p className="text-lg md:text-xl font-bold text-emerald-600">
                  {s.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Campaign cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CAMPAIGNS.map((c, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-5 cursor-pointer"
              >
                <p className="font-medium text-sm mb-3">{c.title}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>참여 {c.participants}명</span>
                  <span>{c.progress}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{c.amount}원</span>
                  <button className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-full hover:bg-emerald-600 transition-colors">
                    참여하기
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RE:BOOK 도서관 ─── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-1">📚 RE:BOOK 구독형 도서관</h2>
        <p className="text-sm text-gray-400 mb-6">
          중고 도서를 통해 독서의 재미를 이어갈 수 있으며, 구독을 통해 다양한 도서를 선택할 수 있음
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "기본 구독권", price: "9,900", books: "월 3권", color: "emerald" },
            { name: "시리즈 구독권", price: "19,900", books: "월 6권", color: "blue" },
            { name: "음악/조합 컨텐츠 구독권", price: "29,900", books: "무제한", color: "purple" },
          ].map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              className="rounded-xl border border-gray-100 p-6 bg-white cursor-pointer text-center"
            >
              <p className="font-bold text-base mb-1">{plan.name}</p>
              <p className="text-xs text-gray-400 mb-4">{plan.books}</p>
              <p className="text-2xl font-bold mb-4">
                <span className="text-emerald-600">{plan.price}</span>
                <span className="text-sm text-gray-400 font-normal">원/월</span>
              </p>
              <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors">
                구독하기
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <p className="text-xl font-black mb-2">RE:USEFUL</p>
              <p className="text-sm text-gray-400">
                지속가능한 일상, RE:USEFUL
              </p>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <div className="flex flex-col gap-2">
                <span className="text-white font-medium">서비스</span>
                <span>이용약관</span>
                <span>개인정보처리방침</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-white font-medium">고객지원</span>
                <span>FAQ</span>
                <span>문의하기</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-8">
            © 2025 RE:USEFUL. All rights reserved. (데모 페이지)
          </p>
        </div>
      </footer>
    </div>
  );
}
