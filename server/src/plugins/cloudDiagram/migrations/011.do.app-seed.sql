-- alice
-- org
INSERT INTO org (org_id, org_name)
VALUES ('org-alice', 'org alice');
INSERT INTO user_orgs (org_id, user_id)
VALUES ('org-alice', 'alice-1234567890');
-- project aws
INSERT INTO project (org_id, project_id, project_name)
VALUES (
        'org-alice',
        'project-aws',
        'alice project'
    );
-- project azure
INSERT INTO project (org_id, project_id, project_name)
VALUES (
        'org-alice',
        'project-azure',
        'project azure'
    );
-- project google
INSERT INTO project (org_id, project_id, project_name)
VALUES (
        'org-alice',
        'project-google',
        'project google'
    );
-- workspace aws
INSERT INTO workspace (org_id, project_id, workspace_id)
VALUES (
        'org-alice',
        'project-aws',
        'dev'
    );
-- workspace azure
INSERT INTO workspace (org_id, project_id, workspace_id)
VALUES (
        'org-alice',
        'project-azure',
        'dev'
    );
-- workspace google
INSERT INTO workspace (org_id, project_id, workspace_id)
VALUES (
        'org-alice',
        'project-google',
        'dev'
    );
-- run
INSERT INTO run (org_id, project_id, workspace_id, status, kind)
VALUES (
        'org-alice',
        'project-aws',
        'dev',
        'started',
        'list'
    );
-- bob
INSERT INTO org (org_id, org_name)
VALUES ('org-bob', 'org bob');
INSERT INTO user_orgs (org_id, user_id)
VALUES ('org-bob', 'bob-1234567890');
INSERT INTO project (org_id, project_id, project_name)
VALUES (
        'org-bob',
        'project-bob',
        'bob project'
    );