import Layout from "../components/layout/Layout";
import { NextSeo } from "next-seo";

export default function Results() {
  return (
    <Layout>
      <NextSeo title="Exam Results - Government Job Results | JobPulse India" />
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h1 className="text-3xl font-extrabold mb-3">Exam Results</h1>
        <p className="text-gray-500">Latest government exam results and merit lists.</p>
        <p className="text-sm text-gray-400 mt-4">This section populates automatically as results are declared.</p>
      </div>
    </Layout>
  );
}
