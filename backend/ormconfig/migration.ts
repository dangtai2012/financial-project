import { DataSource } from 'typeorm';
import { typeormOptions } from './typeorm.data_source';

const dataSource = new DataSource(typeormOptions);
export default dataSource;
