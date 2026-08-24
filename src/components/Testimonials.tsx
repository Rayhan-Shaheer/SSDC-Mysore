import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Mohammed Arshad',
    role: 'NDT Technician',
    company: 'L&T Construction, Mumbai',
    qualification: 'Diploma in Mechanical',
    rating: 5,
    text: 'After completing the NDT Level II course at SSDC, I got placed at L&T within 6 weeks. The practical training on UT and MT was exceptional. The faculty here actually work in the industry — that makes all the difference.',
    initials: 'MA',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    name: 'Priya Kumari',
    role: 'QC Inspector',
    company: 'TATA Projects, Bengaluru',
    qualification: 'BE in Civil Engineering',
    rating: 5,
    text: 'I was struggling to find a job after my BE. SSDC\'s Job Oriented course in QA/QC completely changed my career path. The placement support team was with me every step — from resume to interview prep.',
    initials: 'PK',
    color: 'bg-emerald-50 text-emerald-700',
  },
  {
    name: 'Ravi Shankar G.',
    role: 'AutoCAD Draftsman',
    company: 'Shapoorji Pallonji, Mysuru',
    qualification: 'ITI – Fitter Trade',
    rating: 5,
    text: 'Being an ITI graduate, I thought my options were limited. SSDC\'s AutoCAD and Civil Drafting course gave me a skill that companies actually need. Got hired locally in Mysore — couldn\'t be happier.',
    initials: 'RS',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    name: 'Farheen Begum',
    role: 'Office Administrator',
    company: 'MRC Hospital, Mysuru',
    qualification: 'BA Graduate',
    rating: 5,
    text: 'As a non-technical graduate, I wasn\'t sure which course to pick. The free counseling at SSDC helped me choose the right path. The Tally + MS Office course got me placed within a month of completion.',
    initials: 'FB',
    color: 'bg-rose-50 text-rose-700',
  },
  {
    name: 'Suresh Naik',
    role: 'Piping Designer',
    company: 'Petrofac, Dubai (via placement)',
    qualification: 'Diploma in Mechanical',
    rating: 5,
    text: 'The Oil & Gas and PDMS course at SSDC is what got me into the Gulf sector. The training quality matches what international companies expect. Highly recommend to anyone targeting the energy industry.',
    initials: 'SN',
    color: 'bg-indigo-50 text-indigo-700',
  },
  {
    name: 'Anjali R.',
    role: 'Web Developer Intern',
    company: 'Tech startup, Mysuru',
    qualification: 'BCA Graduate',
    rating: 5,
    text: 'I joined the Web Design course just to improve my skills, but ended up getting an internship offer before I even finished. The practical projects we built during training made my portfolio stand out.',
    initials: 'AR',
    color: 'bg-purple-50 text-purple-700',
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 fill-primary" />
            <span>Student Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Our Students Say
          </h2>
          <p className="text-slate-500 text-sm font-light leading-relaxed">
            Over 1,200 students have transformed their careers through SSDC. Here are a few of their stories.
          </p>
          <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-primary/20 fill-primary/10" />
              </div>

              {/* Rating */}
              <StarRating count={t.rating} />

              {/* Testimonial text */}
              <p className="mt-3 text-slate-600 text-sm font-light leading-relaxed flex-grow">
                "{t.text}"
              </p>

              {/* Divider */}
              <div className="border-t border-slate-100 mt-5 pt-5">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role} · {t.company}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Was: {t.qualification}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div>
            <div className="text-2xl font-extrabold text-slate-900">1,200+ students placed</div>
            <div className="text-sm text-slate-500 font-light mt-1">
              Across Oil & Gas, NDT, IT, and core infrastructure sectors since 2022
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex -space-x-2">
              {['MA', 'PK', 'RS', 'FB', 'SN'].map((init, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white bg-primary/10 text-primary text-xs font-bold flex items-center justify-center"
                >
                  {init}
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-500 font-medium ml-1">
              +1,195 more
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
