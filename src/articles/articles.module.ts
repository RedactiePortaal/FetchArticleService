import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { HttpModule } from '@nestjs/axios';
import { FlevolandAdaptee } from './dataproviders/flevolandAdaptee';
import { NOSAdaptee } from './dataproviders/nosAdaptee';

@Module({
  imports: [HttpModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, FlevolandAdaptee, NOSAdaptee],
})
export class ArticlesModule {}
