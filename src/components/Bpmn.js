import React, { useState, Fragment } from 'react';
import Model from './Model';
import Parameters from './Parameters';
import Results from './Results';


const Bpmn = () => {

    const [processInfo, setProcessInfo] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [variables, setVariables] = useState(null);

    const [simulationResult, setSimulationResult] = useState(null);

    return (
        <Fragment>
            {simulationResult ?
                <Results
                    processInfo={processInfo}
                    simulationResult={simulationResult}
                    setProcessInfo={setProcessInfo}
                    setSimulationResult={setSimulationResult}
                />
                :
                <>
                    {processInfo ?
                        <Parameters
                            processInfo={processInfo}
                            tasks={tasks} variables={variables}
                            setSimulationResult={setSimulationResult}
                        />
                        :
                        <Model
                            setProcessInfo={setProcessInfo}
                            setTasks={setTasks}
                            setVariables={setVariables}
                        />
                    }
                </>
            }
        </Fragment>
    );

}

export default Bpmn;