import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
//import { Play, Image as ImageIcon, X, Video, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Play, Image as ImageIcon, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface GalleryItem {
  id: number
  type: 'image' | 'video'
  url: string
  caption: string
  category: string
}

const items: GalleryItem[] = [
  { id: 1, type: 'video', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/WhatsApp-Video-2022-10-04-at-8.28.05-AM-1.mp4', caption: 'Student Training Session — Practical Coaching', category: 'Training' },
  { id: 2, type: 'video', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/12/VIDEO-2022-12-18-18-14-58-1.mp4', caption: 'SSDC Center Classroom Seminar', category: 'Seminar' },
  { id: 3, type: 'video', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/12/VIDEO-2022-12-18-18-08-43.mp4', caption: 'Vocational Training Workshop Tour', category: 'Workshop' },
  { id: 4, type: 'video', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/12/VIDEO-2022-12-18-18-10-43.mp4', caption: 'Practical Workshop Demonstration', category: 'Workshop' },
  { id: 5, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1088-2-828x828.jpg', caption: 'Classroom Instruction Lecture', category: 'Classroom' },
  { id: 6, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1099-828x828.jpg', caption: 'Technical Lab Workstation', category: 'Lab' },
  { id: 7, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1101-828x828.jpg', caption: 'Practical Workshop — Piping Systems', category: 'Workshop' },
  { id: 8, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1100-828x828.jpg', caption: 'Student AutoCAD Drafting Station', category: 'Lab' },
  { id: 9, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1102-828x828.jpg', caption: 'Independent Study Area', category: 'Classroom' },
  { id: 10, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1103-786x786.jpg', caption: 'Group Learning Discussions', category: 'Classroom' },
  { id: 11, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1089-2-828x828.jpg', caption: 'Classroom Lecture Session', category: 'Classroom' },
  { id: 12, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1088-1-1-828x828.jpg', caption: 'Practical Training in Progress', category: 'Training' },
  { id: 13, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1089-1-828x828.jpg', caption: 'Professional Coach Guidance', category: 'Training' },
  { id: 14, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1088-1-828x828.jpg', caption: 'Vocational Skill Seminar', category: 'Seminar' },
  { id: 15, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/10/IMG_1089-828x828.jpg', caption: 'Classroom Activities Overview', category: 'Classroom' },
  { id: 16, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/12/PHOTO-2022-12-16-21-53-36-1-641x641.jpg', caption: 'Certified Course Batch Photo', category: 'Batch' },
  { id: 17, type: 'image', url: 'https://center.isdmgroup.in/wp-content/uploads/2022/12/PHOTO-2022-12-16-21-53-36-2-653x653.jpg', caption: 'SSDC Mysore Student Group', category: 'Batch' },
  { id: 18, type: 'image', url: '/gallery/certificate_1.jpg', caption: 'Mohammed Maaz — TWG International Certificate', category: 'Batch' },  
  { id: 19, type: 'image', url: '/gallery/certificate_2.jpg', caption: 'Mohammed Maaz — Professional Skills Certificate', category: 'Batch' },
  { id: 20, type: 'image', url: '/gallery/accountning_tally.jpg', caption: 'Accounting & Tally Prime Course — SSDC Mysore', category: 'Training' },
  { id: 21, type: 'video', url: '/gallery/tally_course_video.mp4', caption: 'Accounting & Tally Training Session', category: 'Training' },
]

type FilterType = 'all' | 'image' | 'video'

export default function Gallery() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const filteredItems = filter === 'all' ? items : items.filter((item) => item.type === filter)
  const imageCount = items.filter((i) => i.type === 'image').length
  const videoCount = items.filter((i) => i.type === 'video').length

  const openLightbox = (item: GalleryItem) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id)
    setActiveIndex(idx)
  }

  const closeLightbox = useCallback(() => setActiveIndex(null), [])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null))
  }, [filteredItems.length])

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null))
  }, [filteredItems.length])

  useEffect(() => {
    if (activeIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIndex, closeLightbox, goPrev, goNext])

  const activeItem = activeIndex !== null ? filteredItems[activeIndex] : null

  const filterConfig = [
    { id: 'all' as FilterType, label: 'All Media', count: items.length },
    { id: 'image' as FilterType, label: 'Photos', count: imageCount },
    { id: 'video' as FilterType, label: 'Videos', count: videoCount },
  ]

  return (
    <div className="space-y-10">

      {/* Stats row */}
      <div className="flex items-center justify-center gap-8 py-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="text-center">
          <div className="text-2xl font-extrabold text-slate-900">{imageCount}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Photos</div>
        </div>
        <div className="w-px h-10 bg-slate-200" />
        <div className="text-center">
          <div className="text-2xl font-extrabold text-slate-900">{videoCount}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Videos</div>
        </div>
        <div className="w-px h-10 bg-slate-200" />
        <div className="text-center">
          <div className="text-2xl font-extrabold text-primary">{items.length}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex justify-center gap-3">
        {filterConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              filter === tab.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white text-slate-600 hover:text-primary hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              filter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              onClick={() => openLightbox(item)}
              className="group relative bg-slate-100 rounded-2xl overflow-hidden cursor-pointer aspect-square shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                  <video src={item.url} className="w-full h-full object-cover opacity-30" muted preload="metadata" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary p-4 rounded-full text-white shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-5 w-5 fill-current" />
                    </div>
                  </div>
                </div>
              )}

              {/* Type badge */}
              <div className="absolute top-2 left-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  item.type === 'video' ? 'bg-primary text-white' : 'bg-white/90 text-slate-700'
                }`}>
                  {item.type === 'video'
                    ? <Play className="h-2.5 w-2.5 fill-current" />
                    : <ImageIcon className="h-2.5 w-2.5" />}
                  {item.type}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <div className="flex items-start gap-1.5 text-white">
                  <ZoomIn className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-tight line-clamp-2">{item.caption}</p>
                </div>
                <span className="text-[10px] text-slate-300 font-medium mt-1">{item.category}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeItem && activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="absolute inset-0" onClick={closeLightbox} />

            {/* Top bar */}
            <div className="absolute top-4 left-4 z-20 bg-white/10 px-3 py-1.5 rounded-full text-white text-xs font-semibold">
              {activeIndex + 1} / {filteredItems.length}
            </div>
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Nav buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Media */}
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 max-w-4xl w-full flex flex-col rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-black flex items-center justify-center" style={{ minHeight: '60vh' }}>
                {activeItem.type === 'image' ? (
                  <img src={activeItem.url} alt={activeItem.caption} className="max-h-[70vh] max-w-full object-contain" />
                ) : (
                  <video src={activeItem.url} controls autoPlay className="w-full max-h-[70vh] object-contain" />
                )}
              </div>
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${
                    activeItem.type === 'video' ? 'text-primary' : 'text-accent'
                  }`}>
                    {activeItem.type} · {activeItem.category}
                  </span>
                  <h4 className="text-white font-semibold text-sm mt-0.5">{activeItem.caption}</h4>
                </div>
                <span className="text-slate-500 text-xs hidden sm:block">← → arrow keys to navigate</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
