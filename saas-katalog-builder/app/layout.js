import './globals.css'

export const metadata = {
  title: 'KatalogCraft SaaS',
  description: 'Instant Digital Catalog Website Builder',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  )
}