import 'dotenv/config'

export const environment = {
  httpPort: process.env.PORT ? process.env.PORT : 8089,
  openAI_key: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : '',
  openAI_OrgID: process.env.OPENAI_API_ORG_ID ? process.env.OPENAI_API_ORG_ID : '',
};

