import { Client } from 'pg';
import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';

const chosenActionIds = [
  '40df85e9-77fd-4c13-aaf5-79b713a3914d',
  '9f89c907-3044-4a09-9803-50a7ec7b98e4',
  'b7ceb45f-4f82-41a6-9588-3671c13a82b5',
  'e8cb7287-fbd1-4ece-ac06-b17887b39510',
];
const shopId = '352a9ccb-32ba-4bb8-bd89-25d52484cc2e';

async function seed() {
  const client = new Client({
    host: '127.0.0.1',
    port: '5432',
    password: '0000',
    database: 'scan2win',
    user: 'postgres',
  });

  await client.connect();

  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  for (let i = 0; i < 10000; i++) {
    const id = uuid();
    const clickedAt = faker.date.between({
      from: twoYearsAgo,
      to: new Date(),
    });
    const chosenActionId = faker.helpers.arrayElement(chosenActionIds);

    await client.query(
      `INSERT INTO action_click (id, "clickedAt", "chosenActionId", "shopId")
       VALUES ($1, $2, $3, $4)`,
      [id, clickedAt.toISOString(), chosenActionId, shopId],
    );
  }

  console.log('✅ Seeded 10000 records with raw SQL');
  await client.end();
}

seed().catch(console.error);
