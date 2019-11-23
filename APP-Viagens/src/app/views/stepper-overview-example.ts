import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { Cliente } from '../models/cliente';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Carro } from '../models/carro';
import { CarroService } from '../services/carro.service';
import { ClienteService } from '../services/cliente.service';
import { Hotel } from '../models/hotel';
import { HotelService } from '../services/hotel.service';
import { Voo } from '../models/voo';
import { VooService } from '../services/voo.service';
import { Pagamento } from '../models/pagamento';
import { PagamentoService } from '../services/pagamento.service';
import { ViagemService } from '../services/viagem.service';
import { MatAutocompleteSelectedEvent, MatStepper } from '@angular/material';
import { Viagem } from '../models/viagem';
import { Reserva } from '../models/reserva';
import { TipoReserva } from '../enum/tipo-reserva.enum';


/**
 * @title Stepper overview
 */
@Component({
  selector: 'stepper-overview-example',
  templateUrl: 'stepper-overview-example.html',
  styleUrls: ['stepper-overview-example.css'],
})
export class StepperOverviewExample implements OnInit {
  isEditarCarro = false;
  isEditarCli = false;
  isEditarVoo = false;
  isEditarHotel = false;
  isEditarPagamento = false;

  viagemFormGroup: FormGroup;
  clienteFormGroup: FormGroup;
  carroFormGroup: FormGroup;
  hotelFormGroup: FormGroup;
  vooFormGroup: FormGroup;
  pagamentoFormGroup: FormGroup;

  filteredReserva: Observable<Viagem[]>;
  filteredUser: Observable<Cliente[]>;
  filteredCars: Observable<Carro[]>;
  filteredHotel: Observable<Hotel[]>;
  filteredVoo: Observable<Voo[]>;


  viagem = {} as Viagem;
  viagens: Viagem[];

  cliente = {} as Cliente;
  clientes: Cliente[] = [];

  car = {} as Carro;
  cars: Carro[] = [];

  hotel = {} as Hotel;
  hoteis: Hotel[] = [];

  voo = {} as Voo;
  voos: Voo[] = [];

  pagamento = {} as Pagamento;
  pagamentos: Pagamento[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private carroService: CarroService,
    private viagemService: ViagemService,
    private clienteService: ClienteService,
    private hotelService: HotelService,
    private vooService: VooService,
    private pagamentoService: PagamentoService,
  ) {
    this.viagemFormGroup = this._formBuilder.group({
      controlViagem: new FormControl,

    });
    this.clienteFormGroup = this._formBuilder.group({
      controlCliente: new FormControl()
    });

    this.carroFormGroup = this._formBuilder.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      controlCarro: new FormControl()
    });
    this.hotelFormGroup = this._formBuilder.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      controlHotel: new FormControl()

    });

    this.vooFormGroup = this._formBuilder.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      controlVoo: new FormControl()
    });

    this.pagamentoFormGroup = this._formBuilder.group({
      controlPagamento: new FormControl()
    });

    this.filteredUser = this.clienteFormGroup.controls.controlCliente.valueChanges.pipe(startWith(''),
      map(cliente => cliente ? this._filterClientes(cliente) : this.clientes.slice()));

    this.filteredCars = this.carroFormGroup.controls.controlCarro.valueChanges.pipe(startWith(''),
      map(teste => teste ? this._filterCar(teste) : this.cars.slice()));

    this.filteredHotel = this.hotelFormGroup.controls.controlHotel.valueChanges.pipe(startWith(''),
      map(teste => teste ? this._filterHotel(teste) : this.hoteis.slice()));

    this.filteredVoo = this.vooFormGroup.controls.controlVoo.valueChanges.pipe(startWith(''),
      map(teste => teste ? this._filterVoo(teste) : this.voos.slice()));

  }

  ngOnInit() {
    this.getCars();
    this.getClis();
    this.getHoteis();
    this.getViagens();
    this.getVoos();
  }

  // defini se um carro será criado ou atualizado
  saveCar(form: NgForm) {
    if (this.car.id !== undefined) {
      this.carroService.updateCar(this.car).subscribe(() => {
        this.cleanForm(form);
      });
    } else {
      this.carroService.saveCar(this.car).subscribe(() => {
        this.cleanForm(form);
      });
    }
  }

  saveHotel(form: NgForm) {
    if (this.hotel.id !== undefined) {
      this.hotelService.updateHotel(this.hotel).subscribe(() => {
        this.cleanForm(form);
      });
    } else {
      this.hotelService.saveHotel(this.hotel).subscribe(() => {
        this.cleanForm(form);
      });
    }
  }

  saveVoo(form: NgForm) {
    if (this.voo.id !== undefined) {
      this.vooService.updateVoo(this.voo).subscribe(() => {
        this.cleanForm(form);
      });
    } else {
      this.vooService.saveVoo(this.voo).subscribe(() => {
        this.cleanForm(form);
      });
    }
  }

  saveViagem(form: NgForm) {
    if (this.viagem.id !== undefined) {
      this.viagemService.update(this.viagem).subscribe(() => {
        this.cleanForm(form);
      });
    } else {
      this.viagemService.save(this.viagem).subscribe(() => {
        this.cleanForm(form);
      });
    }
  }

  savePagamento(form: NgForm) {
    
    this.saveViagem(form);

    if (this.pagamento.id !== undefined) {
      this.pagamentoService.updatePagamento(this.pagamento).subscribe(() => {
        this.cleanForm(form);
      });
    } else {
      this.pagamentoService.savePagamento(this.pagamento).subscribe(() => {
        this.cleanForm(form);
      });
    }
  }

  gravarViagem(stepper: MatStepper) {
    stepper.selectedIndex = 0;
  }

  // defini se um Cliente será criado ou atualizado
  novoCli() {
    this.isEditarCli = !this.isEditarCli;
    this.limparCli();
  }

  novoCarro() {
    this.isEditarCarro = !this.isEditarCarro;
    this.limparCar();
  }

  novoHotel() {
    this.isEditarHotel = !this.isEditarHotel;
    this.limparHotel();
  }

  novoPagamento() {
    this.isEditarHotel = !this.isEditarHotel;

  }

  novoVoo() {
    this.isEditarVoo = !this.isEditarVoo;

  }

  private limparCli() {
    this.cliente = {} as Cliente;
    this.cliente.Nome = "";
  }

  private limparCar() {
    this.car = {} as Carro;
    this.car.modelo = "";
  }

  private limparHotel() {
    this.hotel = {} as Hotel;
    this.hotel.nome = "";
  }
  saveCli(form: NgForm) {
    console.log(this.cliente.Nascimento)
    if (this.cliente.id !== undefined) {
      this.clienteService.updateCliente(this.cliente).subscribe(() => {
        this.cleanForm(form);
      });
    } else {
      this.clienteService.saveCliente(this.cliente).subscribe(() => {
        this.cleanForm(form);
      });
    }

  }

  // Chama o serviço para obtém todos os carros
  getCars() {
    this.carroService.getCarros().subscribe((cars: Carro[]) => {
      this.cars = cars;
    });
  }

  getViagens() {
    this.viagemService.get().subscribe((viagens: Viagem[]) => {
      this.viagens = viagens;
    });
  }

  getVoos() {
    this.vooService.getVoos().subscribe((voos: Voo[]) => {
      this.voos = voos;
    });
  }

  getPagamentos() {
    this.pagamentoService.getPagamentos().subscribe((pagamentos: Pagamento[]) => {
      this.pagamentos = pagamentos;
    });
  }

  // deleta um carro
  deleteCar(car: Carro) {
    this.carroService.deleteCar(car).subscribe(() => {
      this.getCars();
    });
  }

  deleteHotel(hotel: Hotel) {
    this.hotelService.deleteHotel(hotel).subscribe(() => {
      this.getHoteis();
    });
  }

  deletePagamento(car: Pagamento) {
    this.pagamentoService.deletePagamento(car).subscribe(() => {
      this.getPagamentos();
    });
  }

  deleteVoo(car: Voo) {
    this.vooService.deleteVoo(car).subscribe(() => {
      this.getVoos();
    });
  }

  // copia o carro para ser editado.
  editCar(car: Carro) {
    this.selectCar(car)
    this.isEditarCarro = true;
  }

  editHotel(hotel: Hotel) {
    this.selectHotel(hotel)
    this.isEditarHotel = true;
  }

  editVoo(voo: Voo) {
    this.selectVoo(voo)
    this.isEditarVoo = true;
  }

  editPagamento(pagamento: Pagamento) {
    this.selectPagamento(pagamento)
    this.isEditarVoo = true;
  }

  selectCar(car: Carro) {
    this.car = { ...car };
  }

  selectHotel(hotel: Hotel) {
    this.hotel = { ...hotel };
  }

  selectVoo(voo: Voo) {
    this.voo = { ...voo };
  }

  selectPagamento(pagamento: Pagamento) {
    this.pagamento = { ...pagamento };
  }

  // Chama o serviço para obtém todos os Usuarios
  getClis() {
    this.clienteService.getClientes().subscribe((clientes: Cliente[]) => {
      this.clientes = clientes;
    });
  }

  getHoteis() {
    this.hotelService.getHoteis().subscribe((hoteis: Hotel[]) => {
      this.hoteis = hoteis;
    });
  }

  deleteUser(user: Cliente) {
    this.clienteService.deleteCliente(user).subscribe(() => {
      this.getClis();
    });
  }

  deleteViagem(reserva: Viagem) {
    this.viagemService.delete(reserva).subscribe(() => {
      this.getViagens();
    });
  }

  // copia o Usuario para ser editado.
  editUser(user: Cliente) {
    this.selectUser(user);
    this.isEditarCli = true;
  }

  editViagem(viagem: Viagem) {
    this.viagemService.getById(viagem.id).subscribe((viagem: Viagem) => {
      this.viagem = viagem;
    });
    console.log(this.viagem.id);

    this.clienteService.getClienteById(viagem.idcliente).subscribe((cliente: Cliente) => {
      this.cliente = cliente;
    });
    console.log(this.cliente.Nome);
  }

  selectReserva(reserva: Viagem) {
    this.viagem = { ...reserva };
  }

  selectUser(user: Cliente) {
    this.cliente = { ...user };
    this.viagem.idcliente = this.cliente.id;
  }

  // limpa o formulario
  cleanForm(form: NgForm) {
    this.getCars();
    this.getClis()
    form.resetForm();
    this.car = {} as Carro;
    this.limparCli();
    this.isEditarCarro = false;
    this.isEditarCli = false;
  }

  displayFn(user?: Cliente): string | undefined {
    return user ? user.Nome : undefined;
  }

  private _allCars(): Carro[] {
    if (this.cars.length <= 0) {
      this.getCars();
    }
    return this.cars;
  }

  private _filterClientes(Nome: string): Cliente[] {
    const filterValue = Nome.toLowerCase();

    return this.clientes.filter(cliente => cliente.Nome.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterCar(modelo: string): Carro[] {
    const filterValue = modelo.toLowerCase();
    return this.cars.filter(carro => carro.modelo.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterHotel(Nome: string): Hotel[] {
    const filterValue = Nome.toLowerCase();
    return this.hoteis.filter(carro => carro.nome.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterVoo(Nome: string): Voo[] {
    const filterValue = Nome.toLowerCase();
    return this.voos.filter(voo => voo.cidadeOrigem.toLowerCase().indexOf(filterValue) === 0
      || voo.cidadeDestino.toLowerCase().indexOf(filterValue) === 0);
  }

  public selecionarCliente(entidade: Cliente) {
    this.cliente = entidade;
    this.viagem.idcliente = entidade.id;
  }

  public selecionarCarro(entidade: Carro) {
    let reservaCarro = {} as Reserva;
    reservaCarro.tipoReserva = TipoReserva.CARRO;
    reservaCarro.idEntidade = entidade.id;
    reservaCarro.valor = entidade.valor;
    let index = this.viagem.reservas.findIndex(reser => reser.tipoReserva === TipoReserva.CARRO)
    if (index !== -1) {
      this.viagem.reservas.slice(index, 1)
    }
    this.viagem.reservas.push(reservaCarro);
  }
  public selecionarVoo(entidade: Voo) {
    let reservaVoo = {} as Reserva;
    reservaVoo.tipoReserva = TipoReserva.VOO;
    reservaVoo.idEntidade = entidade.id;
    reservaVoo.valor = entidade.valor
    let index = this.viagem.reservas.findIndex(reser => reser.tipoReserva === TipoReserva.VOO)
    if (index !== -1) {
      this.viagem.reservas.slice(index, 1)
    }
    this.viagem.reservas.push(reservaVoo);
  }
  public selecionarHotel(entidade: Hotel) {
    let reservaHotel = {} as Reserva;
    reservaHotel.tipoReserva = TipoReserva.HOTEL;
    reservaHotel.idEntidade = entidade.id;
    reservaHotel.valor = entidade.precoDiaria;
    let index = this.viagem.reservas.findIndex(reser => reser.tipoReserva === TipoReserva.HOTEL)
    if (index !== -1) {
      this.viagem.reservas.slice(index, 1)
    }
    this.viagem.reservas.push(reservaHotel);
  }

}