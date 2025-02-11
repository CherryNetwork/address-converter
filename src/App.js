import { useState } from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import logo from './assets/logo512.png';
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
} from '@material-ui/core';
import {
  convertH160ToSs58,
  convertSs58ToH160,
  ADDRESS_FORMAT,
  encodePubKey,
  CHAIN_PREFIX,
  validateSs58,
  getPubKey,
} from './utils';

import './App.css';

// Or Create your Own theme:
const theme = createTheme({
  palette: {
    secondary: {
      main: '#E33E7F',
    },
  },
});
function App() {
  const [inputAddrFormat, setInputAddrFormat] = useState(ADDRESS_FORMAT.ss58);
  const [inputAddress, setInputAddress] = useState('');
  const [outputAddress, setOutputAddress] = useState('');
  const [error, setError] = useState('');

  function handleInputFormatChange(e) {
    setInputAddrFormat(e.target.value);
  }

  function handleInputAddrChange(e) {
    setInputAddress(e.target.value);
  }

  function getAllAddresses(ss58Address, defaultH160) {
    const res = {};

    res[ADDRESS_FORMAT.h160] = defaultH160
      ? defaultH160
      : convertSs58ToH160(ss58Address);
    res[ADDRESS_FORMAT.ss58] = ss58Address;
    res[ADDRESS_FORMAT.pubKey] = getPubKey(ss58Address);

    return res;
  }

  function formatAddresses(addressObj) {
    const outputArray = [];
    Object.entries(addressObj).forEach((entry) => {
      outputArray.push(`<b>${entry[0]}</b>: \t${entry[1]}<br/><br/>`);
    });

    return outputArray.join('\n');
  }

  function handleSubmit(e) {
    e.preventDefault();
    try {
      const inputAddressTrimmed = inputAddress.trim();
      let eqvSs58Addr = inputAddressTrimmed;
      let defaultH160;

      if (inputAddrFormat === ADDRESS_FORMAT.h160) {
        // convert h160 to ss58
        defaultH160 = inputAddressTrimmed; // limitation of bidirectional H160 mapping
        eqvSs58Addr = convertH160ToSs58(inputAddressTrimmed);
      } else if (inputAddrFormat === ADDRESS_FORMAT.pubKey) {
        // convert pubkey to ss58
        eqvSs58Addr = encodePubKey(inputAddressTrimmed, CHAIN_PREFIX.ss58);
      }

      validateSs58(eqvSs58Addr);

      setOutputAddress(
        formatAddresses(getAllAddresses(eqvSs58Addr, defaultH160))
      );
      setError('');
    } catch (e) {
      console.error(e);
      if (typeof e === 'string') {
        setError(e);
      } else {
        setError(`Invalid ${inputAddrFormat} address provided`);
      }
      setOutputAddress('');
    }
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className='App'>
        <img
          src={logo}
          alt='Cherry Network Logo'
          style={{ height: '80px', width: '80px' }}
        />
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <Typography
              variant='p'
              component='p'
              style={{
                color: '#282928',
                fontWeight: 'bold',
              }}
            >
              Input address format:
            </Typography>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={inputAddrFormat}
              onChange={handleInputFormatChange}
            >
              <MenuItem value={ADDRESS_FORMAT.ss58}>SS58 (Substrate)</MenuItem>
              <MenuItem value={ADDRESS_FORMAT.h160}>H160 (Ethereum)</MenuItem>
              <MenuItem value={ADDRESS_FORMAT.pubKey}>
                Public Key (Global)
              </MenuItem>
            </Select>
          </div>

          <div className='form-group'>
            {/* <label className='form-label'>Address: </label> */}
            {/* <input
            type='text'
            value={inputAddress}
            onChange={handleInputAddrChange}
          /> */}
            <Typography
              variant='p'
              component='p'
              style={{
                color: '#282928',
                fontWeight: 'bold',
              }}
            >
              Enter Address
            </Typography>
            <TextField
              id='outlined-basic'
              label='Enter address'
              variant='outlined'
              value={inputAddress}
              onChange={handleInputAddrChange}
              style={{
                marginLeft: '4px',
                height: '18px',
              }}
            />
          </div>

          <div
            className='form-group'
            style={{
              marginTop: '50px',
            }}
          >
            {/* <button type='submit'>Go!</button> */}
            <Button
              color='success'
              type='submit'
              variant='outlined'
              style={{
                fontWeight: 'bold',
              }}
            >
              Go!
            </Button>
          </div>

          <div className='error'>{error}</div>
        </form>
        <div
          className='output-address'
          dangerouslySetInnerHTML={{ __html: outputAddress }}
        />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
