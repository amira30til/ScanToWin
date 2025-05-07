export const UserMessages = {
  USER_CREATED: 'User created successfully',
  USER_ALREADY_EXISTS: (field: string) =>
    `User with this ${field} already exists`,
  USER_NOT_FOUND: (id: number) => `User with ID ${id} not found`,
  USER_REFRESH_TOKEN_NOT_FOUND: 'User with this refresh token not found',
  EMAIL_USER_NOT_FOUND: (email: string) => `User with Email ${email} not found`,
  PHONE_USER_NOT_FOUND: (tel: number) => `User with tel ${tel} not found`,
  CANNOT_REPORT_ADMIN: 'Forbidden: cannot report admin',
};

export const CategoryMessages = {
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_NOT_FOUND: (id: number) => `Category with ID ${id} not found`,
  CATEGORIES_NOT_FOUND: (missingCategoryIds: number[]) =>
    `Categories with IDs ${missingCategoryIds.join(', ')} not found`,
};

export const DealMessages = {
  DEAL_CREATED: 'Deal created successfully',
  DEAL_NOT_FOUND: (id: number) => `Deal with ID ${id} not found`,
  DEAL_ALREADY_EXPIRED: (id: number) =>
    `User has already reported the deal with ID ${id} as expired`,
};

export const ReportedDealMessages = {
  REPORT_DEAL_CREATED: 'Deal reported successfully',
  REPORT_NOT_FOUND: (id: number) => `Report with ID ${id} not found`,
  REPORT_ALREADY_RESOLVED: 'Report already resolved',
  REPORT_ALREADY_DISMISSED: 'Report already dismissed',
};

export const CommentMessages = {
  COMMENT_CREATED: 'Comment sent successfully',
  COMMENT_NOT_FOUND: (id: number) => `Comment with ID ${id} not found`,
  COMMENT_ALREADY_REJECTED: `Can't update a comment that has already been rejected`,
};

export const AuthMessages = {
  INVALID_PASSWORD: 'Invalid password',
  FORGOT_PASSWORD_EMAIL_SENT: 'Forgot password email sent successfully',
  INVALID_RESET_CODE: 'Invalid reset code',
  RESET_CODE_VALID: 'Reset code is valid',
  PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
};
