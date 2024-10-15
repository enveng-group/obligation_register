import initSqlJs from 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.js';
import {fetchData} from '../../../services/service.js';
import {formatDate, capitalize} from '../../../utils/helper.js';

export const initSqlJsPromise = initSqlJs({
    locateFile: () => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.wasm',
});

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Critical scripts loaded');
    // Initialize SQL.js
    const SQL = await initSqlJsPromise;
    const db = new SQL.Database();
    
    // Create a table
    db.run('CREATE TABLE test (col1, col2);');
    // Insert some data
    db.run('INSERT INTO test VALUES (?, ?), (?, ?);', [
        'Hello',
        'World',
        'Foo',
        'Bar',
    ]);
    // Query the database
    const res = db.exec('SELECT * FROM test;');
    console.log('Database query result:', res);
    // Example usage of critical functions
    fetchData('/api/data')
        .then((data) => console.log('Fetched data:', data))
        .catch((error) => console.error('Error fetching data:', error));
    
    console.log('Formatted date:', formatDate(new Date()));
    console.log('Capitalized string:', capitalize('example'));
});
