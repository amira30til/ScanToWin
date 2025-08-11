import dataSource from '../../db/typeorm.config';
import { RewardRedemption } from '../modules/reward-redemption/entities/reward-redemption.entity';
import { faker } from '@faker-js/faker';

const chosenActionIds = [
  'd3a658f3-cb4d-4011-9572-021f7f02726e',
  '13d1153c-b860-43ed-a06d-4db439f21c74',
  'dc6317de-d821-4cd4-9db6-11fa0a099f1e',
  '36c4e941-76f5-4a85-91a3-87f3f750ded9',
];
const shopId = '5a59c4ca-d37f-4387-9b23-42d204994490';

async function createRewardRedemptionSeed() {
  console.log('🚀 Seeding reward redemption...');

  await dataSource.initialize();

  const rewardRedemption = dataSource.getRepository(RewardRedemption);

  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  for (let i = 0; i < 10000; i++) {
    const redeemedAt = faker.date.between({
      from: twoYearsAgo,
      to: new Date(),
    });
    const chosenActionId = faker.helpers.arrayElement(chosenActionIds);

    const newActionClick = rewardRedemption.create({
      redeemedAt,
      chosenAction: { id: chosenActionId },
      shop: { id: shopId },
    });
    await rewardRedemption.save(newActionClick);
  }

  await dataSource.destroy();
}

createRewardRedemptionSeed().catch((err) => {
  console.error('❌ Error creating reward redemption:', err);
});
