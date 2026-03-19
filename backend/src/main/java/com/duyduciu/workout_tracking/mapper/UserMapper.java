package com.duyduciu.workout_tracking.mapper;

import com.duyduciu.workout_tracking.dto.user.UserDto;
import com.duyduciu.workout_tracking.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);
}
