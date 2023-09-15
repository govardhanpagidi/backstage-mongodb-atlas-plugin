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
import { Project } from '@backstage/plugin-gcp-projects/src/components/NewProjectPage/NewProjectPage';
import axios from 'axios';
import cors from 'cors';

const apiKey = 'ghewvngy';
const apiPrivateKey = 'e0702d6b-b062-4a70-bbd0-7044c4f50f75';
const baseUrl = 'https://cloud.mongodb.com/api/atlas/v1.0';

const corsOptions = {
  origin: '*', // Replace with specific origin(s) or use '*' for any
  methods: ['GET', 'POST'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

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
  const endpoint = '/groups'; // Specify the API endpoint you want to call
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const nonce = crypto.randomBytes(16).toString('hex');
  const message = `${timestamp}${nonce}`;
  const hmac = crypto.createHmac('sha256', apiPrivateKey);
  hmac.update(message);
  const digest = hmac.digest('hex');
  const authHeader = `Digest apiKey="${apiKey}", nonce="${nonce}", digest="${digest}", created="${timestamp}"`;

  try {
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });
 
    // Assuming the data structure is an array of Project objects
    return response.data.Response as Project[];
    // Assuming the data structure is an array of Project objects
  } catch (error) {
    console.log('Error fetching data:', error.message);
    throw error;
  }

}
 

export const ProjectTable = () => {

  const columns: TableColumn[] = [
    { 
      title: 'ID', field: 'id',
    },
    { 
      title: 'Name', field: 'name',
    },
    { 
      title: 'OrgId', field: 'orgId',
    },
    { 
      title: 'Created', field: 'created',
    },
    { 
      title: 'Link', field: 'links.href',
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
  id: number;
  name: string;
  created:string;
  orgid:string;
  link:string;
  // Other properties...
}


