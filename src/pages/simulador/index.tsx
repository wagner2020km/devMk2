import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import Link from 'next/link';

import Container from '../../layout/Container';
import { Minicards } from '../../components/MiniCads/MiniCards';
import { Spinner } from '../../components/Spinner/Spinner';

import { canSSRAuth } from '../../utils/canSSRAuth';
import { getExtratos } from '../../api/extrato';

import styles from './styles.module.scss';
import { Buttom } from '../../components/ui/Buttom';
import IconTRansfer from '../../components/IconesBith/IconTRansfer';
import IconPix from '../../components/IconesBith/IconPix';
import IconContas from '../../components/IconesBith/IconContas';
import CartoesIcon from '../../lib/bibliotecaBit/icons/CartoesIcon';
import Extrato from '../../lib/bibliotecaBit/icons/Extrato';
import Pix from '../../lib/bibliotecaBit/icons/Pix';
import Entrada from '../../lib/bibliotecaBit/icons/Entrada';
import Saida from '../../lib/bibliotecaBit/icons/Saida';
import SetaExtrato from '../../lib/bibliotecaBit/icons/SetaExtrato';
import { InputFormBit } from '../../components/ui/InputFormBit';
import BotaoOpcoesExtrato from '../../components/ui/BotaoOpcoesExtrato';
import IconsBith from '../../lib/IconsBith/';
import { numeroParaReal } from '../../utils/maks';
import Pagination from '../../components/Pagination/Pagination';
import { getSaldo } from '../../api/carteira';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// inicio aqui
import {

  moneyMask,
  formaTavalorCelcoin,
  formaTarInteiroParaDecimal,
  formataVirgulaAdireita,
  prrintValorMonetario
} from '../../utils/cpfMask';
import TextField from '@mui/material/TextField';
import { InputFormBitClean } from '../../components/ui/InputFormBit'
import Box from '@mui/material/Box';
import Select from 'react-select';
import {
  resetUserRegisterData,
  setUserRegisterField,
} from '../../redux/actions/userRegisterActions';
import { connect } from 'react-redux';
import getPropSegura from '../../utils/getPropSegura';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { yupResolver } from '@hookform/resolvers/yup';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import { AlertColor } from '@mui/material/Alert';
import * as yup from 'yup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Pagar from '../../lib/bibliotecaBit/icons/Pagar';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { flagPayment } from '../../api/aquisicaoEquipamento';
import { simularTaxas } from '../../api/transacoesEquipamento';
import { useDispatch } from 'react-redux';
import AlertSnack from '../../components/AlertSnack/AlertSnack'
import {filiaisTransacaoes } from '../../api/transacoesEquipamento';
import {getImageCard} from '../../utils/imgCartoes/bandeiraCartoes'
import {
  validaDataBr,
  pegaDataAtual,
  pegaApenasData,
} from '../../validacoes/DataBr';

import { validaDiaDoMes, pegaHoraMinuto } from '../../utils/GetDate';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const bandeiras = [
  { value: 1, label: 'Visa' },
  { value: 2, label: 'Master' },
  { value: 3, label: 'Elo' },
  { value: 4, label: 'Hiper' },
  { value: 5, label: 'Outras' },
];
const formaPagBandeiras = [
  { value: 1, label: 'Débito' },
  { value: 2, label: 'Crédito à Vista' },
  { value: 3, label: 'Parcelado 2x' },
  { value: 4, label: 'Parcelado 3x' },
  { value: 5, label: 'Parcelado 5x' },
  { value: 6, label: 'Parcelado 6x' },
  { value: 7, label: 'Parcelado 7x' },
]
type dadosInputGFormProps = {
  valorVenda: string;
  bandeira: string;
  filial: number;
  antecipacao: string

};

type dadosBandeira = {
  value: number;
  label: string;

};

const teste = [{
  "cliente_id": 1,
  "descricao": "DEBITO - 1 x",
  "valor1": "R$ 1.012,35",
  "valor2": "%1.22",
  "valor3": "R$ 1.000,00",
},
{
  "cliente_id": 2,
  "descricao": "CRÉDITO - 1 x",
  "valor1": "R$ 1.035,35",
  "valor2": "%1.29",
  "valor3": "R$ 1.000,00",
},
{
  "cliente_id": 3,
  "descricao": "CRÉDITO - 2 x",
  "valor1": "R$ 1.052,35",
  "valor2": "%1.35",
  "valor3": "R$ 1.000,00",
}

]

type dadosSelect = {
  value: number;
  label: string;

};
const Simulador = (props: any) => {

  const user = useSelector((state: any) => state.userReducer.user);
  const saldo = useSelector((state: any) => state.saldoReducer.saldo);
  const [formFlagPayment, setFormFlagPayment] = useState<dadosBandeira[]>([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [flag, setFlag] = useState(0);
  const [formPayment, setFormPayment] = useState(0);
  const [nPagina, setNpagina] = useState(1);
  const [menssageAlert, setMenssageAlert] = useState('');
  const [typeAlert, setTypeAlert] = useState<AlertColor>('success');
  const [filialSimulador, setFilialSimulador] = useState<dadosSelect[]>([]);
  const [listKeyExtract, setListExtract] = useState<any>([]);
  const [tempValueFilial, setTempValueFilial] = useState(0);

  const dispatch = useDispatch();
  const [openAlert, setOpenAlert] = useState(false);
  const {
    allFields,
    valorVenda,
    bandeira,
    filial,
    antecipacao,
    setFieldRedux,
    invalidFields,
    resetUserRegisterDataRedux,
  } = props;

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



  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<dadosInputGFormProps>({
    mode: 'onChange',

  });

  const getFlag = async () => {

    try {
      const response = await flagPayment(String(flag));
      //console.log('retorna Taxas', response.data[0]);
      let dataBandeiras = [];
      if (response.status == 200) {

        console.log('forma pagamento', response.data[0]);
        dataBandeiras = [{
          value: response.data[0].seq_idtaxas_tabelas_planos,
          label: response.data[0].Descricao
        }],
          setFormFlagPayment(dataBandeiras)
      }

    } catch (error) {
      console.log(error);

    }

  }

  const handleFilal = async () => {
    try {
      //user?.numeroConta
      const response = await filiaisTransacaoes('130014209', '1142');
      // const response = await filiaisTransacaoes('80500', '8562');
      // console.log('dados ', response);
      if (response.status == 200) {
        // console.log('retorno filial', response.data)
        setFilialSimulador(response.data.map(item => ({ value: item.cfilialid, label: item.Filial })));
        //  setDataTypePayment(response.data)
      }

    } catch (error) {
      setIsOpen(false);
      console.log(error);

    }

  }
  const handleSimulation = async () => {
    setIsOpen(true);
    if (valorVenda.isValid != true || bandeira.isValid != true || filial.isValid != true) {
      return '';
    }

    const valor = formaTavalorCelcoin(String(valorVenda.valor))
    try {
      const response = await simularTaxas(filial.valor, bandeira.valor, parseInt(valor));
      //console.log('retorna Taxas', response.data[0]);
      if (response.status == 200) {

        setListExtract(response.data[0]);
        setIsOpen(false);
      }

    } catch (error) {
      console.log(error);
      setIsOpen(false);

    }
  }


  const verifyFieldsByPage = (page: number) => {
    const invalidFieldsByPage = invalidFields.filter(
      (field: string) => allFields[field]?.page === page
    );
    let isValid = true;

    if (page === 1) {

      if (!valorVenda.isValid) {
        isValid = false;
        handleClick('Valor da venda é obrigatório', 'error');
      }else{
        console.log('Passando no valor para comparar', formataVirgulaAdireita(valorVenda.valor))
       // isValid = false;
        if(formataVirgulaAdireita(valorVenda.valor) < '100'){
          isValid = false;
          handleClick('Valor não pode ser 0.00', 'error');
        }
      }
      if (!bandeira.isValid) {
        isValid = false;
        handleClick('Bandeira é obrigatório', 'error');
      }
      if (!filial.isValid) {
        isValid = false;
        handleClick('Forma de pagamento é obrigatório', 'error');
      }
      if (!antecipacao.isValid) {
        isValid = false;
      }

    }

    if (!isValid) {
      //	toast.error('Preencha os dados corretamente', toastConfig);
     
      return false;
    }

    return isValid;
  };

  const handleNextPage = async () => {
    const isValidsFields = verifyFieldsByPage(nPagina);
    console.log('handleNextPage', isValidsFields);
    
    if (nPagina === 1) {
      if (isValidsFields) {
        //	setNpagina((prev) => prev + 1);
        //	handleSendCode('sms', telefone.valor);
        handleSimulation()
        console.log('validando')
      }
    }
  };


  const handleClick = (menssage: string, type: AlertColor) => {
    setMenssageAlert(menssage);
    setTypeAlert(type)
    setOpenAlert(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const handleFilialidChange = (val: any) => {

    const inputValue = val;
    let isValid = false;
    if (inputValue > 0) {
      isValid = true;
      const auxInvalidFields = [
        ...invalidFields,
        'filial',
      ];
      setFieldRedux('invalidFields', auxInvalidFields);
    } else {
      isValid = false;
      const auxInvalidFields = invalidFields.filter(
        (field: string) => field !== 'filial'
      );
      setFieldRedux('invalidFields', auxInvalidFields);
    }
    handleValueChange({
      name: 'filial',
      valor: inputValue,
      isValid: isValid,
      page: 1,
    });
  };
  useEffect(() => {
    console.log('atualizou', formFlagPayment)
    getFlag()

  }, [flag])
  useEffect(() => {
    // Disparar a ação de limpar dados quando o componente for montado
    dispatch(resetUserRegisterData());
    handleFilal()
  }, [dispatch]);
  useEffect(() => {
    if (filialSimulador.length > 0) {

      setValue('filial', filialSimulador[0].value);
      handleFilialidChange(filialSimulador[0].value)
      setTempValueFilial(filialSimulador[0].value)

    }

  }, [filialSimulador])
  return (
    <Container>
      <div className={styles.titleContainer}>
        <Pagar size={16} color="#000" />
        <h3>&nbsp;Simulador</h3>
      </div>
      <div className={styles.contentdataForm}>

        <div className={styles.iputGroup}>
          <div className={styles.containerInut}>

          {errors.valorVenda ? (
											<p className={styles.erroInputForm}>{errors.valorVenda?.message}</p>
										) : (
											<label className={styles.labelInputForm}>Valor venda</label>
										)}
            <Controller
            rules={{ required: 'Por favor, selecione uma bandeira.' }}
              control={control}
              name="valorVenda"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputFormBitClean
                  placeholder="Valor"
                  type="text"
                  onChange={(event) => {
                    const inputValue = moneyMask(event.target.value);
                    let isValid = true;

                    //console.log('validando select ', val.value)
                    if (parseInt(inputValue) < 0 || parseInt(inputValue) == 0.00) {
                      isValid = false;
                    
                      const auxInvalidFields = [
                        ...invalidFields,
                        'valorVenda',
                      ];
                      setFieldRedux('invalidFields', auxInvalidFields);

                    } else {
                      isValid = true;
                      const auxInvalidFields = invalidFields.filter(
                        (field: string) => field !== 'valorVenda'
                      );
                      setFieldRedux('invalidFields', auxInvalidFields);
                    }
                    console.log('isValid é', isValid)
                    handleValueChange({
                      name: 'valorVenda',
                      valor: inputValue,
                      isValid: isValid,
                      page: 1,
                    });
                  }}

                  value={valorVenda.valor}
                />
              )}
            />

          
          </div>

          <div className={styles.containerInut}>
            {errors.valorVenda ? (
              <p className={styles.erroInputForm}>{errors.valorVenda?.message}</p>
            ) : (
              <label className={styles.labelInputForm}>Bandeira</label>
            )}

            <Controller
              rules={{ required: 'Por favor, selecione uma bandeira.' }} // Definindo regras de validação
              control={control}
              name="bandeira"
              render={({ field: { onChange, onBlur, value } }) => (
                <Select
                  placeholder="Selecione a Bandeira"
                  options={bandeiras}
                  className="basic-single"
                  value={bandeiras.find((c) => c.value === Number(value))}
                  onChange={(val: any) => {
                    onChange(val.value), setFlag(val.value);
                    const inputValue = val.value;
                    let isValid = false;
                    if (inputValue > 0) {
                      isValid = true;
                      const auxInvalidFields = [
                        ...invalidFields,
                        'bandeira',
                      ];
                      setFieldRedux('invalidFields', auxInvalidFields);
                    } else {
                      isValid = false;
                      const auxInvalidFields = invalidFields.filter(
                        (field: string) => field !== 'bandeira'
                      );
                      setFieldRedux('invalidFields', auxInvalidFields);
                    }
                    handleValueChange({
                      name: 'bandeira',
                      valor: inputValue,
                      isValid: isValid,
                      page: 1,
                    });

                  }}
                  defaultInputValue=""
                />
              )}
            />
          </div>
          <div className={styles.containerInut}>
            {errors.bandeira && <p>{errors.bandeira.message}</p>}
            {errors.bandeira ? (
              <p className={styles.erroInputForm}>{errors.bandeira?.message}</p>
            ) : (
              <label className={styles.labelInputForm}>Forma de pagamento</label>
            )}

            <Controller
              control={control}
              name="filial"
              render={({ field: { onChange, onBlur, value } }) => (
                <Select
                  placeholder="Selecione a Filial"
                  options={filialSimulador}
                  className="basic-single"
                  value={filialSimulador.find((c) => c.value === Number(value))}
                  onChange={(val: any) => {
                    onChange(val.value), setFormPayment(val.value);
                    const inputValue = val.value;
                    let isValid = false;
                    if (inputValue > 0) {
                      isValid = true;
                      const auxInvalidFields = [
                        ...invalidFields,
                        'filial',
                      ];
                      setFieldRedux('invalidFields', auxInvalidFields);
                    } else {
                      isValid = false;
                      const auxInvalidFields = invalidFields.filter(
                        (field: string) => field !== 'filial'
                      );
                      setFieldRedux('invalidFields', auxInvalidFields);
                    }
                    handleValueChange({
                      name: 'filial',
                      valor: inputValue,
                      isValid: isValid,
                      page: 1,
                    });
                  }}
                  defaultValue={tempValueFilial > 0 ? { value: filialSimulador[0]?.value, label: filialSimulador[0]?.label } : null} // Define a primeira opção como padrão
                />
              )}
            />
          </div>
        </div>
        <div className={styles.iputGroupantecipacao}>
          <div className={styles.containerInut}>
            <FormLabel id="demo-radio-buttons-group-label">Antecipação</FormLabel>
            <Controller
              control={control}
              name="antecipacao"
              render={({ field: { onChange, onBlur, value } }) => (
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                  value={antecipacao.value}
                  onChange={(val: any) => {

                    const inputValue = val.value;
                    let isValid = false;
                    if (inputValue != null) {
                      isValid = true;
                      const auxInvalidFields = [
                        ...invalidFields,
                        'antecipacao',
                      ];
                      setFieldRedux('invalidFields', auxInvalidFields);
                    } else {
                      isValid = false;
                      const auxInvalidFields = invalidFields.filter(
                        (field: string) => field !== 'antecipacao'
                      );
                      setFieldRedux('invalidFields', auxInvalidFields);
                    }
                    handleValueChange({
                      name: 'antecipacao',
                      valor: inputValue,
                      isValid: true,
                      page: 1,
                    });
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item>
                      <FormControlLabel value="female" control={<Radio />} label="Sem antecipação" />
                    </Grid>
                    <Grid item>
                      <FormControlLabel value="male" control={<Radio />} label="Com atecipação automática" />
                    </Grid>
                    <Grid item>
                      <FormControlLabel value="other" control={<Radio />} label="com antecipação pontual" />
                    </Grid>
                  </Grid>
                </RadioGroup>
              )}
            />

          </div>
          <div className={styles.containerInut}>

            <Button
              type="submit"
              variant="contained"
              color="success"
              onClick={() => {
                handleNextPage()
              }}
            >
              Pesquisar
            </Button>
          </div>
        </div>


      </div>
      <section className={styles.containerListAcount}>
        <div className={styles.containerDataList}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="caption table">
                {listKeyExtract.length === 0 ? (
                  <div className={styles.contantAlertTable}>
                    <Stack sx={{ width: '100%' }} spacing={2} textAlign={'center'}>
                      <Alert severity="warning">
                        <AlertTitle>Ops</AlertTitle>
                        Nenhuma informação encontrada, <strong>Preencha o formulário para simular uma taxa</strong>
                      </Alert>
                    </Stack>
                  </div>

                )
                  :
                  (
                    <>
                      <TableHead>
                        <TableRow>
                          <TableCell align="left" style={{fontWeight: 'bold'}}>TIPO DE COBRANÇA</TableCell>
                          <TableCell align="left" style={{fontWeight: 'bold'}}>BANDEIRA</TableCell>
                          <TableCell align="left" style={{fontWeight: 'bold'}}>VALOR CLIENTE</TableCell>
                          <TableCell align="left" style={{fontWeight: 'bold'}}>TAXA EFETIVA</TableCell>
                          <TableCell align="left" style={{fontWeight: 'bold'}}>LIQUIDO A RECEBER</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listKeyExtract.map((row: any) => (

                          <TableRow key={row.numero_parcelas} className={styles.linhaTabela}>
                            {row.numero_parcelas < 13 && (
                              <>
                                <TableCell component="th"><span className={styles.textTpo}>{row.tipocobranca.toUpperCase()} - {row.numero_parcelas} x</span></TableCell>
                                <TableCell component="th"><span className={styles.textTpo}>{getImageCard(row.bandeira)}</span></TableCell>
                                <TableCell align="left"><span className={styles.textValorCliente}>R$ {row.Valor_Comprador != null ? prrintValorMonetario(String(row.Valor_Comprador)) : '0,00'}</span></TableCell>
                                <TableCell align="left"><span className={styles.textValorTaxa}>%{row.Taxa != null ? row.Taxa : '0.00'}</span></TableCell>
                                <TableCell align="left"><span className={styles.textValorLiquido}>R$ {row.Valor_Liquido != null ? formaTarInteiroParaDecimal(row.Valor_Liquido) : '0,00'}</span></TableCell>
                              </>

                            )}
                          </TableRow>


                        ))}
                      </TableBody>
                    </>
                  )}
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </section>
      {/*
<Button onClick={handleClick}>Open Snackbar</Button>
*/}

{openAlert && (
            <AlertSnack
              message={menssageAlert}
              typeMessage={typeAlert}
              openAlertComponent={openAlert}
              onBack={() => { setOpenAlert(!openAlert) }}
            />
          )

          }
      {modalIsOpen ? <Spinner /> : ''}
    </Container>

  );
}



const mapStateToProps = (state: any) => {
  return {
    allFields: getPropSegura(state, ['userRegisterReducer'], {}),
    invalidFields: getPropSegura(
      state,
      ['userRegisterReducer', 'invalidFields'],
      []
    ),

    valorVenda: getPropSegura(
      state,
      ['userRegisterReducer', 'valorVenda'],
      {
        valor: '',
        isValid: false,
        page: 1,
      }
    ),
    bandeira: getPropSegura(
      state,
      ['userRegisterReducer', 'bandeira'],
      {
        valor: '',
        isValid: false,
        page: 1,
      }
    ),
    filial: getPropSegura(
      state,
      ['userRegisterReducer', 'filial'],
      {
        valor: '',
        isValid: false,
        page: 1,
      }
    ),
    antecipacao: getPropSegura(
      state,
      ['userRegisterReducer', 'antecipacao'],
      {
        valor: '',
        isValid: true,
        page: 1,
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

export default connect(mapStateToProps, mapDispatchToProps)(Simulador);