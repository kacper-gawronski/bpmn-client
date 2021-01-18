import {
    AppBar,
    Button,
    colors,
    createStyles,
    Divider,
    InputAdornment,
    makeStyles,
    TextField,
    Typography
} from '@material-ui/core';
import React, {Fragment} from 'react';
import {useForm} from 'react-hook-form';
import {endpoints} from '../endpoints';


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        appbar: {
            display: 'flex',
            textAlign: 'center',
            padding: theme.spacing(2),
            backgroundColor: colors.cyan[900],
        },
        section: {
            marginTop: theme.spacing(5),
        },
        divider: {
            marginBottom: theme.spacing(2),
        },
        taskValues: {
            display: 'flex',
            margin: theme.spacing(1, 0, 1),
        },
        taskDuration: {
            margin: theme.spacing(0, 2),
        },
        variable: {
            display: 'flex',
            margin: theme.spacing(1, 0, 0),
        },
        variableValue: {
            marginLeft: theme.spacing(2),
        },
        variableError: {
            margin: theme.spacing(1, 0, 3),
        },
        numberOfSimulations: {
            marginLeft: theme.spacing(2),
        },
        submitButtonWrap: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: theme.spacing(5),
        },
        submitButton: {
            maxWidth: '15rem',
        },
    }),
);


const Parameters = ({processInfo, tasks, variables, setSimulationResult}) => {
    const classes = useStyles();

    const {register, handleSubmit, errors, getValues} = useForm();


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
                // console.log(success);
            }
        ).catch(
            error => {
                // console.log(error)
            }
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
                // console.log(success);
            }
        ).catch(
            error => {
                // console.log(error)
            }
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
                // console.log(success);
            }
        ).catch(
            error => {
                // console.log(error)
            }
        );
    };

    const deployAndSimulateProcessOnServer = async () => {
        await fetch(endpoints.deployAndSimulateProcess).then(
            response => response.json()
        ).then(
            success => {
                // console.log(success);
                setSimulationResult(success);
            }
        ).catch(
            error => {
                // console.log(error)
            }
        );
    };

    const sendValues = (data) => {
        // set number of simulations
        setNumberOfSimulationsToServer(data.numberOfSimulations);

        // set variables
        const variablesRequest = {};
        Object.assign(variablesRequest, data);
        delete variablesRequest.tasks;
        delete variablesRequest.numberOfSimulations;
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
        setTasksValuesToServer(tasksRequest);

        // deploy and simulation Process
        deployAndSimulateProcessOnServer();

    };

    return (
        <div>
            <AppBar className={classes.appbar}>
                <Typography variant='h5'>Parametry symulacji modelu procesu
                    biznesowego: {processInfo.processName}</Typography>
            </AppBar>

            <form onSubmit={handleSubmit(sendValues)}>
                <Typography variant='h6'>
                    Podaj wartości dla każdego zadania
                </Typography>
                <Divider/>
                <Divider className={classes.divider}/>
                <div className="tasks">
                    {tasks.map(task => {
                        return (
                            <Fragment key={task.taskId + 'Fragment'}>
                                <Typography variant='subtitle2'>Zadanie: {task.taskName}</Typography>
                                <div key={task.taskId + 'Div'} className={classes.taskValues}>
                                    <div key={task.taskId + 'DurationDiv'} className={classes.taskDuration}>
                                        <TextField
                                            key={task.taskId + 'DurationInput'}
                                            name={"tasks." + task.taskId + "." + "duration"}
                                            type='number'
                                            label='Czas trwania'
                                            InputProps={{
                                                endAdornment: <InputAdornment position='end'>min</InputAdornment>
                                            }}
                                            defaultValue={task.duration ? task.duration : getRandomInt(10, 180)}
                                            inputRef={register({
                                                required: true,
                                                min: 0,
                                            })}
                                        />
                                        <div className={classes.variableError}>
                                            {errors.tasks &&
                                            errors.tasks[task.taskId] &&
                                            errors.tasks[task.taskId].duration &&
                                            errors.tasks[task.taskId].duration.type === "required" && (
                                                <Typography color='error' variant='body2'>Pole nie może być
                                                    puste</Typography>
                                            )}
                                            {errors.tasks &&
                                            errors.tasks[task.taskId] &&
                                            errors.tasks[task.taskId].duration &&
                                            errors.tasks[task.taskId].duration.type === "min" && (
                                                <Typography color='error' variant='body2'>Wartość nie może być
                                                    ujemna</Typography>
                                            )}
                                        </div>
                                    </div>
                                    <div key={task.taskId + 'CostDiv'} className={classes.taskCost}>
                                        <TextField
                                            key={task.taskId + 'CostInput'}
                                            name={'tasks.' + task.taskId + '.' + 'cost'}
                                            type='number'
                                            label='Koszt'
                                            InputProps={{
                                                endAdornment: <InputAdornment position='end'>PLN</InputAdornment>
                                            }}
                                            defaultValue={task.cost ? task.cost : getRandomInt(10, 30)}
                                            inputRef={register({
                                                required: true,
                                                min: 0,
                                                validate: value => value % 1 === 0,
                                            })}
                                        />
                                        <div className={classes.variableError}>
                                            {errors.tasks &&
                                            errors.tasks[task.taskId] &&
                                            errors.tasks[task.taskId].cost &&
                                            errors.tasks[task.taskId].cost.type === "required" && (
                                                <Typography color='error' variant='body2'>Pole nie może być
                                                    puste</Typography>
                                            )}
                                            {errors.tasks &&
                                            errors.tasks[task.taskId] &&
                                            errors.tasks[task.taskId].cost &&
                                            errors.tasks[task.taskId].cost.type === "min" && (
                                                <Typography color='error' variant='body2'>Wartość nie może być
                                                    ujemna</Typography>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })}
                </div>

                <Typography className={classes.section} variant='h6'>
                    Określ prawdopodobieństwo wyboru wartości dla każdej zmiennej
                </Typography>
                <Divider/>
                <Divider className={classes.divider}/>
                <div className="variables">
                    {Object.keys(variables.variablesWithProbabilities).map(key => {
                        return (
                            <Fragment key={key + 'Fragment'}>
                                <Typography variant='subtitle2'>Zmienna: {key}</Typography>

                                {/* error for sum of probability validation */}
                                <div>
                                    {errors[key] &&
                                    Object.keys(variables.variablesWithProbabilities[key])
                                        .map(subKey => errors[key][subKey])
                                        .every((element, index, array) => element) &&
                                    Object.keys(variables.variablesWithProbabilities[key])
                                        .map(subKey => errors[key][subKey].type)
                                        .every((element, index, array) => element === "validate") &&
                                    <Typography color='error' variant='body2'>Suma prawdopodobieństw musi być równa
                                        100</Typography>
                                    }
                                </div>

                                <div key={key + 'Div'} className={classes.variable}>
                                    {Object.keys(variables.variablesWithProbabilities[key]).map(subKey => {
                                        return (
                                            <div key={key + subKey + 'Div'} className={classes.variableValue}>
                                                <TextField
                                                    key={key + subKey + 'Input'}
                                                    name={key + '.' + subKey}
                                                    type='number'
                                                    label={subKey}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position='end'>%</InputAdornment>
                                                    }}
                                                    defaultValue={variables.variablesWithProbabilities[key][subKey]}
                                                    inputRef={register({
                                                        required: true,
                                                        min: 0,
                                                        max: 100,
                                                        validate: value => {
                                                            var sum = 0;
                                                            const variableProbability = getValues(Object.keys(variables.variablesWithProbabilities[key]).map(x => key + '.' + x));
                                                            const probability = Object.keys(variableProbability).map(x => variableProbability[x])[0];
                                                            const probabilityValues = Object.keys(probability).map(x => sum += parseInt(probability[x]));
                                                            return sum === 100;
                                                        },
                                                    })}
                                                />
                                                <div className={classes.variableError}>
                                                    {errors[key] &&
                                                    errors[key][subKey] &&
                                                    errors[key][subKey].type === "required" && (
                                                        <Typography color='error' variant='body2'>Pole nie może być
                                                            puste</Typography>
                                                    )}
                                                    {errors[key] &&
                                                    errors[key][subKey] &&
                                                    errors[key][subKey].type === "min" && (
                                                        <Typography color='error' variant='body2'>Wartość nie może być
                                                            ujemna</Typography>
                                                    )}
                                                    {errors[key] &&
                                                    errors[key][subKey] &&
                                                    errors[key][subKey].type === "max" && (
                                                        <Typography color='error' variant='body2'>Wartość nie może być
                                                            większa niż 100</Typography>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Fragment>
                        )
                    })}
                </div>

                <div>
                    <Typography className={classes.section} variant='h6'>
                        Podaj liczbę instancji procesów jaką chcesz zasymulować
                    </Typography>
                    <Divider/>
                    <Divider className={classes.divider}/>
                    <div className={classes.numberOfSimulations}>
                        <TextField
                            name='numberOfSimulations'
                            type='number'
                            label='Ilość instancji procesów'
                            defaultValue={1}
                            inputRef={register({
                                required: true,
                                min: 1,
                                max: 1000,
                            })}
                        />
                        <div className={classes.variableError}>
                            {errors.numberOfSimulations && errors.numberOfSimulations.type === "required" && (
                                <Typography color='error' variant='body2'>Pole nie może być puste</Typography>
                            )}
                            {errors.numberOfSimulations && errors.numberOfSimulations.type === "min" && (
                                <Typography color='error' variant='body2'>Wartość nie może być mniejsza niż
                                    1</Typography>
                            )}
                            {errors.numberOfSimulations && errors.numberOfSimulations.type === "max" && (
                                <Typography color='error' variant='body2'>Wartość nie może być większa od
                                    1000</Typography>
                            )}
                        </div>
                    </div>
                </div>

                <div className={classes.submitButtonWrap}>
                    <Button color='primary' type='submit' variant='contained' size='large' fullWidth
                            className={classes.submitButton}>
                        Symuluj model
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Parameters;