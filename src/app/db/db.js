import postgres from 'postgres';

// export const sql = postgres('postgresql://postgres:admin@localhost/elder-guard', { ssl: 'require' });
export const sql = postgres('postgresql://elder-guard-poc_owner:e8SEujDmiv9p@ep-curly-paper-a5qkxidv.us-east-2.aws.neon.tech/elder-guard-poc?sslmode=require', { ssl: 'require' });
