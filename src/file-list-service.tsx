import React from 'react';
import {
    callService,
    LISTFILES_MODE,
    Middleware,
    Service,
    serviceWithStorage
} from 'infrastructure-components';

import {SENDER_EMAIL} from './index';
import { FILE_STORAGE_ID } from './file-storage';
const EMAIL_SERVICE_ID = "emailservice";

export async function sendEmail (emailAddress: string, folder: string) {

    return callService(EMAIL_SERVICE_ID, {
        emailAddress: emailAddress,
        folder: folder
    }, (response) => {}, (error) => {
        console.log("error: ", error)
    });
}

export default function EmailService (props) {

    return <Service
        id={ EMAIL_SERVICE_ID }
        path="/email"
        method="POST">

        <Middleware
            callback={serviceWithStorage(async function (listFiles, req, res, next) {
                const {emailAddress, folder} = JSON.parse(req.body);

                const files = await new Promise((resolve, reject) => {
                    listFiles (
                        FILE_STORAGE_ID, //storageId: string,
                        folder, //prefix: string,
                        LISTFILES_MODE.FILES, //listMode: string,
                        {}, //data: any,
                        ({data,  files}) => {
                            resolve(files.map(item => item.file));
                        },
                        (err: string) => {
                            reject(err);
                        },

                    );
                });

                console.log(files);


                await new Promise(function (resolve, reject) {
                    const AWS = require('aws-sdk');
                    new AWS.SES({apiVersion: '2010-12-01'}).sendEmail({
                        Destination: {
                            BccAddresses: [],
                            CcAddresses: [],
                            ToAddresses: [emailAddress]
                        },
                        Message: {
                            Body: {
                                Html: {
                                    Charset: "UTF-8",
                                    Data: `Hello ${emailAddress}! Here are your files: ${files}`
                                },
                                Text: {
                                    Charset: "UTF-8",
                                    Data: `Hello ${emailAddress}! Here are your files: ${files}`
                                }
                            },
                            Subject: {
                                Charset: 'UTF-8',
                                Data: `Hello ${emailAddress}!`
                            }
                        },
                        Source: SENDER_EMAIL,
                        ReplyToAddresses: [SENDER_EMAIL],
                    }).promise().then(data => {
                        res.status(200).set({"Access-Control-Allow-Origin": "*",}).send("ok");
                        resolve();
                    }).catch(err => {
                        console.error(err, err.stack);
                        res.status(500).set({"Access-Control-Allow-Origin": "*",}).send("failed");
                        reject(err);
                    });
                });
            })}/>
    </Service>
}