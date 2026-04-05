package com.GestaoDePedidos.ORM.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.Data;

@Entity
@Data
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nome;

    @NotNull
    @Positive
    private Double preco;

    @NotNull
    @PositiveOrZero
    private Integer estoque;

    /** Opcional: produtos eletrônicos */
    private Integer voltagem;

    /** Opcional: produtos perecíveis */
    private LocalDate dataValidade;
}