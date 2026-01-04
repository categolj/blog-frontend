import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme, getCurrentTheme } from "../hooks/useTheme";

interface HeaderProps {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

// Title characters and animation constants
const TITLE_CHARS = ['I', 'K', '.', 'A', 'M'];
const CHAR_WIDTH_EM = 0.6;
// Target offsets to reverse the string: I->4, K->2, .->0, A->-2, M->-4
const TARGET_OFFSETS = [4, 2, 0, -2, -4];
// Animation order: move from both ends toward center
const MOVE_ORDER = [0, 4, 1, 3, 2];

const Header: React.FC<HeaderProps> = ({ onMouseEnter, onMouseLeave }) => {
    const { theme, isDark } = useTheme();
    const [isLinkHovering, setIsLinkHovering] = useState(false);
    const [charOffsets, setCharOffsets] = useState([0, 0, 0, 0, 0]);
    const [isFlipping, setIsFlipping] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Additional check to ensure we're handling dark mode correctly
    const isDarkMode = isDark || theme === 'dark';

    // Title animation sequence on initial load
    useEffect(() => {
        if (hasAnimated) return;

        const runAnimation = async () => {
            // Initial delay
            await new Promise(r => setTimeout(r, 500));

            // Phase 1: Move characters one by one to form MA.KI
            for (let i = 0; i < MOVE_ORDER.length; i++) {
                await new Promise(r => setTimeout(r, 150));
                setCharOffsets(prev => {
                    const next = [...prev];
                    next[MOVE_ORDER[i]] = TARGET_OFFSETS[MOVE_ORDER[i]];
                    return next;
                });
            }

            // Wait for movement to complete
            await new Promise(r => setTimeout(r, 600));

            // Phase 2: Show MA.KI for 5 seconds
            await new Promise(r => setTimeout(r, 5000));

            // Phase 3: Flip back to IK.AM
            setIsFlipping(true);
            await new Promise(r => setTimeout(r, 400));
            setCharOffsets([0, 0, 0, 0, 0]);
            await new Promise(r => setTimeout(r, 400));
            setIsFlipping(false);

            setHasAnimated(true);
        };

        runAnimation();
    }, [hasAnimated]);
    
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
                className={`relative ${isDarkMode ? 'cursor-binary' : ''} title-animation-container`}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
                style={{
                    textShadow: isLinkHovering && isDarkMode ? '0 0 5px #F4E878, 0 0 10px #F4E878' : 'none',
                    transition: 'text-shadow 0.3s ease'
                }}
            >
                <span className={`title-animation-inner ${isFlipping ? 'flipping' : ''}`}>
                    {TITLE_CHARS.map((char, i) => (
                        <span
                            key={i}
                            className="title-char"
                            style={{ transform: `translateX(${charOffsets[i] * CHAR_WIDTH_EM}em)` }}
                        >
                            {char}
                        </span>
                    ))}
                </span>
            </Link>
        </h1>
    </>;
};

export default Header;