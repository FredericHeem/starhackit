INSERT INTO users (
        user_id,
        email,
        username,
        password_hash,
        user_type
    )
VALUES (
        'user-test-1234567890',
        'test@mail.com',
        'test-user',
        '$2a$10$f3U9QBJ.iBmUIoIQTHl6.ep7xMcufE2lh/uBPoYGkbszloEfIAxhW',
        'basic'
    ),
    (
        'alice-1234567890',
        'alice@mail.com',
        'alice',
        '$2a$10$f3U9QBJ.iBmUIoIQTHl6.ep7xMcufE2lh/uBPoYGkbszloEfIAxhW',
        'basic'
    ),
    (
        'admin-1234567890',
        'admin@mail.com',
        'admin',
        '$2a$10$f3U9QBJ.iBmUIoIQTHl6.ep7xMcufE2lh/uBPoYGkbszloEfIAxhW',
        'admin'
    ),
    (
        'bob-1234567890',
        'bob@mail.com',
        'bob',
        '$2a$10$f3U9QBJ.iBmUIoIQTHl6.ep7xMcufE2lh/uBPoYGkbszloEfIAxhW',
        'admin'
    );
-- alice
INSERT INTO org (org_id, name)
VALUES ('org-alice', 'org alice');
INSERT INTO user_orgs (org_id, user_id)
VALUES ('org-alice', 'alice-1234567890');
INSERT INTO project (org_id, project_id, project_name)
VALUES (
        'org-alice',
        'project-alice',
        'alice project'
    );
-- bob
INSERT INTO org (org_id, name)
VALUES ('org-bob', 'org bob');
INSERT INTO user_orgs (org_id, user_id)
VALUES ('org-bob', 'bob-1234567890');
INSERT INTO project (org_id, project_id, project_name)
VALUES (
        'org-bob',
        'project-bob',
        'bob project'
    );