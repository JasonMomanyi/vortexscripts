
import React from 'react';
import { User } from '../types';
import { ExternalLink, Award } from 'lucide-react';

interface CertificateProps {
  user: User;
}

const Certificate: React.FC<CertificateProps> = ({ user }) => {
  const certifications = [
    {
      name: "CompTIA Security+",
      org: "CompTIA",
      level: "Entry",
      desc: "The baseline certification for a career in cybersecurity. Covers core knowledge required for any cybersecurity role.",
      link: "https://www.comptia.org/certifications/security"
    },
    {
      name: "eJPTv2",
      org: "INE Security",
      level: "Junior",
      desc: "Junior Penetration Tester. A 100% practical exam that tests your ability to perform a pentest on a corporate network.",
      link: "https://ine.com/learning/certifications/internal/ejpt"
    },
    {
      name: "OSCP",
      org: "OffSec",
      level: "Professional",
      desc: "Offensive Security Certified Professional. The industry standard for penetration testing. Requires a rigorous 24-hour exam.",
      link: "https://www.offsec.com/courses/pen-200/"
    },
    {
      name: "CISSP",
      org: "ISC2",
      level: "Management",
      desc: "Certified Information Systems Security Professional. Ideal for security leaders and managers designing security postures.",
      link: "https://www.isc2.org/Certifications/CISSP"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-zinc-900 min-h-full">
      <div className="relative w-full max-w-4xl bg-black border-4 border-double border-[var(--primary)] p-6 md:p-10 text-center shadow-[0_0_50px_rgba(34,197,94,0.2)] mb-16">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
             <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

        <div className="relative z-10 space-y-6">
            <div className="flex justify-center mb-8">
                <div className="text-6xl text-[var(--primary)]">⚡</div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-white tracking-widest uppercase mb-2">
                Certificate of Mastery
            </h1>
            
            <div className="h-px w-2/3 mx-auto bg-[var(--primary)]/50 my-4"></div>

            <p className="text-gray-400 font-fira uppercase tracking-widest text-sm md:text-base">This certifies that</p>
            
            <h2 className="text-3xl md:text-5xl font-share font-bold text-[var(--primary)] drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] py-4 glitch-text" data-text={user.name}>
                {user.name}
            </h2>

            <p className="text-gray-400 font-fira max-w-2xl mx-auto text-sm md:text-base">
                Has successfully demonstrated exceptional proficiency in Offensive and Defensive Cybersecurity Operations within the <span className="text-[var(--primary)] font-bold">VORTEXSCRIPTS</span> simulation environment.
            </p>

            <div className="grid grid-cols-2 gap-8 mt-12 max-w-lg mx-auto text-left">
                <div>
                    <p className="text-xs text-gray-500 uppercase">Authorization ID</p>
                    <p className="text-white font-mono">VX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Date Issued</p>
                    <p className="text-white font-mono">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="mt-12 flex justify-center items-end">
                <div className="text-center">
                    <div className="w-48 border-b border-gray-600 mb-2"></div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Lead Instructor / AI Core</p>
                </div>
            </div>
        </div>
        
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--primary)]"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--primary)]"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--primary)]"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--primary)]"></div>
      </div>

      {/* Real World Roadmap */}
      <div className="max-w-6xl w-full">
        <h3 className="text-2xl font-orbitron text-white mb-8 border-l-4 border-[var(--primary)] pl-4 flex items-center gap-3">
          <Award className="text-[var(--primary)]" />
          INDUSTRY RECOGNITION PATHWAY
        </h3>
        <p className="text-gray-400 mb-8 max-w-3xl">
          VORTEXSCRIPTS provides the simulation training you need to succeed. To advance your career in the real world, aim for these globally recognized certifications next.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, idx) => (
            <a 
              key={idx} 
              href={cert.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-[var(--primary)] transition-all hover:-translate-y-1 block relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-zinc-800 text-xs px-2 py-1 text-gray-400 rounded-bl group-hover:bg-[var(--primary)] group-hover:text-black transition-colors">
                {cert.level}
              </div>
              <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[var(--primary)]">{cert.name}</h4>
              <p className="text-xs text-[var(--primary)] mb-3">{cert.org}</p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed group-hover:text-gray-400">
                {cert.desc}
              </p>
              <div className="flex items-center text-xs font-bold text-gray-600 group-hover:text-white mt-auto">
                VIEW DETAILS <ExternalLink size={12} className="ml-1" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
