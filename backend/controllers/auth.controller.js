const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../common/utils/response.util');
const { HttpStatusCodes } = require('../common/constants/http.constants');
const { handleServiceError } = require('../common/utils/error-handler.util');
const { UserMessages, AuthMessages } = require('../common/constants/messages.constants');
const mailService = require('../services/mail.service');

const setRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  };
  res.cookie('refresh_token', token, cookieOptions);
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log incoming request
    console.log('\n=== LOGIN ATTEMPT ===');
    console.log('Request body:', JSON.stringify(req.body));
    console.log('Email received:', email);
    console.log('Email type:', typeof email);
    console.log('Email length:', email ? email.length : 'null/undefined');

    // Validate input
    if (!email || !password) {
      console.log('? Missing email or password');
      return res.status(400).json({
        statusCode: 400,
        error: { message: 'Email and password are required' },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('Normalized email:', normalizedEmail);
    console.log('Normalized email length:', normalizedEmail.length);
    console.log('Query: Admin.findOne({ email: "' + normalizedEmail + '" })');

    // First, let's check what's actually in the database
    const allAdmins = await Admin.find({}).select('+password +adminStatus');
    console.log('\n--- All admins in database ---');
    allAdmins.forEach((admin, idx) => {
      console.log(`Admin ${idx + 1}:`);
      console.log(`  _id: ${admin._id}`);
      console.log(`  email: "${admin.email}"`);
      console.log(`  email length: ${admin.email ? admin.email.length : 'null'}`);
      console.log(`  email.toLowerCase(): "${admin.email ? admin.email.toLowerCase() : 'null'}"`);
      console.log(`  role: ${admin.role}`);
      console.log(`  adminStatus: ${admin.adminStatus}`);
      console.log(`  Matches query? ${admin.email && admin.email.toLowerCase() === normalizedEmail}`);
    });
    console.log('--- End of admins list ---\n');

    const user = await Admin.findOne({ email: normalizedEmail })
      .select('+password +adminStatus');

    console.log('Query result:', user ? 'FOUND' : 'NOT FOUND');
    if (user) {
      console.log('Found user email:', user.email);
      console.log('Found user role:', user.role);
      console.log('Found user status:', user.adminStatus);
    } else {
      console.log('? User not found with email:', normalizedEmail);
      
      // Try alternative queries
      console.log('\n--- Trying alternative queries ---');
      const query1 = await Admin.findOne({ email: email }).select('+password +adminStatus');
      console.log('Query with original email:', query1 ? 'FOUND' : 'NOT FOUND');
      
      const query2 = await Admin.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } }).select('+password +adminStatus');
      console.log('Query with case-insensitive regex:', query2 ? 'FOUND' : 'NOT FOUND');
    }

    if (!user) {
      console.log('=== END LOGIN ATTEMPT (FAILED) ===\n');
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.EMAIL_USER_NOT_FOUND(normalizedEmail) },
      });
    }

    console.log('Checking admin status:', user.adminStatus);
    if (user.adminStatus !== 'ACTIVE') {
      console.log('? Account is not active. Status:', user.adminStatus);
      console.log('=== END LOGIN ATTEMPT (FAILED - INACTIVE ACCOUNT) ===\n');
      return res.status(401).json({
        statusCode: 401,
        error: { message: 'Your account is not active' },
      });
    }
    console.log('? Account is active');

    console.log('? User found, checking password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('? Invalid password');
      console.log('=== END LOGIN ATTEMPT (FAILED - INVALID PASSWORD) ===\n');
      return res.status(401).json({
        statusCode: 401,
        error: { message: AuthMessages.INVALID_PASSWORD },
      });
    }

    console.log('? Password valid, generating tokens...');
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED,
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, {
      expiresIn: process.env.REFRESH_JWT_EXPIRED,
    });

    setRefreshTokenCookie(res, refreshToken);
    user.refreshToken = refreshToken;
    await user.save();

    console.log('? Login successful!');
    console.log('   User ID:', user.id);
    console.log('   User email:', user.email);
    console.log('   User role:', user.role);
    console.log('=== END LOGIN ATTEMPT (SUCCESS) ===\n');

    return res.json({ accessToken, user });
  } catch (error) {
    console.error('\n? ERROR IN LOGIN FUNCTION ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR LOG ===\n');
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token || req.refreshToken;

    if (!refreshToken) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_REFRESH_TOKEN_NOT_FOUND },
      });
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

    const user = await Admin.findById(payload.sub).select(
      'id email role refreshToken'
    );

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_REFRESH_TOKEN_NOT_FOUND },
      });
    }

    if (!user.refreshToken) {
      return res.status(401).json({
        statusCode: 401,
        error: {
          message: 'Invalid refresh token: User has no stored refresh token',
        },
      });
    }

    const newPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = jwt.sign(newPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED,
    });

    await user.save();

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, {
        role: user.role,
        accessToken: newAccessToken,
      })
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      clearRefreshTokenCookie(res);
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_REFRESH_TOKEN_NOT_FOUND },
      });
    }

    const user = await Admin.findOne({ refreshToken });

    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.USER_REFRESH_TOKEN_NOT_FOUND },
      });
    }

    user.refreshToken = null;
    await user.save();

    clearRefreshTokenCookie(res);

    return res.json(
      ApiResponse.success(HttpStatusCodes.SUCCESS, 'Logout successful')
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.EMAIL_USER_NOT_FOUND(email) },
      });
    }
    const code = mailService.generateEmailCode();
    await mailService.sendMailForget({
      from: process.env.MAIL_FROM || 'tilouchamira@gmail.com',
      receiverEmail: email,
      subject: 'Forgot Password',
      code,
    });
    user.verificationCode = code;
    await user.save();
    return res.json(
      ApiResponse.success(
        HttpStatusCodes.SUCCESS,
        AuthMessages.FORGOT_PASSWORD_EMAIL_SENT
      )
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;

    const user = await Admin.findOne({ email }).select(
      'id email verificationCode password'
    );

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: { message: UserMessages.EMAIL_USER_NOT_FOUND(email) },
      });
    }

    if (!user.verificationCode || user.verificationCode !== verificationCode) {
      return res.status(401).json({
        statusCode: 401,
        error: { message: AuthMessages.INVALID_RESET_CODE },
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.verificationCode = null;

    await user.save();

    return res.json(
      ApiResponse.success(
        HttpStatusCodes.SUCCESS,
        AuthMessages.PASSWORD_RESET_SUCCESS || 'Password has been reset successfully'
      )
    );
  } catch (error) {
    const errorResponse = handleServiceError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

module.exports = {
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
};
