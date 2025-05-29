import { CommonModule } from "@angular/common"
import { Component, type OnInit, signal } from "@angular/core"
import { FormBuilder,  FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatChipsModule } from "@angular/material/chips"
import { MatExpansionModule } from "@angular/material/expansion"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatPaginatorModule, type PageEvent } from "@angular/material/paginator"
import { MatRadioModule } from "@angular/material/radio"
import { MatSelectModule } from "@angular/material/select"
import { MatSliderModule } from "@angular/material/slider"
import { RouterModule } from "@angular/router"
import type { Processador } from "../../models/processador/processador.model"
import { ProcessadorService } from "../../services/processador.service"

type Card = {
  id: number
  title: string
  fabricante: string
  preco: number
  imageUrl: string
  specs: {
    nucleos: number
    threads: number
  }
  isFavorite?: boolean
}

type Filtro = {
  fabricante: string
  precoMin: number
  precoMax: number
  sockets: string[]
  graficosIntegrados: string
  sortBy: string
}

@Component({
  selector: "app-processadores-filtros",
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSliderModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./processadores-filtros.component.html",
  styleUrl: "./processadores-filtros.component.css",
})
export class ProcessadoresFiltrosComponent implements OnInit {
  filtroForm!: FormGroup

  constructor(private fb: FormBuilder, private processadorService: ProcessadorService) {}

  // Product data
  processadores: Processador[] = []
  page = 0
  pageSize = 25
  totalRecords = 0
  cards = signal<Card[]>([])
  sortBy = "preco-asc"

  // Filter UI controls (visual only)
  showFilters = false

  availableSockets = [
    { value: "lga1700", label: "LGA 1700" },
    { value: "am4", label: "AM4" },
    { value: "am5", label: "AM5" },
    { value: "lga1200", label: "LGA 1200" },
    { value: "tr4", label: "TR4" },
  ]

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      fabricante: [null], // Changed from separate intel/amd to single radio group
      precoMin: [0],
      precoMax: [5000],
      sockets: this.fb.group({
        lga1700: [false],
        am4: [false],
        am5: [false],
        lga1200: [false],
        tr4: [false],
      }),
      graficosIntegrados: ["todos"],
    })

    this.loadAllProcessadores()
  }

  loadAllProcessadores() {
    const filtro = this.construirFiltro()

    this.processadorService.findByFiltros(this.page, this.pageSize, filtro).subscribe((data) => {
      console.log(data.results)

      this.processadores = data.results
      this.totalRecords = data.count
      this.loadCards()
    })
  }

  private mapToCard(processador: Processador): Card {
    const imageUrl =
      processador.imagens && processador.imagens.length > 0
        ? this.processadorService.getUrlImage(processador.id.toString(), processador.imagens[0])
        : "assets/images/placeholder.png"

    return {
      id: processador.id,
      title: processador.nome,
      fabricante: processador.fabricante.nome,
      preco: processador.preco,
      imageUrl: imageUrl,
      specs: {
        nucleos: processador.nucleos,
        threads: processador.threads,
      },
      isFavorite: false,
    }
  }

  loadCards() {
    if (this.processadores.length > 0) {
      const cards = this.processadores.map((processador) => this.mapToCard(processador))
      this.cards.set(cards)
    } else {
      this.cards.set([])
    }
  }

  // UI control methods
  toggleFilters(): void {
    this.showFilters = !this.showFilters
  }

  clearFilters(): void {
    this.filtroForm.reset({
      fabricante: "todos", // Updated for radio button
      precoMin: 0,
      precoMax: 5000,
      sockets: {
        lga1700: false,
        am4: false,
        am5: false,
        lga1200: false,
        tr4: false,
      },
      graficosIntegrados: "todos",
    })
    this.applyFilters()
  }

  applyFilters(): void {
    this.page = 0
    this.loadAllProcessadores()
    if (window.innerWidth <= 1024) {
      this.showFilters = false
    }
  }

  hasActiveFilters(): boolean {
    const formValue = this.filtroForm.value
    return (
      formValue.fabricante !== "todos" ||
      formValue.precoMin > 0 ||
      formValue.precoMax < 5000 ||
      Object.values(formValue.sockets).some((v) => v) ||
      formValue.graficosIntegrados !== "todos"
    )
  }

  clearPriceFilter() {
    this.filtroForm.patchValue({ precoMin: 0, precoMax: 5000 })
  }

  // Product interaction methods
  toggleFavorite(card: Card): void {
    card.isFavorite = !card.isFavorite
  }

  addToCart(card: Card): void {
    // Add to cart logic would go here
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex
    this.pageSize = event.pageSize
    this.loadAllProcessadores()
  }

  private construirFiltro(): Filtro {
    const formValue = this.filtroForm.value

    let fabricante = ""
    if (formValue.fabricante === "intel") {
      fabricante = "Intel"
    } else if (formValue.fabricante === "amd") {
      fabricante = "AMD"
    }

    const socketsSelecionados = Object.entries(formValue.sockets)
      .filter(([_, ativo]) => ativo)
      .map(([socket]) => socket.toUpperCase())

    return {
      fabricante: fabricante,
      precoMin: formValue.precoMin,
      precoMax: formValue.precoMax,
      sockets: socketsSelecionados,
      graficosIntegrados: formValue.graficosIntegrados,
      sortBy: this.sortBy,
    }
  }
}
