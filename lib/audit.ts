import prisma from "@/lib/prisma";

export enum AuditAction {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE'
}

export enum AuditEntity {
    AUTH = 'AUTH',
    USER = 'USER',
    PRODUCT = 'PRODUCT',
    ORDER = 'ORDER'
}

export async function logAction(
    userId: string,
    action: AuditAction | string,
    entity: AuditEntity | string,
    details?: string
) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action: String(action),
                entity: String(entity),
                details
            }
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw, we don't want to break the main action if logging fails
    }
}
