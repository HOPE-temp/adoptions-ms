import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mysql: {
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '3000', 10),
      root_password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    },
    jwtSecret: process.env.JWT_SECRET || '',
  };
});
