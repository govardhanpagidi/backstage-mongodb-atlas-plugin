/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { Table, TableColumn } from '@backstage/core-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = 'http://localhost:8080/api/projects?publicKey=ghewvngy&privateKey=e0702d6b-b062-4a70-bbd0-7044c4f50f75&orgId=63350255419cf25e3d511c95'; // Replace with your API endpoint
const username = '';
const password = '';
// const apiUrl = 'http://localhost:8081/api/project';



type AsyncState<T> = {
  value: T | null;
  loading: boolean;
  error: Error | null;
};

interface ENV {
  NODE_ENV: string | undefined;
  USERNAME: string | undefined;
  PASSWORD: string | undefined;
  ATLAS_API_URI: string | undefined;
}


const getConfig = (): ENV => {
  // return {
  //   NODE_ENV: process.env.NODE_ENV,
  //   USERNAME: process.env.USERNAME ,
  //   PASSWORD: process.env.PASSWORD ,
  //   ATLAS_API_URI: process.env.ATLAS_API_URI
  // };
  return {
      NODE_ENV: process.env.NODE_ENV,
      USERNAME: username ,
      PASSWORD: password ,
      ATLAS_API_URI: apiUrl
    };
};


export function useAsync<T>(asyncFunction: () => Promise<T>): AsyncState<T> {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    asyncFunction()
      .then((data) => {
        setValue(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      }); 
  }, [asyncFunction]);

  return { value, loading, error };
}

async function fetchDataWithDigestAuth(): Promise<Project[]> {
  try {
    debugger
    // call the api with digest auth    


     let config = getConfig()

    const token = `${config.USERNAME}:${config.PASSWORD}`;
    const encodedToken = Buffer.from(token).toString('base64');

    // call the api with digest auth  
        
    var apiConfig = {
      method: 'GET',
      url: config.ATLAS_API_URI,
      headers: { 'Authorization': 'Basic '+ encodedToken}
    };

    const response = await axios(apiConfig);
    console.log(JSON.stringify(response.data));
    
    // Assuming the data structure is an array of Project objects
    return response.data as Project[];
    // Assuming the data structure is an array of Project objects
  } catch (error) {
    console.log('Error fetching data:', error.message);
    throw error;
  }

}
 
// create a table component with clickable links to projects
// https://backstage.io/docs/features/software-catalog/directory-structure
// https://backstage.io/docs/features/software-catalog/directory-structure#table
// https://backstage.io/docs/features/software-catalog/directory-structure#table-with-actions
// https://backstage.io/docs/features/software-catalog/directory-structure#table-with-actions



export const ProjectTable = () => {

  const columns: TableColumn[] = [
    { 
      title: 'ID', field: 'id',
    },
    { 
      // create clickable link to project

      title: 'Name', field: 'name',
    },
    { 
      title: 'OrgId', field: 'orgId',
    },
    { 
      title: 'Created', field: 'created',
    },
    { 
      title: 'ClusterCount', field: 'clusterCount',
    },
  ];

  const { value, loading, error } = useAsync<Project[]>(fetchDataWithDigestAuth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!value) {
    return <div>No data available.</div>;
  }


  return (
   
    <Table
      title="Projects"
      options={{ search: false, paging: false }}
      columns={columns}
      data={value}
    />
  );
};


interface Project {
  id: string;
  name: string;
  created:string;
  orgId:string;
  clusterCount:string;
  // Other properties...
}


