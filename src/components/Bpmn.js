import React, { useState, Fragment } from 'react';
import { endpoints } from '../endpoints';
import { useForm } from "react-hook-form";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Bpmn = () => {
    const { register, handleSubmit, errors } = useForm();

    const [inputFile, setInputFile] = useState(null);
    const [processInfo, setProcessInfo] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [variables, setVariables] = useState(null);

    const uploadFileNameToServer = async (fileName) => {
        await fetch(endpoints.setFileName, {
            method: 'POST',
            body: fileName,
        }).then(
            response => response.text()
        ).then(
            success => {
                console.log(success);
            }
        ).catch(
            error => console.log(error)
        );
    };

    const uploadFileToServer = async (file) => {
        await fetch(endpoints.parseModel, {
            method: 'POST',
            body: file,
        }).then(
            response => response.json()
        ).then(
            success => {
                console.log(success);
                setTasks(success.tasks);
                setVariables(success.variables);
                setProcessInfo(success.process);
            }
        ).catch(
            error => console.log(error)
        );
    };

    const setNumberOfSimulationsToServer = async (data) => {
        await fetch(endpoints.setNumberOfSimulations, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data,
        }).then(
            response => response.json()
        ).then(
            success => {
                console.log(success);
            }
        ).catch(
            error => console.log(error)
        );
    }

    const setVariablesToServer = async (data) => {
        await fetch(endpoints.setVariables, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(
            response => response.json()
        ).then(
            success => {
                console.log(success);
            }
        ).catch(
            error => console.log(error)
        );
    };

    const setTasksValuesToServer = async (data) => {
        await fetch(endpoints.setTasksValues, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(
            response => response.json()
        ).then(
            success => {
                console.log(success);
            }
        ).catch(
            error => console.log(error)
        );
    };

    const sendDeployToServer = async () => {
        await fetch(endpoints.deployProcess).then(
            response => response.json()
        ).then(
            success => {
                console.log(success);
            }
        ).catch(
            error => console.log(error)
        );
    };

    const startSimulationOnServer = async () => {
        await fetch(endpoints.simulationProcess).then(
            response => response.json()
        ).then(
            success => {
                console.log(success);
            }
        ).catch(
            error => console.log(error)
        );
    };

    const deployAndSimulateProcessOnServer = async () => {
        await fetch(endpoints.deployAndSimulateProcess).then(
            response => response.json()
        ).then(
            success => {
                console.log(success);
            }
        ).catch(
            error => console.log(error)
        );
    };

    const onFileChange = (e) => {
        // console.log(e.target.files[0]);
        setInputFile(e.target.files[0]);
    };

    const onFileUpload = () => {
        console.log(inputFile);
        console.log(inputFile.name)
        uploadFileNameToServer(inputFile.name);
        uploadFileToServer(inputFile);
    };

    const sendFile = (data) => {
        console.log(data);
        onFileUpload();
    }

    const sendValues = (data) => {
        console.log(data);

        // set number of simulations
        console.log(data.numberOfSimulations);
        setNumberOfSimulationsToServer(data.numberOfSimulations);

        // set variables
        const variablesRequest = {};
        Object.assign(variablesRequest, data);
        delete variablesRequest.tasks;
        delete variablesRequest.numberOfSimulations;
        console.log(variablesRequest);
        setVariablesToServer(variablesRequest);

        // set tasks values
        var tasksRequest = {};
        Object.assign(tasksRequest, tasks);
        tasksRequest = Object.keys(tasksRequest).map(element => {
            // set "duration" field
            tasksRequest[element]["duration"] = data.tasks[tasksRequest[element]["taskId"]]["duration"];
            // set "cost" field
            tasksRequest[element]["cost"] = data.tasks[tasksRequest[element]["taskId"]]["cost"];
            return tasksRequest[element];
        });
        console.log(tasksRequest);
        setTasksValuesToServer(tasksRequest);

        // deploy
        // sendDeployToServer();

        // simulation
        // startSimulationOnServer();

        // deploy and simulation Process
        deployAndSimulateProcessOnServer();

    };


    return (
        <Fragment>
            {processInfo ?
                <div>
                    <form onSubmit={handleSubmit(sendValues)}>
                        <p>Podaj wartości dla każdego zadania:</p>
                        <div className="tasks">
                            {tasks.map(task => {
                                return (
                                    <Fragment key={task.taskId + 'Fragment'}>
                                        <p key={task.taskId}>{task.taskName}</p>
                                        <div key={task.taskId + 'Div'}>
                                            <div key={task.taskId + 'DurationDiv'}>
                                                <label key={task.taskId + 'DurationLabel'}>Czas trwania zadania [w minutach]</label>
                                                <input
                                                    key={task.taskId + 'DurationInput'}
                                                    type='number'
                                                    name={"tasks." + task.taskId + "." + "duration"}
                                                    defaultValue={getRandomInt(10, 180)}
                                                    ref={register({
                                                        required: true,
                                                        min: 0,
                                                    })}
                                                />
                                            </div>
                                            <div key={task.taskId + 'CostDiv'}>
                                                <label key={task.taskId + 'Cost'}>Koszt zadania [dla jednej godziny]</label>
                                                <input
                                                    key={task.taskId + 'CostInput'}
                                                    type='number'
                                                    name={'tasks.' + task.taskId + '.' + 'cost'}
                                                    defaultValue={getRandomInt(10, 30)}
                                                    ref={register({
                                                        required: true,
                                                        min: 0,
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            })}
                        </div>

                        <p>Określ prawdopodobieństwo wyboru wartości dla każdej zmiennej:</p>
                        <div className="variables">
                            {Object.keys(variables.variablesWithProbabilities).map(key => {
                                return (
                                    <Fragment key={key + 'Fragment'}>
                                        <p key={key}>Zmienna: {key}</p>
                                        {Object.keys(variables.variablesWithProbabilities[key]).map(subKey => {
                                            return (
                                                <div key={key + subKey + 'Div'}>
                                                    <label key={key + subKey + 'Label'}>{subKey}</label>
                                                    <input
                                                        key={key + subKey + 'Input'}
                                                        type='number'
                                                        name={key + '.' + subKey}
                                                        defaultValue={variables.variablesWithProbabilities[key][subKey]}
                                                        ref={register({
                                                            required: true,
                                                            min: 0,
                                                            max: 100,
                                                            // TODO: add validation and error message, sum of probabilities have to be 100
                                                            validate: value => {
                                                                // var sum = 0;
                                                                // const probability = getValues(Object.keys(variables.variablesWithProbabilities[key]).map(x => key + '.' + x));
                                                                // console.log(probability);
                                                                // console.log(Object.keys(probability).map(x => probability[x]));
                                                                // console.log(sum);
                                                                // return sum === 100;
                                                                return true;
                                                            },
                                                        })}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </Fragment>
                                )
                            })}
                        </div>

                        <div>
                            <label>Podaj jaką ilość symulacji chcesz przeprowadzić</label>
                            <input
                                type='number'
                                name='numberOfSimulations'
                                defaultValue={1}
                                ref={register({
                                    required: true,
                                    min: 1,
                                    max: 1000,
                                })}
                            />
                        </div>

                        <input type="submit" />
                    </form>
                </div>

                :

                <div>
                    <form onSubmit={handleSubmit(sendFile)}>
                        <div>
                            <label><p>Wybierz plik zawierający model w notacji BPMN XML (z rozszerzeniem '.bpmn20.xml')</p></label>
                            <input name='file'
                                type='file'
                                onChange={onFileChange}
                                ref={register({
                                    required: true,
                                    validate: {
                                        fileExtension: (value) => {
                                            console.log(value[0]);
                                            console.log(value[0].name)
                                            // return value[0].name.endsWith(".bpmn") || value[0].name.endsWith(".bpmn20.xml");
                                            return value[0].name.endsWith(".bpmn20.xml");
                                        },
                                        textXml: (value) => {
                                            console.log(value[0]);
                                            console.log(value[0].type);
                                            return value[0].type === "text/xml";
                                        },
                                    }
                                })}
                            />
                        </div>
                        {/* <button onClick={onFileUpload}>Prześlij plik</button> */}
                        <button type='submit'>Prześlij plik</button>
                        {errors.file && errors.file.type === "required" && (
                            <p style={{ color: '#FF0000' }}>Musisz przesłać plik</p>
                        )}
                        {errors.file && errors.file.type === "fileExtension" && (
                            <p style={{ color: '#FF0000' }}>Rozszerzenie pliku musi być następujące: '.bpmn20.xml'</p>
                        )}
                        {errors.file && errors.file.type === "textXml" && (
                            <p style={{ color: '#FF0000' }}>Ten plik nie jest w formacie XML</p>
                        )}

                    </form>

                </div>
            }
        </Fragment>
    );

}

export default Bpmn;