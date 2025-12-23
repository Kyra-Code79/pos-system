import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    session: {
        strategy: 'jwt',
        maxAge: 3600, // 1 hour
    },
    pages: {
        signIn: '/login',
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLogin = nextUrl.pathname.startsWith('/login');

            // Define paths
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnPos = nextUrl.pathname.startsWith('/pos');
            const isOnManager = nextUrl.pathname.startsWith('/manager');
            const isOnPublic = nextUrl.pathname === '/'; // Assuming landing page is public or redirect base

            if (isLoggedIn) {
                // @ts-ignore
                const role = auth?.user?.role;

                // Redirect logic based on role when accessing login or root
                if (isOnLogin || nextUrl.pathname === '/') {
                    if (role === 'ADMIN') return Response.redirect(new URL('/admin', nextUrl));
                    if (role === 'CASHIER') return Response.redirect(new URL('/pos', nextUrl));
                    if (role === 'MANAGEMENT') return Response.redirect(new URL('/manager', nextUrl));
                }

                // Access Control
                if (role === 'ADMIN') {
                    // Admin has access to all routes
                }

                if (role === 'CASHIER') {
                    if (isOnAdmin || isOnManager) {
                        return Response.redirect(new URL('/pos', nextUrl));
                    }
                }

                if (role === 'MANAGEMENT') {
                    if (isOnAdmin) { // Maybe restrict admin access? Or allow partial?
                        // User said "Management -> manager", implying strict separation
                        return Response.redirect(new URL('/manager', nextUrl));
                    }
                    // Manager might need POS access? Let's assume strict for now based on prompt.
                }

                return true;
            } else {
                // Not logged in
                if (isOnAdmin || isOnPos || isOnManager) {
                    return false; // Redirect to login
                }
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && token.role) {
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
