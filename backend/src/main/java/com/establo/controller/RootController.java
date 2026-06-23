package com.establo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {
  @GetMapping("/")
  String documentation() {
    return "redirect:/swagger-ui.html";
  }
}
