import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RoleModule } from './role/role.module';
import { ExerciseModule } from './exercise/exercise.module';
import { ArticleImageModule } from './article-image/article-image.module';
import { ExerciseUserModule } from './exercise-user/exercise-user.module';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ArticleModule,
    RoleModule,
    ScheduleModule.forRoot(),
    CategoryModule,
    ExerciseModule,
    ArticleImageModule,
    ExerciseUserModule,
    UserModule,
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',      
      rootPath: join(process.cwd(), 'uploads'),
    }),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
