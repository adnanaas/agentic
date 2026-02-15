
import React, { useState, useCallback } from 'react';
import { getProgrammingExplanation } from './services/geminiService';
import { AIResponse, LoadingStatus } from './types';
import CodeBlock from './components/CodeBlock';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStatus(LoadingStatus.LOADING);
    setError(null);

    try {
      const data = await getProgrammingExplanation(query);
      setResult(data);
      setStatus(LoadingStatus.SUCCESS);
      
      // Smooth scroll to results
      setTimeout(() => {
        const resultSection = document.getElementById('result-section');
        resultSection?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError('عذراً، حدث خطأ أثناء جلب المعلومات. يرجى المحاولة مرة أخرى.');
      setStatus(LoadingStatus.ERROR);
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Upper Section: Input Area */}
      <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white py-12 px-4 shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-emerald-300">
            وكيلك الذكي في تعلم البرمجة
          </h1>
          <p className="text-indigo-100/80 mb-8 text-lg">
            اسأل عن أي مفهوم برمجـي، واحصل على شرح مفصل، أمثلة كود، ومحاكاة للتنفيذ.
          </p>

          <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثال: اشرح لي كيفية عمل الحلقات (Loops) في بايثون..."
              className="w-full h-32 p-4 pr-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-inner"
            />
            <button
              type="submit"
              disabled={status === LoadingStatus.LOADING}
              className="absolute bottom-4 left-4 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-600 text-white px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
            >
              {status === LoadingStatus.LOADING ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التحليل...
                </>
              ) : (
                'اطلب الشرح'
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Lower Section: Output Area */}
      <main id="result-section" className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
        {status === LoadingStatus.IDLE && (
          <div className="text-center py-20 opacity-30">
            <svg className="w-24 h-24 mx-auto mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-xl">ابدأ بكتابة سؤالك في الأعلى للحصول على الإجابة</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-lg mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && status !== LoadingStatus.LOADING && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="border-b border-slate-200 pb-6">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">{result.title}</h2>
              <div className="h-1.5 w-24 bg-indigo-500 rounded-full"></div>
            </header>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 p-1.5 rounded-lg">🚀</span>
                مقدمة عن الموضوع
              </h3>
              <p className="text-slate-600 leading-loose text-lg whitespace-pre-line">
                {result.introduction}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="bg-slate-200 p-1.5 rounded-lg">💡</span>
                  مفاهيم أساسية
                </h3>
                <ul className="space-y-3">
                  {result.coreConcepts.map((concept, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <span className="bg-emerald-200 p-1.5 rounded-lg">📌</span>
                  الخلاصة
                </h3>
                <p className="text-emerald-900/80 leading-relaxed italic">
                  {result.summary}
                </p>
              </section>
            </div>

            <section>
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="bg-slate-200 p-1.5 rounded-lg">💻</span>
                أمثلة كود تطبيقية
              </h3>
              <div className="space-y-6">
                {result.examples.map((example, idx) => (
                  <CodeBlock key={idx} example={example} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 py-8 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} وكيلك الذكي في تعلم البرمجة - مدعوم بالذكاء الاصطناعي التوليدي</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
