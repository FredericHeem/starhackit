-- alice
-- org
INSERT INTO org (org_id, org_name)
VALUES ('org-alice', 'org alice');
INSERT INTO user_orgs (org_id, user_id)
VALUES ('org-alice', 'alice-1234567890');
-- git_credential
INSERT INTO git_credential (git_credential_id, org_id, username, password)
VALUES (
        'cred-org-alice',
        'org-alice',
        'alice',
        'password'
    );
-- project
INSERT INTO project (org_id, project_id, project_name)
VALUES (
        'org-alice',
        'project-alice',
        'alice project'
    );
-- git_repository
INSERT INTO git_repository (
        org_id,
        project_id,
        git_repository_id,
        git_credential_id,
        url
    )
VALUES (
        'org-alice',
        'project-alice',
        'repo-alice',
        'cred-org-alice',
        'https://github.com/FredericHeem/grucloud-aws-demo'
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