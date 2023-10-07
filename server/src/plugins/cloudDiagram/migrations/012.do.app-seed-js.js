module.exports.generateSql = () => {
  return `
    INSERT INTO workspace (org_id, project_id, workspace_id)
    VALUES (
              'org-alice',
              'project-alice',
              'dev'
          );
    INSERT INTO cloud_authentication (org_id, project_id, workspace_id, provider_type, env_vars)
    VALUES (
            'org-alice',
            'project-alice',
            'dev',
            'aws',
            '{
              "AWS_REGION": "${process.env.AWS_REGION}",
              "AWSAccessKeyId": "${process.env.AWSAccessKeyId}",
              "AWSSecretKey": "${process.env.AWSSecretKey}"
            }'
        );
    INSERT INTO run (org_id, project_id, workspace_id, status, kind)
    VALUES (
            'org-alice',
            'project-alice',
            'dev',
            'started',
            'list'
        );
          `;
};
