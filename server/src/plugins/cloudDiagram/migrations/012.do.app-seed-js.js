module.exports.generateSql = () => {
  return `
INSERT INTO cloud_authentication (org_id, project_id, workspace_id, provider_type, env_vars)
VALUES (
        'org-alice',
        'project-aws',
        'dev',
        'aws',
        '{
          "AWS_REGION": "${process.env.AWS_REGION}",
          "AWSAccessKeyId": "${process.env.AWSAccessKeyId}",
          "AWSSecretKey": "${process.env.AWSSecretKey}"
        }'
    );
INSERT INTO cloud_authentication (org_id, project_id, workspace_id, provider_type, env_vars)
VALUES (
        'org-alice',
        'project-azure',
        'dev',
        'azure',
        '{
          "AZURE_TENANT_ID": "${process.env.AZURE_TENANT_ID}",
          "AZURE_SUBSCRIPTION_ID": "${process.env.AZURE_SUBSCRIPTION_ID}",
          "AZURE_CLIENT_ID": "${process.env.AZURE_CLIENT_ID}",
          "AZURE_CLIENT_SECRET": "${process.env.AZURE_CLIENT_SECRET}",
          "AZURE_OBJECT_ID": "${process.env.AZURE_OBJECT_ID}",
          "AZURE_LOCATION": "${process.env.AZURE_LOCATION}"

        }'
    );
          `;
};
