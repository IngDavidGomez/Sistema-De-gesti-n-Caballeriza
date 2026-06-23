package com.establo.service;
public interface EmailService { void sendPasswordReset(String recipient,String name,String resetUrl); }
