package com.GestaoDePedidos.ORM.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.GestaoDePedidos.ORM.model.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
}