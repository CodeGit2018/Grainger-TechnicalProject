package com.grainger.products.service.implementation;

import com.grainger.products.model.Product;
import com.grainger.products.repository.ProductRepository;
import com.grainger.products.service.ProductService;
import com.grainger.products.service.ProductServiceException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getProducts() {
        try {
            return productRepository.findAll();
        } catch (RuntimeException exception) {
            throw new ProductServiceException("Unable to retrieve products", exception);
        }
    }

    @Override
    public Product createProduct(String name) {
        try {
            return productRepository.save(new Product(name));
        } catch (RuntimeException exception) {
            throw new ProductServiceException("Unable to create product", exception);
        }
    }
}