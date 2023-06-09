import "./globals.css";

export const metadata = {
  title: "Trello",
  description: "Generated by create ROSHAN ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f6fb">{children}</body>
    </html>
  );
}
