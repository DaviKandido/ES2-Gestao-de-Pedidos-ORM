package com.GestaoDePedidos.ORM.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.GestaoDePedidos.ORM.model.ProdutoEletronico;


@Repository
public interface ProdutoEletronicoRepository extends JpaRepository<ProdutoEletronico, Long> {
}