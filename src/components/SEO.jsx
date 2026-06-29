import { Helmet } from 'react-helmet-async'

function SEO({ title, description, keywords, image, url }) {
  const siteName = 'Syed Cars'

  const fullTitle = title
    ? `${title} | ${siteName}`
    : 'Syed Cars | Premium Pre-Owned Cars in Madanapalle'

  const defaultDescription =
    'Syed Cars — Buy and sell premium pre-owned cars with confidence. Every car is inspected, verified, and quality assured. Find your perfect car today.'

  const defaultKeywords =
    'buy used cars India, premium pre-owned cars, second hand cars, certified used cars, sell my car India, inspected used cars, Syed Cars, quality assured pre-owned vehicles, best used car dealer India'

  const metaDescription = description || defaultDescription
  const metaKeywords = keywords || defaultKeywords
  const metaImage = image || 'https://www.syedcars.com/og-image.jpg'
  const canonicalUrl =
    url ||
    (typeof window !== 'undefined'
      ? window.location.href
      : 'https://www.syedcars.com/')

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  )
}

export default SEO