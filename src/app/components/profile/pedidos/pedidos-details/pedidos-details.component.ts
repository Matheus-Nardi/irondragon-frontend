import { Component,  OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import { CommonModule, CurrencyPipe, DatePipe, Location } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import { MatDividerModule } from "@angular/material/divider"
import { MatListModule } from "@angular/material/list"
import { MatToolbarModule } from "@angular/material/toolbar"
import  { PedidoService } from "../../../../services/pedido.service"
import  { Pedido } from "../../../../models/pedido.model"
import { HeaderComponent } from "../../../template/header/header.component";
import { FooterComponent } from "../../../template/footer/footer.component"
import { ProcessadorService } from "../../../../services/processador.service"
import { Endereco } from "../../../../models/endereco/endereco.model"

@Component({
  selector: "app-pedidos-details",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    CurrencyPipe,
    DatePipe,
    HeaderComponent,
    FooterComponent
],
  templateUrl: "./pedidos-details.component.html",
  styleUrl: "./pedidos-details.component.css",
})
export class PedidosDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private router: Router,
    private location: Location,
    private processadorService: ProcessadorService
  ) {}

  pedido!: Pedido;
  endereco!: Endereco;
  processadorImagens: { [id: number]: string } = {};

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.carregarPedido(+id)
    } else {
      this.router.navigate(["/perfil/pedidos"])
    }
  }

  carregarPedido(id: number): void {
    this.pedidoService.findById(id.toString()).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        console.log(pedido);
        // Para cada item, busque a imagem
        pedido.listaItemPedido.forEach(item => {
          this.processadorService.findById(item.idProcessador.toString()).subscribe({
            next: (processadorData) => {
              this.processadorImagens[item.idProcessador] =
                this.processadorService.getUrlImage(processadorData.id.toString(), processadorData.imagens[0]);
            },
            
            error: (error) => {
              console.error("Erro ao carregar processador:", error);
            }
          });
        });
      },
      error: (error) => {
        console.error("Erro ao carregar pedido:", error);
        this.router.navigate(["/perfil/pedidos"]);
      },
    });
  }

  getImagemProcessador(idProcessador: number): string {
    return this.processadorImagens[idProcessador] || '';
  }

  get enderecosCliente(): any[] {
  return this.pedido?.cliente?.usuario?.enderecos ?? [];
}

  voltarParaPedidos(): void {
   this.location.back();
  }


  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "produto entregue":
        return "primary"
      case "em andamento":
        return "accent"
      case "cancelado":
        return "warn"
      default:
        return ""
    }
  }

  getPagamentoStatus(pago: boolean): string {
    return pago ? "Pago" : "Pendente"
  }

  getPagamentoClass(pago: boolean): string {
    return pago ? "payment-paid" : "payment-pending"
  }
}
