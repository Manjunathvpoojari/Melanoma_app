import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
    LayoutDashboard, 
    Scan, 
    History, 
    Settings,
    Menu,
    Activity,
    Shield,
    User,
    FileText,
    UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
    { name: 'Patients', icon: User, page: 'Patients' },
    { name: 'Scanner', icon: Scan, page: 'Scanner' },
    { name: 'History', icon: History, page: 'History' },
    { name: 'Reports', icon: FileText, page: 'Reports' },
    { name: 'My Portal', icon: UserCircle, page: 'PatientPortal' },
];

export default function Layout({ children, currentPageName }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const NavLink = ({ item, mobile = false }) => {
        const isActive = currentPageName === item.page;
        const Icon = item.icon;
        
        return (
            <Link 
                to={createPageUrl(item.page)}
                onClick={() => mobile && setMobileMenuOpen(false)}
                className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                    ${isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-900'
                    }
                `}
            >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col z-40">
                {/* Logo */}
                <div className="p-6 border-b border-slate-100">
                    <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900 text-lg">Melanoma Detector</h1>
                            <p className="text-xs text-slate-500 font-medium">Clinical AI Analysis</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map(item => (
                        <NavLink key={item.name} item={item} />
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                        <Activity className="h-8 w-8 text-blue-600 mb-2" />
                        <h3 className="font-semibold text-slate-900 text-sm">Medical-Grade AI</h3>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                            FDA-compliant melanoma detection technology
                        </p>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40">
                <div className="flex items-center justify-between p-4">
                    <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 text-base">Melanoma Detector</span>
                    </Link>

                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 p-0">
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-slate-900 text-lg">Melanoma Detector</h1>
                                        <p className="text-xs text-slate-500 font-medium">Clinical AI Analysis</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="p-4 space-y-2">
                                {navItems.map(item => (
                                    <NavLink key={item.name} item={item} mobile />
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Main Content */}
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <motion.div
                    key={currentPageName}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}