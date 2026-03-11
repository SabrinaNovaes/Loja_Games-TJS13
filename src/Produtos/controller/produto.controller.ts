import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ProdutoService } from "../service/produto.service";
import { Produto } from "../entities/produto.entity";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("/produtos")
export class ProdutoController {

    constructor(
        private readonly produtoService: ProdutoService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Produto[]> {
        return this.produtoService.findAll();
    }

    @Get("/preco")
    findByPreco(@Query("min") min?: number, @Query("max") max?: number, @Query("ordem") ordem?: "ASC" | "DESC"): Promise<Produto[]> {
        return this.produtoService.findByPreco(min, max, ordem);
    }

    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    findById(@Param("id", ParseIntPipe) id: number): Promise<Produto> {
        return this.produtoService.findById(id);
    }

    @Get("/nome/:nome")
    @HttpCode(HttpStatus.OK)
    findAllByNome(@Param("nome") nome: string): Promise<Produto[]> {
        return this.produtoService.findAllByNome(nome);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    create(@Body() produto: Produto): Promise<Produto> {
        return this.produtoService.create(produto);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() produto: Produto): Promise<Produto> {
        return this.produtoService.update(produto);
    }

    @Delete("/:id")
    @HttpCode(HttpStatus.OK)
    delete(@Param("id", ParseIntPipe) id: number) {
        return this.produtoService.delete(id);
    }
}