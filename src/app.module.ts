import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './Produtos/entities/produto.entity';
import { ProdutoModule } from './Produtos/ProdutoModule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriaModule } from './Categorias/CategoriaModule';

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get("DB_HOST"),
        port: configService.get('DB_PORT'),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        entities: [Produto],
        synchronize: false,
        logging: true,
      }),
    }),
    ProdutoModule,
    CategoriaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
