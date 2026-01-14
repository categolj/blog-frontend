import Header from './Header.tsx';
import {Outlet} from 'react-router-dom';
import Footer from "./Footer.tsx";
import Navi from "./Navi.tsx";
import { useState } from 'react';
import BinaryRain from './BinaryRain.tsx';
import { useTheme } from '../hooks/useTheme';

const Layout = () => {
    const { theme, isDark } = useTheme();
    const [isHovering, setIsHovering] = useState(false);
    
    // Get real-time dark mode status directly from DOM
    const isDarkMode = isDark || theme === 'dark';

    // Show binary rain on hover (both light and dark mode)
    const showBinaryRain = isHovering;

    // Binary rain colors based on theme
    const binaryRainColor = isDarkMode ? '#F4E878' : '#000000';
    const binaryRainFadeColor = isDarkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    // Handlers for the hover event on IK.AM
    const handleMouseEnter = () => {
        setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div className="p-6 md:p-8 sm:px-2">
            {/* Header container with relative positioning for binary rain effect */}
            <div className="relative">
                <BinaryRain active={showBinaryRain} color={binaryRainColor} fadeColor={binaryRainFadeColor} />
                <div className="relative z-10 flex flex-wrap">
                    <div className="grow">
                        <Header 
                            onMouseEnter={handleMouseEnter} 
                            onMouseLeave={handleMouseLeave}
                        />
                    </div>
                    <Navi/>
                </div>
            </div>
            <hr className="my-4"/>
            <main className="my-6">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
};

export default Layout;