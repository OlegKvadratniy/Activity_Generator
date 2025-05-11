package com.example.demo.controller;

import com.example.demo.model.Activity;
import com.example.demo.service.ActivityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
public class ActivityController {
    private final ActivityService service;

    public ActivityController(ActivityService service) {
        this.service = service;
    }

    @GetMapping("/random")
    public Activity getRandomActivity(@RequestParam(required = false) String category) {
        return service.getRandomActivity(category);
    }

    @PostMapping
    public Activity createActivity(@RequestBody Activity activity) {
        return service.saveActivity(activity);
    }

    @GetMapping
    public List<Activity> getAllActivities() {
        return service.getAllActivities();
    }

    @DeleteMapping("/{id}")
    public void deleteActivity(@PathVariable String id) {
        service.deleteActivity(id);
    }
}
