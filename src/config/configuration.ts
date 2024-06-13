export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  god_password: process.env.GOD_PASSWORD,
  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
});
