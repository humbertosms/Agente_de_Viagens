
const Model = require('../models/cliente-model');
var express = require('express');

class ClienteMemoryDAO 
{
  constructor () 
  {
    this.data = new Map()

    this.createCliente(1, 'Rafael Gonzaga', 'Rua Periata', 'Programador','2019-11-25');
    this.createCliente(2, 'Rafael Borges', 'Rua T15', 'Programador','2019-11-25');
    this.createCliente(3, 'Silvair', 'Av. 125', 'Programador','2019-11-25');
    this.createCliente(4, 'Humberto Santana', 'R. Mariana 120', 'Programador','2019-11-25');
    this.createCliente(5, 'Junior', 'Av. T63', 'Programador','2019-11-25');
  }

  createCliente (id, Nome, Endereco, Profissao, Nascimento) 
  {
    if(id===undefined || id<=0){
      let indice = this.data.keys();
      let max = Array.from(indice).sort(function(a, b){return b-a}).get(0);
    }
    this.data.set(max, new Model(max, Nome, Endereco, Profissao, Nascimento))
  }

  retrieveAll () 
  {
    return Array.from(this.data.values())
  }

  retrieve (id) 
  {
    if (this.data.has(id)) 
    {
      return this.data.get(id)
    } 
    else 
    {
      throw new Error(`Cliente with id ${id} not found`)
    }
  }

  update (id, data) 
  {
    if (this.data.has(id)) 
    {
      const cliente = this.data.get(id)
      cliente.Nome = data.Nome
      cliente.Endereco = data.Endereco
      cliente.Profissao = data.Profissao
      cliente.Nascimento = data.Nascimento
      return this.retrieve(cliente.id)
    } 
    else 
    {
      throw new Error(`Cliente with id ${id} not found`)
    }
  }

  create (cliente) 
  {
    if (this.data.has(cliente.id)) 
    {
      throw new Error(`An Cliente with id ${cliente.id} already exists`)
    } 
    else 
    {
      this.createCliente(cliente.id, cliente.Nome, cliente.Endereco, cliente.Profissao, cliente.Nascimento)
      return this.retrieve(cliente.id)
    }
  }
}
module.exports = ClienteMemoryDAO;