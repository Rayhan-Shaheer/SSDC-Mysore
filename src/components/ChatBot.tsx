import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Phone, MapPin, Clock, ChevronRight } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number
  from: 'bot' | 'user'
  text: string
  options?: Option[]
  timestamp: Date
}

interface Option {
  label: string
  value: string
  icon?: string
}

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const RESPONSES: Record<string, { text: string; options?: Option[] }> = {
  greeting: {
    text: "Hi! 👋 I'm SSDC's virtual counselor. I can help you with courses, fees, eligibility, and admissions.\n\nWhat would you like to know?",
    options: [
      { label: '📚 View Courses', value: 'courses' },
      { label: '💰 Fee Details', value: 'fees' },
      { label: '🎓 Am I Eligible?', value: 'eligibility' },
      { label: '📝 How to Apply', value: 'apply' },
      { label: '📍 Location & Timings', value: 'location' },
      { label: '📞 Talk to Counselor', value: 'contact' },
    ],
  },
  courses: {
    text: "We offer 5 course categories at SSDC Mysore:\n\n🔧 Technical Courses — AutoCAD, SolidWorks, Revit\n⚙️ ITI Courses — Fitter, Welder, Electrician\n🔬 NDT Courses — UT, MT, PT, RT (Level I & II)\n💼 Job Oriented — Oil & Gas, QA/QC, Piping Design\n💻 Other Courses — MS Office, Tally, Web Design\n\nWhich course interests you?",
    options: [
      { label: '🔧 Technical Courses', value: 'technical' },
      { label: '⚙️ ITI Courses', value: 'iti' },
      { label: '🔬 NDT Courses', value: 'ndt' },
      { label: '💼 Job Oriented', value: 'joboriented' },
      { label: '💻 Other Courses', value: 'other' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  technical: {
    text: "🔧 Technical Courses\n\nTopics covered:\n• AutoCAD 2D & 3D\n• SolidWorks Design\n• Revit Architecture\n• Civil & Mechanical Drafting\n• Electrical Layouts\n\n📅 Duration: 1–3 months\n🎯 For: BE, Diploma graduates\n✅ Certificate: ISDM Certified",
    options: [
      { label: '💰 Fee Details', value: 'fees' },
      { label: '📝 Apply Now', value: 'apply' },
      { label: '◀ Back to Courses', value: 'courses' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  iti: {
    text: "⚙️ ITI Courses\n\nTopics covered:\n• Fitter Trade Training\n• Welder (Arc & Gas)\n• Electrician Trade\n• Draftsman Civil\n• Machinist Basics\n• CNC Machine Operations\n\n📅 Duration: 1–2 months\n🎯 For: ITI graduates & aspirants\n✅ Certificate: ISDM Certified",
    options: [
      { label: '💰 Fee Details', value: 'fees' },
      { label: '📝 Apply Now', value: 'apply' },
      { label: '◀ Back to Courses', value: 'courses' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  ndt: {
    text: "🔬 NDT Courses (Non-Destructive Testing)\n\nTopics covered:\n• Ultrasonic Testing (UT)\n• Magnetic Particle (MT)\n• Liquid Penetrant (PT)\n• Radiographic Testing (RT)\n• Visual Testing (VT)\n• NDT Level I & II Certificate\n\n📅 Duration: 1–3 months\n🎯 For: Mechanical, Civil, ITI graduates\n✅ Certificate: ASNT / ISDM Certified\n🌍 High demand in Oil & Gas sector!",
    options: [
      { label: '💰 Fee Details', value: 'fees' },
      { label: '📝 Apply Now', value: 'apply' },
      { label: '◀ Back to Courses', value: 'courses' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  joboriented: {
    text: "💼 Job Oriented Courses\n\nTopics covered:\n• Oil & Gas Technology\n• Piping Design Engineering\n• Plant Design System (PDMS)\n• QA/QC Engineering\n• Industrial Safety (HSE)\n• Placement Assistance\n\n📅 Duration: 2–4 months\n🎯 For: Technical & Non-Technical graduates\n🌍 Placements in Gulf, India & abroad!\n✅ Certificate: ISDM Certified",
    options: [
      { label: '💰 Fee Details', value: 'fees' },
      { label: '📝 Apply Now', value: 'apply' },
      { label: '◀ Back to Courses', value: 'courses' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  other: {
    text: "💻 Other Courses\n\nTopics covered:\n• MS Office (Word, Excel, PowerPoint)\n• Tally Prime with GST\n• Web Design (HTML/CSS)\n• Graphic Design Basics\n• DCA Computer Diploma\n• Career Counselling Sessions\n\n📅 Duration: 1–3 months\n🎯 For: All graduates, open entry\n✅ Certificate: ISDM Certified",
    options: [
      { label: '💰 Fee Details', value: 'fees' },
      { label: '📝 Apply Now', value: 'apply' },
      { label: '◀ Back to Courses', value: 'courses' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  fees: {
    text: "💰 Fee Information\n\nOur courses are very affordable:\n\n• Short courses (1 month): ₹2,000 – ₹5,000\n• Medium courses (2–3 months): ₹5,000 – ₹15,000\n• NDT Level II: ₹10,000 – ₹20,000\n• Job Oriented / Oil & Gas: ₹15,000 – ₹30,000\n\n✅ Installment options available\n✅ No hidden charges\n✅ Certificate included in fee\n\nFor exact fee of a specific course, contact our counselor!",
    options: [
      { label: '📞 Call for Exact Fee', value: 'contact' },
      { label: '📝 Apply Now', value: 'apply' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  eligibility: {
    text: "🎓 Eligibility at SSDC Mysore\n\nWe welcome students from ALL backgrounds:\n\n✅ BE / B.Tech graduates\n✅ Diploma in Engineering\n✅ ITI graduates\n✅ B.Sc / Academic graduates\n✅ Post graduates\n✅ Non-technical graduates (for select courses)\n✅ Working professionals looking to upskill\n\nNo age limit! If you have the will, we have the course. 💪",
    options: [
      { label: '📚 View Courses', value: 'courses' },
      { label: '📝 Apply Now', value: 'apply' },
      { label: '📞 Talk to Counselor', value: 'contact' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  apply: {
    text: "📝 How to Apply at SSDC Mysore\n\nIt's very simple — 3 easy steps:\n\n1️⃣ Fill the online admission form on our website\n2️⃣ Our counselor calls you within 24 hours\n3️⃣ Visit our center to confirm enrollment\n\nDocuments needed:\n• Academic certificates\n• Valid ID proof (Aadhaar)\n• Passport size photo\n\nClick below to go directly to the admission form!",
    options: [
      { label: '📋 Open Admission Form', value: 'openform' },
      { label: '📞 Call Instead', value: 'contact' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  location: {
    text: "📍 SSDC Mysore Location\n\nNo. 2, Ground Floor, 2nd Stage,\nRajivnagar, Near Al Badar Circle,\nMysuru, Karnataka — 570019\n\n🕐 Working Hours:\nMonday to Saturday\n10:30 AM – 6:00 PM\n\n🚌 Easily accessible by bus and auto from anywhere in Mysore!",
    options: [
      { label: '🗺️ Open Google Maps', value: 'maps' },
      { label: '📞 Call Us', value: 'contact' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  contact: {
    text: "📞 Contact SSDC Mysore\n\nOur counselors are available:\nMon–Sat, 10:30 AM – 6:00 PM\n\n📱 Mobile: +91 9008819502\n☎️ Landline: 0821-2501258\n📧 Email: basheer@ssdcmysore.com\n\nYou can also WhatsApp us using the green button on the website! We reply fast. 😊",
    options: [
      { label: '📱 Call Now', value: 'call' },
      { label: '💬 WhatsApp Us', value: 'whatsapp' },
      { label: '📝 Apply Online', value: 'apply' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  placement: {
    text: "🏆 Placement at SSDC Mysore\n\n✅ 100% Placement Assistance\n✅ 1,200+ students placed so far\n✅ Dedicated placement cell\n✅ 50+ hiring partner companies\n\n🌍 Our students work in:\n• Oil & Gas companies (Gulf, India)\n• L&T, TATA Projects, Shapoorji\n• Infrastructure & construction firms\n• IT companies in Mysore & Bengaluru\n• Government & PSU companies",
    options: [
      { label: '📚 View Courses', value: 'courses' },
      { label: '📝 Apply Now', value: 'apply' },
      { label: '🏠 Main Menu', value: 'greeting' },
    ],
  },
  default: {
    text: "I'm not sure I understood that. Let me show you the main options:",
    options: [
      { label: '📚 View Courses', value: 'courses' },
      { label: '💰 Fee Details', value: 'fees' },
      { label: '📝 How to Apply', value: 'apply' },
      { label: '📍 Location & Timings', value: 'location' },
      { label: '📞 Talk to Counselor', value: 'contact' },
    ],
  },
}

// ─── Helper ───────────────────────────────────────────────────────────────────
let msgId = 0
const makeMsg = (from: 'bot' | 'user', text: string, options?: Option[]): Message => ({
  id: ++msgId, from, text, options, timestamp: new Date(),
})

const formatTime = (d: Date) =>
  d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages([makeMsg('bot', RESPONSES.greeting.text, RESPONSES.greeting.options)])
        setHasGreeted(true)
      }, 800)
    }
  }, [isOpen, hasGreeted])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSpecialActions = (value: string): boolean => {
    if (value === 'call') {
      window.open('tel:+919008819502')
      return true
    }
    if (value === 'whatsapp') {
      window.open('https://wa.me/919008819502?text=Hello!%20I%20want%20to%20know%20more%20about%20SSDC%20Mysore%20courses.')
      return true
    }
    if (value === 'maps') {
      window.open('https://maps.google.com/?q=Rajivnagar,+Mysuru,+Karnataka+570019')
      return true
    }
    if (value === 'openform') {
      window.location.href = '/admission'
      return true
    }
    return false
  }

  const sendBotReply = (value: string) => {
    if (handleSpecialActions(value)) return
    const response = RESPONSES[value] || RESPONSES.default
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, makeMsg('bot', response.text, response.options)])
    }, 700)
  }

  const handleOption = (option: Option) => {
    setMessages((prev) => [...prev, makeMsg('user', option.label)])
    sendBotReply(option.value)
  }

  const handleTextInput = () => {
    const text = inputText.trim()
    if (!text) return
    setMessages((prev) => [...prev, makeMsg('user', text)])
    setInputText('')

    const lower = text.toLowerCase()
    let key = 'default'
    if (lower.includes('ndt') || lower.includes('non destructive')) key = 'ndt'
    else if (lower.includes('iti') || lower.includes('fitter') || lower.includes('welder')) key = 'iti'
    else if (lower.includes('technical') || lower.includes('autocad') || lower.includes('solidwork')) key = 'technical'
    else if (lower.includes('oil') || lower.includes('gas') || lower.includes('piping') || lower.includes('job')) key = 'joboriented'
    else if (lower.includes('tally') || lower.includes('office') || lower.includes('computer')) key = 'other'
    else if (lower.includes('fee') || lower.includes('cost') || lower.includes('price') || lower.includes('charge')) key = 'fees'
    else if (lower.includes('eligib') || lower.includes('qualify') || lower.includes('who can')) key = 'eligibility'
    else if (lower.includes('apply') || lower.includes('admission') || lower.includes('enroll')) key = 'apply'
    else if (lower.includes('location') || lower.includes('address') || lower.includes('where') || lower.includes('timing')) key = 'location'
    else if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('number')) key = 'contact'
    else if (lower.includes('placement') || lower.includes('job') || lower.includes('placed')) key = 'placement'
    else if (lower.includes('course') || lower.includes('program') || lower.includes('training')) key = 'courses'
    else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) key = 'greeting'

    sendBotReply(key)
  }

  return (
    <>
      {/* Notification bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 3 }}
            className="fixed bottom-24 left-6 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 max-w-[200px] cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="text-xs font-semibold text-slate-800">💬 Have questions?</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Chat with our counselor!</div>
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r border-b border-slate-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Ping ring */}
        {!isOpen && <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 left-6 z-50 w-[340px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
            style={{ maxHeight: '75vh' }}
          >
            {/* Header */}
            <div className="bg-primary px-5 py-4 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm">SSDC Counselor</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/80 text-xs">Online — replies instantly</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Close chat">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                      msg.from === 'bot' ? 'bg-primary text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {msg.from === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    <div className={`flex flex-col gap-2 max-w-[80%] ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                      {/* Bubble */}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        msg.from === 'bot'
                          ? 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-sm'
                          : 'bg-primary text-white rounded-tr-sm'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Option buttons */}
                      {msg.options && msg.from === 'bot' && (
                        <div className="flex flex-col gap-1.5 w-full">
                          {msg.options.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleOption(opt)}
                              className="flex items-center justify-between gap-2 bg-white hover:bg-primary hover:text-white border border-slate-200 hover:border-primary text-slate-700 text-xs font-medium px-3 py-2 rounded-xl transition-all duration-200 text-left group cursor-pointer"
                            >
                              <span>{opt.label}</span>
                              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <span className="text-[10px] text-slate-400 px-1">{formatTime(msg.timestamp)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2 items-end"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-2 h-2 rounded-full bg-slate-400"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Quick actions bar */}
            <div className="px-3 py-2 border-t border-slate-100 bg-white flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {[
                { label: '📚 Courses', value: 'courses' },
                { label: '💰 Fees', value: 'fees' },
                { label: '📍 Location', value: 'location' },
                { label: '📞 Contact', value: 'contact' },
              ].map((q) => (
                <button key={q.value}
                  onClick={() => handleOption(q)}
                  className="shrink-0 text-[11px] font-medium bg-slate-100 hover:bg-primary hover:text-white text-slate-600 px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap">
                  {q.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextInput()}
                placeholder="Type your question..."
                className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 transition-all"
              />
              <button onClick={handleTextInput}
                disabled={!inputText.trim()}
                className="bg-primary hover:bg-primary-hover disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-colors cursor-pointer shrink-0">
                <Send className="h-4 w-4" />
              </button>
            </div>

            {/* Footer note */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 shrink-0">
              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +91 9008819502</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Mon–Sat 10:30–18:00</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Rajivnagar, Mysuru</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
