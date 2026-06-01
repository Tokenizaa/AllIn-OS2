import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  Compass, 
  Sparkles, 
  Bell, 
  Wifi, 
  Clock, 
  Terminal, 
  ChevronRight,
  Shield,
  Search,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface OSHeaderProps {
  currentModule: string;
}

export const OSHeader: React.FC<OSHeaderProps> = ({ currentModule }) => {
  const [time, setTime] = useState<string>('');
  const [cpuLoad, setCpuLoad] = useState<number>(31);
  const [ping, setPing] = useState<number>(42);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New distributor enrollment pending approve (DST-011)", unread: true, time: "3m ago", type: 'info' },
    { id: 2, text: "Unilevel commission run matching Completed", unread: true, time: "12m ago", type: 'success' },
    { id: 3, text: "Avalara API tax nexus latency warning", unread: false, time: "1h ago", type: 'warn' }
  ]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  useEffect(() => {
    // Tick-tock clock
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Minor fluctuating hardware loads to feel like a real OS
    const cpuInterval = setInterval(() => {
      setCpuLoad(prev => Math.max(12, Math.min(85, prev + Math.floor(Math.random() * 11) - 5)));
    }, 4000);

    const pingInterval = setInterval(() => {
      setPing(prev => Math.max(22, Math.min(110, prev + Math.floor(Math.random() * 15) - 7)));
    }, 6000);

    return () => {
      clearInterval(cpuInterval);
      clearInterval(pingInterval);
    };
  }, []);

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-2.5 flex items-center justify-between text-slate-200 font-sans shadow-sm select-none">
      {/* Leading segment: Logo and Breadcrumb */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 shadow-lg shadow-indigo-900/30">
            <span className="font-display font-black text-sm text-white tracking-widest">A</span>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <h1 className="font-display font-bold text-[14px] leading-tight tracking-wider text-white">ALLIN OS</h1>
            <p className="font-mono text-[9px] text-slate-500 tracking-normal">CORE SERVER V4.2</p>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Current Module Breadcrumb */}
        <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>system</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-400 font-medium px-1 bg-emerald-500/10 rounded">{currentModule.toLowerCase()}</span>
        </div>
      </div>

      {/* Mid segment: Quick System Status Meters */}
      <div className="hidden lg:flex items-center space-x-6 text-[11px] font-mono text-slate-400">
        {/* CPU */}
        <div className="flex items-center space-x-2 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-800/40">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-500">CPU</span>
          <span className={`font-semibold ${cpuLoad > 70 ? 'text-rose-400' : 'text-emerald-400'}`}>{cpuLoad}%</span>
          {/* Hardware mini bar */}
          <div className="w-10 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${cpuLoad > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${cpuLoad}%` }}
            />
          </div>
        </div>

        {/* DB Connection */}
        <div className="flex items-center space-x-2 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-800/40">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-500">DB.LINK</span>
          <span className="text-indigo-400 font-semibold">99.9%</span>
        </div>

        {/* Latency / Ping */}
        <div className="flex items-center space-x-2 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-800/40">
          <Wifi className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-500">RTT</span>
          <span className={`font-semibold ${ping > 90 ? 'text-amber-400' : 'text-sky-400'}`}>{ping}ms</span>
        </div>
      </div>

      {/* Trailing segment: Clock, Notifications, Profile */}
      <div className="flex items-center space-x-4">
        {/* Dynamic UTC Clock */}
        <div className="hidden sm:flex items-center space-x-2 font-mono text-[11px] text-slate-300 bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
          <span>{time}</span>
        </div>

        {/* Live System Logs badge */}
        <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full select-none">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <span>ONLINE</span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button 
            id="notifications-bell-btn"
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="p-1.5 rounded-md hover:bg-slate-800/80 transition-colors relative border border-transparent hover:border-slate-800"
          >
            <Bell className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-bounce" />
            )}
          </button>

          {showNotificationDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-lg shadow-xl shadow-black/80 p-2.5 z-50 text-xs animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-display font-medium text-slate-300 text-[13px]">System Messages ({notifications.length})</span>
                {notifications.length > 0 && (
                  <button onClick={handleClearNotifications} className="text-[10px] text-slate-500 hover:text-rose-400 font-mono underline transition-colors">
                    dismiss all
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-slate-500">
                    No active notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-2 rounded-md border transition-colors ${n.unread ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-950/20 border-slate-900/60'}`}>
                      <div className="flex items-start space-x-2">
                        {n.type === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />}
                        {n.type === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
                        {n.type === 'info' && <Shield className="w-3.5 h-3.5 text-sky-500 mt-0.5 shrink-0" />}
                        <div className="flex-1">
                          <p className="text-slate-300 font-sans tracking-wide leading-relaxed text-[11px]">{n.text}</p>
                          <span className="text-[9px] font-mono text-slate-500 block mt-1">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Capsule */}
        <div className="flex items-center space-x-2.5 bg-slate-900/60 hover:bg-slate-800/60 p-1 pr-3 rounded-lg border border-slate-800/80 transition-all cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop" 
            alt="Owner Profile" 
            className="w-6.5 h-6.5 rounded-md object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="text-left leading-tight hidden md:block">
            <p className="text-[11px] font-medium text-slate-200">Olivia Miller</p>
            <p className="text-[9px] text-indigo-400 font-mono tracking-wider">EXEC OFFICE</p>
          </div>
        </div>
      </div>
    </header>
  );
};
