import React from "react";
import { OGP } from "../../components/OGP.tsx";
import { useTheme } from "../../hooks/useTheme";

const AboutMePage: React.FC = () => {
    const { isDark } = useTheme();

    // Animation for profile image on hover
    const profileHoverEffect = "transform transition-transform duration-300 hover:scale-105 hover:rotate-3";
    
    // Border styles based on theme
    const borderStyle = "border-2 border-dashed transition-colors duration-300";
    const borderColor = isDark ? "border-fg/40" : "border-fg2/30";
    
    // Section card styles
    const sectionCardStyle = `${borderStyle} ${borderColor} rounded-lg p-4 mb-6 backdrop-blur-sm bg-bg/30 hover:bg-bg/60 transition-all duration-300`;
    
    // Badge styles
    const badgeStyle = `inline-block rounded-full px-3.5 py-1 text-xs ${isDark ? "bg-fg2/20 text-fg" : "bg-fg/10 text-fg2"} font-mono m-1`;

    return <>
        <OGP title={`About Me - IK.AM`} />
        
        {/* Header section with animated profile */}
        <div className="mb-10 text-center">
            <h2 className="mb-4">About Me</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-6 mb-6">
                <div className={`relative mb-4 sm:mb-0 ${profileHoverEffect}`}>
                    <img 
                        src={"https://avatars.githubusercontent.com/u/106908?s=200"}
                        width={180}
                        height={180}
                        className={`rounded-full shadow-lg ${borderStyle} ${borderColor}`}
                        alt="@making"
                    />
                </div>
                <div className="text-center sm:text-left">
                    <h3 className="text-2xl font-bold mb-1">Toshiaki Maki / 槙 俊明</h3>
                    <p className="text-fg2/80 mb-3">Senior Principal Architect at Broadcom</p>
                    <div className="space-x-2">
                        <a href="https://x.com/making" className={`${badgeStyle} hover:bg-fg2/30`}>
                            @making
                        </a>
                        <span className={badgeStyle}>
                            makingx [at] gmail.com
                        </span>
                    </div>
                    <p className="mt-4 text-sm italic">
                        Dog lover 🐩 (<a href="https://en.wikipedia.org/wiki/Bichon_Frise">Bichon Frise</a>). 
                        My dog's name is Lemon 🍋
                    </p>
                </div>
            </div>
        </div>
        
        {/* Work Experience */}
        <div className={sectionCardStyle}>
            <h3 className="border-b border-fg/20 pb-2 mb-4">Work Experience</h3>
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/4">
                        <a href={'https://www.broadcom.com/'} className="font-bold hover:underline flex items-center">
                            <span className="inline-block w-6 mr-2">🌐</span> Broadcom
                        </a>
                    </div>
                    <div className="w-full sm:w-3/4">
                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Senior Principal Architect (P6)</span>
                                <span className="text-xs bg-fg/10 px-2 py-0.5 rounded">Dec 2023 - Present</span>
                            </div>
                            <div className="text-sm">Tokyo</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/4">
                        <a href={'https://vmware.com'} className="font-bold hover:underline flex items-center">
                            <span className="inline-block w-6 mr-2">🌐</span> VMware
                        </a>
                    </div>
                    <div className="w-full sm:w-3/4">
                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Senior Staff Cloud Native Architect (P6)</span>
                                <span className="text-xs bg-fg/10 px-2 py-0.5 rounded">Aug 2022 - Dec 2023</span>
                            </div>
                            <div className="text-sm">Tokyo</div>
                        </div>
                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Staff Cloud Native Architect (P5)</span>
                                <span className="text-xs bg-fg/10 px-2 py-0.5 rounded">Apr 2020 - Jul 2022</span>
                            </div>
                            <div className="text-sm">Tokyo</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/4">
                        <a href={'https://pivotal.io'} className="font-bold hover:underline flex items-center">
                            <span className="inline-block w-6 mr-2">🌐</span> Pivotal
                        </a>
                    </div>
                    <div className="w-full sm:w-3/4">
                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Advisory Solutions Architect (P5)</span>
                                <span className="text-xs bg-fg/10 px-2 py-0.5 rounded">Sep 2018 - Apr 2020</span>
                            </div>
                            <div className="text-sm">Tokyo</div>
                        </div>
                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Senior Solutions Architect (P4)</span>
                                <span className="text-xs bg-fg/10 px-2 py-0.5 rounded">Jan 2016 - Aug 2018</span>
                            </div>
                            <div className="text-sm">Tokyo</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/4">
                        <a href={'https://www.nttdata.com'} className="font-bold hover:underline flex items-center">
                            <span className="inline-block w-6 mr-2">🌐</span> NTT DATA
                        </a>
                    </div>
                    <div className="w-full sm:w-3/4">
                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Assistant Manager</span>
                                <span className="text-xs bg-fg/10 px-2 py-0.5 rounded">Apr 2009 - Dec 2015</span>
                            </div>
                            <div className="text-sm">Tokyo</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Education */}
        <div className={sectionCardStyle}>
            <h3 className="border-b border-fg/20 pb-2 mb-4">Education</h3>
            
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/4">
                        <div className="font-bold flex items-center">
                            <span className="inline-block w-6 mr-2">🎓</span> The University of Tokyo
                        </div>
                    </div>
                    <div className="w-full sm:w-3/4">
                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Master of Science, Mechano-Informatics</span>
                                <span className="text-xs bg-fg/10 px-2 py-0.5 rounded">Apr 2007 - Mar 2009</span>
                            </div>
                            <div className="text-sm">
                                <a href={'https://www.i.u-tokyo.ac.jp/'} className="hover:underline">Graduate School of Information Science and Technology</a>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Bachelor of Science, Mechano-Informatics</span>
                                <span className="text-xs bg-fg/10 px-2 py-0.5 rounded">Apr 2003 - Mar 2007</span>
                            </div>
                            <div className="text-sm">
                                <a href={'https://www.u-tokyo.ac.jp/'} className="hover:underline">Faculty of Engineering</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>;
};

export default AboutMePage;