package com.GestaoDePedidos.ORM.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.GestaoDePedidos.ORM.model.ProdutoPerecivel;
import com.GestaoDePedidos.ORM.repository.ProdutoPerecivelRepository;

@RestController
@RequestMapping("/produtos/pereciveis")
public class ProdutoPerecivelController {

    @Autowired
    private ProdutoPerecivelRepository repository;

    @PostMapping
    public ProdutoPerecivel criar(@RequestBody ProdutoPerecivel produto) {
        return repository.save(produto);
    }

    @GetMapping
    public List<ProdutoPerecivel> listar() {
        return repository.findAll();
    }
}