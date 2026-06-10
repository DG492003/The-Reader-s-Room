package com.trr.readers_room_api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class healthcheck {

    @GetMapping
    public String check(){
        return "Application is fine";
    }
}
