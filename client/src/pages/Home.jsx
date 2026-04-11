import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api, { createStudent, createRazorpayOrder, verifyRazorpayPayment } from '../utils/api';
import { Loader2, User, CreditCard, ShieldCheck, MapPin, Building, GraduationCap, Phone, Mail, BookOpen, MapPinned } from 'lucide-react';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, required = true, value, onChange, error }) => (
  <div className="space-y-1.5 overflow-hidden">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5 px-1">
      <Icon size={12} className={error ? 'text-secondary' : 'text-primary'} />
      {label} {required && <span className="text-secondary">*</span>}
    </label>
    <div className="relative group">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field py-4 px-5 bg-white transition-all duration-300 border-2 ${error ? 'border-secondary focus:ring-secondary/20' : 'border-gray-100 focus:border-primary focus:ring-primary/10'}`}
      />
    </div>
    {error && <p className="text-[9px] font-bold text-secondary uppercase tracking-wider px-1">{error}</p>}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', branch: '',
    rollNumber: '', collegeName: '', location: '', course: '',
    courseType: '', year: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [step, setStep] = useState(1);

  const courses = [
    'AI',
    'IOT & CYBERSECURITY',
    'VLSI & PCB',
    'WEB TECHNOLOGIES'
  ];
  const courseTypes = ['Diploma', 'B tech', 'Degree', 'Other'];
  const years = ['1st year', '2nd year', '3rd year', '4th year', 'Other'];

  const validateField = (name, value) => {
    let error = '';
    if (!value) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is mandatory.`;
    } else if (name === 'phone' && value && !/^\d{10}$/.test(value)) {
      error = 'Phone number must be exactly 10 digits.';
    } else if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Valid email ID is required.';
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  useEffect(() => {
    // 1. Warm up Render Backend (Free tier cold start)
    const wakeupBackend = async () => {
      try {
        await api.get('/'); // Just a ping to wake up the server
        console.log('Backend wake-up ping successful');
      } catch (err) {
        console.log('Backend wake-up ping (expected for cold start or non-root endpoint)');
      }
    };
    wakeupBackend();

    // 2. Pre-load Razorpay Script
    const loadRazorpayScript = () => {
      if (document.getElementById('razorpay-script')) return;
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    const isAllFilled = Object.values(formData).every(val => val.trim() !== '');
    const hasNoErrors = Object.values(errors).every(err => !err);
    setIsFormValid(isAllFilled && hasNoErrors);
  }, [formData, errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return toast.error('Please fix the errors before continuing.');
    setLoading(true);

    try {
      // Step 1: Create Student
      const res1 = await createStudent(formData);
      const studentId = res1.data.studentId;

      // Step 2: Ensure Razorpay is loaded (it should be already)
      if (!window.Razorpay) {
        // Fallback: wait a bit or try loading again
        await new Promise(resolve => {
          let attempts = 0;
          const interval = setInterval(() => {
            if (window.Razorpay || attempts > 20) {
              clearInterval(interval);
              resolve();
            }
            attempts++;
          }, 500);
        });

        if (!window.Razorpay) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }
      }

      // Step 3: Create Order
      const orderRes = await createRazorpayOrder({ studentId, course: formData.course });
      const order = orderRes.data.order;

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'Svglobal Services',
        description: `Course Registration - ${formData.course}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              studentId: studentId
            });
            toast.success('Registration & Payment Successful!');
            navigate('/success', { state: { studentId } });
          } catch (err) {
            console.error('Verification error:', err);
            navigate('/failure', { state: { message: 'Payment verification failed. Please contact support.' } });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: '#1e3a8a' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        navigate('/failure', { state: { message: response.error.description || 'Payment failed. Please try again.' } });
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <header className="bg-primary text-white py-24 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none rotate-12 scale-150">
          <GraduationCap size={200} />
        </div>
        <div className="absolute bottom-0 left-0 p-12 opacity-10 pointer-events-none -rotate-12 scale-150">
          <BookOpen size={180} />
        </div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
            <ShieldCheck size={14} /> Secure Enrollment 2026
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter italic uppercase leading-none">
            Internship <span className="text-secondary not-italic">Registration Form</span>
          </h1>
          
          <div className="space-y-6 max-w-3xl mx-auto mt-8">
            <p className="text-sm md:text-base text-blue-50 font-semibold tracking-wide leading-relaxed">
              Professional internship training on advanced technologies:
              <span className="text-secondary font-black ml-2">AI, IOT & CYBERSECURITY</span>
            </p>
            
            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-white/5 hover:bg-white/10 transition-all border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Organised by:</span>
                <span className="text-sm md:text-base font-black text-white tracking-wider">SV GLOBAL SERVICES</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-secondary"></div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-secondary text-center bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                  Google & IBM Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-xl relative -mt-16">
        <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(15,23,42,0.1)] border border-gray-50 p-8 md:p-12 overflow-hidden relative">

          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
              {step === 1 ? <User size={24} /> : <CreditCard size={24} />}
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-dark">
                {step === 1 ? 'Personal Information' : 'Payment Details'}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {step === 1 ? 'All fields are mandatory' : 'Review and pay'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
            <div className="grid grid-cols-1 gap-6">
              <InputField label="Full Name" name="name" placeholder="John Doe" icon={User} value={formData.name} onChange={handleInputChange} error={errors.name} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Phone Number" name="phone" placeholder="9876543210" icon={Phone} type="tel" value={formData.phone} onChange={handleInputChange} error={errors.phone} />
                <InputField label="Email ID" name="email" placeholder="john@example.com" icon={Mail} type="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Branch" name="branch" placeholder="e.g. CSE, ECE" icon={GraduationCap} value={formData.branch} onChange={handleInputChange} error={errors.branch} />
                <InputField label="Roll Number" name="rollNumber" placeholder="Univ Roll No" icon={MapPinned} value={formData.rollNumber} onChange={handleInputChange} error={errors.rollNumber} />
              </div>

              <InputField label="College Name" name="collegeName" placeholder="Full College Identity" icon={Building} value={formData.collegeName} onChange={handleInputChange} error={errors.collegeName} />
              <InputField label="Location / City" name="location" placeholder="e.g. Hyderabad" icon={MapPin} value={formData.location} onChange={handleInputChange} error={errors.location} />

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5 px-1">
                  <BookOpen size={12} className={errors.course ? 'text-secondary' : 'text-primary'} />
                  Select Course <span className="text-secondary">*</span>
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className={`input-field py-4 px-5 bg-white cursor-pointer transition-all duration-300 border-2 ${errors.course ? 'border-secondary focus:ring-secondary/20' : 'border-gray-100 focus:border-primary focus:ring-primary/10'}`}
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                {errors.course && <p className="text-[9px] font-bold text-secondary uppercase tracking-wider px-1">{errors.course}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5 px-1">
                    <GraduationCap size={12} className={errors.courseType ? 'text-secondary' : 'text-primary'} />
                    Course Type <span className="text-secondary">*</span>
                  </label>
                  <select
                    name="courseType"
                    value={formData.courseType}
                    onChange={handleInputChange}
                    className={`input-field py-4 px-5 bg-white cursor-pointer transition-all duration-300 border-2 ${errors.courseType ? 'border-secondary focus:ring-secondary/20' : 'border-gray-100 focus:border-primary focus:ring-primary/10'}`}
                  >
                    <option value="">Select Course</option>
                    {courseTypes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5 px-1">
                    <BookOpen size={12} className={errors.year ? 'text-secondary' : 'text-primary'} />
                    Current Year <span className="text-secondary">*</span>
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={`input-field py-4 px-5 bg-white cursor-pointer transition-all duration-300 border-2 ${errors.year ? 'border-secondary focus:ring-secondary/20' : 'border-gray-100 focus:border-primary focus:ring-primary/10'}`}
                  >
                    <option value="">Select Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
            )}

            {/* Payment Summary */}
            {step === 2 && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>Course Fee</span>
                <span className="text-dark">₹1.70</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>GST (18%)</span>
                <span className="text-dark">₹0.30</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Final Amount</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em]">Secure Payment via Razorpay</p>
                </div>
                <p className="text-3xl font-display font-black text-primary italic">₹2</p>
              </div>
            </div>
            )}

            {step === 1 ? (
              <button
                type="button"
                disabled={!isFormValid}
                onClick={() => setStep(2)}
                className={`w-full py-6 text-xs font-black uppercase tracking-[0.4em] rounded-2xl shadow-[0_25px_60px_-15px_rgba(30,58,138,0.3)] transition-all flex items-center justify-center gap-4 ${!isFormValid ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed' : 'btn-primary hover:scale-[1.02] active:scale-95'}`}
              >
                Next Step
              </button>
            ) : (
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-6 text-xs font-black uppercase tracking-[0.4em] rounded-2xl shadow-[0_25px_60px_-15px_rgba(30,58,138,0.3)] transition-all flex items-center justify-center gap-4 ${loading ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed' : 'btn-primary hover:scale-[1.02] active:scale-95'}`}
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> Processing...</>
                  ) : (
                    <><CreditCard size={18} /> Register & Pay ₹2</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="w-full py-4 text-xs font-black uppercase tracking-[0.4em] text-gray-500 hover:text-dark transition-all flex items-center justify-center gap-2"
                >
                  Go Back
                </button>
              </div>
            )}

            <p className="text-center text-[8px] font-black uppercase tracking-[0.3em] text-gray-300">
              © 2026 Svglobal Services • Privacy Policy • Terms
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
