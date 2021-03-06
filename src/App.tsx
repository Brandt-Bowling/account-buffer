import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  createStyles,
  Theme,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import './App.css';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { ResultLabel } from './ResultLabel';
import { Label } from './Label';
import Typography from '@material-ui/core/Typography';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        minHeight: '100vh',
      },
      [theme.breakpoints.up('md')]: {
        minWidth: '200px',
        maxWidth: '75vw',
        minHeight: '100vh',
      },
    },
    paper: {
      padding: 24,
      width: '75%',
    },
    form: {
      width: '100%',
    },
  }),
);

type CategoryEntry = {
  name: string;
  amount: string;
};

const App: React.FC = () => {
  const classes = useStyles();
  const inputs = [
    'Freedom Unlimited (Brandt)',
    'Freedom Unlimited (Hannah)',
    'Freedom',
    'Amazon',
    'Charity | Tithes',
    'Fun Money (Brandt)',
    'Fun Money (Hannah)',
    'Gifts',
    'Doctor Appts',
    'Misc',
  ];

  const initialState: CategoryEntry[] = inputs.map((input) => {
    return {
      name: input,
      amount: '0',
    };
  });

  const [balance, setBalance] = useState('0');
  const [entries, setEntries] = useState(initialState);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const totalEntries = entries.reduce((prev, curr) => {
      return parseFloat(curr.amount) + prev;
    }, 0);
    const total = parseFloat(balance) - totalEntries;
    setTotalAmount(total);
  }, [entries, inputs, balance]);

  useEffect(() => {
    const inputString = localStorage.getItem('inputs');
    if (!inputString) {
      localStorage.setItem('inputs', inputs.toString());
    }
  });

  const handleChange = (value: string, name: string) => {
    const updated = entries.map((entry) => {
      if (entry.name !== name) {
        return entry;
      }

      return { ...entry, amount: value };
    });
    const newState = [...updated];
    setEntries(newState);
  };

  const handleDelete = (name: string) => {
    const remainingEntries = entries.filter((entry) => entry.name !== name);
    setEntries(remainingEntries);
  };

  const handleAdd = () => {};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container justify="center">
        <Grid
          container
          alignItems="center"
          className={classes.container}
          justify="center"
        >
          <Paper className={classes.paper}>
            <Typography variant="h5">Account Buffer</Typography>
            <Grid container>
              <Label
                name={'Starting Balance'}
                value={balance}
                hasDelete={false}
                handleChange={(value: string) => setBalance(value)}
              />
            </Grid>
            <Grid container alignItems="center">
              {entries.map((entry) => {
                return (
                  <Label
                    key={entry.name}
                    name={entry.name}
                    value={entry.amount}
                    handleChange={handleChange}
                    handleDelete={handleDelete}
                  />
                );
              })}
              <ResultLabel name="Total" amount={totalAmount} />
              <Grid item xs={2}>
                <Fab color="primary" onClick={handleAdd}>
                  <AddIcon></AddIcon>
                </Fab>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default App;
