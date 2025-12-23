import "./globals.css";
import SiteHeader from "@/components/ui/SiteHeader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-neutral-950 text-neutral-50">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
