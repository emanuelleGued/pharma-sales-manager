package com.pharmasales.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.pharmasales.dto.AuthResponse;
import com.pharmasales.dto.LoginRequest;
import com.pharmasales.dto.RegisterRequest;
import com.pharmasales.model.User;
import com.pharmasales.model.UserRole;
import com.pharmasales.repository.UserRepository;
import com.pharmasales.security.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        var userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "E-mail ou senha inválidos"));
        }

        User user = userOpt.get();
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(new AuthResponse(
                token,
                new AuthResponse.UserData(user.getId(), user.getName(), user.getEmail(), user.getRole())
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Este e-mail já está cadastrado"));
        }

        User user = userRepository.save(new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                UserRole.REPRESENTATIVE
        ));

        String token = jwtService.generateToken(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(
                token,
                new AuthResponse.UserData(user.getId(), user.getName(), user.getEmail(), user.getRole())
        ));
    }
}