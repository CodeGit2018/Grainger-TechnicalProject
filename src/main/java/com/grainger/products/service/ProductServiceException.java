package com.grainger.products.service;

public class ProductServiceException extends RuntimeException {

    public ProductServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}