import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Providers from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "One Romeo",
  description: "I just want to do my part. To leave my footprints in the sand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} mx-10` }>
      <Providers>
            <Header />
              <main className="md:container mx-auto bg-neutral-100 mt-10 p-10 rounded-md prose">         
                {children}
              </main>
              <Footer />
      </Providers>
        </body>
    </html>
  );
}
