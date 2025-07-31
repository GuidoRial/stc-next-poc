import { APIResponse, Config } from './types/api';
import stcApi from './instances/stc';

const configService = {
  /**
   * Get application configuration
   */
  getConfig(): Promise<APIResponse<Config>> {
    return stcApi.get('/configs').then((res) => res.data);
  },

  /**
   * Update application configuration (admin only)
   */
  updateConfig(config: Partial<Config>): Promise<APIResponse<Config>> {
    return stcApi.put('/configs', config).then((res) => res.data);
  },

  /**
   * Get specific config value by key
   */
  getConfigValue(key: string): Promise<APIResponse<unknown>> {
    return stcApi.get(`/configs/${key}`).then((res) => res.data);
  },
};

export default configService;