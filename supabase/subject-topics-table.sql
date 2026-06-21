-- ============================================
-- SUBJECT_TOPICS TABLE
-- Stores all topics for each subject
-- ============================================

DROP TABLE IF EXISTS public.subject_topics CASCADE;

CREATE TABLE public.subject_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    difficulty VARCHAR(20) DEFAULT 'medium',
    estimated_hours DECIMAL(4,1) DEFAULT 2,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subject, topic)
);

-- Indexes
CREATE INDEX idx_subject_topics_subject ON public.subject_topics(subject);
CREATE INDEX idx_subject_topics_category ON public.subject_topics(category);
CREATE INDEX idx_subject_topics_difficulty ON public.subject_topics(difficulty);

-- Grant read access
GRANT SELECT ON public.subject_topics TO authenticated;
GRANT SELECT ON public.subject_topics TO anon;

-- ============================================
-- INSERT TOPICS DATA
-- ============================================

-- MATHEMATICS TOPICS (36 topics)
INSERT INTO public.subject_topics (subject, topic, category, difficulty, estimated_hours) VALUES
('Mathematics', 'Number Bases', 'Number and Numeration', 'easy', 2),
('Mathematics', 'Fractions and Decimals', 'Number and Numeration', 'easy', 2),
('Mathematics', 'Indices', 'Number and Numeration', 'medium', 2),
('Mathematics', 'Logarithms', 'Number and Numeration', 'medium', 3),
('Mathematics', 'Surds', 'Number and Numeration', 'medium', 2),
('Mathematics', 'Modular Arithmetic', 'Number and Numeration', 'medium', 2),
('Mathematics', 'Sets', 'Number and Numeration', 'easy', 2),
('Mathematics', 'Algebraic Foundations', 'Algebra', 'easy', 2),
('Mathematics', 'Algebraic Expressions', 'Algebra', 'easy', 2),
('Mathematics', 'Factorization', 'Algebra', 'medium', 2),
('Mathematics', 'Linear Equations', 'Algebra', 'easy', 2),
('Mathematics', 'Quadratic Equations', 'Algebra', 'medium', 3),
('Mathematics', 'Simultaneous Equations', 'Algebra', 'medium', 3),
('Mathematics', 'Inequalities', 'Algebra', 'medium', 2),
('Mathematics', 'Functions', 'Algebra', 'medium', 3),
('Mathematics', 'Polynomials', 'Algebra', 'hard', 3),
('Mathematics', 'Sequences and Series', 'Algebra', 'medium', 3),
('Mathematics', 'Geometry Basics', 'Geometry', 'easy', 2),
('Mathematics', 'Angles and Polygons', 'Geometry', 'medium', 2),
('Mathematics', 'Circles', 'Geometry', 'medium', 3),
('Mathematics', 'Mensuration', 'Geometry', 'medium', 3),
('Mathematics', 'Coordinate Geometry', 'Geometry', 'medium', 3),
('Mathematics', 'Trigonometry', 'Trigonometry', 'medium', 3),
('Mathematics', 'Trigonometric Identities', 'Trigonometry', 'hard', 3),
('Mathematics', 'Differentiation', 'Calculus', 'hard', 4),
('Mathematics', 'Integration', 'Calculus', 'hard', 4),
('Mathematics', 'Applications of Calculus', 'Calculus', 'hard', 3),
('Mathematics', 'Probability', 'Statistics', 'medium', 3),
('Mathematics', 'Statistics', 'Statistics', 'medium', 3),
('Mathematics', 'Permutations and Combinations', 'Statistics', 'medium', 2),
('Mathematics', 'Vectors', 'Vectors', 'medium', 3),
('Mathematics', 'Matrices', 'Matrices', 'medium', 3),
('Mathematics', 'Determinants', 'Matrices', 'medium', 2),
('Mathematics', 'Binary Operations', 'Number and Numeration', 'medium', 2),
('Mathematics', 'Word Problems', 'Problem Solving', 'medium', 3),
('Mathematics', 'Mathematical Reasoning', 'Problem Solving', 'medium', 2);

-- ENGLISH LANGUAGE TOPICS (34 topics)
INSERT INTO public.subject_topics (subject, topic, category, difficulty, estimated_hours) VALUES
('English Language', 'Parts of Speech', 'Grammar', 'easy', 3),
('English Language', 'Nouns and Types', 'Grammar', 'easy', 2),
('English Language', 'Pronouns', 'Grammar', 'easy', 2),
('English Language', 'Verbs and Tenses', 'Grammar', 'medium', 4),
('English Language', 'Adjectives', 'Grammar', 'easy', 2),
('English Language', 'Adverbs', 'Grammar', 'easy', 2),
('English Language', 'Prepositions', 'Grammar', 'medium', 2),
('English Language', 'Conjunctions', 'Grammar', 'easy', 2),
('English Language', 'Sentence Structure', 'Sentence Structure', 'easy', 2),
('English Language', 'Sentence Types', 'Sentence Structure', 'easy', 2),
('English Language', 'Phrases and Clauses', 'Sentence Structure', 'medium', 3),
('English Language', 'Punctuation', 'Mechanics', 'easy', 2),
('English Language', 'Capitalization', 'Mechanics', 'easy', 1),
('English Language', 'Spelling Rules', 'Mechanics', 'easy', 2),
('English Language', 'Vocabulary Building', 'Vocabulary', 'medium', 3),
('English Language', 'Synonyms and Antonyms', 'Vocabulary', 'easy', 2),
('English Language', 'Idioms and Expressions', 'Vocabulary', 'medium', 3),
('English Language', 'Figures of Speech', 'Vocabulary', 'medium', 2),
('English Language', 'Comprehension', 'Comprehension', 'medium', 3),
('English Language', 'Summary Writing', 'Comprehension', 'medium', 3),
('English Language', 'Paragraph Development', 'Writing', 'medium', 2),
('English Language', 'Essay Writing', 'Writing', 'medium', 4),
('English Language', 'Letter Writing', 'Writing', 'medium', 2),
('English Language', 'Article Writing', 'Writing', 'medium', 2),
('English Language', 'Speech Writing', 'Writing', 'medium', 2),
('English Language', 'Report Writing', 'Writing', 'medium', 2),
('English Language', 'Debate Writing', 'Writing', 'medium', 2),
('English Language', 'Narrative Essays', 'Writing', 'medium', 2),
('English Language', 'Descriptive Essays', 'Writing', 'medium', 2),
('English Language', 'Argumentative Essays', 'Writing', 'medium', 2),
('English Language', 'Expository Essays', 'Writing', 'medium', 2),
('English Language', 'Oral English', 'Oral English', 'medium', 3),
('English Language', 'Stress and Intonation', 'Oral English', 'medium', 2),
('English Language', 'Speech Sounds', 'Oral English', 'medium', 2);

-- PHYSICS TOPICS (36 topics)
INSERT INTO public.subject_topics (subject, topic, category, difficulty, estimated_hours) VALUES
('Physics', 'Fundamental Quantities', 'Measurements', 'easy', 2),
('Physics', 'Units and Dimensions', 'Measurements', 'easy', 2),
('Physics', 'Measurement Errors', 'Measurements', 'easy', 2),
('Physics', 'Scalars and Vectors', 'Measurements', 'medium', 3),
('Physics', 'Position and Motion', 'Mechanics', 'easy', 2),
('Physics', 'Equations of Motion', 'Mechanics', 'medium', 3),
('Physics', 'Projectile Motion', 'Mechanics', 'medium', 3),
('Physics', 'Newton Laws of Motion', 'Mechanics', 'medium', 4),
('Physics', 'Friction', 'Mechanics', 'medium', 2),
('Physics', 'Work, Energy and Power', 'Mechanics', 'medium', 3),
('Physics', 'Momentum', 'Mechanics', 'medium', 3),
('Physics', 'Circular Motion', 'Mechanics', 'hard', 3),
('Physics', 'Simple Harmonic Motion', 'Mechanics', 'hard', 3),
('Physics', 'Equilibrium', 'Mechanics', 'medium', 2),
('Physics', 'Simple Machines', 'Mechanics', 'medium', 2),
('Physics', 'Density and Upthrust', 'Properties of Matter', 'medium', 2),
('Physics', 'Pressure', 'Properties of Matter', 'medium', 2),
('Physics', 'Elasticity', 'Properties of Matter', 'medium', 2),
('Physics', 'Surface Tension', 'Properties of Matter', 'medium', 2),
('Physics', 'Viscosity', 'Properties of Matter', 'medium', 2),
('Physics', 'Temperature and Heat', 'Thermal Physics', 'medium', 3),
('Physics', 'Thermometry', 'Thermal Physics', 'easy', 2),
('Physics', 'Thermal Expansion', 'Thermal Physics', 'medium', 2),
('Physics', 'Gas Laws', 'Thermal Physics', 'medium', 3),
('Physics', 'Heat Transfer', 'Thermal Physics', 'medium', 3),
('Physics', 'Wave Motion', 'Waves', 'medium', 3),
('Physics', 'Sound Waves', 'Waves', 'medium', 2),
('Physics', 'Light Waves', 'Waves', 'medium', 3),
('Physics', 'Reflection and Refraction', 'Optics', 'medium', 3),
('Physics', 'Lenses and Mirrors', 'Optics', 'medium', 3),
('Physics', 'Electrostatics', 'Electricity', 'medium', 3),
('Physics', 'Electric Current', 'Electricity', 'easy', 2),
('Physics', 'Electrical Circuits', 'Electricity', 'medium', 3),
('Physics', 'Magnetism', 'Magnetism', 'medium', 2),
('Physics', 'Electromagnetic Induction', 'Magnetism', 'hard', 3),
('Physics', 'Modern Physics', 'Modern Physics', 'hard', 3);

-- CHEMISTRY TOPICS (30 topics)
INSERT INTO public.subject_topics (subject, topic, category, difficulty, estimated_hours) VALUES
('Chemistry', 'Nature of Matter', 'Introduction', 'easy', 2),
('Chemistry', 'Atomic Structure', 'Atomic Structure', 'medium', 3),
('Chemistry', 'Periodic Table', 'Periodic Table', 'medium', 3),
('Chemistry', 'Periodic Trends', 'Periodic Table', 'medium', 2),
('Chemistry', 'Chemical Bonding', 'Chemical Bonding', 'medium', 3),
('Chemistry', 'Ionic Bonding', 'Chemical Bonding', 'medium', 2),
('Chemistry', 'Covalent Bonding', 'Chemical Bonding', 'medium', 2),
('Chemistry', 'Metallic Bonding', 'Chemical Bonding', 'medium', 2),
('Chemistry', 'Chemical Formulae', 'Chemical Reactions', 'easy', 2),
('Chemistry', 'Chemical Equations', 'Chemical Reactions', 'medium', 2),
('Chemistry', 'Balancing Equations', 'Chemical Reactions', 'medium', 3),
('Chemistry', 'Types of Reactions', 'Chemical Reactions', 'medium', 2),
('Chemistry', 'Stoichiometry', 'Chemical Reactions', 'hard', 3),
('Chemistry', 'Acids and Bases', 'Acids and Bases', 'medium', 3),
('Chemistry', 'pH and Indicators', 'Acids and Bases', 'medium', 2),
('Chemistry', 'Salts', 'Acids and Bases', 'medium', 2),
('Chemistry', 'Oxidation and Reduction', 'Redox Reactions', 'medium', 3),
('Chemistry', 'Electrochemistry', 'Redox Reactions', 'hard', 3),
('Chemistry', 'Gas Laws', 'States of Matter', 'medium', 2),
('Chemistry', 'Kinetic Theory', 'States of Matter', 'medium', 2),
('Chemistry', 'Solutions', 'States of Matter', 'medium', 2),
('Chemistry', 'Solubility', 'States of Matter', 'medium', 2),
('Chemistry', 'Rate of Reaction', 'Reaction Kinetics', 'hard', 3),
('Chemistry', 'Equilibrium', 'Reaction Kinetics', 'hard', 3),
('Chemistry', 'Thermochemistry', 'Thermochemistry', 'hard', 3),
('Chemistry', 'Organic Chemistry Basics', 'Organic Chemistry', 'medium', 3),
('Chemistry', 'Hydrocarbons', 'Organic Chemistry', 'medium', 3),
('Chemistry', 'Functional Groups', 'Organic Chemistry', 'hard', 3),
('Chemistry', 'Polymers', 'Organic Chemistry', 'medium', 2),
('Chemistry', 'Environmental Chemistry', 'Applied Chemistry', 'medium', 2);

-- BIOLOGY TOPICS (39 topics)
INSERT INTO public.subject_topics (subject, topic, category, difficulty, estimated_hours) VALUES
('Biology', 'Characteristics of Living Things', 'Introduction', 'easy', 2),
('Biology', 'Classification of Living Things', 'Introduction', 'easy', 2),
('Biology', 'Cell Structure', 'Cell Biology', 'medium', 3),
('Biology', 'Cell Theory', 'Cell Biology', 'easy', 2),
('Biology', 'Cell Division Mitosis', 'Cell Biology', 'medium', 3),
('Biology', 'Cell Division Meiosis', 'Cell Biology', 'medium', 3),
('Biology', 'Movement of Substances', 'Cell Biology', 'medium', 2),
('Biology', 'Nutrition in Plants', 'Nutrition', 'medium', 3),
('Biology', 'Photosynthesis', 'Nutrition', 'medium', 3),
('Biology', 'Nutrition in Animals', 'Nutrition', 'medium', 3),
('Biology', 'Digestive System', 'Nutrition', 'medium', 3),
('Biology', 'Transport in Plants', 'Transport', 'medium', 3),
('Biology', 'Transport in Animals', 'Transport', 'medium', 3),
('Biology', 'Circulatory System', 'Transport', 'medium', 3),
('Biology', 'Respiration', 'Respiration', 'medium', 3),
('Biology', 'Respiratory System', 'Respiration', 'medium', 3),
('Biology', 'Excretion', 'Excretion', 'medium', 3),
('Biology', 'Excretory System', 'Excretion', 'medium', 2),
('Biology', 'Support and Movement', 'Support', 'medium', 2),
('Biology', 'Skeleton', 'Support', 'medium', 3),
('Biology', 'Muscles', 'Support', 'medium', 2),
('Biology', 'Nervous System', 'Coordination', 'medium', 3),
('Biology', 'Sense Organs', 'Coordination', 'medium', 2),
('Biology', 'Hormones', 'Coordination', 'medium', 3),
('Biology', 'Reproduction in Plants', 'Reproduction', 'medium', 3),
('Biology', 'Reproduction in Animals', 'Reproduction', 'medium', 3),
('Biology', 'Reproductive System', 'Reproduction', 'medium', 3),
('Biology', 'Genetics', 'Genetics', 'hard', 4),
('Biology', 'Heredity', 'Genetics', 'medium', 3),
('Biology', 'Variation', 'Genetics', 'medium', 2),
('Biology', 'Evolution', 'Evolution', 'hard', 3),
('Biology', 'Adaptation', 'Evolution', 'medium', 2),
('Biology', 'Ecosystems', 'Ecology', 'medium', 3),
('Biology', 'Food Chains and Webs', 'Ecology', 'medium', 2),
('Biology', 'Ecological Pyramids', 'Ecology', 'medium', 2),
('Biology', 'Nutrient Cycles', 'Ecology', 'medium', 3),
('Biology', 'Population', 'Ecology', 'medium', 2),
('Biology', 'Microorganisms', 'Microbiology', 'medium', 3),
('Biology', 'Diseases', 'Health', 'medium', 2);

-- ============================================
-- DONE! Subject topics table created with 175 topics
-- ============================================
