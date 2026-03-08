import './globals.css'

export const metadata = {
  title: 'MediCare Manager',
  description: 'Complete medical management system with emergency features',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}