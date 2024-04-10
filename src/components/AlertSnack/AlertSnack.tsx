import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { AlertColor } from '@mui/material/Alert';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
interface AlertProps {
  message: string;
  typeMessage: AlertColor;
  openAlertComponent: boolean;
  typeHorizontal?: string;
  typeVertical?: string
  onBack?: () => void;
}

interface State extends SnackbarOrigin {
  open: boolean;
}

export default function AlertSnack({
  message,
  typeMessage,
  openAlertComponent,
  typeHorizontal,
  typeVertical,
  onBack
}: AlertProps) {
  const [openAlert, setOpenAlert] = useState(openAlertComponent);
  const [state, setState] = React.useState<State>({
    open: openAlert,
    vertical: typeHorizontal && (typeHorizontal === 'top' || typeHorizontal === 'bottom') ? typeHorizontal : 'top',
    horizontal: typeVertical && (typeVertical === 'left' || typeVertical === 'right' || typeVertical === 'center') ? typeVertical : 'right',
  });
  const { vertical, horizontal, open } = state;
  const handleClose = () => {
    setOpenAlert(false);
    if (onBack) {
      onBack(); // Informa que não houve sucesso
    }
  };
  useEffect(() => {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', openAlertComponent)
  }, [])
  return (
    <Snackbar
      open={openAlert}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert
        onClose={handleClose}
        severity={typeMessage}
        sx={{ width: '100%' }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}