import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, BarChart3, Settings, ShieldCheck, LogOut, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', icon: <BarChart3 size={20} />, path: '/admin' },
    { title: 'Add Student', icon: <UserPlus size={20} />, path: '/admin/add-student' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isSVAdmin');
    toast.success('Logged out securely.');
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-dark h-full flex flex-col fixed left-0 top-0 border-r border-gray-800 shadow-2xl z-50 transition-all duration-300">
      <div className="p-8 pb-12 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-secondary p-2 rounded-lg shadow-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-white font-display font-bold text-lg tracking-tight uppercase italic">SV <span className="text-secondary font-medium not-italic">ADMIN</span></h2>
            <p className="text-gray-500 text-xs font-black tracking-widest uppercase">Portal v2.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 group ${
              location.pathname === item.path 
                ? 'bg-gradient-to-r from-primary to-blue-700 text-white shadow-xl shadow-blue-500/20' 
                : 'text-gray-500 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <span className={location.pathname === item.path ? 'text-white scale-110' : 'group-hover:text-primary transition-all group-hover:scale-110'}>
              {item.icon}
            </span>
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-secondary transition-all w-full font-black uppercase tracking-widest text-[11px]"
        >
          <LogOut size={20} />
          <span>Security Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
