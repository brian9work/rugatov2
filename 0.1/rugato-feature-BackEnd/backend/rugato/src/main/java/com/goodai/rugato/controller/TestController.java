package com.goodai.rugato.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class TestController {
    @GetMapping
    public String test() {
        return "sistem on line";
    }
}
