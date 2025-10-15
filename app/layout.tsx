
import "./globals.css";
import { Lato, Playfair_Display_SC, Poppins } from "next/font/google";
import NextTopLoader from 'nextjs-toploader'

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-lato",
});

const playfair = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400","500", "600","700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  title: "Bridge Point Solution",
  description: "Next.js 14 App with custom fonts",
  icons: {
    icon: "/assets/apple-touch-icon.png",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${playfair.variable} ${poppins.variable}`}
    >
      <body className={lato.className}>
          <NextTopLoader color="#0070f3" height={3}   showSpinner={false} />
        {children}
        </body>
    </html>
  );
}
