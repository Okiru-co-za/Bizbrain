import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bizbrain-production-5ef3.up.railway.app'

  res.setHeader('Content-Type', 'text/plain')
  res.write(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /dashboard\nDisallow: /customers\nDisallow: /assistant\nDisallow: /auth/\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
  res.end()

  return { props: {} }
}

export default function Robots() {
  return null
}
