export interface ICentralRequest {
    task: string,
    apikey: string,
    answer: any,
}

export interface ICentralResponse {
    code: number,
    message: string,
}

class CentralService {
    report(request: ICentralRequest): Promise<ICentralResponse> {
        return fetch(process.env.CENTRAL_REPORT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(request)
        }).then<ICentralResponse>(response => {
            if (response.ok) return response.json()

            return Promise.reject(response);
        }).catch(async (response) => {
            const body = await response.json()
            console.log(body);

            throw Error(`Error on Central report process: code: [${response.status}]`)
        })
    }

    data<T>(suffix: string): Promise<T> {
        return fetch(`${process.env.CENTRAL_DATA}/${process.env.AI_DEVS_KEY}/${suffix}`, {
            headers: {
                'Accept': 'application/json',
            },
        }).then<T>(response => {
            if (response.ok) return response.json()

            return Promise.reject(response);
        }).catch(async (response) => {
            const body = await response.json()
            console.log(body);

            throw Error(`Error on fetch data from central process: code: [${response.status}]`)
        })
    }
}

export default new CentralService();