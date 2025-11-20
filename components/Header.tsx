import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">阡陌AI自动电商产品海报设计</h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">由 Gemini 2.5 Flash Image 驱动</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://ai.google.dev/" 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              开发文档
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;