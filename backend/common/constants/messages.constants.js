const UserMessages = {
  USER_CREATED: 'User created successfully',
  USER_ALREADY_EXISTS: (field) => `User with this ${field} already exists`,
  USER_NOT_FOUND: (id) => `User with ID ${id} not found`,
  USER_REFRESH_TOKEN_NOT_FOUND: 'User with this refresh token not found',
  EMAIL_USER_NOT_FOUND: (email) => `User with Email ${email} not found`,
  PHONE_USER_NOT_FOUND: (tel) => `User with tel ${tel} not found`,
  CANNOT_REPORT_ADMIN: 'Forbidden: cannot report admin',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',
  USER_DELETE_SUCCESS: (id) => `User with ID ${id} deleted successfully`,
};

const CategoryMessages = {
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_NOT_FOUND: (id) => `Category with ID ${id} not found`,
  CATEGORIES_NOT_FOUND: (missingCategoryIds) =>
    `Categories with IDs ${missingCategoryIds.join(', ')} not found`,
};

const AuthMessages = {
  INVALID_PASSWORD: 'Invalid password',
  FORGOT_PASSWORD_EMAIL_SENT: 'Forgot password email sent successfully',
  INVALID_RESET_CODE: 'Invalid reset code',
  RESET_CODE_VALID: 'Reset code is valid',
  PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
};

const SubscriptionPlanMessages = {
  SUB_PLAN_NOT_FOUND: (id) => `Subscription Plan with ID ${id} not found`,
  SUB_PLAN_CREATED: 'Subscription Plan created successfully',
  SUB_PLAN_ALREADY_EXISTS: (name) =>
    `Subscription Plan with name ${name} already exists`,
  SUB_PLAN_UPDATED: 'Subscription Plan updated successfully',
  SUB_PLAN_DELETED: 'Subscription Plan deleted successfully',
};

const PermissionMessages = {
  PERMISSION_CREATED: 'Permission created successfully',
  PERMISSION_ALREADY_EXISTS: (name) =>
    `Permission with name ${name} already exists`,
  PERMISSION_NOT_FOUND: (id) => `Permission with ID ${id} not found`,
  PERMISSION_UPDATED: 'Permission updated successfully',
  PERMISSION_DELETED: 'Permission deleted successfully',
};

const SubscriptionPermissionMessages = {
  SUBSCRIPTION_PERMISSION_CREATED:
    'Subscription permission created successfully',
  SUBSCRIPTION_PERMISSION_ALREADY_EXISTS:
    'Subscription permission already exists for this plan and permission',
  SUBSCRIPTION_PERMISSION_NOT_FOUND: (id) =>
    `Subscription permission with ID ${id} not found`,
  SUBSCRIPTION_PERMISSION_UPDATED:
    'Subscription permission updated successfully',
  SUBSCRIPTION_PERMISSION_DELETED:
    'Subscription permission deleted successfully',
};

const GameMessages = {
  GAME_CREATED: 'Game created successfully',
  GAMES_FETCHED: 'Games fetched successfully',
  GAME_FETCHED: 'Game fetched successfully',
  GAME_UPDATED: 'Game updated successfully',
  GAME_DELETED: 'Game deleted successfully',
  GAME_ACTIVATED: 'Game activated successfully',
  GAME_ALREADY_ACTIVATED: 'Game already activated',
  GAME_ALREADY_DEACTIVATED: 'Game already deactivated',
  GAME_DEACTIVATED: 'Game deactivated successfully',
  GAME_NOT_FOUND: (id) => `Game with ID ${id} not found`,
  GAME_ALREADY_EXISTS: (field) => `Game with this ${field} already exists`,
  ACTIVE_GAME_NOT_FOUND: (id) => `Active game with ID ${id} not found`,
  NO_ACTIVE_GAME_FOR_SHOP: (id) =>
    `No active game found for shop with ID ${id}`,
  ACTIVE_GAME_ASSIGNED: 'Active game assigned to shop successfully',
  ACTIVE_GAME_FETCHED: 'Active game fetched successfully',
  ACTIVE_GAME_UPDATED: 'Active game activated successfully ',
};

const ChosenGameMessages = {
  CHOSEN_GAME_CREATED: 'Chosen game created successfully',
  CHOSEN_GAMES_FETCHED: 'Chosen games fetched successfully',
  CHOSEN_GAME_FETCHED: 'Chosen game fetched successfully',
  CHOSEN_GAME_UPDATED: 'Chosen game updated successfully',
  CHOSEN_GAME_DELETED: 'Chosen game deleted successfully',
  CHOSEN_GAME_NOT_FOUND: (id) => `Chosen game with ID ${id} not found`,
  CHOSEN_GAME_ALREADY_EXISTS: (field) =>
    `Chosen game with this ${field} already exists for this admin`,
};

const UserGameMessages = {
  USER_GAME_CREATED: 'User game relationship created successfully',
  USER_GAMES_FETCHED: 'User games fetched successfully',
  USER_GAME_FETCHED: 'User game fetched successfully',
  USER_GAME_UPDATED: 'User game updated successfully',
  USER_GAME_DELETED: 'User game deleted successfully',
  PLAY_COUNT_INCREMENTED: 'Play count incremented successfully',
  USER_GAME_NOT_FOUND: (id) => `User game with ID ${id} not found`,
  USER_GAME_ALREADY_EXISTS: 'User already has this game assigned',
};

const ShopMessages = {
  SHOP_NOT_FOUND: (id) => `Shop with ID ${id} not found`,
  SHOP_NOT_FOUND_FOR_ADMIN: (id, adminId) =>
    `Shop with ID ${id} not found for admin with ID ${adminId}`,
  SHOP_ALREADY_EXISTS: (field) => `Shop with this ${field} already exists`,
  SHOP_CREATION_SUCCESS: (name) => `Shop '${name}' created successfully`,
  SHOP_UPDATE_SUCCESS: (id) => `Shop with ID ${id} updated successfully`,
  SHOP_DELETE_SUCCESS: (id) => `Shop with ID ${id} deleted successfully`,
  QR_CODE_GENERATED: 'QR code identifier generated successfully',
  SHOP_QR_NOT_FOUND: 'Shop with this QR code not found',
  SHOP_FETCHED_BY_QR: 'Shop and active game fetched by QR code successfully',
  GAME_CODE_MATCHED: 'Game code pin is correct.',
  GAME_CODE_MISMATCH: 'Game code pin does not match.',
};

const RewardMessages = {
  CATEGORY_CREATED: 'Reward category created successfully',
  CATEGORY_UPDATED: 'Reward category updated successfully',
  CATEGORY_DELETED: 'Reward category deleted successfully',
  CATEGORY_RETRIEVED: 'Reward category retrieved successfully',
  CATEGORIES_RETRIEVED: 'Reward categories retrieved successfully',
  CATEGORY_NOT_FOUND: (id) => `Reward category with ID '${id}' not found`,
  CATEGORY_NAME_EXISTS: (name) =>
    `Reward category with name '${name}' already exists`,
  CATEGORY_HAS_REWARDS:
    'Cannot delete reward category that has associated rewards. Please reassign or delete rewards first.',

  REWARD_CREATED: 'Reward created successfully',
  REWARD_UPDATED: 'Reward updated successfully',
  REWARD_DELETED: 'Reward deleted successfully',
  REWARD_RETRIEVED: 'Reward retrieved successfully',
  REWARDS_RETRIEVED: 'Rewards retrieved successfully',
  REWARD_NOT_FOUND: (id) => `Reward with ID '${id}' not found`,
  REWARD_NAME_EXISTS: (name) =>
    `Reward with name '${name}' already exists for this shop`,
  SHOP_NOT_FOUND: (id) => `Shop with ID '${id}' not found`,
  GUARANTEED_WIN_REQUIRES_UNLIMITED:
    "Pour un jeu 100% gagnant, vous devez définir un gain illimité. Sinon, décochez l'option 100% gagnant pour inclure une case 'Perdu' dans le jeu.",
  CANNOT_REMOVE_LAST_UNLIMITED:
    "Vous ne pouvez pas modifier ce gain en limité car c'est le seul gain illimité. Soit ajoutez un autre gain illimité, soit désactivez le mode 100% gagnant.",
  SHOP_NEEDS_UNLIMITED_FOR_GUARANTED:
    "Pour activer le mode 100% gagnant, vous devez d'abord créer au moins un gain illimité.",
  REWARDS_UPSERT_DONE: 'Rewards successfully processed.',
  NOT_SELECTED: 'No reward was selected.',
};

const ActionMessages = {
  ACTION_CREATED: 'Action created successfully',
  ACTION_UPDATED: 'Action updated successfully',
  ACTION_DELETED: 'Action deleted successfully',
  ACTION_RETRIEVED: 'Action retrieved successfully',
  ACTIONS_RETRIEVED: 'Actions retrieved successfully',
  ACTION_NOT_FOUND: (id) => `Action with ID '${id}' not found`,
  ACTION_NAME_EXISTS: (name) => `Action with name '${name}' already exists`,
  ACTION_SOFT_DELETED: 'Action soft deleted successfully.',
};

const ChosenActionMessages = {
  CREATED: 'Chosen action created successfully',
  UPDATED: 'Chosen action updated successfully',
  DELETED: 'Chosen action deleted successfully',
  RETRIEVED: 'Chosen action retrieved successfully',
  ALL_RETRIEVED: 'All chosen actions retrieved successfully',
  BY_SHOP_RETRIEVED: (shopId) =>
    `Chosen actions retrieved for shop ID '${shopId}'`,
  NOT_FOUND: (id) => `Chosen action with ID '${id}' not found`,
  INCREMENTED: 'Chosen action CLICKED ++',
};

const RewardRedemptionMessages = {
  FOUND_BY_SHOP: (shopId) =>
    `Reward redemptions found for shop with ID ${shopId}`,
  FOUND_BY_CHOSEN_ACTION: (actionId) =>
    `Reward redemptions found for chosen action with ID ${actionId}`,
  NO_REDEMPTIONS_FOR_SHOP: (shopId) =>
    `No reward redemptions found for shop with ID ${shopId}`,
  NO_REDEMPTIONS_FOR_ACTION: (actionId) =>
    `No reward redemptions found for chosen action with ID ${actionId}`,
};

const ActionClickMessages = {
  FOUND_BY_SHOP: (shopId) => `Action clicks found for shop with ID ${shopId}`,
  FOUND_BY_ACTION: (actionId) =>
    `Action clicks found for chosen action with ID ${actionId}`,
  NO_CLICKS_FOR_SHOP: (shopId) =>
    `No action clicks found for shop with ID ${shopId}`,
  NO_CLICKS_FOR_ACTION: (actionId) =>
    `No action clicks found for chosen action with ID ${actionId}`,
};

module.exports = {
  UserMessages,
  CategoryMessages,
  AuthMessages,
  SubscriptionPlanMessages,
  PermissionMessages,
  SubscriptionPermissionMessages,
  GameMessages,
  ChosenGameMessages,
  UserGameMessages,
  ShopMessages,
  RewardMessages,
  ActionMessages,
  ChosenActionMessages,
  RewardRedemptionMessages,
  ActionClickMessages,
};
