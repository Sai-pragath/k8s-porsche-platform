package com.porsche.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String modelName;
    private String category; // e.g., 911, Taycan, Panamera, Macan
    private BigDecimal basePrice;
    private Integer horsepower;
    private Double zeroToSixty; // 0-60 mph time
    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    // Constructors
    public Vehicle() {}

    public Vehicle(String modelName, String category, BigDecimal basePrice, Integer horsepower, Double zeroToSixty, String imageUrl, String description) {
        this.modelName = modelName;
        this.category = category;
        this.basePrice = basePrice;
        this.horsepower = horsepower;
        this.zeroToSixty = zeroToSixty;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    public Integer getHorsepower() { return horsepower; }
    public void setHorsepower(Integer horsepower) { this.horsepower = horsepower; }
    public Double getZeroToSixty() { return zeroToSixty; }
    public void setZeroToSixty(Double zeroToSixty) { this.zeroToSixty = zeroToSixty; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
