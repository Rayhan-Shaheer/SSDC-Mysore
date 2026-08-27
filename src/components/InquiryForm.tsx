import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle, User, MapPin, Phone } from 'lucide-react'

// ─── EmailJS Configuration ────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_1  = import.meta.env.VITE_EMAILJS_TEMPLATE_1
const EMAILJS_TEMPLATE_2  = import.meta.env.VITE_EMAILJS_TEMPLATE_2
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const ADMIN_EMAIL         = import.meta.env.VITE_ADMIN_EMAIL
const CC_EMAIL            = import.meta.env.VITE_CC_EMAIL
// ─────────────────────────────────────────────────────────────────────────────

interface FormState {
  firstName: string
  lastName: string
  gender: string
  dob: string
  fatherName: string
  motherName: string
  address: string
  city: string
  state: string
  zipCode: string
  nationality: string
  mobileNumber: string
  email: string
  qualification: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

const initialFormState: FormState = {
  firstName: '',
  lastName: '',
  gender: '',
  dob: '',
  fatherName: '',
  motherName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  nationality: 'Indian',
  mobileNumber: '',
  email: '',
  qualification: '',
  message: '',
}

function FieldError({ message }: { message: string }) {
  return (
    <span className="flex items-center space-x-1 text-xs text-red-500 mt-1">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </span>
  )
}

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
      <div className="bg-primary/10 p-2 rounded-xl text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-slate-800 text-base sm:text-lg">{title}</h3>
    </div>
  )
}

function InputField({
  id, label, type = 'text', placeholder, value, onChange, error, required = true,
}: {
  id: string; label: string; type?: string; placeholder?: string
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string; required?: boolean
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type} id={id} name={id} value={value}
        onChange={onChange} placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
        }`}
      />
      {error && <FieldError message={error} />}
    </div>
  )
}

export default function InquiryForm() {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n })
  }

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.firstName.trim())    e.firstName    = 'First name is required.'
    if (!form.lastName.trim())     e.lastName     = 'Last name is required.'
    if (!form.gender)              e.gender       = 'Gender is required.'
    if (!form.dob)                 e.dob          = 'Date of birth is required.'
    if (!form.fatherName.trim())   e.fatherName   = "Father's name is required."
    if (!form.motherName.trim())   e.motherName   = "Mother's name is required."
    if (!form.address.trim())      e.address      = 'Address is required.'
    if (!form.city.trim())         e.city         = 'City is required.'
    if (!form.state.trim())        e.state        = 'State is required.'
    if (!form.zipCode.trim())      e.zipCode      = 'Zip code is required.'
    if (!form.nationality.trim())  e.nationality  = 'Nationality is required.'
    if (!form.qualification)       e.qualification = 'Qualification is required.'
    if (!form.mobileNumber.trim()) {
      e.mobileNumber = 'Mobile number is required.'
    } else if (!/^\d{10}$/.test(form.mobileNumber.replace(/[-\s]/g, ''))) {
      e.mobileNumber = 'Enter a valid 10-digit mobile number.'
    }
    if (!form.email.trim()) {
      e.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) {
      const firstKey = Object.keys(errors)[0]
      document.getElementsByName(firstKey)?.[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSubmitting(true)

    const submittedOn = new Date().toLocaleString('en-IN', {
      dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Kolkata',
    })

    const commonParams = {
      student_name: `${form.firstName} ${form.lastName}`,
      gender:        form.gender,
      dob:           form.dob,
      father_name:   form.fatherName,
      mother_name:   form.motherName,
      nationality:   form.nationality,
      address:       form.address,
      city:          form.city,
      state:         form.state,
      zip_code:      form.zipCode,
      mobile:        form.mobileNumber,
      student_email: form.email,
      qualification: form.qualification,
      message:       form.message || 'No specific message provided.',
      submitted_on:  submittedOn,
    }

    try {
      // Template 1 — Admin notification (with CC)
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_1,
        {
          ...commonParams,
          to_email:  ADMIN_EMAIL,
          cc_email:  CC_EMAIL,
          reply_to:  form.email,
        },
        EMAILJS_PUBLIC_KEY
      )

      // Template 2 — Student auto-reply
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_2,
        {
          ...commonParams,
          to_email:  form.email,
          reply_to:  'noreply@ssdcmysore.com',
        },
        EMAILJS_PUBLIC_KEY
      )

      setIsSubmitting(false)
      setIsSuccess(true)

      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })

    } catch (err) {
      console.error('EmailJS error:', err)
      setIsSubmitting(false)
      setSubmitError('Something went wrong. Please try again or call us at +91 9008819502.')
    }
  }

  const handleReset = () => {
    setForm(initialFormState)
    setErrors({})
    setSubmitError('')
    setIsSuccess(false)
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
      errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
    }`

  return (
    <div className="relative">
      <AnimatePresence mode="wait">

        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-8 bg-white border border-slate-100 p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-100/50"
          >

            {/* Section 1 — Personal Details */}
            <div className="space-y-6">
              <SectionHeader icon={User} title="Personal Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

                <InputField id="firstName" label="First Name" value={form.firstName}
                  onChange={handleChange} error={errors.firstName} />

                <InputField id="lastName" label="Last Name" value={form.lastName}
                  onChange={handleChange} error={errors.lastName} />

                {/* Gender */}
                <div className="space-y-1">
                  <label htmlFor="gender" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select id="gender" name="gender" value={form.gender}
                    onChange={handleChange} className={inputClass('gender')}>
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  {errors.gender && <FieldError message={errors.gender} />}
                </div>

                <InputField id="dob" label="Date of Birth" type="date" value={form.dob}
                  onChange={handleChange} error={errors.dob} />

                <InputField id="fatherName" label="Father's Name" value={form.fatherName}
                  onChange={handleChange} error={errors.fatherName} />

                <InputField id="motherName" label="Mother's Name" value={form.motherName}
                  onChange={handleChange} error={errors.motherName} />

                <InputField id="nationality" label="Nationality" value={form.nationality}
                  onChange={handleChange} error={errors.nationality} />

              </div>
            </div>

            {/* Section 2 — Address */}
            <div className="space-y-6">
              <SectionHeader icon={MapPin} title="Address Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">

                <div className="sm:col-span-2 space-y-1">
                  <label htmlFor="address" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Permanent Address <span className="text-red-500">*</span>
                  </label>
                  <input type="text" id="address" name="address" value={form.address}
                    onChange={handleChange} className={inputClass('address')} />
                  {errors.address && <FieldError message={errors.address} />}
                </div>

                <InputField id="city" label="City" value={form.city}
                  onChange={handleChange} error={errors.city} />

                <InputField id="state" label="State" value={form.state}
                  onChange={handleChange} error={errors.state} />

                <InputField id="zipCode" label="Zip Code" value={form.zipCode}
                  onChange={handleChange} error={errors.zipCode} />

              </div>
            </div>

            {/* Section 3 — Contact & Qualification */}
            <div className="space-y-6">
              <SectionHeader icon={Phone} title="Contact & Qualifications" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                <InputField id="mobileNumber" label="Mobile Number" type="tel"
                  placeholder="E.g. 9876543210" value={form.mobileNumber}
                  onChange={handleChange} error={errors.mobileNumber} />

                <InputField id="email" label="Email Address" type="email"
                  placeholder="name@example.com" value={form.email}
                  onChange={handleChange} error={errors.email} />

                {/* Qualification */}
                <div className="space-y-1">
                  <label htmlFor="qualification" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Qualification <span className="text-red-500">*</span>
                  </label>
                  <select id="qualification" name="qualification" value={form.qualification}
                    onChange={handleChange} className={inputClass('qualification')}>
                    <option value="">Select Qualification</option>
                    <option value="BE / B.Tech">B.E / B.Tech</option>
                    <option value="Diploma in Engineering">Diploma in Engineering</option>
                    <option value="ITI Graduate">ITI Graduate</option>
                    <option value="BSC / Academic Graduate">B.Sc / Academic Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.qualification && <FieldError message={errors.qualification} />}
                </div>

              </div>

              {/* Message */}
              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Course Interest / Message
                </label>
                <textarea id="message" name="message" rows={4}
                  placeholder="Tell us which course you are interested in..."
                  value={form.message} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-4">
              <button type="button" onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer">
                Clear Fields
              </button>
              <button type="submit" disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>

          </motion.form>
        ) : (

          /* Success Screen */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-100 p-8 sm:p-16 rounded-3xl shadow-xl text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-light max-w-md mx-auto">
                Thank you <strong>{form.firstName}</strong>! We have received your inquiry and sent a confirmation to <strong>{form.email}</strong>. Our counselor will contact you within 24 hours.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 max-w-sm mx-auto">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">What happens next?</div>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-primary font-bold shrink-0">1.</span>
                <span>Check your email for a confirmation message from SSDC Mysore</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-primary font-bold shrink-0">2.</span>
                <span>Our counselor will call you on <strong>{form.mobileNumber}</strong> within 24 hours</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-primary font-bold shrink-0">3.</span>
                <span>Visit our center at Rajivnagar, Mysuru for final enrollment</span>
              </div>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleReset}
                className="px-8 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer">
                Submit Another Inquiry
              </button>
              <a href="tel:+919008819502"
                className="px-8 py-3 rounded-full border border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all">
                📞 Call Us Directly
              </a>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
