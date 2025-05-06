import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RoleModule } from './role/role.module';
import { ExerciseModule } from './exercise/exercise.module';

@Module({
  imports: [
    // ArticleModule,
    RoleModule,
    ScheduleModule.forRoot(),
    CategoryModule,
    ExerciseModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
