import React from 'react';
import { Entry, mutate, withDataLayer } from "infrastructure-components";
import { GraphQLString }  from 'graphql';
import { Query } from 'react-apollo';

export const FILEMETADATA_ENTRYID = "filemetadata";

export default function FileMetaDataEntry (props)  {
    return <Entry
        id={ FILEMETADATA_ENTRYID }
        primaryKey="prefix"
        rangeKey="filename"
        data={{
            author: GraphQLString,
            description: GraphQLString,
        }}
    />
};

const prePrefix = (prefix: string) => "pre_"+prefix;

export interface IMetaData {
    prefix: string,
    filename: string,
    author: string,
    description: string,
}

export async function addMetaData(dataLayer, data: IMetaData) {
    mutate(
        dataLayer.client,
        dataLayer.setEntryMutation(FILEMETADATA_ENTRYID, Object.assign({}, data, {
            prefix: prePrefix(data.prefix),
        }))
    );
};

export const MetaDataQuery = withDataLayer(props => (
    <Query {...props.getEntryQuery(FILEMETADATA_ENTRYID, {
        prefix: prePrefix(props.prefix),
        filename: props.filename}
    )} >{
        ({data}, results) => (
            <props.children
                {...results}
                fileMetaData={data ? data[`get_${FILEMETADATA_ENTRYID}`] : undefined}
            />
        )
    }</Query>)
);