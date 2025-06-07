import { Routes } from '@angular/router';
import { CadastroComponent } from './components/auth/cadastro/cadastro.component';
import { CidadeFormComponent } from './components/cidade/cidade-form/cidade-form.component';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';
import { cidadeResolver } from './components/cidade/cidade.resolver';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { estadoResolver } from './components/estado/estado.resolver';
import { FabricanteFormComponent } from './components/fabricante/fabricante-form/fabricante-form.component';
import { FabricanteListComponent } from './components/fabricante/fabricante-list/fabricante-list.component';
import { fabricanteResolver } from './components/fabricante/fabricante.resolver';
import { FornecedorFormComponent } from './components/fornecedor/fornecedor-form/fornecedor-form.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { fornecedorResolver } from './components/fornecedor/fornecedor.resolver';
import { FuncionarioFormComponent } from './components/funcionario/funcionario-form/funcionario-form.component';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { funcionarioResolver } from './components/funcionario/funcionario.resolver';
import { LoteFormComponent } from './components/lote/lote-form/lote-form.component';
import { LoteListComponent } from './components/lote/lote-list/lote-list.component';
import { loteResolver } from './components/lote/lote.resolver';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PlacaintegradaFormComponent } from './components/placaintegrada/placaintegrada-form/placaintegrada-form.component';
import { PlacaintegradaListComponent } from './components/placaintegrada/placaintegrada-list/placaintegrada-list.component';
import { placaintegradaResolver } from './components/placaintegrada/placaintegrada.resolver';
import { ProcessadorFormComponent } from './components/processador/processador-form/processador-form.component';
import { ProcessadorListComponent } from './components/processador/processador-list/processador-list.component';
import { processadorResolver } from './components/processador/processador.resolver';
import { AdminHomeComponent } from './components/template/admin-home/admin-home.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { ClienteHomeComponent } from './components/template/cliente/cliente-home/cliente-home.component';
import { ClienteTemplateComponent } from './components/template/cliente/cliente-template/cliente-template.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
import { UserOnlyGuard } from './guard/user-only.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ProcessadorDetailsComponent } from './components/processador/processador-details/processador-details.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { ProcessadoresFiltrosComponent } from './components/processadores-filtros/processadores-filtros.component';
import { PedidosDetailsComponent } from './components/profile/pedidos/pedidos-details/pedidos-details.component';
import { PedidosListComponent } from './components/pedidos-list/pedidos-list.component';
import { PagamentosComponent } from './components/profile/pagamentos/pagamentos.component';
import { PagamentoComponent } from './components/pagamento/pagamento-form/pagamento-form.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminTemplateComponent,
    title: 'Administração',
    canActivate: [AuthGuard, AdminGuard],
    data: { roles: ['Super', 'Admin'] },
    children: [
      { path: '', component: AdminHomeComponent, title: 'Home' },

      {
        path: 'estados',
        component: EstadoListComponent,
        title: 'Lista de Estados',
      },
      {
        path: 'estados/create',
        component: EstadoFormComponent,
        title: 'Novo Estado',
      },
      {
        path: 'estados/edit/:id',
        component: EstadoFormComponent,
        title: 'Editar Estado',
        resolve: { estado: estadoResolver },
      },

      {
        path: 'cidades',
        component: CidadeListComponent,
        title: 'Lista de Cidades',
      },
      {
        path: 'cidades/create',
        component: CidadeFormComponent,
        title: 'Nova Cidade',
      },
      {
        path: 'cidades/edit/:id',
        component: CidadeFormComponent,
        title: 'Editar Cidade',
        resolve: { cidade: cidadeResolver },
      },

      {
        path: 'fabricantes',
        component: FabricanteListComponent,
        title: 'Lista de Fabricantes',
      },
      {
        path: 'fabricantes/create',
        component: FabricanteFormComponent,
        title: 'Novo Fabricante',
      },
      {
        path: 'fabricantes/edit/:id',
        component: FabricanteFormComponent,
        title: 'Editar Fabricante',
        resolve: { fabricante: fabricanteResolver },
      },

      {
        path: 'fornecedores',
        component: FornecedorListComponent,
        title: 'Lista de Fornecedores',
      },
      {
        path: 'fornecedores/create',
        component: FornecedorFormComponent,
        title: 'Novo Fornecedor',
      },
      {
        path: 'fornecedores/edit/:id',
        component: FornecedorFormComponent,
        title: 'Editar Fornecedor',
        resolve: { fornecedor: fornecedorResolver },
      },

      { path: 'lotes', component: LoteListComponent, title: 'Lista de Lotes' },
      {
        path: 'lotes/create',
        component: LoteFormComponent,
        title: 'Novo Lote',
      },
      {
        path: 'lotes/edit/:id',
        component: LoteFormComponent,
        title: 'Editar Lote',
        resolve: { lote: loteResolver },
      },

      {
        path: 'placasintegradas',
        component: PlacaintegradaListComponent,
        title: 'Lista de Placas Integradas',
      },
      {
        path: 'placasintegradas/create',
        component: PlacaintegradaFormComponent,
        title: 'Nova Placa Integrada',
      },
      {
        path: 'placasintegradas/edit/:id',
        component: PlacaintegradaFormComponent,
        title: 'Editar Placa Integrada',
        resolve: { placaintegrada: placaintegradaResolver },
      },

      {
        path: 'processadores',
        component: ProcessadorListComponent,
        title: 'Lista de Processadores',
      },
      {
        path: 'processadores/create',
        component: ProcessadorFormComponent,
        title: 'Novo Processador',
      },
      {
        path: 'processadores/edit/:id',
        component: ProcessadorFormComponent,
        title: 'Editar Processador',
        resolve: { processador: processadorResolver },
      },

      {
        path: 'funcionarios',
        component: FuncionarioListComponent,
        title: 'Lista de Funcionários',
      },
      {
        path: 'funcionarios/create',
        component: FuncionarioFormComponent,
        title: 'Novo Funcionário',
      },
      {
        path: 'funcionarios/edit/:id',
        component: FuncionarioFormComponent,
        title: 'Edicar Funcionario',
        resolve: { funcionario: funcionarioResolver },
      },
      {
        path: 'pedidos',
        component: PedidosListComponent,
        title: 'Pedidos'
      },

      { path: '**', component: PageNotFoundComponent },
    ],
  },

  {
    path: '',
    component: ClienteTemplateComponent,
    title: 'IRONDRAGON',
    children: [
      {
        path: '',
        component: ClienteHomeComponent,
        title: 'Home',
      },
      {
        path: 'processadores/:id',
        component: ProcessadorDetailsComponent,
        title: 'Processador',
      },
      {
        path: 'cadastrar',
        component: CadastroComponent,
        title: 'Cadastrar',
      },    
      {
        path: 'carrinho',
        component: CarrinhoComponent,
        title: 'Carrinho de Compras',
      },
      {
        path: 'pagamento',
        component: PagamentoComponent,
        title: 'Tela de Pagamento'
      },
      {
        path: 'perfil',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'processadores',
        component: ProcessadoresFiltrosComponent,
        title: 'Processadores'
      }
    ],
  },

  {
    path: 'perfil',
    title: 'Perfil',
    component: ProfileComponent,
    canActivate: [AuthGuard, UserOnlyGuard],
    data: { roles: ['User'] },
    children: [
      { path: '', redirectTo: 'dados', pathMatch: 'full' },
      { path: 'dados', title: 'Meus Dados', component: ProfileComponent },
      { path: 'pedidos', title: 'Meus Pedidos', component: ProfileComponent },
      { path: 'carteira', title: 'Carteira', component: ProfileComponent },
      { path: 'desejos', title: 'Desejos', component: ProfileComponent },
      // ...outras rotas filhas se quiser
    ]
  },
  {
    path: 'perfil/pedidos/:id',
    title: 'Detalhes do Pedido',
    component: PedidosDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['User'] }
  },
];
