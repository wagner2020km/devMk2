import React, { useState, useEffect } from 'react';
import IconPix from '../../components/IconesBith/IconPix';
import IconTRansfer from '../../components/IconesBith/IconTRansfer';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { AlertColor } from '@mui/material/Alert';

import AlertSnack from '../../components/AlertSnack/AlertSnack'
import Container from '../../layout/Container';
import styles from './styles.module.scss';
import { moneyMaskNumber, moneyMask, moneyMaskNumberSerBrl } from '../../utils/cpfMask';

import { useMediaQuery } from 'usehooks-ts';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import {
  resetUserRegisterData,
  setUserRegisterField,
} from '../../redux/actions/userRegisterActions';
import { connect } from 'react-redux';
import getPropSegura from '../../utils/getPropSegura';
import { useDispatch } from 'react-redux';
// Marks com valores monetários formatados
const marks = [
  { value: 0.00, label: moneyMaskNumber(0.00) },

  { value: 90000.00, label: moneyMaskNumber(90000.00) },
];

type dadosInputGFormProps = {
  valorTransferDia: number;
  valorTransferNoite: number;
  valorPixDia: number
  valorPixNoite: number;


};

// Estilização customizada para o Slider
const PrettoSlider = styled(Slider)({
  color: '#0fa49b',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 64,
    height: 64,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#0fa49b',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const DailyLimit = (props: any) => {

  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [limiteTrasDiario, setLimiteTrasDiario] = useState<number>(0);
  const [limiteTrasNoturno, setLimiteTrasNoturno] = useState<number>(0);
  const [limitePixDiario, setLimitePixDiario] = useState<number>(0);
  const [limitePixNoturno, setLimitePixNoturno] = useState<number>(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [nPagina, setNpagina] = useState(1);
  const [menssageAlert, setMenssageAlert] = useState('');
  const [typeAlert, setTypeAlert] = useState<AlertColor>('success');

  const {
    allFields,
    valorTransferDia,
    valorTransferNoite,
    valorPixDia,
    valorPixNoite,
    setFieldRedux,
    invalidFields,
    resetUserRegisterDataRedux,
  } = props;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<dadosInputGFormProps>({
    mode: 'onChange',

  });

  const handleValueChange = ({ name, valor, isValid, page }: {
    name: string;
    valor: string; // Add this line to explicitly declare the type
    isValid: boolean;
    page: number;
  }) => {
    setFieldRedux(name, {
      name,
      valor,
      isValid,
      page,
    });
  };

  const verifyFieldsByPage = (page: number) => {
    const invalidFieldsByPage = invalidFields.filter(
      (field: string) => allFields[field]?.page === page
    );

    let isValid = true;

    if (page === 1) {

      if (!valorTransferDia.isValid) {
        isValid = false;
        handleClick('O valor da transferência diária deve ser maior que 0,00', 'error');
      }

      if (!valorTransferNoite.isValid) {
        isValid = false;
        handleClick('O valor da transferência noturna deve ser maior que 0,00', 'error');
      }
    }
    if (page === 2) {

      if (!valorPixDia.isValid) {
        isValid = false;
        handleClick('O valor do pix diário deve ser maior que 0,00', 'error');
      }

      if (!valorPixNoite.isValid) {
        isValid = false;
        handleClick('O valor do pix noturno deve ser maior que 0,00', 'error');
      }
    }

    if (!isValid) {

      return false;
    }

    return isValid;
  };

  const handleNextPage = async (numberPage: number) => {

    const isValidsFields = verifyFieldsByPage(numberPage);


    if (numberPage === 1) {
      if (isValidsFields) {
        alert('salva valor transferência')
      }
    }
    if (numberPage === 2) {
      if (isValidsFields) {
        alert('salva valor pix')
      }
    }
  };

  const handleClick = (menssage: string, type: AlertColor) => {
    setMenssageAlert(menssage);
    setTypeAlert(type)
    setOpenAlert(true);
  };

  const handleChangeTrasferDay = (event: Event, newValue: number | number[]) => {
    console.log('valor diario', newValue)
    handleValueChange({
      name: 'valorTransferDia',
      valor: String(newValue),
      isValid: true,
      page: 1,
    });
    setLimiteTrasDiario(newValue as number);
  };

  const handleChangeTransferNigth = (event: Event, newValue: number | number[]) => {
    console.log('valor noturno', newValue)
    handleValueChange({
      name: 'valorTransferNoite',
      valor: String(newValue),
      isValid: true,
      page: 1,
    });
    setLimiteTrasNoturno(newValue as number);
  };

  const handleChangePixDay = (event: Event, newValue: number | number[]) => {
    handleValueChange({
      name: 'valorPixDia',
      valor: String(newValue),
      isValid: true,
      page: 1,
    });
    setLimitePixDiario(newValue as number);
  };

  const handleChangePixNigth = (event: Event, newValue: number | number[]) => {
    handleValueChange({
      name: 'valorPixNoite',
      valor: String(newValue),
      isValid: true,
      page: 1,
    });
    setLimitePixNoturno(newValue as number);
  };

  useEffect(() => {

    dispatch(resetUserRegisterData());


  }, [dispatch]);

  return (
    <Container>
      <section className={styles.containerTransferencia}>
        <div className={styles.cardLeft}>
          <div className={styles.titleContainer}>
            <IconTRansfer
              height={25}
              width={25}
              primaryColor={'#0fa49b'}
              secondaryColor={'#0fa49b'}
            />
            <h3>Limites de Trasferências</h3>
          </div>
          <div className={styles.containerLimite}>
            <div className={styles.cardLimites}>

              <Box
                sx={isMobile == false ? { width: '100%', paddingLeft: 16, paddingRight: 16, paddingBottom: 4 } : { width: 250 }}>
                <Typography gutterBottom>
                  Diário:
                  {valorTransferDia.valor != '' ? moneyMaskNumber(valorTransferDia.valor) : '0,00'}
                </Typography>
                <PrettoSlider
                  value={valorTransferDia.valor}
                  onChange={handleChangeTrasferDay}
                  min={0.00}
                  max={90000}
                  step={100}
                  marks={marks}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(limiteTrasDiario) => moneyMaskNumber(limiteTrasDiario as number)}
                />
              </Box>
              <Box
                sx={isMobile == false ? { width: '100%', paddingLeft: 16, paddingRight: 16, paddingBottom: 4 } : { width: 250 }}>
                <Typography gutterBottom>
                  Noturno:
                  {valorTransferNoite.valor != '' ? moneyMaskNumber(valorTransferNoite.valor) : '0,00'}
                </Typography>
                <PrettoSlider
                  value={valorTransferNoite.valor}
                  onChange={handleChangeTransferNigth}
                  min={0.00}
                  max={90000}
                  step={100}
                  marks={marks}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(limiteTrasNoturno) => moneyMaskNumber(limiteTrasNoturno as number)}
                />
              </Box>



            </div>
            <div className={styles.cardButtomLimit}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => { handleNextPage(1) }}
              >
                Alterar
              </Button>
            </div>

          </div>
        </div>
        <div className={styles.cardLeft}>
          <div className={styles.titleContainer}>
            <IconPix
              height={25}
              width={25}
              primaryColor={'#0fa49b'}
              secondaryColor={'#0fa49b'}
            />
            <h3>Limites de Pix</h3>
          </div>
          <div className={styles.containerLimite}>
            <div className={styles.cardLimites}>

              <Box
                sx={isMobile == false ? { width: '100%', paddingLeft: 16, paddingRight: 16, paddingBottom: 4 } : { width: 250 }}>
                <Typography gutterBottom>
                  Diário:
                  {valorPixDia.valor != '' ? moneyMaskNumber(valorPixDia.valor) : '0,00'}
                </Typography>
                <PrettoSlider
                  value={valorPixDia.valor}
                  onChange={handleChangePixDay}
                  min={0.00}
                  max={90000}
                  step={100}
                  marks={marks}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(limitePixDiario) => moneyMaskNumber(limitePixDiario as number)}
                />
              </Box>
              <Box
                sx={isMobile == false ? { width: '100%', paddingLeft: 16, paddingRight: 16, paddingBottom: 4 } : { width: 250 }}>
                <Typography gutterBottom>
                  Noturno:
                  {valorPixNoite.valor != '' ? moneyMaskNumber(valorPixNoite.valor) : '0,00'}
                </Typography>
                <PrettoSlider
                  value={valorPixNoite.valor}
                  onChange={handleChangePixNigth}
                  min={0}
                  max={90000}
                  step={100}
                  marks={marks}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(limitePixNoturno) => moneyMaskNumber(limitePixNoturno as number)}
                />
              </Box>
            </div>
            <div className={styles.cardButtomLimit}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => { handleNextPage(2) }}
              >
                alterar
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="info">
          <AlertTitle>
            <Typography variant="h6">Informações sobre limites</Typography>
          </AlertTitle>
          <Typography variant="body1">
            Os limites de transferências e pix referem-se aos valores máximos que podem ser transferidos em uma única
            transação ou em um determinado período de tempo. Esses limites podem variar dependendo do tipo de transação
            e do perfil do usuário.
            <br />
            <br />
          </Typography>
          <Typography variant="body1">
            1. O limite diário de transação abrange intervalo de 06:00 da manhã as 18:00 da noite
            <br />

            2. O limite noturno de transação abrange intervalo de 18:00 da noite as 06:00 da manhã
            <br />

            3. O limite diário de Pix abrange intervalo de 06:00 da manhã as 18:00 da noite
            <br />

            4. O limite noturno de Pix abrange intervalo de 18:00 da noite as 06:00 da manhã

          </Typography>
        </Alert>
      </Stack>
      {
        openAlert && (
          <AlertSnack
            message={menssageAlert}
            typeMessage={typeAlert}
            openAlertComponent={openAlert}
            onBack={() => { setOpenAlert(!openAlert) }}
          />
        )
      }
    </Container>
  );
};

const mapStateToProps = (state: any) => {
  return {
    allFields: getPropSegura(state, ['userRegisterReducer'], {}),
    invalidFields: getPropSegura(
      state,
      ['userRegisterReducer', 'invalidFields'],
      []
    ),

    valorTransferDia: getPropSegura(
      state,
      ['userRegisterReducer', 'valorTransferDia'],
      {
        valor: '',
        isValid: false,
        page: 1,
      }
    ),

    valorTransferNoite: getPropSegura(
      state,
      ['userRegisterReducer', 'valorTransferNoite'],
      {
        valor: '',
        isValid: false,
        page: 1,
      }
    ),

    valorPixDia: getPropSegura(
      state,
      ['userRegisterReducer', 'valorPixDia'],
      {
        valor: '',
        isValid: false,
        page: 2,
      }
    ),
    valorPixNoite: getPropSegura(
      state,
      ['userRegisterReducer', 'valorPixNoite'],
      {
        valor: '',
        isValid: false,
        page: 2,
      }
    ),

  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setFieldRedux: (field: string, value: string) => {
      dispatch(setUserRegisterField(field, value));
    },
    resetUserRegisterDataRedux: () => {
      dispatch(resetUserRegisterData());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DailyLimit);
