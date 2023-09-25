module.exports.generateSql = () => {
  return `
    INSERT INTO workspace (workspace_id, project_id, workspace_name, env_vars)
    VALUES (
              'workspace-project-alice-dev',
              'project-alice',
              'Workspace dev alice',
              '{
                "AWS_REGION": "${process.env.AWS_REGION}",
                "AWSAccessKeyId": "${process.env.AWSAccessKeyId}",
                "AWSSecretKey": "${process.env.AWSSecretKey}"
              }'
          );
    INSERT INTO run (run_id, workspace_id, status, kind)
    VALUES (
            'run-1-alice',
            'workspace-project-alice-dev',
            'started',
            'list'
        );
          `;
};
