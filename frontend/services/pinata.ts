import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';

const key: string = process.env.NEXT_PUBLIC_PINATA_KEY as string;
const secret: string = process.env.NEXT_PUBLIC_PINATA_SECRET as string;

interface PinataResponse {
    success: boolean;
    pinataURL?: string;
    message?: string;
}

export const uploadJSONToIPFS = async (JSONBody: object): Promise<PinataResponse> => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    
    try {
        const response: AxiosResponse = await axios.post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            },
        });
        
        return {
            success: true,
            pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false
        };
    }
};

export const uploadFileToIPFS = async (file: File | null): Promise<PinataResponse> => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    
    const data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue',
        },
    });
    data.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1,
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2,
                },
            ],
        },
    });
    data.append('pinataOptions', pinataOptions);

    try {
        const response: AxiosResponse = await axios.post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            },
        });

        console.log('image uploaded', response.data.IpfsHash);
        return {
            success: true,
            pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false
        };
    }
};
