// src/components/Sidebar.tsx

import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    LayoutTemplate,
    Box,
    Server,
    Image,
    Database,
    UploadCloud,
    HomeIcon
} from 'lucide-react';

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { projectId } = useParams();

    const sections = [
        {title: '',
            items: [
                { to: `/projects/${projectId}`, label: 'General', icon: <HomeIcon size={18} /> },
            ]
        },
        {
            title: 'Frontend',
            items: [
                { to: `/projects/${projectId}/pages`, label: 'Pages', icon: <FileText size={18} /> },
                { to: `/projects/${projectId}/templates`, label: 'Templates', icon: <LayoutTemplate size={18} /> },
                { to: `/projects/${projectId}/components`, label: 'Components', icon: <Box size={18} /> },
            ],
        },
        {
            title: 'Backend',
            items: [
                { to: `/projects/${projectId}/router`, label: 'Router', icon: <Server size={18} /> },
                { to: `/projects/${projectId}/assets`, label: 'Assets & Content', icon: <Image size={18} /> },
                { to: `/projects/${projectId}/dbschema`, label: 'DB Schema', icon: <Database size={18} /> },
            ],
        },
        {
            title: 'Deployment',
            items: [
                { to: `/projects/${projectId}/deployment`, label: 'Deployment', icon: <UploadCloud size={18} /> },
            ],
        },
    ];

    return (
        <div
            className={cn(
                'h-full bg-white text-black border-r border-gray-300 transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-64'
            )}
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
                {!isCollapsed && <span className="text-xl font-bold">Menu</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="transition-transform duration-300"
                >
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </Button>
            </div>
            <nav className="mt-4">
                {sections.map((section) => (
                    <div key={section.title} className="mb-4">
                        {!isCollapsed && (
                            <div className="px-4 py-2 text-sm font-semibold uppercase text-gray-600 transition-colors duration-200">
                                {section.title}
                            </div>
                        )}
                        {section.items.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center px-4 py-2 hover:bg-gray-200 transition-colors duration-200',
                                        isActive ? 'bg-gray-300 font-semibold' : ''
                                    )
                                }
                            >
                                <div className="flex items-center space-x-2">
                                    {item.icon}
                                    {!isCollapsed && <span>{item.label}</span>}
                                </div>
                               
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>
        </div>
    );
}

export { Sidebar };
