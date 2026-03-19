package com.duyduciu.workout_tracking.service;

import com.duyduciu.workout_tracking.dto.user.ChangePasswordRequest;
import com.duyduciu.workout_tracking.dto.user.UpdateUserRequest;
import com.duyduciu.workout_tracking.dto.user.UserDto;
import com.duyduciu.workout_tracking.entity.User;
import com.duyduciu.workout_tracking.exception.DuplicateResourceException;
import com.duyduciu.workout_tracking.exception.ResourceNotFoundException;
import com.duyduciu.workout_tracking.mapper.UserMapper;
import com.duyduciu.workout_tracking.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserDto getCurrentUser() {
        return userMapper.toDto(getAuthenticatedUser());
    }

    @Transactional
    public UserDto updateCurrentUser(UpdateUserRequest request) {
        User user = getAuthenticatedUser();

        if (request.username() != null && !request.username().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.username())) {
                throw new DuplicateResourceException("Username is already taken");
            }
            user.setUsername(request.username());
        }

        if (request.unitPref() != null) {
            user.setUnitPref(request.unitPref());
        }

        return userMapper.toDto(userRepository.save(user));
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = getAuthenticatedUser();

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
