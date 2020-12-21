const serverAdress = 'http://localhost:8080';

export const endpoints = {
    test: serverAdress + '/api',

    setFileName: serverAdress + '/file-name',
    parseModel: serverAdress + '/parse',
    setVariables: serverAdress + '/set-variables',
    setTaskValues: serverAdress + '/set-task-values',
    deployProcess: serverAdress + '/deploy',
    simulationProcess: serverAdress + '/simulation',
    deployAndSimulateProcess: serverAdress + '/deploy-simulation',
};