import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {isUrl} from '@/lib/string';
// import getConfig from 'next/config';
import {api} from '../apiPath';

export const TOKEN = 'userToken';
export const USERDATA = 'usercdata';

export class APIRequest {
  static token = '';

  static API_ENDPOINT = null;

  setAuthHeaderToken(token) {
    APIRequest.token = token;
  }

  //   getBaseApiEndpoint() {
  //     const {API_ENDPOINT} = APIRequest;
  //     if (API_ENDPOINT) return API_ENDPOINT;
  //     const {publicRuntimeConfig} = getConfig();
  //     return publicRuntimeConfig.API_ENDPOINT;
  //   }

  async request(url, method = 'get', body = null, headers = {}) {
    const token = await AsyncStorage.getItem(TOKEN);
    const updatedHeader = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // 'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
      ...(headers || {}),
    };

    const response = await axios({
      method,
      url: `${api}/api${url}`,
      data: body,
      headers: updatedHeader,
    });

    return response;
  }

  buildUrl(baseUrl, params = {}) {
    const queryString = Object.keys(params)
      .map(k => {
        if (Array.isArray(params[k])) {
          return params[k]
            .map(
              param => `${encodeURIComponent(k)}=${encodeURIComponent(param)}`,
            )
            .join('&');
        }
        return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
      })
      .join('&');

    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  get(url, headers, params = null) {
    return this.request(url, 'get', params, headers);
  }

  post(url, data, headers) {
    return this.request(url, 'post', data, headers);
  }

  put(url, data, headers) {
    return this.request(url, 'put', data, headers);
  }

  delete(url, data, headers) {
    return this.request(url, 'delete', data, headers);
  }

  // Upload function remains same as before, with XMLHttpRequest
  //   upload(url, files, options = {onProgress() {}, method: 'POST'}) {
  //     const {publicRuntimeConfig: config} = getConfig();
  //     const uploadUrl = isUrl(url) ? url : new URL(url, config.API_ENDPOINT).href;
  //     return new Promise(async (resolve, reject) => {
  //       const req = new XMLHttpRequest();

  //       req.upload.addEventListener('progress', event => {
  //         if (event.lengthComputable) {
  //           options.onProgress({
  //             percentage: (event.loaded / event.total) * 100,
  //           });
  //         }
  //       });

  //       req.addEventListener('load', () => {
  //         const success = req.status >= 200 && req.status < 300;
  //         const {response} = req;
  //         if (!success) {
  //           return reject(response);
  //         }
  //         return resolve(response);
  //       });

  //       req.upload.addEventListener('error', () => {
  //         reject(req.response);
  //       });

  //       const formData = new FormData();
  //       files.forEach(f => formData.append(f.fieldname, f.file, f.file.name));
  //       options.customData &&
  //         Object.keys(options.customData).forEach(fieldname => {
  //           if (
  //             typeof options.customData[fieldname] !== 'undefined' &&
  //             !Array.isArray(options.customData[fieldname])
  //           )
  //             formData.append(fieldname, options.customData[fieldname]);
  //           if (
  //             typeof options.customData[fieldname] !== 'undefined' &&
  //             Array.isArray(options.customData[fieldname])
  //           ) {
  //             if (options.customData[fieldname].length) {
  //               for (
  //                 let i = 0;
  //                 i < options.customData[fieldname].length;
  //                 i += 1
  //               ) {
  //                 formData.append(fieldname, options.customData[fieldname][i]);
  //               }
  //             }
  //           }
  //         });

  //       req.responseType = 'json';
  //       req.open(options.method || 'POST', uploadUrl);

  //       const token = await AsyncStorage.getItem(TOKEN);
  //       req.setRequestHeader('Authorization', token || '');
  //       req.send(formData);
  //     });
  //   }
}
