-- ─────────────────────────────────────────────────────────────
-- V2: Seed system exercises
-- is_system = TRUE means these are read-only reference data
-- ─────────────────────────────────────────────────────────────

INSERT INTO exercises (name, description, category, muscle_group, is_system) VALUES

-- STRENGTH / CHEST
('Barbell Bench Press',    'Classic compound chest press using a barbell on a flat bench.',              'STRENGTH', 'CHEST',     TRUE),
('Incline Dumbbell Press', 'Dumbbell press on an incline bench targeting the upper chest.',              'STRENGTH', 'CHEST',     TRUE),
('Cable Fly',              'Cable crossover isolation movement focusing on chest squeeze.',              'STRENGTH', 'CHEST',     TRUE),
('Chest Dip',              'Bodyweight dip leaning forward to emphasise the lower chest.',               'STRENGTH', 'CHEST',     TRUE),
('Push-Up',                'Classic bodyweight push movement targeting chest, shoulders and triceps.',   'STRENGTH', 'CHEST',     TRUE),
('Pec Deck Machine',       'Machine isolation fly for consistent tension across the chest.',             'STRENGTH', 'CHEST',     TRUE),

-- STRENGTH / BACK
('Deadlift',               'Fundamental compound pull from the floor working the entire posterior chain.', 'STRENGTH', 'BACK',   TRUE),
('Pull-Up',                'Bodyweight vertical pull targeting lats and upper back.',                    'STRENGTH', 'BACK',     TRUE),
('Barbell Row',            'Horizontal barbell row for mid-back thickness.',                             'STRENGTH', 'BACK',     TRUE),
('Seated Cable Row',       'Cable row in a seated position for controlled back contraction.',            'STRENGTH', 'BACK',     TRUE),
('Lat Pulldown',           'Machine vertical pull to develop lat width.',                               'STRENGTH', 'BACK',     TRUE),
('Single-Arm Dumbbell Row','Unilateral row on a bench for balanced back development.',                   'STRENGTH', 'BACK',     TRUE),

-- STRENGTH / LEGS
('Barbell Squat',          'King of leg exercises — compound squat with barbell on upper back.',         'STRENGTH', 'LEGS',     TRUE),
('Romanian Deadlift',      'Hip-hinge movement with a barbell targeting hamstrings and glutes.',         'STRENGTH', 'LEGS',     TRUE),
('Leg Press',              'Machine compound press targeting quads, hamstrings and glutes.',             'STRENGTH', 'LEGS',     TRUE),
('Leg Curl',               'Machine isolation curl for the hamstrings.',                                'STRENGTH', 'LEGS',     TRUE),
('Leg Extension',          'Machine isolation extension for the quadriceps.',                            'STRENGTH', 'LEGS',     TRUE),
('Calf Raise',             'Standing or seated raise to develop the gastrocnemius and soleus.',          'STRENGTH', 'LEGS',     TRUE),

-- STRENGTH / SHOULDERS
('Overhead Press',         'Compound barbell or dumbbell press overhead for shoulder mass.',             'STRENGTH', 'SHOULDERS', TRUE),
('Lateral Raise',          'Dumbbell raise to the side for lateral deltoid width.',                     'STRENGTH', 'SHOULDERS', TRUE),
('Front Raise',            'Dumbbell raise to the front targeting the anterior deltoid.',               'STRENGTH', 'SHOULDERS', TRUE),
('Face Pull',              'Cable pull to the face for rear delts and external rotators.',              'STRENGTH', 'SHOULDERS', TRUE),

-- STRENGTH / ARMS
('Barbell Curl',           'Classic barbell curl for bicep mass and strength.',                         'STRENGTH', 'ARMS',     TRUE),
('Tricep Pushdown',        'Cable pushdown isolation for the triceps.',                                 'STRENGTH', 'ARMS',     TRUE),
('Hammer Curl',            'Neutral-grip dumbbell curl targeting brachialis and brachioradialis.',      'STRENGTH', 'ARMS',     TRUE),
('Skull Crusher',          'Lying barbell or EZ-bar extension for tricep isolation.',                   'STRENGTH', 'ARMS',     TRUE),

-- STRENGTH / CORE
('Plank',                  'Isometric hold targeting the entire anterior core.',                        'STRENGTH', 'CORE',     TRUE),
('Cable Crunch',           'Kneeling cable crunch for weighted core flexion.',                          'STRENGTH', 'CORE',     TRUE),
('Hanging Leg Raise',      'Hanging from a bar, raise legs to work lower abs and hip flexors.',         'STRENGTH', 'CORE',     TRUE),

-- CARDIO / FULL BODY
('Running',                'Steady-state or interval running for cardiovascular endurance.',             'CARDIO',   'FULL_BODY', TRUE),
('Cycling',                'Stationary or outdoor cycling for low-impact cardio.',                      'CARDIO',   'FULL_BODY', TRUE),
('Rowing Machine',         'Full-body cardio on an ergometer targeting back, legs and arms.',            'CARDIO',   'FULL_BODY', TRUE),
('Jump Rope',              'High-intensity skipping for coordination and cardiovascular fitness.',       'CARDIO',   'FULL_BODY', TRUE),

-- FLEXIBILITY / FULL BODY
('Yoga Flow',              'Dynamic sequence of yoga poses improving mobility and flexibility.',         'FLEXIBILITY', 'FULL_BODY', TRUE),
('Hip Flexor Stretch',     'Kneeling lunge stretch releasing tight hip flexors.',                       'FLEXIBILITY', 'FULL_BODY', TRUE),
('Foam Rolling',           'Self-myofascial release using a foam roller to reduce muscle tension.',     'FLEXIBILITY', 'FULL_BODY', TRUE);
