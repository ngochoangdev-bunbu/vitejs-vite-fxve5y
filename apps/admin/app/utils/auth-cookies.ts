// utils/auth-cookies.ts
'use client';

const AUTH_COOKIE_NAME = 'amplify-auth-status';

export const setAuthCookie = (isAuthenticated: boolean) => {
    if (typeof document !== 'undefined') {
        const expires = new Date();
        expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 24時間

        document.cookie = `${AUTH_COOKIE_NAME}=${isAuthenticated ? 'authenticated' : 'unauthenticated'}; expires=${expires.toUTCString()}; path=/; samesite=strict`;
    }
};

export const removeAuthCookie = () => {
    if (typeof document !== 'undefined') {
        document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};
