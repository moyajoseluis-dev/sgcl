export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'SGCL',
    port: Number(process.env.PORT ?? 3001),
    environment: process.env.NODE_ENV ?? 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'default_secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  },
  laudus: {
    baseUrl: process.env.LAUDUS_BASE_URL ?? '',
    username: process.env.LAUDUS_USERNAME ?? '',
    password: process.env.LAUDUS_PASSWORD ?? '',
    companyVatId: process.env.LAUDUS_COMPANY_VAT_ID ?? '',
  },
});