import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Funcionario } from '../../../models/funcionario.model';
import { DialogService } from '../../../services/dialog.service';
import { FuncionarioService } from '../../../services/funcionario.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-funcionario-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './funcionario-list.component.html',
  styleUrl: './funcionario-list.component.css',
})
export class FuncionarioListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nome',
    'email',
    'cargo',
    'salario',
    'dataContratacao',
    'telefone',
    'acoes',
  ];
  funcionarios: Funcionario[] = [];
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  constructor(
    private funcionarioService: FuncionarioService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  loadFuncionarios(): void {
    this.funcionarioService
      .findAll(this.page, this.pageSize)
      .subscribe((data) => {
        console.log(data);
        this.funcionarios = data.results;
        this.totalRecords = data.count;
      });
  }

  paginar(event: any): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFuncionarios();
  }

  onDeleteFuncionario(funcionario: Funcionario) {
    this.dialogService
      .openConfirmDialog(
        'Deletar Funcionario',
        'Você realmente deseja deletar este funcionario?',
        'warning'
      )
      .subscribe((result) => {
        if (result) {
          this.deleteFuncionario(funcionario);
        }
      });
  }

  deleteFuncionario(funcionario: Funcionario): void {
    this.funcionarioService.delete(funcionario).subscribe({
      next: () => {
        console.log('Funcionario deletado com sucesso');
        this.snackbarService.showSuccess('Funcionario deletado com sucesso');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao deletar o funcionario', err);
      },
    });
  }

  viewDetails(funcionario: Funcionario): void {
    const usuario = funcionario.usuario;
  
    const properties = {
      'ID': funcionario.id,
      'Nome': usuario.nome,
      'Email': usuario.email,
      'CPF': this.formatarCPF(usuario.cpf),
      'Perfil': usuario.perfil.label,
      'Data de Criação': this.formatarDataHora(usuario.dataCriacao),
      'Data de Nascimento': this.formatarData(usuario.dataNascimento),
      'Cargo': funcionario.cargo,
      'Salário': this.formatarMoeda(funcionario.salario),
      'Data de Contratação': this.formatarData(funcionario.dataContratacao),
      'Telefone': usuario.telefone
        ? `(${usuario.telefone.codigoArea}) ${usuario.telefone.numero}`
        : 'Não informado',
        'Endereços': usuario.enderecos?.length > 0
        ? usuario.enderecos.map(e =>
            `${e.logradouro},  Numero: ${e.numero} - Bairro: ${e.bairro}, Cidade: ${e.cidade.nome} - ${e.cidade.estado.sigla}, CEP: ${e.cep}`
          ).join('\n')
        : 'Não informado'
    };
  
    this.dialogService.openDetailsDialog(
      'Detalhes do Funcionário',
      properties,
      'info'
    );
  }

  private formatarData(data: string | Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
  
  private formatarDataHora(data: string | Date): string {
    return new Date(data).toLocaleString('pt-BR');
  }
  
  private formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
  
  private formatarCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
  
}
