import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Produto } from "../entities/produto.entity";
import { Between, DeleteResult, ILike, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoriaService } from "../../Categorias/service/categoria.service";

@Injectable()
export class ProdutoService {

    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        private readonly categoriaService: CategoriaService
    ) { }

    async findAll(): Promise<Produto[]> {
        return this.produtoRepository.find();
    }

    async findById(id: number): Promise<Produto> {
        const produto = await this.produtoRepository.findOne({
            where: { id },
            relations: { categoria: true }
        })

        if (!produto)
            throw new HttpException("Produto não encontrado", HttpStatus.NOT_FOUND);

        return produto;
    }

    async findAllByNome(nome: string): Promise<Produto[]> {
        return this.produtoRepository.find({
            where: { nome: ILike(`%${nome}%`) },
            relations: { categoria: true },
            order: { nome: "ASC", id: "DESC" }
        });
    }

    async findAllByPreco(): Promise<Produto[]> {
        return this.produtoRepository.find({
            relations: { categoria: true },
            order: { preco: "DESC" }
        });
    }

    async findByPreco(min?: number, max?: number, ordem: "ASC" | "DESC" = "ASC"): Promise<Produto[]> {

        let where = {};
        let order = {};

        if (min && max) {
            where = { preco: Between(min, max) };
            order = { preco: "ASC" }
        } else if (min) {
            where = { preco: MoreThanOrEqual(min) };
            order = { preco: "DESC" }
        } else if (max) {
            where = { preco: LessThanOrEqual(max) };
            order = { preco: "ASC" }
        }

        return this.produtoRepository.find({
            where,
            relations: { categoria: true },
            order: { preco: ordem }
        });
    }

    async create(produto: Produto): Promise<Produto> {
        return await this.produtoRepository.save(produto);
    }

    async update(produto: Produto): Promise<Produto> {

        if (!produto.id || produto.id <= 0)
            throw new HttpException("Produto inválido", HttpStatus.BAD_REQUEST);

        await this.findById(produto.id);

        return await this.produtoRepository.save(produto);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findById(id);

        return await this.produtoRepository.delete(id);
    }
}
