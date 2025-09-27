import React from 'react';

type CircularProgressProps = {
    value: number;
    size?: number;
    strokeWidth?: number;
};

export const CircularProgress = ({ value, size = 140, strokeWidth = 12 }: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const getColor = () => {
        if (value >= 70) return 'hsl(var(--chart-2))';
        if (value >= 40) return 'hsl(var(--chart-4))';
        return 'hsl(var(--destructive))';
    };
    
    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                <circle
                    stroke="hsl(var(--muted) / 0.3)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke={getColor()}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={offset}
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-3xl font-bold font-headline text-foreground">{Math.round(value)}</span>
                 <span className="text-sm font-bold font-headline text-muted-foreground">%</span>
            </div>
        </div>
    );
};
