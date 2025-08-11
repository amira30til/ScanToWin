import dataSource from '../../db/typeorm.config';
import { ActionClick } from '../modules/action-click/entities/action-click.entity';
import { faker } from '@faker-js/faker';

const chosenActionIds = [
  'd3a658f3-cb4d-4011-9572-021f7f02726e',
  '13d1153c-b860-43ed-a06d-4db439f21c74',
  'dc6317de-d821-4cd4-9db6-11fa0a099f1e',
  '36c4e941-76f5-4a85-91a3-87f3f750ded9',
];
const shopId = '5a59c4ca-d37f-4387-9b23-42d204994490';

async function createActionClickSeed() {
  console.log('🚀 Seeding action click...');

  await dataSource.initialize();

  const actionClickRepo = dataSource.getRepository(ActionClick);

  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  for (let i = 0; i < 10000; i++) {
    const clickedAt = faker.date.between({
      from: twoYearsAgo,
      to: new Date(),
    });
    const chosenActionId = faker.helpers.arrayElement(chosenActionIds);

    const newActionClick = actionClickRepo.create({
      clickedAt,
      chosenAction: { id: chosenActionId },
      shop: { id: shopId },
    });
    await actionClickRepo.save(newActionClick);
  }

  await dataSource.destroy();
}

createActionClickSeed().catch((err) => {
  console.error('❌ Error creating action click:', err);
});
