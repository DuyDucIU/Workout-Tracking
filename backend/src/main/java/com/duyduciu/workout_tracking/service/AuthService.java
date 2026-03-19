package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.config.JwtConfig;
import com.duyduciu.workout_tracking.dto.auth.*;
import com.duyduciu.workout_tracking.entity.RefreshToken;
import com.duyduciu.workout_tracking.entity.User;
import com.duyduciu.workout_tracking.enums.UnitPreference;
import com.duyduciu.workout_tracking.exception.DuplicateResourceException;
import com.duyduciu.workout_tracking.exception.InvalidTokenException;
import com.duyduciu.workout_tracking.exception.ResourceNotFoundException;
import com.duyduciu.workout_tracking.repository.RefreshTokenRepository;
import com.duyduciu.workout_tracking.repository.UserRepository;
import com.duyduciu.workout_tracking.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final JwtConfig jwtConfig;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email is already in use");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username is already taken");
        }

        User user = User.builder()
                .email(request.email())
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .unitPref(UnitPreference.KG)
                .build();

        userRepository.save(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User", null));

        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        String hashedToken = jwtService.hashToken(request.refreshToken());

        RefreshToken storedToken = refreshTokenRepository.findByToken(hashedToken)
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        if (storedToken.isRevoked()) {
            throw new InvalidTokenException("Refresh token has been revoked");
        }
        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Refresh token has expired");
        }

        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        return issueTokens(storedToken.getUser());
    }

    @Transactional
    public void logout(LogoutRequest request) {
        String hashedToken = jwtService.hashToken(request.refreshToken());

        refreshTokenRepository.findByToken(hashedToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String rawRefreshToken = jwtService.generateRefreshToken();
        String hashedRefreshToken = jwtService.hashToken(rawRefreshToken);

        LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(jwtConfig.getRefreshTokenExpiration() / 1000);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(hashedRefreshToken)
                .expiresAt(expiresAt)
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.of(accessToken, rawRefreshToken, jwtConfig.getAccessTokenExpiration() / 1000);
    }
}
