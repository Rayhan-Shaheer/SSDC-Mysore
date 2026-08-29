import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  url?: string
}

const BASE_URL = 'https://www.ssdcmysore.com'
const DEFAULT_DESC = 'Authorized ISDM skill development franchise in Rajivnagar, Mysuru. Technical, ITI, NDT, and job-oriented courses for BE, Diploma, and ITI graduates. 100% placement support.'
const DEFAULT_KEYWORDS = 'skill development center mysore, SSDC mysore, ISDM franchise mysore, NDT courses mysore, ITI training mysore, oil gas training karnataka, vocational training mysuru, technical courses rajivnagar'

export default function SEO({ title, description, keywords, url }: SEOProps) {
  const fullTitle = title ? `${title} | SSDC Mysore` : 'SSDC Mysore — Sahar Skill Development Center'
  const metaDesc = description || DEFAULT_DESC
  const metaKeywords = keywords || DEFAULT_KEYWORDS
  const metaUrl = url ? `${BASE_URL}${url}` : BASE_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content="Sahar Skill Development Center" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content="https://www.ssdcmysore.com/ssdcmysore_logo.jpg" />
      <meta property="og:site_name" content="SSDC Mysore" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content="https://www.ssdcmysore.com/ssdcmysore_logo.jpg" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Sahar Skill Development Center",
        "alternateName": "SSDC Mysore",
        "url": BASE_URL,
        "description": DEFAULT_DESC,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "No. 2 Ground Floor, 2nd Stage, Rajivnagar, Near Al Badar Circle",
          "addressLocality": "Mysuru",
          "addressRegion": "Karnataka",
          "postalCode": "570019",
          "addressCountry": "IN"
        },
        "telephone": ["+91-9008819502", "0821-2501258"],
        "email": "basheer@ssdcmysore.com",
        "openingHours": "Mo-Sa 10:30-18:00"
      })}</script>
    </Helmet>
  )
}
