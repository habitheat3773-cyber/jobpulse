import "../styles/globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { Toaster } from "react-hot-toast";
import { DefaultSeo } from "next-seo";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <DefaultSeo
        titleTemplate="%s | JobPulse India"
        defaultTitle="JobPulse India - India's Smart Government Job Alert Platform"
        description="Get instant alerts for latest government jobs in India. Search central and state government vacancies, railway, banking, police, SSC, UPSC jobs."
        openGraph={{
          type: "website",
          locale: "en_IN",
          url: "https://jobpulseindia.com/",
          siteName: "JobPulse India",
          images: [{ url: "https://jobpulseindia.com/og-image.png", width: 1200, height: 630 }],
        }}
        additionalLinkTags={[
          { rel: "icon", href: "/favicon.ico" },
          { rel: "manifest", href: "/manifest.json" },
        ]}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { fontFamily: "'DM Sans', sans-serif", fontSize: "14px" },
        }}
      />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
