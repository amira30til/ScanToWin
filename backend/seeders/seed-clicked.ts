import { Client } from 'pg';
import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';

const chosenActionIds = [
  '6f12dc99-c986-4fa2-a25a-5f52e41eed73',
  'de0707cf-dd09-4061-8e04-4f1600a842b1',
  'a17332be-73a2-4cc3-8725-ee9fa21514f1',
  '15a076ae-9d27-4e26-85bc-063e064ca55f',
];
const shopId = '2f4cdba4-2f63-48c9-ac06-49e59eaa1e90';

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
