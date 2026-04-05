package com.GestaoDePedidos.ORM.controller;

import java.util.ArrayList;
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
import com.GestaoDePedidos.ORM.repository.PedidoRepository;
import com.GestaoDePedidos.ORM.repository.ProdutoRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoRepository repository;
    private final ProdutoRepository produtoRepository;

    public PedidoController(PedidoRepository repository, ProdutoRepository produtoRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
    }

    @PostMapping
    public ResponseEntity<Pedido> criar(@Valid @RequestBody Pedido pedido) {
        anexarItensAoPedido(pedido);
        Pedido salvo = repository.save(pedido);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping
    public List<Pedido> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Pedido buscar(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));
    }

    @PutMapping("/{id}")
    public Pedido atualizar(@PathVariable Long id, @Valid @RequestBody Pedido body) {
        Pedido existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", id));
        existing.setData(body.getData());
        existing.setValorTotal(body.getValorTotal());
        if (body.getItens() != null) {
            if (existing.getItens() == null) {
                existing.setItens(new ArrayList<>());
            }
            existing.getItens().clear();
            for (Item item : body.getItens()) {
                if (item.getProduto() == null || item.getProduto().getId() == null) {
                    throw new IllegalArgumentException("Cada item deve referenciar produto com id.");
                }
                Produto produto = produtoRepository.findById(item.getProduto().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Produto", item.getProduto().getId()));
                Item novo = new Item();
                novo.setQuantidade(item.getQuantidade());
                novo.setValorItem(item.getValorItem());
                novo.setProduto(produto);
                novo.setPedido(existing);
                existing.getItens().add(novo);
            }
        }
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Pedido", id);
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void anexarItensAoPedido(Pedido pedido) {
        if (pedido.getItens() == null) {
            return;
        }
        for (Item item : pedido.getItens()) {
            item.setPedido(pedido);
            if (item.getProduto() == null || item.getProduto().getId() == null) {
                throw new IllegalArgumentException("Cada item deve referenciar produto com id.");
            }
            Produto produto = produtoRepository.findById(item.getProduto().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto", item.getProduto().getId()));
            item.setProduto(produto);
        }
    }
}
