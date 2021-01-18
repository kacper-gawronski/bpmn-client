import { AppBar, Button, colors, createStyles, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { endpoints } from '../endpoints';

const useStyles = makeStyles((theme) =>
    createStyles({
        appbar: {
            display: 'flex',
            textAlign: 'center',
            padding: theme.spacing(2),
            backgroundColor: colors.cyan[900],
        },
        label: {
            marginBottom: theme.spacing(2),
        },
        fileInput: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: theme.spacing(2),
        },
        fileName: {
            marginLeft: theme.spacing(2),
        },
        buttonAndErrors: {
            display: 'flex',
            alignItems: 'center',
        },
        errors: {
            marginLeft: theme.spacing(2),
        },
        button: {
            maxWidth: '15rem',
        }
    }),
);

const Model = ({ setProcessInfo, setTasks, setVariables }) => {
    const classes = useStyles();
    const { register, handleSubmit, errors } = useForm();

    const [inputFile, setInputFile] = useState(null);


    const uploadFileNameToServer = async (fileName) => {
        await fetch(endpoints.setFileName, {
            method: 'POST',
            body: fileName,
        }).then(
            response => response.text()
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

    const uploadFileToServer = async (file) => {
        await fetch(endpoints.parseModel, {
            method: 'POST',
            body: file,
        }).then(
            response => response.json()
        ).then(
            success => {
                // console.log(success);
                setTasks(success.tasks);
                setVariables(success.variables);
                setProcessInfo(success.process);
            }
        ).catch(
            error => {
                // console.log(error)
            }
        );
    };

    const onFileChange = (e) => {
        setInputFile(e.target.files[0]);
    };

    const onFileUpload = () => {
        uploadFileNameToServer(inputFile.name);
        uploadFileToServer(inputFile);
    };

    const sendFile = (data) => {
        onFileUpload();
    }

    return (
        <div>
            <AppBar className={classes.appbar}>
                <Typography variant='h5'>Witaj w aplikacji służącej do symualcji modeli procesów
                    biznesowych</Typography>
            </AppBar>

            <form onSubmit={handleSubmit(sendFile)}>
                <div>
                    <label>
                        <Typography variant='h6'>
                            Wybierz plik zawierający model w notacji BPMN XML
                        </Typography>
                        <Typography variant='h6' className={classes.label}>
                            (z rozszerzeniem '.bpmn20.xml')
                        </Typography>
                    </label>
                    <div className={classes.fileInput}>
                        <Button color="secondary" variant="contained" component="label" size='large' fullWidth
                            className={classes.button}>
                            Wybierz plik
                            <input
                                name='file'
                                type='file'
                                hidden
                                onChange={onFileChange}
                                ref={register({
                                    required: true,
                                    validate: {
                                        fileExtension: (value) => {
                                            return value[0].name.endsWith(".bpmn20.xml");
                                        },
                                        textXml: (value) => {
                                            return value[0].type === "text/xml";
                                        },
                                    }
                                })}
                            />
                        </Button>
                        {inputFile
                            ?
                            <Typography variant='subtitle2' className={classes.fileName}>Wybrano
                                plik: {inputFile.name}</Typography>
                            :
                            <Typography variant='subtitle2' className={classes.fileName}>Nie wybrano pliku</Typography>}
                    </div>
                </div>

                <div className={classes.buttonAndErrors}>
                    <Button color='primary' type='submit' variant="contained" size='large' fullWidth
                        className={classes.button}>Prześlij plik</Button>
                    <div className={classes.errors}>
                        {errors.file && errors.file.type === "required" && (
                            <Typography color='error' variant='subtitle2'>Musisz przesłać plik</Typography>
                        )}
                        {errors.file && errors.file.type === "fileExtension" && (
                            <Typography color='error' variant='subtitle2'>Rozszerzenie pliku musi być następujące:
                                '.bpmn20.xml'</Typography>
                        )}
                        {errors.file && errors.file.type === "textXml" && (
                            <Typography color='error' variant='subtitle2'>Ten plik nie jest w formacie XML</Typography>
                        )}
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Model;