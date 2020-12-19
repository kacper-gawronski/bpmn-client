import { useEffect, useState, Fragment } from 'react';
import { endpoints } from '../endpoints';

const Test = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);

    const fetchData = async () => {
        await fetch(endpoints.test)
            .then(async (response) => {
                const data = await response.json();
                console.log(data);
                setData(data);
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                setError('fetched failed');
            });
    }

    const startProcess = async () => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
        };
        await fetch('http://localhost:8080/deploy', requestOptions)
            .then(async (response) => {
                setLoading(false);
            })
            .catch((e) => {
                setError(e.toString());
                setLoading(false);
                console.error('There was an error!', e);
            });
    }

    useEffect(() => {
        setLoading(true);
        fetchData();

    }, []);

    useEffect(() => {
        setLoading(true);
        startProcess();

    }, []);


    if (loading) {
        return <p>loading...</p>;
    }

    if (error !== '') {
        return <p>ERROR: {error}</p>;
    }

    return (
        <Fragment>
            <ul>
                {data.map((element) => (
                    <li key={element}>{element}</li>
                ))}
            </ul>
        </Fragment>
    );

}

export default Test;