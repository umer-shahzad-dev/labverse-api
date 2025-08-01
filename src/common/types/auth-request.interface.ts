// src/common/auth/auth-request.interface.ts

import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface'; // The interface we defined previously

// This interface extends the standard Express Request with our custom user payload
export interface AuthRequest extends Request {
    user: JwtPayload;
}