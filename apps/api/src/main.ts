import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DataSource } from 'typeorm';
import { seedDatabase } from './app/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();

  // Get DataSource correctly
  const dataSource = app.get(DataSource);
  await seedDatabase(dataSource);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 API running on http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
