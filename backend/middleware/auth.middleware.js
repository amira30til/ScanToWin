const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const extractToken = (req) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

// Basic auth guard - verifies JWT token
const authGuard = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        error: { message: 'Unauthorized' },
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT secret not found in environment variables');
    }

    const payload = jwt.verify(token, jwtSecret);
    const user = await Admin.findById(payload.sub);

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: 'User not found' },
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      error: { message: 'Unauthorized' },
    });
  }
};

// Admin guard - allows ADMIN and SUPER_ADMIN
const adminGuard = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        error: { message: 'Unauthorized' },
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, jwtSecret);

    const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];
    if (!allowedRoles.includes(payload.role)) {
      return res.status(403).json({
        statusCode: 403,
        error: { message: 'Forbidden' },
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      error: { message: 'Unauthorized' },
    });
  }
};

// Super admin guard - only SUPER_ADMIN
const superAdminGuard = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        error: { message: 'Unauthorized' },
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, jwtSecret);

    if (payload.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        statusCode: 403,
        error: { message: 'Forbidden' },
      });
    }

    const user = await Admin.findById(payload.sub);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: 'User not found' },
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      error: { message: 'Unauthorized' },
    });
  }
};

// Refresh token guard
const refreshTokenGuard = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({
        statusCode: 401,
        error: { message: 'Refresh token not found' },
      });
    }

    const jwtSecret = process.env.REFRESH_JWT_SECRET;
    const payload = jwt.verify(refreshToken, jwtSecret);

    req.user = payload;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      error: { message: 'Invalid refresh token' },
    });
  }
};

module.exports = {
  authGuard,
  adminGuard,
  superAdminGuard,
  refreshTokenGuard,
  extractToken,
};
