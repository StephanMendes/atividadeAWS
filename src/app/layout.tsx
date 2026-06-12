import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR ">
      <body className="bg-gray-800 text-white">{children}</body>
    </html>
  );
}
