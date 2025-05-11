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

export const AuthMessages = {
  INVALID_PASSWORD: 'Invalid password',
  FORGOT_PASSWORD_EMAIL_SENT: 'Forgot password email sent successfully',
  INVALID_RESET_CODE: 'Invalid reset code',
  RESET_CODE_VALID: 'Reset code is valid',
  PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
};

export const SubscriptionPlanMessages = {
  SUB_PLAN_NOT_FOUND: (id: number) =>
    `Subscription Plan with ID ${id} not found`,
  SUB_PLAN_CREATED: 'Subscription Plan created successfully',
  SUB_PLAN_ALREADY_EXISTS: (name: string) =>
    `Subscription Plan with name ${name} already exists`,
  SUB_PLAN_UPDATED: 'Subscription Plan updated successfully',
  SUB_PLAN_DELETED: 'Subscription Plan deleted successfully',
};
export const PermissionMessages = {
  PERMISSION_CREATED: 'Permission created successfully',
  PERMISSION_ALREADY_EXISTS: (name: string) =>
    `Permission with name ${name} already exists`,
  PERMISSION_NOT_FOUND: (id: number) => `Permission with ID ${id} not found`,
  PERMISSION_UPDATED: 'Permission updated successfully',
  PERMISSION_DELETED: 'Permission deleted successfully',
};
export const SubscriptionPermissionMessages = {
  SUBSCRIPTION_PERMISSION_CREATED:
    'Subscription permission created successfully',
  SUBSCRIPTION_PERMISSION_ALREADY_EXISTS:
    'Subscription permission already exists for this plan and permission',
  SUBSCRIPTION_PERMISSION_NOT_FOUND: (id: number) =>
    `Subscription permission with ID ${id} not found`,
  SUBSCRIPTION_PERMISSION_UPDATED:
    'Subscription permission updated successfully',
  SUBSCRIPTION_PERMISSION_DELETED:
    'Subscription permission deleted successfully',
};

export const GameMessages = {
  GAME_CREATED: 'Game created successfully',
  GAMES_FETCHED: 'Games fetched successfully',
  GAME_FETCHED: 'Game fetched successfully',
  GAME_UPDATED: 'Game updated successfully',
  GAME_DELETED: 'Game deleted successfully',
  GAME_ACTIVATED: 'Game activated successfully',
  GAME_ALREADY_ACTIVATED: 'Game already activated ',
  GAME_ALREADY_DEACTIVATED: 'Game already deactivated ',
  GAME_DEACTIVATED: 'Game deactivated successfully',
  GAME_NOT_FOUND: (id: number) => `Game with ID ${id} not found`,
  GAME_ALREADY_EXISTS: (field: string) =>
    `Game with this ${field} already exists`,
};
export const ChosenGameMessages = {
  CHOSEN_GAME_CREATED: 'Chosen game created successfully',
  CHOSEN_GAMES_FETCHED: 'Chosen games fetched successfully',
  CHOSEN_GAME_FETCHED: 'Chosen game fetched successfully',
  CHOSEN_GAME_UPDATED: 'Chosen game updated successfully',
  CHOSEN_GAME_DELETED: 'Chosen game deleted successfully',
  CHOSEN_GAME_NOT_FOUND: (id: number) => `Chosen game with ID ${id} not found`,
  CHOSEN_GAME_ALREADY_EXISTS: (field: string) =>
    `Chosen game with this ${field} already exists for this admin`,
};
export const UserGameMessages = {
  USER_GAME_CREATED: 'User game relationship created successfully',
  USER_GAMES_FETCHED: 'User games fetched successfully',
  USER_GAME_FETCHED: 'User game fetched successfully',
  USER_GAME_UPDATED: 'User game updated successfully',
  USER_GAME_DELETED: 'User game deleted successfully',
  PLAY_COUNT_INCREMENTED: 'Play count incremented successfully',
  USER_GAME_NOT_FOUND: (id: number) => `User game with ID ${id} not found`,
  USER_GAME_ALREADY_EXISTS: 'User already has this game assigned',
};
