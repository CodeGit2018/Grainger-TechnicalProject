package com.grainger.products.service;

import com.grainger.products.model.Product;
import java.util.List;

public interface ProductService {

    List<Product> getProducts();

    Product createProduct(String name);
}