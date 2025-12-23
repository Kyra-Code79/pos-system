import { getLandingPageContent } from "@/lib/actions/landing";
import LoginForm from "@/components/auth/LoginForm";
import { ShieldCheck, BarChart3, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
    const content = await getLandingPageContent();
    const heroTitle = content?.heroTitle || "One Cashier App For All Types Of Business";
    const heroDescription = content?.heroDescription || "A cloud-based online cashier application that can take your business potential to the highest level.";

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#0f172a] text-white overflow-hidden relative">
            <div className="absolute top-4 left-4 z-50">
                <Button asChild variant="ghost" className="text-white hover:text-[#00C853] hover:bg-white/10 gap-2">
                    <Link href="/">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>

            {/* Left Side - Content */}
            <div className="hidden lg:flex flex-col justify-center px-16 relative">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#00C853] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
                    <div className="absolute top-[20%] -right-[10%] w-[70%] h-[70%] bg-[#00C853] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold mb-6">
                        Welcome to <span className="text-[#00C853]">K.Inc POS</span>
                    </h1>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                        {heroDescription}
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <ShieldCheck className="w-6 h-6 text-[#00C853]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#00C853]">Secure & Reliable</h3>
                                <p className="text-sm text-slate-400">Enterprise-grade security for your transactions.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <BarChart3 className="w-6 h-6 text-[#00C853]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#00C853]">Real-time Analytics</h3>
                                <p className="text-sm text-slate-400">Track sales and performance instantly.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <Globe className="w-6 h-6 text-[#00C853]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#00C853]">Cloud Based</h3>
                                <p className="text-sm text-slate-400">Access your business from anywhere, anytime.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 lg:p-16 relative">
                <div className="absolute inset-0 z-0">
                    <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-[#00C853] rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
                </div>
                <div className="w-full max-w-md relative z-10">
                    <LoginForm heroTitle="Welcome to K.Inc POS" heroDescription={heroDescription} />
                </div>
            </div>
        </div>
    );
}
