package com.grainger.products.dto;

import jakarta.validation.constraints.NotBlank;

public record ProductRequest(@NotBlank String name) {
}