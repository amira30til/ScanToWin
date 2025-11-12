const fs = require('fs');
const path = require('path');

const createCRUDController = require('./controllers/base-crud.controller');

const controllers = [
  { name: 'reward-category', model: 'RewardCategory', modelPath: '../models/RewardCategory' },
  { name: 'reward-redemption', model: 'RewardRedemption', modelPath: '../models/RewardRedemption' },
  { name: 'action-click', model: 'ActionClick', modelPath: '../models/ActionClick' },
  { name: 'game-play-tracking', model: 'GamePlayTracking', modelPath: '../models/GamePlayTracking' },
  { name: 'subscription-plan', model: 'SubscriptionPlan', modelPath: '../models/SubscriptionPlan' },
  { name: 'permission', model: 'Permission', modelPath: '../models/Permission' },
  { name: 'subscription-permission', model: 'SubscriptionPermission', modelPath: '../models/SubscriptionPermission' },
  { name: 'admin-subscription', model: 'AdminSubscription', modelPath: '../models/AdminSubscription' },
];

controllers.forEach(({ name, model, modelPath }) => {
  const Model = require(modelPath);
  const controller = createCRUDController(Model);
  const content = `const ${model} = require('${modelPath}');
const createCRUDController = require('./base-crud.controller');
module.exports = createCRUDController(${model});
`;
  fs.writeFileSync(`controllers/${name}.controller.js`, content);
  console.log(`Created ${name}.controller.js`);
});

console.log('All remaining controllers created!');
