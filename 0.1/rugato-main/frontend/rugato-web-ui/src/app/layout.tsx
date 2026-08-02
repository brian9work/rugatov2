import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Rugato",
  description: "Gestion de restaurante",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
