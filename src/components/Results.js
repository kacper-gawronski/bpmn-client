import { Accordion, AccordionDetails, AccordionSummary, AppBar, Button, colors, createStyles, Divider, makeStyles, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import clsx from 'clsx';
import React, { Fragment, useState } from 'react';


const calculateDuration = (durationInMinutes) => {
    // 60 min = 1 h     | 1 h = 60 min
    // 24 h = 1 day     | 1 day = 24 x 60 = 1 440 min
    // 7 days = 1 week  | 1 week = 7 x 1 440 = 10 080 min

    const hourInMinutes = 60;
    const dayInMinutes = 1440;
    const weekInMinutes = 10080;

    var tmp = durationInMinutes;

    const weeks = Math.floor(tmp / weekInMinutes);
    tmp = tmp % weekInMinutes;

    const days = Math.floor(tmp / dayInMinutes);
    tmp = tmp % dayInMinutes;

    const hours = Math.floor(tmp / hourInMinutes);
    tmp = tmp % hourInMinutes;

    const minutes = tmp;

    const durations = {
        "weeks": weeks,
        "days": days,
        "hours": hours,
        "minutes": minutes,
    };

    console.log(durations);

    return durations;
};

const weeksToString = (amount) => {
    var str = amount.toString();
    if (amount === 1) {
        return "tydzień";
    }
    else if (amount > 1 && amount < 5) {
        return "tygodnie";
    }
    else if (amount > 20
        && (str.charAt(str.length - 1) === '2'
            || str.charAt(str.length - 1) === '3'
            || str.charAt(str.length - 1) === '4')) {
        return "tygodnie";
    }
    else {
        return "tygodni";
    }
};

const daysToString = (amount) => {
    if (amount === 1) {
        return "dzień";
    }
    else {
        return "dni";
    }
};

const hoursToString = (amount) => {
    var str = amount.toString();
    if (amount === 1) {
        return "godzina";
    }
    else if (amount > 1 && amount < 5) {
        return "godziny";
    }
    else if (amount > 20
        && (str.charAt(str.length - 1) === '2'
            || str.charAt(str.length - 1) === '3'
            || str.charAt(str.length - 1) === '4')) {
        return "godziny";
    }
    else {
        return "godzin";
    }
};

const minutesToString = (amount) => {
    var str = amount.toString();
    if (amount === 1) {
        return "minuta";
    }
    else if (amount > 1 && amount < 5) {
        return "minuty";
    }
    else if (amount > 20
        && (str.charAt(str.length - 1) === '2'
            || str.charAt(str.length - 1) === '3'
            || str.charAt(str.length - 1) === '4')) {
        return "minuty";
    }
    else {
        return "minut";
    }
};

const useStyles = makeStyles((theme) =>
    createStyles({
        appbar: {
            display: 'flex',
            textAlign: 'center',
            padding: theme.spacing(2),
            backgroundColor: colors.cyan[900],
        },
        section: {
            marginTop: theme.spacing(2),
        },
        divider: {
            marginBottom: theme.spacing(3),
        },
        label: {
            marginTop: theme.spacing(2),
        },
        resultValue: {
            fontWeight: 900,
            marginLeft: theme.spacing(2),
        },
        flexContainer: {
            display: 'flex',
        },
        instances: {
            width: '100%',
            margin: theme.spacing(6, 0, 0),
        },
        accordion: {
            backgroundColor: colors.blueGrey[100],
        },
        summaryNumber: {
            flexGrow: 1,
            width: 'auto',
        },
        summaryDuration: {
            flexGrow: 1,
            margin: theme.spacing(0, 2),
            width: 'auto',
        },
        summaryCost: {
            width: 'auto',
            textAlign: 'end',
        },
        tableWrapper: {
            height: '24rem',
            width: '100%',
        },
        table: {
            backgroundColor: theme.palette.background.paper,
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: theme.spacing(6),
        },
        lefButton: {
            marginRight: theme.spacing(4),
        }
    }),
);


const Results = ({ processInfo, simulationResult, setProcessInfo, setSimulationResult }) => {
    const classes = useStyles();
    const { processInstances, sumOfDurations, sumOfCosts } = simulationResult;
    const [durations, setDurations] = useState(calculateDuration(sumOfDurations));

    const tableColumns = [
        { field: 'id', headerName: 'ID' },
        { field: 'name', headerName: 'Nazwa zadania', width: 300 },
        { field: 'duration', headerName: 'Czas trwania [min]', width: 180 },
        { field: 'cost', headerName: 'Koszt [PLN]', width: 150 },
    ];

    const modifySimulation = () => {
        setSimulationResult(null);
    };

    const createNewsimulation = () => {
        setProcessInfo(null);
        setSimulationResult(null);
    }

    return (
        <div>
            <AppBar className={classes.appbar}>
                <Typography variant='h5'>
                    Wyniki symulacji modelu procesu biznesowego: {processInfo.processName}
                </Typography>
            </AppBar>

            <Typography className={classes.section} variant='h6'>Rezultaty ogólne</Typography>
            <Divider />
            <Divider />

            <Fragment>

                <div className={clsx(classes.flexContainer, classes.label)}>
                    <Typography variant='h5'>
                        Liczba symulowanych instancji procesów:
                    </Typography>
                    <Typography variant='h5' className={classes.resultValue}>
                        {processInstances.length}
                    </Typography>
                </div>


                <div className={classes.label}>
                    {durations
                        ?
                        <div className={classes.flexContainer}>
                            <Typography variant='h5' className={classes.durationElement}>Czas trwania wszystkich instancji procesów wyniósł:</Typography>
                            {durations.weeks ? <Typography variant='h5' className={classes.resultValue}>
                                {durations.weeks} {weeksToString(durations.weeks)}
                            </Typography> : null}
                            {durations.days ? <Typography variant='h5' className={classes.resultValue}>
                                {durations.days} {daysToString(durations.days)}
                            </Typography> : null}
                            {durations.hours ? <Typography variant='h5' className={classes.resultValue}>
                                {durations.hours} {hoursToString(durations.hours)}
                            </Typography> : null}
                            {durations.minutes ? <Typography variant='h5' className={classes.resultValue}>
                                {durations.minutes} {minutesToString(durations.minutes)}
                            </Typography> : null}
                        </div>
                        :
                        <Typography variant='h5'>
                            Czas trwania wszystkich instancji procesów wyniósł: {sumOfDurations} {minutesToString(sumOfDurations)}
                        </Typography>
                    }
                </div>

                <div className={clsx(classes.flexContainer, classes.label)}>
                    <Typography variant='h5'>
                        Koszt realizacji wszystkich instancji procesów wyniósł:
                    </Typography>
                    <Typography variant='h5' className={classes.resultValue}>
                        {" " + sumOfCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " PLN"}
                    </Typography>
                </div>

            </Fragment>


            <div className={classes.instances}>
                <Typography className={classes.section} variant='h6'>Rezultaty szczegółowe</Typography>
                <Divider />
                <Divider className={classes.divider} />

                {processInstances.map(instance => {

                    const rows = instance.simulationActivities.map(x => {
                        return ({
                            id: instance.simulationActivities.indexOf(x) + 1,
                            name: x.name,
                            duration: x.duration,
                            cost: x.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        });
                    });

                    return (
                        <Accordion
                            key={'accordion' + processInstances.indexOf(instance)}
                            className={classes.accordion}
                        >
                            <AccordionSummary key={'accordionSummary' + processInstances.indexOf(instance)}>
                                <Typography variant='subtitle2' className={classes.summaryNumber}>
                                    Nr instancji procesu: {processInstances.indexOf(instance) + 1}
                                </Typography>
                                <Typography variant='subtitle2' className={classes.summaryDuration}>
                                    Całkowity czas trwania procesu: {instance.totalDuration} min
                                </Typography>
                                <Typography variant='subtitle2' className={classes.summaryCost}>
                                    Koszt całkowity procesu: {instance.totalDuration} PLN
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails key={'accordionDetails' + processInstances.indexOf(instance)}>
                                <div className={classes.tableWrapper}>
                                    <DataGrid
                                        rows={rows}
                                        columns={tableColumns}
                                        pageSize={5}
                                        autoHeight
                                        hideFooterSelectedRowCount
                                        disableSelectionOnClick
                                        className={classes.table}
                                    />
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </div>


            <div className={classes.buttons}>
                <Button
                    color='primary'
                    variant='contained'
                    size='large'
                    onClick={modifySimulation}
                    className={classes.lefButton}
                >
                    Zmodyfikuj parametry symulacji
                </Button>
                <Button color='secondary'
                    variant='contained'
                    size='large'
                    onClick={createNewsimulation}
                >
                    Przeprowadź symulację dla innego modelu
                </Button>
            </div>

        </div>
    );
}

export default Results;