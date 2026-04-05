package com.GestaoDePedidos.ORM.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class ProdutoEletronico extends Produto {

    private Integer voltagem;
}