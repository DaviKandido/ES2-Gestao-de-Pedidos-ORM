package com.GestaoDePedidos.ORM.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.GestaoDePedidos.ORM.model.ProdutoEletronico;
import com.GestaoDePedidos.ORM.repository.ProdutoEletronicoRepository;

@RestController
@RequestMapping("/produtos/eletronicos")
public class ProdutoEletronicoController {

    @Autowired
    private ProdutoEletronicoRepository repository;

    @PostMapping
    public ProdutoEletronico criar(@RequestBody ProdutoEletronico produto) {
        return repository.save(produto);
    }

    @GetMapping
    public List<ProdutoEletronico> listar() {
        return repository.findAll();
    }
}