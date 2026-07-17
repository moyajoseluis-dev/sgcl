import * as Joi from 'joi';

export function validate(config: Record<string, unknown>) {
  const schema = Joi.object({
    APP_NAME: Joi.string().required(),
    PORT: Joi.number().default(3001),
    NODE_ENV: Joi.string()
      .valid('development', 'test', 'production')
      .default('development'),
    
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('8h'),
    
    LAUDUS_BASE_URL: Joi.string().uri().required(),
    LAUDUS_USERNAME: Joi.string().required(),
    LAUDUS_PASSWORD: Joi.string().required(),
    LAUDUS_COMPANY_VAT_ID: Joi.string().required(),
  });

  const { error, value } = schema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    throw new Error(`Error de configuración de entorno: ${error.message}`);
  }

  return value;
}