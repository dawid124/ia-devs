import { ICentralRequest, ICentralResponse } from './types';

class CentralService {
    report(request: ICentralRequest): Promise<ICentralResponse> {
        const url = process.env.CENTRAL_REPORT;
        if (!url) {
            return Promise.reject(new Error('CENTRAL_REPORT environment variable is not defined'));
        }

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(request),
        })
            .then<ICentralResponse>(response => {
                if (response.ok) return response.json();
                return Promise.reject(response);
            })
            .catch(async response => {
                const body = await response.json();
                console.log(body);
                throw Error(`Error on Central report process: code: [${response.status}]`);
            });
    }

    dataJson<T>(suffix: string): Promise<T> {
        const baseUrl = process.env.CENTRAL_DATA;
        const apiKey = process.env.AI_DEVS_KEY;

        if (!baseUrl || !apiKey) {
            return Promise.reject(
                new Error(
                    'Required environment variables are not defined CENTRAL_DATA and AI_DEVS_KEY'
                )
            );
        }

        return fetch(`${baseUrl}/${apiKey}/${suffix}`, {
            headers: {
                Accept: 'application/json',
            },
        })
            .then<T>(response => {
                if (response.ok) return response.json();
                return Promise.reject(response);
            })
            .catch(async response => {
                const body = await response.json();
                console.log(body);
                throw Error(`Error on fetch data from central process: code: [${response.status}]`);
            });
    }
    dataText(suffix: string): Promise<string> {
        const baseUrl = process.env.CENTRAL_DATA;
        const apiKey = process.env.AI_DEVS_KEY;

        if (!baseUrl || !apiKey) {
            return Promise.reject(
                new Error(
                    'Required environment variables are not defined CENTRAL_DATA and AI_DEVS_KEY'
                )
            );
        }

        return fetch(`${baseUrl}/${apiKey}/${suffix}`)
            .then<T>(response => {
                if (response.ok) return response.text();
                return Promise.reject(response);
            })
            .catch(async response => {
                const body = await response.text();
                console.log(body);
                throw Error(`Error on fetch data from central process: code: [${response.status}]`);
            });
    }
}

export default new CentralService();
