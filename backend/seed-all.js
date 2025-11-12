require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import all models
const Admin = require('./models/Admin');
const Permission = require('./models/Permission');
const SubscriptionPlan = require('./models/SubscriptionPlan');
const SubscriptionPermission = require('./models/SubscriptionPermission');
const AdminSubscription = require('./models/AdminSubscription');
const Game = require('./models/Game');
const Action = require('./models/Action');
const RewardCategory = require('./models/RewardCategory');
const Shop = require('./models/Shop');
const Reward = require('./models/Reward');
const ActiveGameAssignment = require('./models/ActiveGameAssignment');
const ChosenAction = require('./models/ChosenAction');
const User = require('./models/User');
const UserGame = require('./models/UserGame');
const ActionClick = require('./models/ActionClick');
const RewardRedemption = require('./models/RewardRedemption');
const GamePlayTracking = require('./models/GamePlayTracking');

const seedAll = async () => {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      console.error('? MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('? Connected to MongoDB');
    console.log('');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('???  Clearing existing data...');
    await Promise.all([
      Admin.deleteMany({}),
      Permission.deleteMany({}),
      SubscriptionPlan.deleteMany({}),
      SubscriptionPermission.deleteMany({}),
      AdminSubscription.deleteMany({}),
      Game.deleteMany({}),
      Action.deleteMany({}),
      RewardCategory.deleteMany({}),
      Shop.deleteMany({}),
      Reward.deleteMany({}),
      ActiveGameAssignment.deleteMany({}),
      ChosenAction.deleteMany({}),
      User.deleteMany({}),
      UserGame.deleteMany({}),
      ActionClick.deleteMany({}),
      RewardRedemption.deleteMany({}),
      GamePlayTracking.deleteMany({}),
    ]);
    console.log('? Existing data cleared');
    console.log('');

    // 1. Seed Admins
    console.log('?? Seeding Admins...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const superAdmin = await Admin.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      adminStatus: 'ACTIVE',
      mailStatus: true,
    });

    const regularAdmin = await Admin.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      adminStatus: 'ACTIVE',
      tel: 1234567890,
      mailStatus: true,
    });

    console.log(`? Created ${await Admin.countDocuments()} admins`);
    console.log('');

    // 2. Seed Permissions
    console.log('?? Seeding Permissions...');
    const permissions = await Permission.insertMany([
      { key: 'MANAGE_USERS', description: 'Manage users' },
      { key: 'MANAGE_GAMES', description: 'Manage games' },
      { key: 'MANAGE_REWARDS', description: 'Manage rewards' },
      { key: 'MANAGE_SHOPS', description: 'Manage shops' },
      { key: 'VIEW_ANALYTICS', description: 'View analytics' },
      { key: 'MANAGE_SUBSCRIPTIONS', description: 'Manage subscriptions' },
      { key: 'MANAGE_ADMINS', description: 'Manage admins' },
      { key: 'MANAGE_ACTIONS', description: 'Manage actions' },
    ]);
    console.log(`? Created ${permissions.length} permissions`);
    console.log('');

    // 3. Seed Subscription Plans
    console.log('?? Seeding Subscription Plans...');
    const subscriptionPlans = await SubscriptionPlan.insertMany([
      {
        name: 'Basic Plan',
        subscriptionStatus: 'ACTIVE',
        monthlyPrice: 29.99,
        annualPrice: 299.99,
        isCustom: false,
        freeTrialDays: 7,
        discount: 0,
        averageReviews: 4.5,
        type: 'MONTHLY',
        tag: 'Basic',
      },
      {
        name: 'Pro Plan',
        subscriptionStatus: 'ACTIVE',
        monthlyPrice: 59.99,
        annualPrice: 599.99,
        isCustom: false,
        freeTrialDays: 14,
        discount: 10,
        averageReviews: 4.8,
        type: 'MONTHLY',
        tag: 'Pro',
      },
      {
        name: 'Enterprise Plan',
        subscriptionStatus: 'ACTIVE',
        monthlyPrice: 99.99,
        annualPrice: 999.99,
        isCustom: false,
        freeTrialDays: 30,
        discount: 15,
        averageReviews: 5.0,
        type: 'ANNUAL',
        tag: 'Enterprise',
      },
    ]);
    console.log(`? Created ${subscriptionPlans.length} subscription plans`);
    console.log('');

    // 4. Seed Subscription Permissions
    console.log('?? Seeding Subscription Permissions...');
    const subscriptionPermissions = [];
    subscriptionPlans.forEach((plan, planIndex) => {
      permissions.forEach((permission, permIndex) => {
        subscriptionPermissions.push({
          displayOrder: permIndex + 1,
          enabled: planIndex === 0 ? permIndex < 4 : planIndex === 1 ? permIndex < 6 : true, // Basic gets 4, Pro gets 6, Enterprise gets all
          subscriptionPlanId: plan._id,
          permissionId: permission._id,
        });
      });
    });
    await SubscriptionPermission.insertMany(subscriptionPermissions);
    console.log(`? Created ${subscriptionPermissions.length} subscription permissions`);
    console.log('');

    // 5. Seed Admin Subscriptions
    console.log('?? Seeding Admin Subscriptions...');
    const adminSubscriptions = await AdminSubscription.insertMany([
      {
        BillingPeriode: 'ACTIVE',
        price: subscriptionPlans[1].monthlyPrice,
        isActive: true,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    ]);
    console.log(`? Created ${adminSubscriptions.length} admin subscriptions`);
    console.log('');

    // 6. Seed Games
    console.log('?? Seeding Games...');
    const games = await Game.insertMany([
      {
        name: 'Spin the Wheel',
        status: 'ACTIVE',
        pictureUrl: 'https://example.com/spin-wheel.jpg',
        description: 'Spin the wheel and win amazing prizes!',
      },
      {
        name: 'Scratch Card',
        status: 'ACTIVE',
        pictureUrl: 'https://example.com/scratch-card.jpg',
        description: 'Scratch and reveal your reward!',
      },
      {
        name: 'Lucky Draw',
        status: 'ACTIVE',
        pictureUrl: 'https://example.com/lucky-draw.jpg',
        description: 'Pick a card and win instantly!',
      },
    ]);
    console.log(`? Created ${games.length} games`);
    console.log('');

    // 7. Seed Actions
    console.log('?? Seeding Actions...');
    const actions = await Action.insertMany([
      { name: 'Follow on Instagram', isActive: true },
      { name: 'Like Facebook Page', isActive: true },
      { name: 'Subscribe to Newsletter', isActive: true },
      { name: 'Share on Social Media', isActive: true },
      { name: 'Visit Website', isActive: true },
      { name: 'Download App', isActive: true },
    ]);
    console.log(`? Created ${actions.length} actions`);
    console.log('');

    // 8. Seed Reward Categories
    console.log('?? Seeding Reward Categories...');
    const rewardCategories = await RewardCategory.insertMany([
      { name: 'Discount Coupons' },
      { name: 'Free Products' },
      { name: 'Gift Cards' },
      { name: 'Cash Prizes' },
      { name: 'Merchandise' },
    ]);
    console.log(`? Created ${rewardCategories.length} reward categories`);
    console.log('');

    // 9. Seed Shops
    console.log('?? Seeding Shops...');
    const shops = await Shop.insertMany([
      {
        name: 'Premium Boutique',
        logo: 'https://example.com/boutique-logo.jpg',
        address: '123 Main Street',
        city: 'New York',
        country: 'USA',
        zipCode: 10001,
        nbSiret: 12345678901234,
        tel: '+1-555-0101',
        status: 'ACTIVE',
        gameColor1: '#FF5733',
        gameColor2: '#33FF57',
        gameCodePin: 1234,
        isGuaranteedWin: true,
        winningPercentage: 75,
        adminId: superAdmin._id,
      },
      {
        name: 'Tech Store',
        logo: 'https://example.com/tech-logo.jpg',
        address: '456 Tech Avenue',
        city: 'San Francisco',
        country: 'USA',
        zipCode: 94102,
        nbSiret: 98765432109876,
        tel: '+1-555-0202',
        status: 'ACTIVE',
        gameColor1: '#3357FF',
        gameColor2: '#FF33F5',
        gameCodePin: 5678,
        isGuaranteedWin: false,
        winningPercentage: 50,
        adminId: regularAdmin._id,
      },
      {
        name: 'Fashion Hub',
        logo: 'https://example.com/fashion-logo.jpg',
        address: '789 Fashion Boulevard',
        city: 'Los Angeles',
        country: 'USA',
        zipCode: 90001,
        nbSiret: 11223344556677,
        tel: '+1-555-0303',
        status: 'ACTIVE',
        gameColor1: '#F5FF33',
        gameColor2: '#33FFF5',
        gameCodePin: 9012,
        isGuaranteedWin: true,
        winningPercentage: 60,
        adminId: superAdmin._id,
      },
    ]);
    console.log(`? Created ${shops.length} shops`);
    console.log('');

    // 10. Seed Rewards
    console.log('?? Seeding Rewards...');
    const rewards = [];
    shops.forEach((shop, shopIndex) => {
      rewards.push(
        {
          name: `${shop.name} - 10% Discount`,
          icon: '??',
          winnerCount: 0,
          isUnlimited: true,
          status: 'ACTIVE',
          shopId: shop._id,
          nbRewardTowin: null,
          percentage: 10,
        },
        {
          name: `${shop.name} - Free Product`,
          icon: '??',
          winnerCount: shopIndex === 0 ? 5 : 10,
          isUnlimited: false,
          status: 'ACTIVE',
          shopId: shop._id,
          nbRewardTowin: shopIndex === 0 ? 1 : 2,
          percentage: 15,
        },
        {
          name: `${shop.name} - $50 Gift Card`,
          icon: '??',
          winnerCount: shopIndex === 0 ? 2 : 3,
          isUnlimited: false,
          status: 'ACTIVE',
          shopId: shop._id,
          nbRewardTowin: shopIndex === 0 ? 1 : 1,
          percentage: 5,
        }
      );
    });
    const createdRewards = await Reward.insertMany(rewards);
    console.log(`? Created ${createdRewards.length} rewards`);
    console.log('');

    // 11. Seed Active Game Assignments
    console.log('?? Seeding Active Game Assignments...');
    const activeGameAssignments = [];
    shops.forEach((shop, shopIndex) => {
      games.forEach((game, gameIndex) => {
        // Assign different rewards to different game-shop combinations
        const shopRewards = createdRewards.filter(r => r.shopId.toString() === shop._id.toString());
        const assignedRewards = shopRewards.slice(0, Math.min(2, shopRewards.length));
        
        activeGameAssignments.push({
          adminId: shop.adminId,
          gameId: game._id,
          shopId: shop._id,
          isActive: true,
          rewardIds: assignedRewards.map(r => r._id),
        });
      });
    });
    const createdActiveGameAssignments = await ActiveGameAssignment.insertMany(activeGameAssignments);
    console.log(`? Created ${createdActiveGameAssignments.length} active game assignments`);
    console.log('');

    // 12. Seed Chosen Actions
    console.log('?? Seeding Chosen Actions...');
    const chosenActions = [];
    shops.forEach((shop, shopIndex) => {
      actions.slice(0, 3).forEach((action, actionIndex) => {
        chosenActions.push({
          name: action.name,
          position: actionIndex + 1,
          targetLink: `https://example.com/${shop.name.toLowerCase().replace(/\s+/g, '-')}/${action.name.toLowerCase().replace(/\s+/g, '-')}`,
          shopId: shop._id,
          actionId: action._id,
          redeemedReward: 0,
        });
      });
    });
    const createdChosenActions = await ChosenAction.insertMany(chosenActions);
    console.log(`? Created ${createdChosenActions.length} chosen actions`);
    console.log('');

    // 13. Seed Users
    console.log('?? Seeding Users...');
    const users = await User.insertMany([
      {
        email: 'user1@example.com',
        firstName: 'Alice',
        lastName: 'Smith',
        tel: '+1-555-1001',
        totalPlayedGames: 5,
        agreeToPromotions: true,
      },
      {
        email: 'user2@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        tel: '+1-555-1002',
        totalPlayedGames: 3,
        agreeToPromotions: false,
      },
      {
        email: 'user3@example.com',
        firstName: 'Charlie',
        lastName: 'Brown',
        tel: '+1-555-1003',
        totalPlayedGames: 8,
        agreeToPromotions: true,
      },
      {
        email: 'user4@example.com',
        firstName: 'Diana',
        lastName: 'Wilson',
        tel: '+1-555-1004',
        totalPlayedGames: 2,
        agreeToPromotions: true,
      },
      {
        email: 'user5@example.com',
        firstName: 'Eve',
        lastName: 'Davis',
        tel: '+1-555-1005',
        totalPlayedGames: 12,
        agreeToPromotions: false,
      },
    ]);
    console.log(`? Created ${users.length} users`);
    console.log('');

    // 14. Seed User Games
    console.log('?? Seeding User Games...');
    const userGames = [];
    users.forEach((user, userIndex) => {
      shops.slice(0, 2).forEach((shop) => {
        const gameAssignment = createdActiveGameAssignments.find(
          aga => aga.shopId.toString() === shop._id.toString()
        );
        if (gameAssignment) {
          const shopRewards = createdRewards.filter(r => r.shopId.toString() === shop._id.toString());
          const reward = shopRewards[userIndex % shopRewards.length] || shopRewards[0];
          
          userGames.push({
            userId: user._id,
            activeGameAssignmentId: gameAssignment._id,
            gameId: gameAssignment.gameId,
            playCount: userIndex + 1,
            lastPlayedAt: new Date(Date.now() - (userIndex * 24 * 60 * 60 * 1000)),
            rewardId: reward._id,
            shopId: shop._id,
            nbPlayedTimes: userIndex + 1,
          });
        }
      });
    });
    const createdUserGames = await UserGame.insertMany(userGames);
    console.log(`? Created ${createdUserGames.length} user games`);
    console.log('');

    // 15. Seed Action Clicks
    console.log('?? Seeding Action Clicks...');
    const actionClicks = [];
    createdChosenActions.forEach((chosenAction, index) => {
      // Create 2-5 clicks per chosen action
      const clickCount = 2 + (index % 4);
      for (let i = 0; i < clickCount; i++) {
        actionClicks.push({
          chosenActionId: chosenAction._id,
          shopId: chosenAction.shopId,
          clickedAt: new Date(Date.now() - (i * 60 * 60 * 1000)), // Spread over hours
        });
      }
    });
    await ActionClick.insertMany(actionClicks);
    console.log(`? Created ${actionClicks.length} action clicks`);
    console.log('');

    // 16. Seed Reward Redemptions
    console.log('?? Seeding Reward Redemptions...');
    const rewardRedemptions = [];
    createdChosenActions.slice(0, 5).forEach((chosenAction) => {
      rewardRedemptions.push({
        chosenActionId: chosenAction._id,
        shopId: chosenAction.shopId,
        redeemedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
      });
    });
    await RewardRedemption.insertMany(rewardRedemptions);
    console.log(`? Created ${rewardRedemptions.length} reward redemptions`);
    console.log('');

    // 17. Seed Game Play Tracking
    console.log('?? Seeding Game Play Tracking...');
    const gamePlayTracking = [];
    createdUserGames.forEach((userGame) => {
      const chosenAction = createdChosenActions.find(
        ca => ca.shopId.toString() === userGame.shopId.toString()
      );
      
      gamePlayTracking.push({
        userId: userGame.userId,
        shopId: userGame.shopId,
        gameId: userGame.gameId,
        activeGameAssignmentId: userGame.activeGameAssignmentId,
        rewardId: userGame.rewardId,
        chosenActionId: chosenAction?._id,
        playedAt: userGame.lastPlayedAt,
      });
    });
    await GamePlayTracking.insertMany(gamePlayTracking);
    console.log(`? Created ${gamePlayTracking.length} game play tracking records`);
    console.log('');

    // Summary
    console.log('???????????????????????????????????????????????????????????');
    console.log('?? SEEDING COMPLETE!');
    console.log('???????????????????????????????????????????????????????????');
    console.log('');
    console.log('?? Summary:');
    console.log(`   Admins: ${await Admin.countDocuments()}`);
    console.log(`   Permissions: ${await Permission.countDocuments()}`);
    console.log(`   Subscription Plans: ${await SubscriptionPlan.countDocuments()}`);
    console.log(`   Subscription Permissions: ${await SubscriptionPermission.countDocuments()}`);
    console.log(`   Admin Subscriptions: ${await AdminSubscription.countDocuments()}`);
    console.log(`   Games: ${await Game.countDocuments()}`);
    console.log(`   Actions: ${await Action.countDocuments()}`);
    console.log(`   Reward Categories: ${await RewardCategory.countDocuments()}`);
    console.log(`   Shops: ${await Shop.countDocuments()}`);
    console.log(`   Rewards: ${await Reward.countDocuments()}`);
    console.log(`   Active Game Assignments: ${await ActiveGameAssignment.countDocuments()}`);
    console.log(`   Chosen Actions: ${await ChosenAction.countDocuments()}`);
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   User Games: ${await UserGame.countDocuments()}`);
    console.log(`   Action Clicks: ${await ActionClick.countDocuments()}`);
    console.log(`   Reward Redemptions: ${await RewardRedemption.countDocuments()}`);
    console.log(`   Game Play Tracking: ${await GamePlayTracking.countDocuments()}`);
    console.log('');
    console.log('?? Super Admin Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('?? Regular Admin Credentials:');
    console.log('   Email: john.doe@example.com');
    console.log('   Password: admin123');
    console.log('');

    await mongoose.disconnect();
    console.log('? Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('? Error seeding database:', error.message);
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAll();
