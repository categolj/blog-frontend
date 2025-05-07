import React, { ReactNode } from 'react';

interface InfoBoxProps {
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
}

/**
 * A standardized information box component for displaying notices and alerts
 */
const InfoBox: React.FC<InfoBoxProps> = ({
    children,
    icon,
    className = ''
}) => {
    return (
        <div 
            className={`
                p-4 rounded-lg bg-(color:--info-bg) mb-6
                ${className}
            `}
        >
            <div className="flex items-start">
                {icon && (
                    <span className="h-5 w-5 mr-2 mt-0.5 shrink-0 text-(color:--info-text)">
                        {icon}
                    </span>
                )}
                <span className="text-(color:--info-text)">
                    {children}
                </span>
            </div>
        </div>
    );
};

export default InfoBox;
