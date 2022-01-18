import * as React from 'react';
import axios from 'axios'
import {useQuery} from "react-query";
import {AppShell} from '@mantine/core';

function App() {
    const {data, error, isLoading, isFetching} = useQuery('hello', async () => {
        const response = await axios.get(`/api/hello`)
        return response.data
    })

    if (isLoading) {
        return <p>Loading...</p>
    }
    if (error) return <p>An error has occured</p>;

    return <AppShell>{data}</AppShell>;
}

export default App;
