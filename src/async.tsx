import React, { useState } from 'react'

export interface ICurrentTimeIn {
    location: string,
    onLoading: () => any
    onSuccess: (datetime: string) => any,
    onError: (error: string) => any
}
export function CurrentTimeIn (props: ICurrentTimeIn) {

    const [data, setData] = useState(undefined);
    const [error, setError] = useState(undefined);

    !(data || error) && fetch("http://worldtimeapi.org/api/timezone/"+props.location,{
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "Accept-Charset": "utf-8"
        }
    }).then(result => result.json()
    ).then(setData
    ).catch(setError);

    return data ? props.onSuccess(data.datetime) : (error ? props.onError(error) : props.onLoading());
};
export default function () {
    return <CurrentTimeIn
        location="Europe/Berlin"
        onLoading={() => "loading"}
        onSuccess={(datetime) => datetime}
        onError={(error) => error}
    />
}

export function TimeIn (props) {

    const [data, setData] = useState(undefined);
    const [error, setError] = useState(undefined);

    !(data || error) && fetch("http://worldtimeapi.org/api/timezone/"+props.timezone,{
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "Accept-Charset": "utf-8"
            }
        }
    ).then(result => result.json()
    ).then(setData
    ).catch(setError);

    return props.children({
        loading: !(data || error),
        datetime: data ? data.datetime : undefined,
        error: error
    });

    //data ? data.datetime : (error ? error : "loading");
};
