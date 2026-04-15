import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Code2, Terminal, ShieldAlert, KeyRound, ChevronDown, Github } from 'lucide-react';
import { CodeBlock } from './components/CodeBlock';
import { luaScript } from './data/scriptContent';

export default function App() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setGeneratedCode(`GOJO-${segment()}-${segment()}-${segment()}`);
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-accent/30 flex flex-col" dir="rtl">
      {/* Navbar */}
      <header className="h-16 bg-panel border-b border-border-main flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-xl tracking-wide text-accent">GOJO HUB</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-subtext">
          <a href="#features" className="hover:text-text-main transition-colors">المميزات</a>
          <a href="#script" className="hover:text-text-main transition-colors">السكربت</a>
          <a href="#activation" className="hover:text-text-main transition-colors">التفعيل</a>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 pt-16 pb-32 w-full">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-bg-main border border-border-main text-[11px] uppercase tracking-[2px] text-subtext mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]"></span>
            الإصدار 2.5.0 متاح الآن للتدريب
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold text-text-main tracking-tight leading-tight mb-6"
          >
            أقوى منصة <br/>
            <span className="text-accent">
              لصناعة وتطوير السكربتات
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-subtext mb-10 leading-relaxed max-w-2xl"
          >
            منصة GOJO HUB توفر لك أحدث الأكواد البرمجية المحسنة. تم تطوير هذا السكربت خصيصاً لأغراض التدريب والتعلم البرمجي، مع واجهة مستخدم احترافية وأداء خالي من اللاق.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a href="#script" className="w-full sm:w-auto px-8 py-3 rounded-md bg-accent text-bg-main font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Code2 className="w-5 h-5" />
              عرض السكربت
            </a>
            <a href="#activation" className="w-full sm:w-auto px-8 py-3 rounded-md bg-bg-main border border-border-main text-text-main font-bold hover:border-accent transition-colors flex items-center justify-center gap-2">
              <KeyRound className="w-5 h-5 text-subtext" />
              توليد كود تفعيل
            </a>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-6 mb-32">
          {[
            { title: 'أداء محسن (Anti-Lag)', desc: 'تم تحسين الكود ليعمل بسلاسة تامة مع ميزة تقليل اللاق المدمجة لضمان أفضل تجربة.', icon: Terminal },
            { title: 'واجهة مستخدم عصرية', desc: 'قائمة تحكم (Mod Menu) بتصميم احترافي، تدعم السحب والإفلات مع ألوان متناسقة.', icon: Code2 },
            { title: 'لأغراض التدريب فقط', desc: 'هذا السكربت مخصص للتعلم وفهم كيفية بناء واجهات المستخدم وأنظمة الـ ESP في الألعاب.', icon: ShieldAlert },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-lg bg-panel border border-transparent hover:border-accent transition-colors"
            >
              <div className="w-10 h-10 rounded bg-bg-main border border-border-main flex items-center justify-center mb-5">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-sm font-bold text-text-main mb-2">{feature.title}</h3>
              <p className="text-xs text-subtext leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Script Section */}
        <div id="script" className="mb-32 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[11px] uppercase tracking-[2px] text-subtext mb-2">الكود المصدري (Source Code)</h2>
              <p className="text-sm text-text-main">انسخ الكود أدناه واستخدمه في بيئة التدريب الخاصة بك.</p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <CodeBlock code={luaScript} />
          </motion.div>
        </div>

        {/* Activation Section */}
        <div id="activation" className="scroll-mt-24 max-w-xl mx-auto">
          <div className="p-8 rounded-lg bg-panel border border-border-main">
            <div className="text-[11px] uppercase tracking-[2px] text-subtext mb-6 text-center">نظام تفعيل الأكواد</div>
            
            <div className="flex flex-col items-center gap-6">
              <div className="w-full bg-bg-main border border-border-main rounded-lg p-6 text-center">
                <div className="text-xs text-subtext mb-3">كود التفعيل الحالي:</div>
                {generatedCode ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="font-mono text-sm text-accent border border-dashed border-accent p-3 rounded text-center tracking-wider"
                  >
                    {generatedCode}
                  </motion.div>
                ) : (
                  <div className="font-mono text-sm text-subtext border border-dashed border-border-main p-3 rounded text-center">
                    لم يتم التوليد بعد
                  </div>
                )}
              </div>

              <button 
                onClick={generateCode}
                className="w-full py-3 rounded-md bg-accent text-bg-main font-bold hover:opacity-90 transition-opacity"
              >
                تحديث الكود
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-main bg-panel py-8 mt-auto shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-extrabold text-sm tracking-wide text-accent">
            GOJO HUB
          </div>
          <p className="text-subtext text-xs text-center md:text-right">
            تم تطويره لأغراض التدريب والتطوير فقط
          </p>
        </div>
      </footer>
    </div>
  );
}
