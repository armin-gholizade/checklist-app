import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
const db=new PrismaClient();
async function main(){const [username,password]=process.argv.slice(2);if(!username || !/^[a-zA-Z0-9_.-]{3,40}$/.test(username) || !password || password.length<8 || password.length>128) throw new Error('Usage: npm run user:create -- username "password-at-least-8-characters"');await db.user.create({data:{username,passwordHash:await hash(password,12)}});console.log('User created:',username);}
main().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(()=>db.$disconnect());
