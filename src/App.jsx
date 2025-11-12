import { useEffect, useMemo, useState } from 'react'

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-100 px-3 py-1 rounded-full text-xs">
              <span>🇵🇰</span> Karachi Inspired Styles
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Karachi Couture
            </h1>
            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              Curated Pakistani clothing inspired by the charm of Karachi — from Clifton sunsets to the hustle of Saddar. Discover lawn suits, kurtas, festive wear and more.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#shop" className="px-5 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black">Shop Now</a>
              <a href="#about" className="px-5 py-3 rounded-lg bg-white text-gray-900 border border-gray-200 font-semibold hover:bg-gray-50">Learn More</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              <img
                alt="Pakistani festive outfits"
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1593030253490-1540f48f5c3b?q=80&w=1600&auto=format&fit=crop"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white shadow-md rounded-xl px-4 py-2 text-sm border border-gray-100">
              ✨ Festive Eid Collection
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ item }) {
  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="p-4">
        <p className="text-xs text-emerald-600 font-medium">{item.category}</p>
        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
          <button className="text-sm px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Add to cart</button>
        </div>
      </div>
    </div>
  )
}

function Shop() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [message, setMessage] = useState('')

  const categories = ['All', 'Women', 'Men', 'Kids']

  const fetchProducts = async (selected) => {
    setLoading(true)
    try {
      const url = selected && selected !== 'All' ? `${baseUrl}/api/products?category=${encodeURIComponent(selected)}` : `${baseUrl}/api/products`
      const res = await fetch(url)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setItems([])
      setMessage('Could not load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(category)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const seed = async () => {
    try {
      setMessage('Seeding sample Karachi styles...')
      const res = await fetch(`${baseUrl}/api/seed`, { method: 'POST' })
      const data = await res.json()
      setMessage(data.message || 'Seed complete')
      await fetchProducts(category)
    } catch (e) {
      setMessage('Seeding failed')
    }
  }

  return (
    <section id="shop" className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Shop Pakistani Styles</h2>
        <div className="flex items-center gap-2">
          <button onClick={seed} className="text-sm px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black">Load sample products</button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm border ${category === c ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {message && (
        <div className="mt-4 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">{message}</div>
      )}

      <div className="mt-8 min-h-[120px]">
        {loading ? (
          <p className="text-gray-500">Loading products…</p>
        ) : items.length === 0 ? (
          <div className="text-gray-600">
            <p className="font-medium">No products yet.</p>
            <p className="text-sm">Click "Load sample products" to add a curated Karachi collection.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <ProductCard key={item.id || item._id || item.title} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Karachi Couture. All rights reserved.</p>
        <p>Made with love for Karachi — Clifton • Saddar • Sea View</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple navbar */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 grid place-items-center text-white font-bold">KC</div>
            <div>
              <p className="text-xl font-bold tracking-tight text-gray-800">Karachi Couture</p>
              <p className="text-xs text-gray-500 -mt-1">Karachi, Pakistan</p>
            </div>
          </a>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <a href="#shop" className="text-gray-600 hover:text-gray-900">Shop</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="/test" className="text-gray-600 hover:text-gray-900">Status</a>
          </nav>
          <button className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm">Cart</button>
        </div>
      </header>

      <Hero />
      <Shop />

      <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Rooted in Karachi</h3>
            <p className="mt-3 text-gray-600">
              Our collections blend traditional Pakistani craftsmanship with modern silhouettes. From everyday lawn to festive wear, each piece is inspired by neighborhoods and moments across Karachi.
            </p>
            <ul className="mt-4 text-gray-700 space-y-2 text-sm list-disc pl-5">
              <li>Light, breathable fabrics for coastal weather</li>
              <li>Embroideries inspired by old city architecture</li>
              <li>Colors drawn from sea, sand, and sunsets</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6">
            <p className="text-sm text-emerald-700 font-semibold">Fast Shipping in Pakistan</p>
            <p className="mt-2 text-gray-700">Karachi orders delivered within 2-3 days. Nationwide shipping available.</p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                <p className="text-2xl">🎉</p>
                <p className="text-xs mt-1 text-gray-600">Festive</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                <p className="text-2xl">🌤️</p>
                <p className="text-xs mt-1 text-gray-600">Lawn</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                <p className="text-2xl">🧵</p>
                <p className="text-xs mt-1 text-gray-600">Stitched</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
