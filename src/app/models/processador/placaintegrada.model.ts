export interface IPlacaIntegrada {
  id?: number;
  nome: string;
  directX: number;
  openGl: number;
  vulkan: number;
}

export class PlacaIntegrada {
  id?: number;
  nome!: string;
  directX!: number;
  openGl!: number;
  vulkan!: number;

  constructor(data: IPlacaIntegrada) {
    this.id = data.id;
    this.nome = data.nome;
    this.directX = data.directX;
    this.openGl = data.openGl;
    this.vulkan = data.vulkan;
  }
}
