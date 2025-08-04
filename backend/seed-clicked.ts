import { Client } from 'pg';
import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';

async function seed() {
  const client = new Client({
    host: '127.0.0.1',
    port: '5432',
    password: '0000',
    database: 'scan2win',
    user: 'postgres',
  });

  await client.connect();

  const chosenActionIds = [
    'b43197a8-fdd0-4592-a9f4-a5759c9e8765',
    'fdbbf843-2083-4785-8dda-64a222504a6d',
    '14ecefc4-81f2-48e4-8423-219ce7ba423f',
    'e365770b-638d-46bc-bdb0-a3dac82d3bec',
  ];
  const shopId = 'a1c7dda1-b779-47b8-8441-51d354bd8567';

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
