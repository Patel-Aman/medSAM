export const metadata = {
  title: 'MedSAM Demo',
  description: 'Demo of MedSAM for medical image segmentation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
