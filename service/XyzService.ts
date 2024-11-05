import {response} from "express";

export interface IVerifyRequest {
    msgID: string;
    text: string;
}

class XyzService {
    verify(request: IVerifyRequest): Promise<IVerifyRequest> {
        return fetch(process.env.XYZ_VERIFI_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(request)
        }).then<IVerifyRequest>(response => {
            if (response.ok) return response.json()

            return Promise.reject(response);
        }).catch(async (response) => {
            const body = await response.json()
            console.log(body);

            throw Error(`Error on verify process: code: [${response.status}]`)
        })
    }
}

export default new XyzService();