import Header from './Header.tsx';
import {Outlet} from 'react-router-dom';
import Footer from "./Footer.tsx";
import Navi from "./Navi.tsx";
import { useState, useEffect } from 'react';
import BinaryRain from './BinaryRain.tsx';
import { useTheme, getCurrentTheme } from '../hooks/useTheme';

const Layout = () => {
    const { theme, isDark } = useTheme();
    const [isHovering, setIsHovering] = useState(false);
    
    // Get real-time dark mode status directly from DOM
    const isDarkMode = isDark || theme === 'dark';
    
    // Only show binary rain in dark mode
    const showBinaryRain = isDarkMode && isHovering;
    
    // Effect to sync dark mode state with DOM
    useEffect(() => {
        // When theme changes, check if we need to update binary visibility
        const currentTheme = getCurrentTheme();
        if (currentTheme === 'light' && isHovering) {
            // If we switched to light mode while hovering, stop the effect
            setIsHovering(false);
        }
    }, [theme, isHovering]);
    
    // Handlers for the hover event on IK.AM
    const handleMouseEnter = () => {
        // Only set hovering if in dark mode
        if (getCurrentTheme() === 'dark') {
            setIsHovering(true);
        }
    };
    
    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div className="p-6 md:p-8 sm:px-2">
            {/* Header container with relative positioning for binary rain effect */}
            <div className="relative">
                <BinaryRain active={showBinaryRain} />
                <div className="relative z-10 flex flex-wrap">
                    <div className="flex-grow">
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