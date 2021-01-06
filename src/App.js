import { createStyles, makeStyles } from '@material-ui/core';
import Bpmn from './components/Bpmn';


const useStyles = makeStyles((theme) =>
  createStyles({
    app: {
      backgroundColor: theme.palette.background.paper,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2, 4),
      minHeight: '100vh',
    },
    header: {
      ...theme.mixins.toolbar,
    },
  }),
);

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.app}>

      <div className={classes.content}>
        <div className={classes.header} />
        <Bpmn />
      </div>

    </div>
  );
}

export default App;
