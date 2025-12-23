import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import prisma from '@/lib/prisma';

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
                try {
                    const user = await prisma.user.findUnique({
                        where: { id: token.id as string },
                        select: { name: true, email: true, role: true, image: true }
                    });

                    if (user) {
                        session.user.name = user.name;
                        session.user.email = user.email;
                        session.user.image = user.image;
                        // @ts-ignore
                        session.user.role = user.role;
                    }
                } catch (error) {
                    console.error('Failed to fetch fresh user data for session:', error);
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        }
    },
    events: {
        async signIn({ user }) {
            try {
                if (user && user.id) {
                    const { logAction, AuditAction, AuditEntity } = await import('@/lib/audit');
                    await logAction(
                        user.id,
                        AuditAction.LOGIN,
                        AuditEntity.AUTH,
                        'User logged in'
                    );
                }
            } catch (error) {
                console.error('Failed to log sign in:', error);
            }
        }
    }
});
