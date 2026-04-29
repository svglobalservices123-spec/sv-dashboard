import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { submitBtechInternship } from '../utils/api';
import { 
  User, Mail, Phone, Calendar, Users, Fingerprint, 
  GraduationCap, Briefcase, FileUp, CheckCircle, 
  ChevronRight, ChevronLeft, Loader2, Upload,
  ShieldCheck, Send, Globe, MapPin
} from 'lucide-react';

const ProgressBar = ({ step }) => {
  const pct = (step / 6) * 100;
  const labels = ["Basic Identification","Personal Background","Academic Records","Training Preferences","Document Vault","Final Confirmation"];
  return (
    <div className="w-full mb-12">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-display font-black text-dark tracking-tighter">Step <span className="text-primary">{step}</span> <span className="text-gray-300 font-light">/ 6</span></h2>
          <p className="text-gray-400 font-medium text-sm mt-1">{labels[step - 1]}</p>
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-primary">{Math.round(pct)}% Complete</span>
      </div>
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-50">
        <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 transition-all duration-700 ease-out shadow-lg" style={{ width: `${pct}%` }}/>
      </div>
    </div>
  );
};

const IW = ({ label, icon, children, required }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2 group-focus-within:text-primary transition-colors">
      {icon} {label} {required && <span className="text-secondary">*</span>}
    </label>
    {children}
  </div>
);

const FUB = ({ label, name, required, files, previews, onFileChange }) => (
  <div className={`relative border-2 border-dashed rounded-[2rem] p-8 transition-all flex flex-col items-center justify-center gap-4 group ${files[name] ? 'border-green-400 bg-green-50/30' : 'border-gray-200 hover:border-primary hover:bg-primary/5'}`}>
    <input type="file" name={name} onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept=".jpg,.jpeg,.png,.pdf" />
    {previews[name] ? (
      <div className="flex flex-col items-center gap-3">
        {previews[name] === 'pdf' ? <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600"><FileUp size={32}/></div> : <img src={previews[name]} alt="preview" className="w-20 h-20 object-cover rounded-2xl shadow-lg border-2 border-white"/>}
        <span className="text-[10px] font-black uppercase tracking-widest text-green-600">File Captured</span>
        <p className="text-xs text-gray-400 max-w-[150px] truncate">{files[name]?.name}</p>
      </div>
    ) : (
      <>
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:text-primary transition-all"><Upload size={28}/></div>
        <div className="text-center">
          <p className="text-sm font-bold text-dark">{label} {required && '*'}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">JPG, PNG or PDF (Max 10MB)</p>
        </div>
      </>
    )}
  </div>
);

const ic = "input-field py-4 bg-muted/30 border-transparent focus:bg-white focus:border-primary";

const BtechInternshipForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentEmail:'',studentFullName:'',studentPhone:'',parentPhone:'',gender:'',dob:'',
    fatherName:'',motherName:'',age:'',caste:'',aadharNumber:'',sscHallTicket:'',
    state:'',
    collegeName:'',branch:'',otherBranch:'',rollNumber:'',degreePercentage:'',
    trainingMode:'',companyName:'',course:'',otherCourse:'',city:'',
    declaration:false
  });
  const [files, setFiles] = useState({collegeIdCard:null,aadharCard:null,sscMemo:null,photo:null});
  const [previews, setPreviews] = useState({collegeIdCard:null,aadharCard:null,sscMemo:null,photo:null});

  useEffect(() => {
    const s = localStorage.getItem('btech_internship_draft');
    if (s) setFormData(JSON.parse(s));
  }, []);
  useEffect(() => { localStorage.setItem('btech_internship_draft', JSON.stringify(formData)); }, [formData]);

  const hic = (e) => { const {name,value,type,checked}=e.target; setFormData({...formData,[name]:type==='checkbox'?checked:value}); };
  const hfc = (e) => {
    const {name,files:uf}=e.target;
    if(uf&&uf[0]){
      const f=uf[0];
      if(f.size>10*1024*1024){toast.error('File size must be less than 10MB');return;}
      setFiles({...files,[name]:f});
      if(f.type.startsWith('image/')){const r=new FileReader();r.onloadend=()=>{setPreviews({...previews,[name]:r.result});};r.readAsDataURL(f);}
      else{setPreviews({...previews,[name]:'pdf'});}
    }
  };

  const nextStep = () => { if(validateStep()){setStep(step+1);window.scrollTo(0,0);} };
  const prevStep = () => { setStep(step-1);window.scrollTo(0,0); };

  const validateStep = () => {
    if(step===1){const{studentEmail,studentFullName,fatherName,studentPhone,parentPhone,gender,collegeName,branch,city}=formData;if(!studentEmail||!studentFullName||!fatherName||!studentPhone||!parentPhone||!gender||!collegeName||!branch||!city){toast.error('Please fill all required fields');return false;}if(branch==='others'&&!formData.otherBranch){toast.error('Please specify your branch');return false;}}
    else if(step===2){const{age,dob,caste,aadharNumber,state}=formData;if(!age||!dob||!caste||!aadharNumber||!state){toast.error('Please fill all required fields including State');return false;}}
    else if(step===3){const{rollNumber,degreePercentage}=formData;if(!rollNumber||!degreePercentage){toast.error('Please fill all required fields');return false;}}
    else if(step===4){if(!formData.trainingMode){toast.error('Please choose mode of training');return false;}if(formData.trainingMode==='In Hands Training'&&!formData.course){toast.error('Please select a course');return false;}if(formData.course==='Other'&&!formData.otherCourse){toast.error('Please specify your course');return false;}}
    else if(step===5){if(!files.collegeIdCard||!files.aadharCard||!files.sscMemo||!files.photo){toast.error('Please upload all required documents');return false;}}
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.declaration){toast.error('Please confirm the declaration');return;}
    setLoading(true);
    try{
      const data=new FormData();
      const sd={...formData};
      if(sd.branch==='others')sd.branch=sd.otherBranch;
      if(sd.course==='Other')sd.course=sd.otherCourse;

      Object.keys(sd).forEach(k=>data.append(k,sd[k]));
      Object.keys(files).forEach(k=>data.append(k,files[k]));
      await submitBtechInternship(data);
      toast.success('Registration Successful!');
      localStorage.removeItem('btech_internship_draft');
      navigate('/btech-internship/success');
    }catch(error){toast.error(error.response?.data?.message||'Failed to submit application.');}
    finally{setLoading(false);}
  };

  return (
    <div className="min-h-screen bg-muted py-10 px-4 md:py-20 flex justify-center items-start">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-2 rounded-full shadow-xl shadow-gray-200/50 border border-gray-100 mb-6">
            <div className="bg-emerald-600 p-1.5 rounded-lg"><GraduationCap className="text-white" size={16}/></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark">Degree Registration Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-dark tracking-tighter italic">Btech/Degree <span className="text-emerald-600 not-italic">Internship</span></h1>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">Complete your professional registration in minutes through our secure multi-step wizard.</p>
        </header>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-16 relative overflow-hidden">
          <ProgressBar step={step}/>
          <form onSubmit={(e)=>e.preventDefault()} className="space-y-12">
            {step===1&&(
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <IW label="Student Gmail" icon={<Mail size={12}/>} required><input type="email" name="studentEmail" value={formData.studentEmail} onChange={hic} className={ic} placeholder="name@gmail.com"/></IW>
                <IW label="Full Name" icon={<User size={12}/>} required><input type="text" name="studentFullName" value={formData.studentFullName} onChange={hic} className={ic} placeholder="e.g. Rahul Sharma"/></IW>
                <IW label="Father Name" icon={<User size={12}/>} required><input type="text" name="fatherName" value={formData.fatherName} onChange={hic} className={ic} placeholder="Enter Father Name"/></IW>
                <IW label="Mother Name" icon={<User size={12}/>}><input type="text" name="motherName" value={formData.motherName} onChange={hic} className={ic} placeholder="Enter Mother Name"/></IW>
                <IW label="Student Phone Number" icon={<Phone size={12}/>} required><input type="tel" name="studentPhone" value={formData.studentPhone} onChange={hic} className={ic} placeholder="+91 XXXXX XXXXX"/></IW>
                <IW label="Parent Phone Number" icon={<Phone size={12}/>} required><input type="tel" name="parentPhone" value={formData.parentPhone} onChange={hic} className={ic} placeholder="+91 XXXXX XXXXX"/></IW>
                <IW label="Gender" icon={<Users size={12}/>} required>
                  <select name="gender" value={formData.gender} onChange={hic} className={ic+" cursor-pointer"}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option></select>
                </IW>
                <IW label="Location" icon={<MapPin size={12}/>} required>
                  <select name="city" value={formData.city} onChange={hic} className={ic+" cursor-pointer"}>
                    <option value="">Select Location</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Sri City (Anantapur)">Sri City (Anantapur)</option>
                    <option value="Tirupati">Tirupati</option>
                  </select>
                </IW>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mt-4 border-t border-gray-100 pt-8">
                  <IW label="College Name" icon={<GraduationCap size={12}/>} required><input type="text" name="collegeName" value={formData.collegeName} onChange={hic} className={ic} placeholder="Full College Name"/></IW>
                  <IW label="Branch" icon={<GraduationCap size={12}/>} required>
                    <select name="branch" value={formData.branch} onChange={hic} className={ic+" cursor-pointer"}>
                      <option value="">Select Branch</option>
                      <option value="Computer Science Engineering (CSE)">Computer Science Engineering (CSE)</option>
                      <option value="Information Technology (IT)">Information Technology (IT)</option>
                      <option value="Artificial Intelligence (AI)">Artificial Intelligence (AI)</option>
                      <option value="Artificial Intelligence & Machine Learning (AI-ML)">Artificial Intelligence & Machine Learning (AI-ML)</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="Electronics & Communication Engineering (ECE)">Electronics & Communication Engineering (ECE)</option>
                      <option value="Electrical & Electronics Engineering (EEE)">Electrical & Electronics Engineering (EEE)</option>
                      <option value="Mechanical Engineering (ME)">Mechanical Engineering (ME)</option>
                      <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
                      <option value="others">others</option>
                    </select>
                  </IW>
                  {formData.branch==='others'&&(
                    <IW label="Enter Branch / Batch" icon={<GraduationCap size={12}/>} required>
                      <input type="text" name="otherBranch" value={formData.otherBranch} onChange={hic} className={ic} placeholder="Specify your branch/batch"/>
                    </IW>
                  )}
                </div>
              </div>
            )}
            {step===2&&(
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <IW label="Age (As per Aadhar Card)" icon={<Calendar size={12}/>} required><input type="number" name="age" value={formData.age} onChange={hic} className={ic} placeholder="e.g. 21"/></IW>
                <IW label="Date of Birth" icon={<Calendar size={12}/>} required><input type="date" name="dob" value={formData.dob} onChange={hic} className={ic}/></IW>
                <IW label="Caste" icon={<Users size={12}/>} required><input type="text" name="caste" value={formData.caste} onChange={hic} className={ic} placeholder="e.g. General/OBC/SC/ST"/></IW>
                <IW label="Aadhar Card Number" icon={<Fingerprint size={12}/>} required><input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={hic} className={ic} placeholder="XXXX XXXX XXXX"/></IW>
                <IW label="SSC Hall Ticket Number" icon={<ShieldCheck size={12}/>}><input type="text" name="sscHallTicket" value={formData.sscHallTicket} onChange={hic} className={ic} placeholder="Roll No"/></IW>
                <IW label="State" icon={<Globe size={12}/>} required>
                  <select name="state" value={formData.state} onChange={hic} className={ic+" cursor-pointer"}><option value="">Select State</option><option value="Telangana">Telangana</option><option value="Andhra Pradesh">Andhra Pradesh</option><option value="Tamil Nadu">Tamil Nadu</option></select>
                </IW>
              </div>
            )}
            {step===3&&(
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <IW label="Roll Number" icon={<Fingerprint size={12}/>} required><input type="text" name="rollNumber" value={formData.rollNumber} onChange={hic} className={ic} placeholder="College Roll No"/></IW>
                <IW label="Degree Percentage (%)" icon={<CheckCircle size={12}/>} required><input type="text" name="degreePercentage" value={formData.degreePercentage} onChange={hic} className={ic} placeholder="e.g. 75% or 8.2 CGPA"/></IW>
              </div>
            )}
            {step===4&&(
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <IW label="Choose Mode of Training" icon={<Briefcase size={12}/>} required>
                    <div className="grid grid-cols-1 gap-3">
                      {[{id:'OJT',label:'1. OJT- ON JOB TRAINING[Stipend ]'},{id:'In Hands Training',label:'2. IN HANDS TRAINING [NO Stipend paid ]'}].map(m=>(
                        <label key={m.id} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${formData.trainingMode===m.id?'border-emerald-500 bg-emerald-50/50':'border-gray-100 hover:border-gray-200'}`}>
                          <input type="radio" name="trainingMode" value={m.id} checked={formData.trainingMode===m.id} onChange={hic} className="w-5 h-5 accent-emerald-600"/><span className="text-sm font-bold text-dark">{m.label}</span>
                        </label>
                      ))}
                    </div>
                  </IW>
                  <div className="space-y-8">
                    <IW label="Company Name" icon={<Briefcase size={12}/>}><input type="text" name="companyName" value={formData.companyName} onChange={hic} className={ic} placeholder="Optional"/></IW>
                    {formData.trainingMode==='In Hands Training'&&(
                      <IW label="Course Selection" icon={<GraduationCap size={12}/>} required>
                        <select name="course" value={formData.course} onChange={hic} className={ic+" cursor-pointer"}>
                          <option value="">Select Course</option>
                          <option value="C">C</option>
                          <option value="Java">Java</option>
                          <option value="Python">Python</option>
                          <option value="Full Stack Development">Full Stack Development</option>
                          <option value="AI">AI</option>
                          <option value="Machine Learning">Machine Learning</option>
                          <option value="Cyber Security">Cyber Security</option>
                          <option value="IoT">IoT</option>
                          <option value="Robotics">Robotics</option>
                          <option value="Cloud Computing">Cloud Computing</option>
                          <option value="Networking">Networking</option>
                          <option value="AWS">AWS</option>
                          <option value="DevOps">DevOps</option>
                          <option value="5G Technologies">5G Technologies</option>
                          <option value="Embedded Systems">Embedded Systems</option>
                          <option value="PCB Design">PCB Design</option>
                          <option value="Solar Design">Solar Design</option>
                          <option value="VLSI">VLSI</option>
                          <option value="MATLAB">MATLAB</option>
                          <option value="Arduino">Arduino</option>
                          <option value="Raspberry Pi">Raspberry Pi</option>
                          <option value="EMS">EMS</option>
                          <option value="NDT Tools Design">NDT Tools Design</option>
                          <option value="CNC Programming">CNC Programming</option>
                          <option value="AutoCAD">AutoCAD</option>
                          <option value="SketchUp">SketchUp</option>
                          <option value="Revit">Revit</option>
                          <option value="Site Engineering">Site Engineering</option>
                          <option value="Quantity Survey">Quantity Survey</option>
                          <option value="Advanced Survey">Advanced Survey</option>
                          <option value="Other">Other</option>
                        </select>
                      </IW>
                    )}
                    {formData.course==='Other'&&(
                      <IW label="Specify Other Course" icon={<GraduationCap size={12}/>} required>
                        <input type="text" name="otherCourse" value={formData.otherCourse} onChange={hic} className={ic} placeholder="Enter course name"/>
                      </IW>
                    )}
                  </div>
                </div>
              </div>
            )}
            {step===5&&(
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <FUB label="College ID / Bonafide" name="collegeIdCard" required files={files} previews={previews} onFileChange={hfc}/>
                <FUB label="Aadhar Card (Colour)" name="aadharCard" required files={files} previews={previews} onFileChange={hfc}/>
                <FUB label="SSC Memo" name="sscMemo" required files={files} previews={previews} onFileChange={hfc}/>
                <FUB label="Photo (Colour)" name="photo" required files={files} previews={previews} onFileChange={hfc}/>
              </div>
            )}
            {step===6&&(
              <div className="max-w-2xl mx-auto space-y-10 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-100"><CheckCircle size={48}/></div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-black text-dark tracking-tight italic uppercase">Review & <span className="text-emerald-600 not-italic">Confirm</span></h3>
                  <p className="text-gray-400 font-medium text-sm">Please verify all entered details before submission.</p>
                </div>
                <div className="bg-muted/50 p-10 rounded-[3rem] border border-gray-100 text-left space-y-6">
                  {[['Student Name',formData.studentFullName],['College',formData.collegeName],['State',formData.state],['Course',formData.course||'N/A'],['Training Mode',formData.trainingMode]].map(([l,v])=>(
                    <div key={l} className="flex justify-between border-b border-gray-100 pb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{l}</span>
                      <span className="text-sm font-black text-dark truncate ml-4 text-right">{l==='Course' && formData.course==='Other' ? formData.otherCourse : v}</span>
                    </div>
                  ))}
                  <label className="flex items-start gap-4 cursor-pointer mt-8">
                    <input type="checkbox" name="declaration" checked={formData.declaration} onChange={hic} className="w-5 h-5 accent-emerald-600 mt-1"/>
                    <span className="text-xs font-bold text-gray-600 leading-relaxed">I confirm that all the information provided above is correct to the best of my knowledge and I agree to the terms of the internship.</span>
                  </label>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
              {step>1&&<button type="button" onClick={prevStep} className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white border border-gray-200 text-dark rounded-2xl hover:bg-gray-50 transition-all font-black text-[10px] uppercase tracking-widest"><ChevronLeft size={16}/> Previous Phase</button>}
              {step<6?(
                <button type="button" onClick={nextStep} className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 group">Next Step <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
              ):(
                <button type="button" onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-4 px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl hover:scale-[1.02] active:scale-95 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/40 disabled:opacity-50">
                  {loading?<><Loader2 className="animate-spin" size={18}/> Processing...</>:<><Send size={18}/> Finalize Registration</>}
                </button>
              )}
            </div>
          </form>
        </div>
        <footer className="mt-10 text-center"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">© 2026 SV Global Services • Powered by Antigravity OS</p></footer>
      </div>
    </div>
  );
};

export default BtechInternshipForm;
