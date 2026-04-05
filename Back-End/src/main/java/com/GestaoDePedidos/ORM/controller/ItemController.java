package com.GestaoDePedidos.ORM.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.GestaoDePedidos.ORM.model.Item;
import com.GestaoDePedidos.ORM.repository.ItemRepository;

@RestController
@RequestMapping("/itens")
public class ItemController {

    @Autowired
    private ItemRepository repository;

    @PostMapping
    public Item criar(@RequestBody Item item) {
        return repository.save(item);
    }

    @GetMapping
    public List<Item> listar() {
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}