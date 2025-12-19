
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { User } from '../types';
import { Shield, Zap, Target, Award } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const chartData = [
    { subject: 'Offensive', A: user.skills.offensive, fullMark: 100 },
    { subject: 'Defensive', A: user.skills.defensive, fullMark: 100 },
    { subject: 'Net', A: user.skills.networking, fullMark: 100 },
    { subject: 'Scripting', A: user.skills.scripting, fullMark: 100 },
    { subject: 'Forensics', A: user.skills.forensics, fullMark: 100 },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn p-2 md:p-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-orbitron text-white">OPERATOR DASHBOARD</h2>
          <p className="text-[var(--primary)] font-mono text-base md:text-lg mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center flex-1 md:min-w-[120px] shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">RANK</div>
            <div className="text-purple-400 font-bold text-lg leading-tight truncate">{user.rank}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center flex-1 md:min-w-[120px] shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">LEVEL</div>
            <div className="text-yellow-400 font-bold text-lg leading-tight">{user.level}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Skill Radar */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 md:p-6 h-[350px] md:h-[400px] relative overflow-hidden backdrop-blur-sm shadow-md">
            <div className="absolute top-4 right-4 text-xs text-gray-600 font-mono bg-black px-2 py-1 rounded z-10">SKILL_MATRIX_V2.0</div>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--primary)', fontSize: 11, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="var(--primary)"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
        </div>

        {/* Stats Grid - 1 Col on mobile, 2 on Tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 content-start">
            <div className="bg-zinc-900/50 p-6 border-l-4 border-red-500 rounded-xl hover:bg-zinc-900 transition flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">CTFs Solved</h3>
                  <p className="text-3xl font-bold text-white">12</p>
                </div>
                <Target className="text-red-500 w-8 h-8 opacity-80" />
            </div>
            <div className="bg-zinc-900/50 p-6 border-l-4 border-blue-500 rounded-xl hover:bg-zinc-900 transition flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Labs Secured</h3>
                  <p className="text-3xl font-bold text-white">8</p>
                </div>
                <Shield className="text-blue-500 w-8 h-8 opacity-80" />
            </div>
            <div className="bg-zinc-900/50 p-6 border-l-4 border-yellow-500 rounded-xl hover:bg-zinc-900 transition flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Streak</h3>
                  <p className="text-3xl font-bold text-white">4 Days</p>
                </div>
                <Zap className="text-yellow-500 w-8 h-8 opacity-80" />
            </div>
            <div className="bg-zinc-900/50 p-6 border-l-4 border-purple-500 rounded-xl hover:bg-zinc-900 transition flex items-center justify-between shadow-sm">
                <div>
                   <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Badges</h3>
                   <p className="text-3xl font-bold text-white">5</p>
                </div>
                <Award className="text-purple-500 w-8 h-8 opacity-80" />
            </div>
        </div>
      </div>
      
      {/* Recent Activity Mockup */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 md:p-8 shadow-lg">
        <h3 className="text-xl font-orbitron mb-6 text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></span>
            SYSTEM LOGS (Recent Activity)
        </h3>
        <ul className="space-y-4 font-mono text-sm">
            <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-400 border-b border-zinc-800/50 pb-3 gap-1">
                <span className="flex items-center gap-2"><span className="text-blue-500 font-bold">[INFO]</span> Completed module "Network Recon"</span>
                <span className="text-gray-600 text-xs">2h ago</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-400 border-b border-zinc-800/50 pb-3 gap-1">
                <span className="flex items-center gap-2"><span className="text-red-500 font-bold">[WARN]</span> Failed challenge "Buffer Overflow 101"</span>
                <span className="text-gray-600 text-xs">5h ago</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-[var(--primary)]/90 gap-1">
                <span className="flex items-center gap-2"><span className="font-bold">[SUCCESS]</span> Flag captured: {'ctf{w3b_h4ck3r}'}</span>
                <span className="text-gray-600 text-xs">1d ago</span>
            </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
