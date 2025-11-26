
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'indigo' | 'red' | 'yellow' | 'purple' | 'gray';
    description: string;
    onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color = 'gray', description, onClick }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-400' },
        green: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-600 dark:text-green-400' },
        indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-600 dark:text-indigo-400' },
        red: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-600 dark:text-red-400' },
        yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-600 dark:text-yellow-400' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-400' },
        gray: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' },
    };
    
    const Wrapper = onClick ? 'button' : 'div';

    return (
        <Wrapper 
            onClick={onClick}
            className="w-full text-left bg-ui-card p-5 rounded-xl shadow-sm border border-ui-border-light flex items-start space-x-4 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[color].bg} ${colorClasses[color].text}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-text-secondary">{title}</p>
                <p className="text-2xl font-bold text-text-primary">{value}</p>
                <p className="text-xs text-text-muted mt-1">{description}</p>
            </div>
        </Wrapper>
    );
};

interface KpiCardProps {
    title: string;
    value: string;
    delta: string;
    deltaType: 'increase' | 'decrease';
    data: { value: number }[];
}

const TrendIcon: React.FC<{type: 'increase' | 'decrease'}> = ({ type }) => {
    if (type === 'increase') {
        return <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>;
    }
    return <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>;
}


export const KpiCard: React.FC<KpiCardProps> = ({ title, value, delta, deltaType, data }) => {
    const { theme } = useTheme();
    const lineStroke = deltaType === 'increase' 
        ? (theme === 'dark' ? '#4ade80' : '#16a34a')
        : (theme === 'dark' ? '#f87171' : '#dc2626');
    return (
        <div className="bg-ui-card p-5 rounded-xl shadow-sm border border-ui-border-light transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-text-secondary">{title}</p>
                    <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${deltaType === 'increase' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'}`}>
                    <TrendIcon type={deltaType} />
                    <span>{delta}</span>
                </div>
            </div>
             {data.length > 0 && <div className="h-16 mt-2 -mb-2 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line type="monotone" dataKey="value" stroke={lineStroke} strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>}
        </div>
    );
};