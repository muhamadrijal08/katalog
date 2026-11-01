export const metadata = {
  title: 'KatalogCraft SaaS',
  description: 'Instant Digital Catalog Website Builder',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}