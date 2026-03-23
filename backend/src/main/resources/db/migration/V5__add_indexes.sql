-- V1 already covers indexes on: workout_plans(user_id), workout_sessions(plan_id),
-- session_exercises(session_id), workout_logs(user_id/plan_id), workout_log_entries(log_id),
-- refresh_tokens(user_id). Only session_exercises(exercise_id) is missing.
CREATE INDEX idx_se_exercise_id ON session_exercises(exercise_id);
