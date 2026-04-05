package com.GestaoDePedidos.ORM.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String recurso, Long id) {
        super(recurso + " não encontrado: id=" + id);
    }
}
