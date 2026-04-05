package com.GestaoDePedidos.ORM.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.GestaoDePedidos.ORM.model.Produto;


@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}