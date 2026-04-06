import React from 'react';
import SignUpForm from './SignUpForm';

export default function RightPanel({ lang, toggleLang }) {
    return (
        <div className="w-full max-w-[560px] flex flex-col pt-8 px-6 pb-12 sm:px-12 relative overflow-y-auto">
            {/* Language Switcher */}
            <div className="flex justify-end gap-3 mb-12 uppercase text-sm font-semibold text-slate-400 tracking-wider">
                <button
                    onClick={() => toggleLang('en')}
                    className={`transition-colors ${lang === 'en' ? 'text-brand-dark' : 'hover:text-slate-600'}`}
                >
                    EN
                </button>
                <span className="text-slate-200">|</span>
                <button
                    onClick={() => toggleLang('ar')}
                    className={`transition-colors ${lang === 'ar' ? 'text-brand-dark' : 'hover:text-slate-600'}`}
                >
                    ع 
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center bg-white shadow-xl sm:shadow-sm sm:border border-slate-100/50 rounded-2xl p-6 sm:p-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-brand-dark mb-2 tracking-tight">Create an Account</h2>
                    <p className="text-slate-500 text-[15px]">
                        Join our platform to start investing or raising funds.
                    </p>
                </div>

                <SignUpForm lang={lang} />

                <div className="mt-6 text-center text-sm text-slate-500 font-medium">
                    Already have an account?{' '}
                    <a href="#" className="text-brand-dark hover:underline font-bold">Log in</a>
                </div>
            </div>
        </div>
    );
}
