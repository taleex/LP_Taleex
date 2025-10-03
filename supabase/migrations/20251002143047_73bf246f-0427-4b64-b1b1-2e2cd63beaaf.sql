-- Clear existing skills and categories
DELETE FROM skills;
DELETE FROM skill_categories;

-- Create new skill categories
INSERT INTO skill_categories (name, order_index) VALUES
('Frontend / Web Development', 1),
('Backend / Databases / APIs', 2),
('Tools & DevOps / Automation', 3),
('Emerging / AI & Projects', 4);

-- Insert skills for Frontend / Web Development
INSERT INTO skills (name, icon, category_id, order_index)
SELECT 'Bubble.io', 'SiBubble', id, 1 FROM skill_categories WHERE name = 'Frontend / Web Development'
UNION ALL
SELECT 'React.js', 'SiReact', id, 2 FROM skill_categories WHERE name = 'Frontend / Web Development'
UNION ALL
SELECT 'TypeScript', 'SiTypescript', id, 3 FROM skill_categories WHERE name = 'Frontend / Web Development'
UNION ALL
SELECT 'JavaScript', 'SiJavascript', id, 4 FROM skill_categories WHERE name = 'Frontend / Web Development'
UNION ALL
SELECT 'HTML', 'SiHtml5', id, 5 FROM skill_categories WHERE name = 'Frontend / Web Development'
UNION ALL
SELECT 'CSS', 'SiCss3', id, 6 FROM skill_categories WHERE name = 'Frontend / Web Development'
UNION ALL
SELECT 'Figma', 'SiFigma', id, 7 FROM skill_categories WHERE name = 'Frontend / Web Development'
UNION ALL
SELECT 'Bootstrap', 'SiBootstrap', id, 8 FROM skill_categories WHERE name = 'Frontend / Web Development'
UNION ALL
SELECT 'AJAX', 'SiJquery', id, 9 FROM skill_categories WHERE name = 'Frontend / Web Development';

-- Insert skills for Backend / Databases / APIs
INSERT INTO skills (name, icon, category_id, order_index)
SELECT 'SQL', 'SiMysql', id, 1 FROM skill_categories WHERE name = 'Backend / Databases / APIs'
UNION ALL
SELECT 'Supabase', 'SiSupabase', id, 2 FROM skill_categories WHERE name = 'Backend / Databases / APIs'
UNION ALL
SELECT 'Google BigQuery', 'SiGooglebigquery', id, 3 FROM skill_categories WHERE name = 'Backend / Databases / APIs'
UNION ALL
SELECT 'Metabase', 'SiMetabase', id, 4 FROM skill_categories WHERE name = 'Backend / Databases / APIs'
UNION ALL
SELECT 'OpenAI', 'SiOpenai', id, 5 FROM skill_categories WHERE name = 'Backend / Databases / APIs'
UNION ALL
SELECT 'Pipedrive', 'SiPipedrive', id, 6 FROM skill_categories WHERE name = 'Backend / Databases / APIs'
UNION ALL
SELECT 'Airbyte', 'SiAirbyte', id, 7 FROM skill_categories WHERE name = 'Backend / Databases / APIs'
UNION ALL
SELECT 'Airtable', 'SiAirtable', id, 8 FROM skill_categories WHERE name = 'Backend / Databases / APIs'
UNION ALL
SELECT 'Postman', 'SiPostman', id, 9 FROM skill_categories WHERE name = 'Backend / Databases / APIs';

-- Insert skills for Tools & DevOps / Automation
INSERT INTO skills (name, icon, category_id, order_index)
SELECT 'GitHub', 'SiGithub', id, 1 FROM skill_categories WHERE name = 'Tools & DevOps / Automation'
UNION ALL
SELECT 'Cursor', 'SiCursor', id, 2 FROM skill_categories WHERE name = 'Tools & DevOps / Automation'
UNION ALL
SELECT 'n8n', 'SiN8n', id, 3 FROM skill_categories WHERE name = 'Tools & DevOps / Automation'
UNION ALL
SELECT 'Airbyte', 'SiAirbyte', id, 4 FROM skill_categories WHERE name = 'Tools & DevOps / Automation'
UNION ALL
SELECT 'Microsoft Power Automate', 'SiPowerautomate', id, 5 FROM skill_categories WHERE name = 'Tools & DevOps / Automation';

-- Insert skills for Emerging / AI & Projects
INSERT INTO skills (name, icon, category_id, order_index)
SELECT 'Lovable.dev', 'SiReact', id, 1 FROM skill_categories WHERE name = 'Emerging / AI & Projects'
UNION ALL
SELECT 'Artificial Intelligence', 'SiOpenai', id, 2 FROM skill_categories WHERE name = 'Emerging / AI & Projects';