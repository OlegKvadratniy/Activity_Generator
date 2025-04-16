package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activities")
@Data
@AllArgsConstructor
public class Activity {
    @Id
    private String id;
    private String description;
    private String category; // Например, "fun", "relax", "action"
    private int durationMinutes; // Примерное время в минутах
}
