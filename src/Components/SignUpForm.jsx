import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Briefcase, Leaf } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function SignUpForm({ lang }) {
    const [role, setRole] = useState('Investor'); // 'Founder' or 'Investor'

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        termsAgreed: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'phone') {
            // Allow only digits and '+'
            const sanitized = value.replace(/[^\d+ ]/g, '');
            setFormData(prev => ({ ...prev, [name]: sanitized }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
        // Clear error for this field
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: 'bg-slate-200' };
        let score = 0;
        if (password.length >= 6) score += 1; // Medium
        if (password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)) score += 1; // Good
        if (password.length >= 10 && /[A-Za-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1; // Strong

        // Convert logic to requirements matching user spec:
        // weak (<6): score 1
        // medium (6+): score 2
        // good (8+, letters+num): score 3
        // strong (10+, letters+num+sym): score 4
        let scoreNum = 0;
        let label = '';

        if (password.length > 0 && password.length < 6) { scoreNum = 1; label = lang === 'en' ? 'Weak' : 'ضعيف'; }
        if (password.length >= 6) { scoreNum = 2; label = lang === 'en' ? 'Medium' : 'متوسط'; }
        if (password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)) { scoreNum = 3; label = lang === 'en' ? 'Good' : 'جيد'; }
        if (password.length >= 10 && /[A-Za-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) { scoreNum = 4; label = lang === 'en' ? 'Strong' : 'قوي'; }

        return { score: scoreNum, label };
    };

    const strengthInfo = getPasswordStrength(formData.password);

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
        if (!formData.termsAgreed) newErrors.termsAgreed = 'You must agree to the Terms & Conditions';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isFormValid = formData.fullName && formData.email && formData.phone && formData.password.length >= 8 && formData.password === formData.confirmPassword && formData.termsAgreed;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            const dataToSubmit = { role, ...formData };
            console.log('Form Submitted:', dataToSubmit);

            // Simulate API request
            setTimeout(() => {
                setIsSubmitting(false);
                alert('Account created successfully (check console)');
            }, 1500);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Role Selection */}
            <div className="bg-slate-100/80 p-1 rounded-xl flex items-center justify-between mb-2 border border-slate-200/60 shadow-inner">
                <button
                    type="button"
                    onClick={() => setRole('Founder')}
                    className={cn(
                        'flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300',
                        role === 'Founder' ? 'bg-white text-brand-dark shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700'
                    )}
                >
                    <Leaf className="w-4 h-4" /> Founder
                </button>
                <button
                    type="button"
                    onClick={() => setRole('Investor')}
                    className={cn(
                        'flex-1 flex justify-center items-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300',
                        role === 'Investor' ? 'bg-white text-brand-dark shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700'
                    )}
                >
                    <Briefcase className="w-4 h-4" /> Investor
                </button>
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-brand-dark">{lang === 'en' ? 'Full Name' : 'الاسم الكامل'}</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 rtl:pl-0 flex items-center pointer-events-none text-slate-400">
                        <User className="w-[18px] h-[18px]" />
                    </div>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Yasmin Abdelrahim"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={cn(
                            "w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2.5 bg-white border rounded-lg text-sm text-brand-dark placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold",
                            errors.fullName ? "border-red-500 ring-1 ring-red-500/50" : "border-slate-200 hover:border-slate-300"
                        )}
                    />
                </div>
                {errors.fullName && <span className="text-xs text-red-500 font-medium">{errors.fullName}</span>}
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-brand-dark">{lang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 rtl:pl-0 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-[18px] h-[18px]" />
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Yasmen Abdelrahem@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={cn(
                            "w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2.5 bg-white border rounded-lg text-sm text-brand-dark outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold",
                            errors.email ? "border-red-500 ring-1 ring-red-500/50" : "border-slate-200 hover:border-slate-300"
                        )}
                        dir="ltr"
                    />
                </div>
                {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-brand-dark">{lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 rtl:pl-0 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-[18px] h-[18px]" />
                    </div>
                    <input
                        type="text"
                        name="phone"
                        placeholder="+971 50 123 4567"
                        value={formData.phone}
                        onChange={handleChange}
                        className={cn(
                            "w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2.5 bg-white border rounded-lg text-sm text-brand-dark outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold",
                            errors.phone ? "border-red-500 ring-1 ring-red-500/50" : "border-slate-200 hover:border-slate-300"
                        )}
                        dir="ltr"
                    />
                </div>
                {errors.phone && <span className="text-xs text-red-500 font-medium">{errors.phone}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 mb-2">
                <label className="text-sm font-bold text-brand-dark">{lang === 'en' ? 'Password' : 'كلمة المرور'}</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-[18px] h-[18px]" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={cn(
                            "w-full pl-10 rtl:pr-10 pr-10 rtl:pl-10 py-2.5 bg-white border rounded-lg text-sm text-brand-dark outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold",
                            errors.password ? "border-red-500 ring-1 ring-red-500/50" : "border-slate-200 hover:border-slate-300"
                        )}
                        dir="ltr"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pl-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                </div>

                {/* Strength Indicator */}
                <div className="flex gap-1.5 mt-2 h-1.5 w-full">
                    {[1, 2, 3, 4].map((index) => {
                        let bgColor = 'bg-slate-200';
                        if (strengthInfo.score >= index) {
                            if (strengthInfo.score === 1) bgColor = 'bg-red-400';
                            else if (strengthInfo.score === 2) bgColor = 'bg-yellow-400';
                            else bgColor = 'bg-green-500';
                        }
                        return <div key={index} className={cn("flex-1 rounded-full transition-colors duration-300", bgColor)}></div>;
                    })}
                </div>
                {strengthInfo.label && (
                    <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-slate-500 font-medium">Strength: <span className={cn(
                            "font-bold",
                            strengthInfo.score === 1 && "text-red-500",
                            strengthInfo.score === 2 && "text-yellow-600",
                            strengthInfo.score >= 3 && "text-green-600"
                        )}>{strengthInfo.label}</span></span>
                    </div>
                )}
                {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-brand-dark">{lang === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-[18px] h-[18px]" />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={cn(
                            "w-full pl-10 rtl:pr-10 pr-10 rtl:pl-10 py-2.5 bg-white border rounded-lg text-sm text-brand-dark outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold",
                            errors.confirmPassword ? "border-red-500 ring-1 ring-red-500/50" : "border-slate-200 hover:border-slate-300"
                        )}
                        dir="ltr"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pl-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                </div>
                {errors.confirmPassword && <span className="text-xs text-red-500 font-medium">{errors.confirmPassword}</span>}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2.5 mt-2">
                <div className="relative flex items-center mt-0.5">
                    <input
                        type="checkbox"
                        name="termsAgreed"
                        id="termsAgreed"
                        checked={formData.termsAgreed}
                        onChange={handleChange}
                        className="peer appearance-none w-[18px] h-[18px] border-2 border-slate-300 rounded cursor-pointer checked:bg-brand-dark checked:border-brand-dark transition-colors focus:ring-2 focus:ring-brand-dark/20 focus:outline-none"
                    />
                    <svg className="absolute w-[12px] h-[12px] top-[3px] left-[3px] pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                    <label htmlFor="termsAgreed" className="text-[13px] text-slate-600 cursor-pointer select-none leading-tight">
                        I agree to the <a href="#" className="text-brand-dark font-bold hover:underline">Terms & Conditions</a> and <a href="#" className="text-brand-dark font-bold hover:underline">Privacy Policy</a>.
                    </label>
                </div>
            </div>
            {/* Since there's not a lot of space, termsAgreed error is better integrated, but text under checkbox matches other inputs. */}
            {errors.termsAgreed && <span className="text-xs text-red-500 font-medium -mt-3">{errors.termsAgreed}</span>}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={cn(
                    "w-full py-3.5 mt-4 rounded-xl font-bold text-white transition-all duration-300 shadow-md",
                    isFormValid
                        ? "bg-brand-dark hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-brand-dark/50 cursor-not-allowed shadow-none"
                )}
            >
                {isSubmitting
                    ? lang === 'en' ? 'Creating Account...' : 'جاري إنشاء الحساب…'
                    : lang === 'en' ? 'Create Account' : 'إنشاء حساب'}
            </button>
        </form>
    );
}
