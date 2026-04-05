package com.GestaoDePedidos.ORM.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class ProdutoPerecivel extends Produto {

    private LocalDate dataValidade;
}