package com.grainger.products.service.implementation;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

import com.grainger.products.repository.ProductRepository;
import com.grainger.products.service.ProductServiceException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Test
    void throwsServiceExceptionWhenGettingProductsFails() {
        RuntimeException cause = new RuntimeException("database unavailable");
        given(productRepository.findAll()).willThrow(cause);
        ProductServiceImpl productService = new ProductServiceImpl(productRepository);

        assertThatThrownBy(productService::getProducts)
                .isInstanceOf(ProductServiceException.class)
                .hasMessage("Unable to retrieve products")
                .hasCause(cause);
    }

    @Test
    void throwsServiceExceptionWhenCreatingProductFails() {
        RuntimeException cause = new RuntimeException("database unavailable");
        given(productRepository.save(org.mockito.ArgumentMatchers.any())).willThrow(cause);
        ProductServiceImpl productService = new ProductServiceImpl(productRepository);

        assertThatThrownBy(() -> productService.createProduct("Safety Gloves"))
                .isInstanceOf(ProductServiceException.class)
                .hasMessage("Unable to create product")
                .hasCause(cause);
    }
}