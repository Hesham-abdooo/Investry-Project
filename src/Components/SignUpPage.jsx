import React, { useState } from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

export default function SignUpPage() {
    const [lang, setLang] = useState('en'); // 'en' or 'ar'

    const toggleLang = (newLang) => {
        setLang(newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    return (
        <div className={`flex w-full min-h-screen ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
            {/* 
        On mobile, LeftPanel is hidden and RightPanel takes full width. 
        On desktop, split 50/50. 
      */}
            <div className="hidden lg:flex w-1/2">
                <LeftPanel />
            </div>
            <div className="flex w-full lg:w-1/2 justify-center bg-brand-gray relative">
                <RightPanel lang={lang} toggleLang={toggleLang} />
            </div>
        </div>
    );
}
