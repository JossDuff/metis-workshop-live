// fetch api
import React, { useState, useEffect } from 'react';

function DataFetcher() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const query = `
        {
            Trader(where: {id: {_eq: "0xda76ACeB65167174c777B768521910F4B8534C23"}}) {
              id
              num_transfers
            }
          }
          
          
    `;

        fetch('https://indexer.bigdevenergy.link/171c891/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        })
            .then(response => response.json())
            .then(result => {
                setData(result.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <pre>{JSON.stringify(data.Trader, null, 2)}</pre>
        </div>
    );
}

export default DataFetcher;
