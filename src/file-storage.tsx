import React from 'react';

import {
    File,
    Storage
} from "infrastructure-components";

import { BookFile } from './file-list';




export default function () {
    return
}

<Service
    id="FILEUPLOAD"
    path="/fileupload"
    method="POST">

    <Middleware
        callback={ async function (req, res, next) {
            const parsedBody = JSON.parse(req.body);

            console.log("this is the service: ", parsedBody.part, " of ", parsedBody.total_parts);

            /*{
             file_data: event.target.result,
             file: file.name,
             file_type: file.type,
             },*/

            const AWS = require('aws-sdk');
            AWS.config.update({region: 'eu-west-1'});
            const s3 = new AWS.S3({
                apiVersion: '2006-03-01',
                s3ForcePathStyle: true,
                accessKeyId: 'S3RVER', // This specific key is required when working offline
                secretAccessKey: 'S3RVER',
                endpoint: new AWS.Endpoint('http://localhost:3002'),
            });


            const fs = require("fs");
            const path = require ("path");

            const targetFolder = ".s3";
            //check if folder needs to be created or integrated
            if ( !fs.existsSync( targetFolder+"/file-management-dev" ) ) {
                fs.mkdirSync( targetFolder, {recursive: true} );

            }
            fs.chmodSync( targetFolder, 0o777);

            var data_url = parsedBody.file_data;
            var matches = data_url.match(/^data:.+\/(.+);base64,(.*)$/);
            var ext = matches[1];
            var base64_data = matches[2];
            var buffer = Buffer.from(base64_data, 'base64');

            //const tmpName = "/tmp/"+parsedBody.file;
            const tmpName = path.join(targetFolder,parsedBody.file);

            await new Promise((resolve, reject) => {
                fs.writeFile(tmpName, buffer,
                    (err) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            console.log("Successfully Written File to tmp.");
                            resolve();
                        }

                    });
            });

            const fileKey = parsedBody.file + "_ICPART_" + parsedBody.part;

            /*
             var params = {
             Bucket: "infrcomp-604800795243-file-management-dev",
             Key: fileKey,
             Body: fs.createReadStream(tmpName),
             //Expires:expiryDate
             };*/



            var params = {
                Bucket: "file-management-dev",
                Key: fileKey,
                Body: fs.createReadStream(tmpName),
                //Expires:expiryDate
            };


            console.log("now uploading");
            await s3.upload(params).promise().then(
                function (data) {
                    //console.log("file uploaded: ", data);

                    res.status(200)
                        .set({
                            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                        })
                        .send(JSON.stringify({url: data.Location}));

                    return;

                },
                function (error) {
                    console.log("could not upload to s3 ", error);

                    res.status(500).set({
                        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                    }).send("error");

                    return
                }
            );

            if (parseInt(parsedBody.part) + 1 == parseInt(parsedBody.total_parts)) {
                //console.log("merge files!");

                const parts = Buffer.concat(await Promise.all(Array.apply(null, Array(parseInt(parsedBody.total_parts))).map(
                    function (part, idx) {
                        return new Promise((resolve, reject) => {
                            const getparams = {
                                Bucket: "file-management-dev",
                                Key: parsedBody.file + "_ICPART_" + idx
                            };

                            return s3.getObject(getparams).promise().then(
                                async function (data) {
                                    //console.log("file downloaded: ", data);

                                    const b = Buffer.from(data.Body, 'base64');
                                    //console.log(b);

                                    await s3.deleteObject(getparams).promise().then(
                                        ok => ok,
                                        err => {
                                            console.log("could not delete part ", idx, err);
                                        }
                                    );

                                    resolve(b);

                                },
                                function (error) {
                                    console.log("could not load part ", idx, error);
                                    reject(err);
                                }
                            );

                        });

                    }
                )));

                //console.log(parts);

                var params = {
                    Bucket: "file-management-dev",
                    Key: parsedBody.file,
                    Body: parts,
                    //Expires:expiryDate
                };

                await s3.upload(params).promise().then(
                    function (data) {
                        //console.log("file uploaded: ", data);

                        res.status(200)
                            .set({
                                "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                                "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                            })
                            .send(JSON.stringify({url: data.Location}));

                        return;

                    },
                    function (error) {
                        console.log("could not upload to s3 ", error);

                        res.status(500).set({
                            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                        }).send("error");

                        return
                    }
                );

            }

            res.status(200).set({
                "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            }).send("ok");

        }}/>

</Service>