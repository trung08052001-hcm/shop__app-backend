const { z } = require('zod');

const register = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').optional(),
        fullName: z.string().min(1, 'Full name is required').optional(),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        address: z.string().optional(),
        phone: z.string().optional(),
        phoneNumber: z.string().optional()
    }).refine((data) => data.name || data.fullName, {
        message: "Name or full name is required",
        path: ["name"],
    })
});

const login = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    })
});

const googleLogin = z.object({
    body: z.object({
        idToken: z.string().min(1, 'Google ID Token is required'),
    })
});

const updateProfile = z.object({
    body: z.object({
        address: z.string().optional(),
        phone: z.string().optional(),
    })
});

const updateUserRole = z.object({
    body: z.object({
        role: z.enum(['user', 'admin'], {
            errorMap: () => ({ message: 'Role must be either user or admin' })
        })
    })
});

const refreshToken = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required')
    })
});

module.exports = {
    register,
    login,
    googleLogin,
    updateProfile,
    updateUserRole,
    refreshToken
};
