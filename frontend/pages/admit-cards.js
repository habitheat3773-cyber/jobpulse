// admit-cards.js
import Layout from "../components/layout/Layout";
import { NextSeo } from "next-seo";

export default function AdmitCards() {
  return (
    <Layout>
      <NextSeo title="Admit Cards - Download Hall Tickets | JobPulse India" />
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🪪</div>
        <h1 className="text-3xl font-extrabold mb-3">Admit Cards</h1>
        <p className="text-gray-500">Hall ticket download links for upcoming government exams.</p>
        <p className="text-sm text-gray-400 mt-4">This section populates automatically as admit cards are released.</p>
      </div>
    </Layout>
  );
}
