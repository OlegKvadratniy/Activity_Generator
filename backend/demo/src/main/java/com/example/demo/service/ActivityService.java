package com.example.demo.service;

import com.example.demo.model.Activity;
import com.example.demo.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class ActivityService {
    private final ActivityRepository repository;

    public ActivityService(ActivityRepository repository) {
        this.repository = repository;
    }

    public Activity getRandomActivity(String category) {
        List<Activity> activities = category != null
            ? repository.findByCategory(category)
            : repository.findAll();
        return activities.isEmpty() ? null : activities.get(new Random().nextInt(activities.size()));
    }

    public Activity saveActivity(Activity activity) {
        return repository.save(activity);
    }

    public List<Activity> getAllActivities() {
        return repository.findAll();
    }

    public void deleteActivity(String id) {
        repository.deleteById(id);
    }
}