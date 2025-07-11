import { Fabricante } from "../fabricante.model";
import { ImagemProcessador } from "../imagem-processador.model";
import { Conectividade } from "./conectividade.model";
import { ConsumoEnergetico } from "./consumoenergetico.model";
import { Frequencia } from "./frequencia.model";
import { MemoriaCache } from "./memoriacache.model";
import { PlacaIntegrada } from "./placaintegrada.model";

export class Processador {
    id!: number;
    nome!: string;
    socket!: string;
    threads!: number;
    nucleos!: number;
    desbloqueado!: boolean;
    preco!: number;
    quantidade?: number;
    placaIntegrada?: PlacaIntegrada;
    memoriaCache!: MemoriaCache;
    frequencia!: Frequencia;
    consumoEnergetico!: ConsumoEnergetico;
    conectividade!: Conectividade;
    fabricante!: Fabricante;
    imagens!: ImagemProcessador[];
    isFavorite?: boolean = false;
}
