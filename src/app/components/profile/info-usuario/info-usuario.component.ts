// info-usuario.component.ts (refatorado)
import { DatePipe, NgIf } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Cliente } from '../../../models/cliente.model';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-info-usuario',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    DatePipe,
    NgIf,
  ],
  templateUrl: './info-usuario.component.html',
  styleUrls: ['./info-usuario.component.css'],
})
export class InfoUsuarioComponent implements OnInit, OnChanges {
  @Input() usuario!: Usuario;
  @Input() cliente!: Cliente;
  @Input() keycloakProfile?: Keycloak.KeycloakProfile;

  @Output() salvarInfo = new EventEmitter<{
    nome: string;
    dataNascimento: Date | null;
    telefone: { codigoArea: string; numero: string };
  }>();

  formInfoPessoais!: FormGroup;
  editandoInfoPessoais = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // Removido buildForm daqui
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['usuario'] || changes['cliente']) && this.cliente?.usuario) {
      this.buildForm();
      this.editandoInfoPessoais = false;
    }
  }

  private buildForm() {
    this.formInfoPessoais = this.formBuilder.group({
      nome: [
        this.cliente?.usuario.nome || this.keycloakProfile?.firstName || '',
        Validators.required,
      ],
      email: [{ value: this.cliente?.usuario.email || '', disabled: true }],
      telefone: this.formBuilder.group({
        codigoArea: [
          this.cliente?.usuario.telefone?.codigoArea || '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(2),
          ],
        ],
        numero: [
          this.cliente?.usuario.telefone?.numero || '',
          [Validators.required, Validators.pattern(/^\d{8,9}$/)],
        ],
      }),
      cpf: [{ value: this.cliente?.usuario.cpf || '', disabled: true }],
      dataNascimento: [
        this.cliente?.usuario.dataNascimento
          ? new Date(this.cliente.usuario.dataNascimento)
          : null,
      ],
    });
  }

  editar() {
    this.editandoInfoPessoais = true;
  }

  cancelar() {
    this.buildForm();
    this.editandoInfoPessoais = false;
  }

  submit() {
    this.formInfoPessoais.markAllAsTouched();
    if (this.formInfoPessoais.invalid) return;

    const { nome, dataNascimento, telefone } =
      this.formInfoPessoais.getRawValue();
    this.salvarInfo.emit({ nome, dataNascimento, telefone });
    this.editandoInfoPessoais = false;
  }
}
