import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

interface AlertProps {
    message: string;
    typeMessage: AlertColor;
    textAlert: string,
    onBack?: () => void;
  }
export default function MenssageError({
    message,
    typeMessage,
 
    onBack
  }: AlertProps) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
    <Alert severity={typeMessage}>
      <AlertTitle>Success</AlertTitle>
      {message}
    </Alert>
  </Stack>
  );
}