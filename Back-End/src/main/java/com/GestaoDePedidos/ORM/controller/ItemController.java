package com.GestaoDePedidos.ORM.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.GestaoDePedidos.ORM.exception.ResourceNotFoundException;
import com.GestaoDePedidos.ORM.model.Item;
import com.GestaoDePedidos.ORM.model.Pedido;
import com.GestaoDePedidos.ORM.model.Produto;
import com.GestaoDePedidos.ORM.repository.ItemRepository;
import com.GestaoDePedidos.ORM.repository.PedidoRepository;
import com.GestaoDePedidos.ORM.repository.ProdutoRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/itens")
public class ItemController {

    private final ItemRepository repository;
    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;

    public ItemController(ItemRepository repository, PedidoRepository pedidoRepository,
            ProdutoRepository produtoRepository) {
        this.repository = repository;
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    @PostMapping
    public ResponseEntity<Item> criar(@Valid @RequestBody Item item) {
        Pedido pedido = resolverPedido(item);
        Produto produto = resolverProduto(item);
        item.setPedido(pedido);
        item.setProduto(produto);
        Item salvo = repository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public List<Item> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Item buscar(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item", id));
    }

    @PutMapping("/{id}")
    public Item atualizar(@PathVariable Long id, @Valid @RequestBody Item body) {
        return repository.findById(id)
                .map(existing -> {
                    Pedido pedido = resolverPedido(body);
                    Produto produto = resolverProduto(body);
                    existing.setQuantidade(body.getQuantidade());
                    existing.setValorItem(body.getValorItem());
                    existing.setPedido(pedido);
                    existing.setProduto(produto);
                    return repository.save(existing);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Item", id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Item", id);
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Pedido resolverPedido(Item item) {
        if (item.getPedido() == null || item.getPedido().getId() == null) {
            throw new IllegalArgumentException("pedido com id é obrigatório.");
        }
        Long pedidoId = item.getPedido().getId();
        return pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", pedidoId));
    }

    private Produto resolverProduto(Item item) {
        if (item.getProduto() == null || item.getProduto().getId() == null) {
            throw new IllegalArgumentException("produto com id é obrigatório.");
        }
        Long produtoId = item.getProduto().getId();
        return produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", produtoId));
    }
}
