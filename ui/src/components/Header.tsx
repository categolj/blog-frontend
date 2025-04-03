import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme, getCurrentTheme } from "../hooks/useTheme";

interface HeaderProps {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMouseEnter, onMouseLeave }) => {
    const { theme, isDark } = useTheme();
    const [isLinkHovering, setIsLinkHovering] = useState(false);
    
    // Additional check to ensure we're handling dark mode correctly
    const isDarkMode = isDark || theme === 'dark';
    
    // Handle mouse events specifically for the IK.AM link
    const handleLinkMouseEnter = () => {
        setIsLinkHovering(true);
        
        // Double-check dark mode before triggering effect
        const currentTheme = getCurrentTheme();
        if (currentTheme === 'dark' && onMouseEnter) {
            onMouseEnter();
        }
    };
    
    const handleLinkMouseLeave = () => {
        setIsLinkHovering(false);
        
        // Double-check dark mode before handling leave event
        const currentTheme = getCurrentTheme();
        if (currentTheme === 'dark' && onMouseLeave) {
            onMouseLeave();
        }
    };

    // Monitor theme changes and update effects if needed
    useEffect(() => {
        // If theme changes while link is being hovered, handle it
        if (isLinkHovering) {
            const currentTheme = getCurrentTheme();
            if (currentTheme === 'dark' && onMouseEnter) {
                onMouseEnter();
            } else if (currentTheme === 'light' && onMouseLeave) {
                onMouseLeave();
            }
        }
    }, [theme, isLinkHovering, onMouseEnter, onMouseLeave]);

    return <>
        <h1 className="text-[1.75rem] mt-0 mb-6">
            <Link 
                to={`/`}
                className={`relative ${isDarkMode ? 'cursor-binary' : ''}`}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
                style={{
                    textShadow: isLinkHovering && isDarkMode ? '0 0 5px #F4E878, 0 0 10px #F4E878' : 'none',
                    transition: 'text-shadow 0.3s ease'
                }}
            >
                IK.AM
            </Link>
        </h1>
    </>;
};

export default Header;