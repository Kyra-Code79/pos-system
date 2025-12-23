'use client';

import { useActionState, useState } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, BarChart3, Globe } from 'lucide-react';
import { authenticate } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginFormProps {
    heroTitle?: string;
    heroDescription?: string;
}

export default function LoginForm({ heroTitle = "Welcome to K.Inc POS", heroDescription = "A secure POS system." }: LoginFormProps) {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    // Reusable Form Content
    const LoginFields = (
        <>
            <form action={formAction} className="flex-1 flex flex-col justify-center px-6 pb-6 h-full">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="m@example.com"
                            required
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-[#00C853]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-slate-300">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-[#00C853]"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-300"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                    {showPassword ? 'Hide password' : 'Show password'}
                                </span>
                            </Button>
                        </div>
                    </div>
                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <p className="text-sm text-red-400">{errorMessage}</p>
                        )}
                    </div>
                </div>
                <div className="mt-auto pt-4">
                    <Button className="w-full bg-[#00C853] hover:bg-[#00b34a] text-white font-bold" disabled={isPending}>
                        {isPending ? 'Signing in...' : 'Login'}
                    </Button>
                </div>
            </form>
        </>
    );

    return (
        <div className="w-full max-w-md">
            {/* DESKTOP VIEW: Simple Card, No Flips */}
            <div className="hidden lg:block relative z-10">
                <Card className="w-full bg-[#1e293b] border-slate-700 shadow-2xl h-[500px] flex flex-col">
                    <CardHeader className="text-center space-y-1 relative">
                        <CardTitle className="text-2xl font-bold text-[#00C853]">Login</CardTitle>
                    </CardHeader>
                    {LoginFields}
                </Card>
            </div>

            {/* MOBILE VIEW: 3D Flip Card */}
            <div className="block lg:hidden w-full h-[500px] perspective-1000 relative">
                <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                    {/* FRONT FACE (Info) */}
                    <Card className="absolute inset-0 w-full h-full bg-[#1e293b] border-slate-700 shadow-2xl backface-hidden flex flex-col justify-center items-center p-6 text-center z-20">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white">
                                Welcome to <span className="text-[#00C853]">K.Inc POS</span>
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {heroDescription}
                            </p>

                            <div className="space-y-4 text-left w-full max-w-xs mx-auto pt-4">
                                <div className="flex items-center gap-3 text-slate-300 text-sm">
                                    <ShieldCheck className="w-4 h-4 text-[#00C853]" /> <span>Secure and verifiable</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 text-sm">
                                    <BarChart3 className="w-4 h-4 text-[#00C853]" /> <span>Real-time Analytics</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 text-sm">
                                    <Globe className="w-4 h-4 text-[#00C853]" /> <span>Cloud Based</span>
                                </div>
                            </div>

                            <Button
                                className="bg-[#00C853] hover:bg-[#00b34a] text-white font-bold w-full max-w-xs mt-8"
                                onClick={() => setIsFlipped(true)}
                            >
                                Go to Login <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </Card>

                    {/* BACK FACE (Login Form) */}
                    <Card className="absolute inset-0 w-full h-full bg-[#1e293b] border-slate-700 shadow-2xl backface-hidden rotate-y-180 flex flex-col z-10">
                        <CardHeader className="text-center space-y-1 relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute left-2 top-2 text-slate-400 hover:text-white"
                                onClick={() => setIsFlipped(false)}
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back
                            </Button>
                            <CardTitle className="text-2xl font-bold text-[#00C853]">Login</CardTitle>
                        </CardHeader>
                        {LoginFields}
                    </Card>
                </div>
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
}
