// src/common/auth/jwt-payload.interface.ts

// This interface defines the data stored in the JWT token payload.
export interface JwtPayload {
    id: string;
    email: string;
    role: string; // Keep this as a string, as the role name is what's usually passed
    permissions?: string[];
    // Add any other properties you need from the token here
}