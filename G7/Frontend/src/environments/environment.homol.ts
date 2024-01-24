export const environment = {
  production: true,
  attachments: {
    BRIDGE: 'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/',
    NEW_ATTACHMENT:
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/workflow/actions/newAttachment',
    COMMIT_ATTACHMENT:
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/workflow/actions/commitAttachment',
    LINK_ATTACHMENTS:
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/workflow/actions/linkAttachments',
    REQUEST_ATTACHMENT_ACCESS:
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/workflow/queries/requestAttachmentAccess',
    GET_ATTACHMENTS:
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/workflow/queries/getAttachments',
  },
  user: {
    GET_USER:
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/user/queries/getUser',
    GET_ROLES:
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/authorization/queries/getUserDetailRoles',
  },
  backend: {
    baseUrl: 'api/v1',
  },

  plugin: {
    invoke:
      'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/conector/actions/invoke',
  },

  webService: {
    baseUrl: 'https://webcarrefourhml.seniorcloud.com.br:8181',
    id: 'f2200c3b-c7df-4040-9613-34f697b75889',
    configurationId: '46e8db60-56ea-4807-b311-7a2ade9bcda2',
    module: 'rubi',
    service: 'com.senior.automacao.hcm.geral',
    encryption: '3',
  },
  domains: {
    platform: 'https://platform.senior.com.br',
  },
};
