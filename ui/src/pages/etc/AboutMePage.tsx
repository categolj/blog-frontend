import React from "react";
import { OGP } from "../../components/OGP.tsx";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import PageHeader from "../../components/PageHeader";

const AboutMePage: React.FC = () => {
    // Animation for profile image on hover
    const profileHoverEffect = "transform transition-transform duration-300 hover:scale-105 hover:rotate-3";
    
    // Section card styles with our reusable Card component
    const sectionStyle = "backdrop-blur-xs bg-bg/30 hover:bg-bg/60";

    return (
        <>
            <OGP title={`About Me - IK.AM`} />
            
            <PageHeader title="About Me" />
            
            {/* Profile section */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:space-x-6 mb-4">
                    <div className={`relative mb-4 sm:mb-0 ${profileHoverEffect}`}>
                        <img 
                            src={"https://avatars.githubusercontent.com/u/106908?s=200"}
                            width={180}
                            height={180}
                            className="rounded-full shadow-lg border-2 border-dashed border-(color:--empty-border) transition-colors duration-300"
                            alt="@making"
                        />
                    </div>
                    <div className="text-left">
                        <h3 className="text-2xl font-bold mb-1">Toshiaki Maki / 槙 俊明</h3>
                        <p className="text-fg2/80 mb-3">Senior Principal Architect at Broadcom</p>
                        <div className="space-x-2">
                            <Badge href="https://x.com/making" className="hover:bg-fg2/30">
                                @making
                            </Badge>
                            <Badge>
                                makingx [at] gmail.com
                            </Badge>
                        </div>
                        <p className="mt-4 text-sm italic">
                            Dog lover 🐩 (<a href="https://en.wikipedia.org/wiki/Bichon_Frise">Bichon Frise</a>). 
                            My dog's name is Lemon 🍋
                        </p>
                    </div>
                </div>
            </div>
        
            {/* Work Experience */}
            <Card isDashed={true} className={sectionStyle}>
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
                                    <span className="text-xs bg-fg/10 px-2 py-0.5 rounded-sm">Dec 2023 - Present</span>
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
                                    <span className="text-xs bg-fg/10 px-2 py-0.5 rounded-sm">Aug 2022 - Dec 2023</span>
                                </div>
                                <div className="text-sm">Tokyo</div>
                            </div>
                            <div className="mb-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Staff Cloud Native Architect (P5)</span>
                                    <span className="text-xs bg-fg/10 px-2 py-0.5 rounded-sm">Apr 2020 - Jul 2022</span>
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
                                    <span className="text-xs bg-fg/10 px-2 py-0.5 rounded-sm">Sep 2018 - Apr 2020</span>
                                </div>
                                <div className="text-sm">Tokyo</div>
                            </div>
                            <div className="mb-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Senior Solutions Architect (P4)</span>
                                    <span className="text-xs bg-fg/10 px-2 py-0.5 rounded-sm">Jan 2016 - Aug 2018</span>
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
                                    <span className="text-xs bg-fg/10 px-2 py-0.5 rounded-sm">Apr 2009 - Dec 2015</span>
                                </div>
                                <div className="text-sm">Tokyo</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            
            {/* Education */}
            <Card isDashed={true} className={sectionStyle}>
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
                                    <span className="text-xs bg-fg/10 px-2 py-0.5 rounded-sm">Apr 2007 - Mar 2009</span>
                                </div>
                                <div className="text-sm">
                                    <a href={'https://www.i.u-tokyo.ac.jp/'} className="hover:underline">Graduate School of Information Science and Technology</a>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Bachelor of Science, Mechano-Informatics</span>
                                    <span className="text-xs bg-fg/10 px-2 py-0.5 rounded-sm">Apr 2003 - Mar 2007</span>
                                </div>
                                <div className="text-sm">
                                    <a href={'https://www.u-tokyo.ac.jp/'} className="hover:underline">Faculty of Engineering</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default AboutMePage;