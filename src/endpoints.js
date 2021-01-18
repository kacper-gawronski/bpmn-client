const serverAdress = 'http://localhost:8080';

export const endpoints = {
    setFileName: serverAdress + '/file-name',
    parseModel: serverAdress + '/parse',
    setNumberOfSimulations: serverAdress + '/number-of-simulations',
    setVariables: serverAdress + '/variables',
    setTasksValues: serverAdress + '/tasks-values',
    deployAndSimulateProcess: serverAdress + '/simulation',
};