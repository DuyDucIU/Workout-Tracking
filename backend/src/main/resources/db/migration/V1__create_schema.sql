-- ─────────────────────────────────────────────────────────────
-- V1: Initial schema
-- Tables created in dependency order (no forward FK references)
-- All weights stored in kg; unit conversion is a display concern.
-- ─────────────────────────────────────────────────────────────

-- ── 1. users ─────────────────────────────────────────────────
CREATE TABLE users
(
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255) NOT NULL,
    username   VARCHAR(100) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    unit_pref  ENUM ('KG', 'LBS') NOT NULL DEFAULT 'KG',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email    UNIQUE (email),
    CONSTRAINT uq_users_username UNIQUE (username)
);

-- ── 2. refresh_tokens ─────────────────────────────────────────
CREATE TABLE refresh_tokens
(
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT UNSIGNED NOT NULL,
    token      VARCHAR(512)    NOT NULL,
    expires_at DATETIME        NOT NULL,
    revoked    BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_refresh_tokens_token UNIQUE (token),
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_rt_token (token),
    INDEX idx_rt_user_id (user_id)
);

-- ── 3. exercises ──────────────────────────────────────────────
CREATE TABLE exercises
(
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(150)                                                               NOT NULL,
    description  TEXT,
    category     ENUM ('CARDIO', 'STRENGTH', 'FLEXIBILITY')                                NOT NULL,
    muscle_group ENUM ('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'FULL_BODY') NOT NULL,
    is_system    BOOLEAN                                                                    NOT NULL DEFAULT TRUE,
    created_at   DATETIME                                                                   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_exercises_name UNIQUE (name),
    INDEX idx_ex_category (category),
    INDEX idx_ex_muscle_group (muscle_group)
);

-- ── 4. workout_plans ──────────────────────────────────────────
CREATE TABLE workout_plans
(
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    name        VARCHAR(150)    NOT NULL,
    description TEXT,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_wp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_wp_user_id (user_id)
);

-- ── 5. workout_sessions ───────────────────────────────────────
CREATE TABLE workout_sessions
(
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plan_id     BIGINT UNSIGNED                                                                      NOT NULL,
    name        VARCHAR(150)                                                                         NOT NULL,
    day_of_week ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    order_index INT             NOT NULL DEFAULT 0,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ws_plan FOREIGN KEY (plan_id) REFERENCES workout_plans (id) ON DELETE CASCADE,
    INDEX idx_ws_plan_id (plan_id),
    INDEX idx_ws_day_of_week (day_of_week)
);

-- ── 6. session_exercises ──────────────────────────────────────
CREATE TABLE session_exercises
(
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id  BIGINT UNSIGNED NOT NULL,
    exercise_id BIGINT UNSIGNED NOT NULL,
    sets        INT             NOT NULL,
    reps        INT             NOT NULL,
    weight_kg   DECIMAL(6, 2)  NULL,
    notes       TEXT,
    order_index INT             NOT NULL DEFAULT 0,
    CONSTRAINT fk_se_session  FOREIGN KEY (session_id)  REFERENCES workout_sessions (id) ON DELETE CASCADE,
    CONSTRAINT fk_se_exercise FOREIGN KEY (exercise_id) REFERENCES exercises (id),
    INDEX idx_se_session_id (session_id)
);

-- ── 7. workout_logs ───────────────────────────────────────────
CREATE TABLE workout_logs
(
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT UNSIGNED NOT NULL,
    plan_id           BIGINT UNSIGNED NULL,
    session_id        BIGINT UNSIGNED NULL,
    plan_name_snap    VARCHAR(150)    NULL,
    session_name_snap VARCHAR(150)    NULL,
    completed_date    DATE            NOT NULL,
    notes             TEXT,
    created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wl_user    FOREIGN KEY (user_id)    REFERENCES users (id)            ON DELETE CASCADE,
    CONSTRAINT fk_wl_plan    FOREIGN KEY (plan_id)    REFERENCES workout_plans (id)    ON DELETE SET NULL,
    CONSTRAINT fk_wl_session FOREIGN KEY (session_id) REFERENCES workout_sessions (id) ON DELETE SET NULL,
    INDEX idx_wl_user_id (user_id),
    INDEX idx_wl_user_date (user_id, completed_date),
    INDEX idx_wl_plan_id (plan_id)
);

-- ── 8. workout_log_entries ────────────────────────────────────
CREATE TABLE workout_log_entries
(
    id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    log_id             BIGINT UNSIGNED NOT NULL,
    exercise_id        BIGINT UNSIGNED NULL,
    exercise_name_snap VARCHAR(150)    NOT NULL,
    actual_sets        INT             NOT NULL,
    actual_reps        INT             NOT NULL,
    actual_weight_kg   DECIMAL(6, 2)  NULL,
    notes              TEXT,
    CONSTRAINT fk_wle_log      FOREIGN KEY (log_id)      REFERENCES workout_logs (id) ON DELETE CASCADE,
    CONSTRAINT fk_wle_exercise FOREIGN KEY (exercise_id) REFERENCES exercises (id)    ON DELETE SET NULL,
    INDEX idx_wle_log_id (log_id),
    INDEX idx_wle_exercise_id (exercise_id)
);
