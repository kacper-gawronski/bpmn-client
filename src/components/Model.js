import { useState, Fragment } from 'react';
import { endpoints } from '../endpoints';

const Model = () => {

    const [ inputFile, setInputFile ] = useState(null);

    const upload = (file) => {
        fetch(endpoints.parseModel, {
            method: 'POST',
            body: file,
        }).then(
            response => response.json() // if the response is a JSON object
        ).then(
            success => console.log(success) // Handle the success response object
        ).catch(
            error => console.log(error) // Handle the error response object
        );
    };

    const onFileChange = (e) => {
        console.log(e.target.files[0]);
        setInputFile(e.target.files[0]);
    };

    const onFileUpload = () => {
        console.log(inputFile);
        upload(inputFile);
    };

    return (
        <Fragment>
            {/* <input type='file' onChange={onFileChange} /> */}
            {/* <button onClick={onFileUpload}>Send file</button> */}

            {/* <form> */}
                <div>
                    <label>Select file to upload</label>
                    <input type="file" onChange={onFileChange} />
                </div>
                <button onClick={onFileUpload}>Send file</button>
            {/* </form> */}
        </Fragment>
    );

}

export default Model;