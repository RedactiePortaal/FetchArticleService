import { HttpModule } from '@nestjs/axios';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Module } from '@nestjs/common/decorators';

@Module({
  imports: [HttpModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
