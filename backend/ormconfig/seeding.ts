import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { typeormOptions } from './typeorm.data_source';

const dataSource = new DataSource(typeormOptions);

dataSource
  .initialize()
  .then(async () => {
    await runSeeders(dataSource);
    process.exit();
  })
  .catch((error) => {
    process.exit(1);
  });
