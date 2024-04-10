
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Select from 'react-select';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import Container from '../../layout/Container';

import { Spinner } from '../../components/Spinner/Spinner';
import Pagination from '../../components/Pagination/Pagination';
import { InputFormBitClean } from '../../components/ui/InputFormBit'
import AlertSnack from '../../components/AlertSnack/AlertSnack'
import ExportToExcel from '../../components/ExportToExcel/ExportToExcel'

import styles from './styles.module.scss';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import { AlertColor } from '@mui/material/Alert';
import Button from '@mui/material/Button';

import {
  resetUserRegisterData,
  setUserRegisterField,
} from '../../redux/actions/userRegisterActions';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';

import { extratoEquipamento, filiaisTransacaoes } from '../../api/transacoesEquipamento';
import { acountNumberMachine, typePaymentMachine } from '../../api/aquisicaoEquipamento';
import Pagar from '../../lib/bibliotecaBit/icons/Pagar';
import getPropSegura from '../../utils/getPropSegura';
import { moneyMask } from '../../utils/cpfMask';
import { dataUsaParaBr } from '../../utils/GetDate'





const daysSearch = [
  { value: 0, label: 'limpar' },
  { value: 7, label: '7 dias' },
  { value: 15, label: '15 dias' },
  { value: 30, label: '30 dias' },
  { value: 45, label: '45 dias' },
  { value: 123, label: 'Entre datas' },
];

const bandeiras = [
  { value: 1, label: 'Visa' },
  { value: 2, label: 'Master' },
  { value: 3, label: 'Elo' },
  { value: 4, label: 'Hiper' },
  { value: 5, label: 'Outras' },
];

const numberPaginnation = [
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 250, label: '250' },
  { value: 500, label: '500' }
];

type dadosInputGFormProps = {

  bandeira: number;
  formaPg: string;
  paginacao: string;
  dias: string;
  dataStart: Date,
  dataEnd: Date,
  filialid: number

};


type dadosSelect = {
  value: number;
  label: string;

};


const ExtratoVendas = (props: any) => {

  const user = useSelector((state: any) => state.userReducer.user);
  const saldo = useSelector((state: any) => state.saldoReducer.saldo);
  const router = useRouter();
  const dispatch = useDispatch();
  const [habilitaEntreDatas, setHabilitaEntreDatas] = useState(false)
  const [dataTypePayment, setDataTypePayment] = useState<dadosSelect[]>([]);
  const [filialTransacoes, setFilialTransacoes] = useState<dadosSelect[]>([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [flag, setFlag] = useState(0);
  const [formPayment, setFormPayment] = useState(0);
  const [nPagina, setNpagina] = useState(1);
  const [listKeyExtract, setListExtract] = useState<any>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [menssageAlert, setMenssageAlert] = useState('');
  const [typeAlert, setTypeAlert] = useState<AlertColor>('success');
  const [habilitaExtrato, setHabilitaExtrato] = useState(false);
  const [tempValueFilial, setTempValueFilial] = useState(0);
  const [tempNameFilial, setTempNameFilial] = useState('');

  const [actualPage, setActualPage] = useState(1);
  const [totalRegistro, setTotalRegistro] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [nextPage, setNextPage] = useState(1);
  const [backNextPage, setBackPage] = useState(0);

  const {
    allFields,
    dias,
    bandeira,
    formaPg,
    paginacao,
    dataStart,
    dataEnd,
    filialid,
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
    reset
  } = useForm<dadosInputGFormProps>({
    mode: 'onChange',
    //  resolver: yupResolver(schema),
  });

  const handleAcountMachine = async () => {

    try {
      //user?.numeroConta
      const response = await acountNumberMachine(user?.numeroConta);
      // console.log('dados ', response);
      if (response.status == 200) {
        if (response.data > 0) {
          setHabilitaExtrato(true);
        }
      }

    } catch (error) {
      setIsOpen(false);
      console.log(error);

    }
  }

  const typePayment = async () => {
    try {
      //user?.numeroConta
      const response = await typePaymentMachine();
      // console.log('dados ', response);
      if (response.status == 200) {
        // console.log('tipo pagamento', response.data)
        setDataTypePayment(response.data.map(item => ({ value: item.id, label: item.descricao })));
      }

    } catch (error) {
      setIsOpen(false);
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
        setFilialTransacoes(response.data.map(item => ({ value: item.cfilialid, label: item.Filial })));
        //  setDataTypePayment(response.data)
      }

    } catch (error) {
      setIsOpen(false);
      console.log(error);

    }

  }

  const handleTransactionEc = async () => {
    setIsOpen(true);
    const validaFilial = filialTransacoes.length == 1 ?
      {
        "name": "filialid",
        "valor": filialTransacoes[0]?.value,
        "isValid": true,
        "page": 1
      }
      : filialid;

    let dataForm = {
      filtroDia: dias,
      filtroBandeiras: bandeira,
      filtroFormPg: formaPg,
      filtroFormDataIni: dataStart,
      filtroDataFim: dataEnd,
      filtroFilialId: validaFilial
    }
    try {
      const response = await extratoEquipamento(actualPage, perPage, dataForm);
      //  console.log('extrato', response)
      if (response.status == 200) {

        setTotalRegistro(response?.pagination?.totalItems)
        setPageSize(response?.pagination?.totalPages)
        setNextPage(response?.pagination?.nextPage)
        setBackPage(response?.pagination?.backPage)
        setListExtract(response.data)
        setIsOpen(false);
      } else {
        setIsOpen(false);
      }

    } catch (error) {
      setIsOpen(false);
      console.log(error);

    }

  }

  const handleClick = (menssage: string, type: AlertColor) => {

    setMenssageAlert(menssage);
    setTypeAlert(type)
    setOpenAlert(true);
  };

  const verifyFieldsByPage = (page: number) => {
    const invalidFieldsByPage = invalidFields.filter(
      (field: string) => allFields[field]?.page === page
    );
    let isValid = false;

    if (page === 1) {

      if (dias.isValid || bandeira.isValid || formaPg.isValid || filialid.isValid) {
        isValid = true;

      }
      if (dias.isValid) {
        if (dias.valor == 123) {
          if (!dataStart.isValid) {
            isValid = false;
            return handleClick('Data Inicial é obrigatório', 'error');
          }
          if (!dataEnd.isValid) {
            isValid = false;
            return handleClick('Data Final é obrigatório', 'error');
          }
        }
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
    
    if (nPagina === 1) {
      if (isValidsFields) {
        handleTransactionEc()

      }
    }
  };

  useEffect(() => {

    reset();
    dispatch(resetUserRegisterData());
    handleAcountMachine();
    typePayment();
    handleFilal();
    handleTransactionEc();

  }, [])
  useEffect(() => {

    if (pagePagination == pageSize) {
      setPagePagination(0)
    } else {
      setPagePagination(nextPage);
    }
    handleTransactionEc()
  }, [actualPage])

  useEffect(() => {

  }, [openAlert])

  const handleFilialidChange = (val: any) => {

    const inputValue = val;
    let isValid = false;
    if (inputValue > 0) {
      isValid = true;
      const auxInvalidFields = [
        ...invalidFields,
        'filialid',
      ];
      setFieldRedux('invalidFields', auxInvalidFields);
    } else {
      isValid = false;
      const auxInvalidFields = invalidFields.filter(
        (field: string) => field !== 'filialid'
      );
      setFieldRedux('invalidFields', auxInvalidFields);
    }
    handleValueChange({
      name: 'filialid',
      valor: inputValue,
      isValid: isValid,
      page: 1,
    });
  };

  useEffect(() => {
    if (filialTransacoes.length > 0) {

      setValue('filialid', filialTransacoes[0].value);
      handleFilialidChange(filialTransacoes[0].value);
      setTempValueFilial(filialTransacoes[0].value);
      setTempNameFilial(filialTransacoes[0].label);
    }

  }, [filialTransacoes])
  return (
    <Container>
      <div className={styles.titleContainer}>
        <Pagar size={16} color="#000" />
        <h3>&nbsp;Extrato</h3>
      </div>
      {habilitaExtrato == true ? (
        <>

          <div className={styles.contentdataForm}>

            <div className={styles.iputGroup}>
              <div className={styles.containerInut}>
                {errors.dias ? (
                  <p className={styles.erroInputForm}>{errors.dias?.message}</p>
                ) : (
                  <label className={styles.labelInputForm}>Intervalo</label>
                )}

                <Controller
                  control={control}
                  name="dias"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select
                      placeholder="Intervalo"
                      options={daysSearch}
                      className="basic-single"
                      value={daysSearch.find((c) => c.value === Number(value))}
                      onChange={(val: any) => {
                        onChange(val.value), setPagePagination(val.value);
                        if (val.value == 123) {
                          setHabilitaEntreDatas(true);

                          handleValueChange({
                            name: 'dataStart',
                            valor: null,
                            isValid: false,
                            page: 1,
                          });
                          handleValueChange({
                            name: 'dataEnd',
                            valor: null,
                            isValid: false,
                            page: 1,
                          });
                        } else {
                          setValue('dataStart', new Date(''));
                          setValue('dataEnd', new Date(''));
                          setHabilitaEntreDatas(false)
                        }
                        console.log('valor dia onchange', val.value)
                        const inputValue = val.value;
                        let isValid = false;
                        if (inputValue > 0) {
                          isValid = true;
                          const auxInvalidFields = [
                            ...invalidFields,
                            'dias',
                          ];
                          setFieldRedux('invalidFields', auxInvalidFields);
                        } else {
                          isValid = false;
                          const auxInvalidFields = invalidFields.filter(
                            (field: string) => field !== 'dias'
                          );
                          setFieldRedux('invalidFields', auxInvalidFields);
                        }
                        handleValueChange({
                          name: 'dias',
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
              {habilitaEntreDatas == true && (
                <>
                  <div className={styles.containerInut}>
                    {errors.dias ? (
                      <p className={styles.erroInputForm}>{errors.dias?.message}</p>
                    ) : (
                      <label className={styles.labelInputForm}>Data inicial</label>
                    )}

                    <Controller
                      control={control}
                      name="dataStart"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <InputFormBitClean
                          placeholder="Data"
                          type="date"
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            let isValid = true;

                            console.log('data onchange ', event.target.value);
                            if (inputValue == '') {
                              isValid = false;
                              handleClick('Data inicial Obrigatória', 'error');
                            } else {
                              if (inputValue > dataEnd.valor && dataEnd.valor != '') {
                                console.log('data inicial maior que data final');
                                console.log('data final aqui', dataEnd.valor)
                                handleClick('Data inicial maior que data final', 'error');
                                isValid = false;

                                const auxInvalidFields = [
                                  ...invalidFields,
                                  'dataStart',
                                ];
                                setFieldRedux('invalidFields', auxInvalidFields);

                              } else {
                                isValid = true;
                                const auxInvalidFields = invalidFields.filter(
                                  (field: string) => field !== 'dataStart'
                                );
                                setFieldRedux('invalidFields', auxInvalidFields);
                              }
                            }

                            console.log('isValid é', isValid)
                            handleValueChange({
                              name: 'dataStart',
                              valor: inputValue,
                              isValid: isValid,
                              page: 1,
                            });
                          }}

                          value={dataStart.valor}
                        />
                      )}
                    />
                  </div>
                  <div className={styles.containerInut}>
                    {errors.dias ? (
                      <p className={styles.erroInputForm}>{errors.dias?.message}</p>
                    ) : (
                      <label className={styles.labelInputForm}>Data final</label>
                    )}

                    <Controller
                      control={control}
                      name="dataEnd"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <InputFormBitClean
                          placeholder="Valor"
                          type="date"
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            let isValid = true;

                            //console.log('validando select ', val.value)
                            if (inputValue < dataStart.valor && dataStart.valor != '') {
                              console.log('data inicial maior que data final');
                              console.log('data final aqui', dataEnd.valor)
                              handleClick('Data Final maior que data inicial', 'error');
                              isValid = false;

                              const auxInvalidFields = [
                                ...invalidFields,
                                'dataEnd',
                              ];
                              setFieldRedux('invalidFields', auxInvalidFields);

                            } else {
                              isValid = true;
                              const auxInvalidFields = invalidFields.filter(
                                (field: string) => field !== 'dataEnd'
                              );
                              setFieldRedux('invalidFields', auxInvalidFields);
                            }
                            console.log('isValid é', isValid)
                            handleValueChange({
                              name: 'dataEnd',
                              valor: inputValue,
                              isValid: isValid,
                              page: 1,
                            });
                          }}

                          value={dataEnd.valor}
                        />
                      )}
                    />
                  </div>
                </>
              )}
              <div className={styles.containerInut}>
                {errors.bandeira ? (
                  <p className={styles.erroInputForm}>{errors.bandeira?.message}</p>
                ) : (
                  <label className={styles.labelInputForm}>Bandeira</label>
                )}

                <Controller
                  control={control}
                  name="bandeira"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select
                      placeholder="Selecione a Bandeira"
                      options={[{ label: "Todas", value: null }, ...bandeiras]}
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
                {errors.formaPg ? (
                  <p className={styles.erroInputForm}>{errors.formaPg?.message}</p>
                ) : (
                  <label className={styles.labelInputForm}>Forma de pagamento</label>
                )}

                <Controller
                  control={control}
                  name="formaPg"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select
                      placeholder="forma de pagamento"
                      options={[{ label: "Todos", value: null }, ...dataTypePayment]}
                      className="basic-single"
                      value={dataTypePayment.find((c) => c.value === Number(value))}
                      onChange={(val: any) => {
                        onChange(val.value), setFormPayment(val.value);
                        const inputValue = val.value;
                        let isValid = false;
                        if (inputValue > 0) {
                          isValid = true;
                          const auxInvalidFields = [
                            ...invalidFields,
                            'formaPg',
                          ];
                          setFieldRedux('invalidFields', auxInvalidFields);
                        } else {
                          isValid = false;
                          const auxInvalidFields = invalidFields.filter(
                            (field: string) => field !== 'formaPg'
                          );
                          setFieldRedux('invalidFields', auxInvalidFields);
                        }
                        handleValueChange({
                          name: 'formaPg',
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
              {filialTransacoes.length > 1 && (
                <div className={styles.containerInut}>
                  {errors.filialid ? (
                    <p className={styles.erroInputForm}>{errors.filialid?.message}</p>
                  ) : (
                    <label className={styles.labelInputForm}>Filiais</label>
                  )}

                  <Controller
                    control={control}
                    name="filialid"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Select
                        placeholder="forma de pagamento"
                        options={filialTransacoes}
                        className="basic-single"
                        value={filialTransacoes.find((c) => c.value === Number(value))}
                        onChange={(val: any) => {

                          onChange(val.value), setFormPayment(val.value);
                          const inputValue = val.value;
                          let isValid = false;
                          if (inputValue > 0) {
                            isValid = true;
                            const auxInvalidFields = [
                              ...invalidFields,
                              'filialid',
                            ];
                            setFieldRedux('invalidFields', auxInvalidFields);
                          } else {
                            isValid = false;
                            const auxInvalidFields = invalidFields.filter(
                              (field: string) => field !== 'filialid'
                            );
                            setFieldRedux('invalidFields', auxInvalidFields);
                          }
                          handleValueChange({
                            name: 'filialid',
                            valor: inputValue,
                            isValid: isValid,
                            page: 1,
                          });
                        }}
                        defaultValue={tempValueFilial > 0 ? { value: filialTransacoes[0]?.value, label: filialTransacoes[0]?.label } : null} // Define a primeira opção como padrão
                      />
                    )}
                  />
                </div>
              )}

            </div>
            <div className={styles.iputGroup}>
              <div className={styles.contentDetalhes}>
                <div className={styles.contentItendsDetalhes}>
                  <div>
                    <span className={styles.descricaoSaidaSpan}>Canceladas</span>
                  </div>
                  <div>
                    <span className={styles.descricaoValorSpan}>R$ 0,00</span>
                  </div>
                </div>
                <div className={styles.contentItendsDetalhes}>
                  <div>
                    <span className={styles.descricaoSaidaSpan}>
                      Contestadas
                    </span>
                  </div>
                  <div>
                    <span className={styles.descricaoValorSpan}>
                      R$ 0,00
                    </span>
                  </div>
                </div>
                <div className={styles.contentItendsDetalhes}>
                  <div>
                    <span className={styles.descricaoSaidaSpan}>
                      Devolvidas por pix
                    </span>

                  </div>
                  <div>
                    <span className={styles.descricaoValorSpan}>
                      R$ 0,00
                    </span>

                  </div>
                </div>
                <div className={styles.contentItendsDetalhes}>
                 
                </div>
              </div>
            </div>
            <div className={styles.iputGroup}>
              <div className={styles.contentDetalhes}>
                <div className={styles.contentItendsDetalhes}>
                  <div>
                    <span className={styles.descricaoEntradaSpan}>
                      Crédito
                    </span>

                  </div>
                  <div>
                    <span className={styles.descricaoValorSpan}>
                      R$ 0,00
                    </span>
                  </div>
                </div>
                <div className={styles.contentItendsDetalhes}>
                  <div>
                    <span className={styles.descricaoEntradaSpan}>
                      Débito
                    </span>

                  </div>
                  <div>
                    <span className={styles.descricaoValorSpan}>
                      R$ 0,00
                    </span>
                  </div>
                </div>
                <div className={styles.contentItendsDetalhes}>
                  <div>
                    <span className={styles.descricaoEntradaSpan}>
                      Boleto
                    </span>

                  </div>
                  <div>
                    <span className={styles.descricaoValorSpan}>
                      R$ 0,00
                    </span>
                  </div>
                </div>
                <div className={styles.contentItendsDetalhes}>
                  <div style={{ marginRight: 8 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      onClick={() => {
                        setActualPage(1)
                        handleNextPage()

                      }}
                    >
                      Pesquisar
                    </Button>
                  </div>
                  <div>
                    <Button
                      type="submit"
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        router.reload();
                      }}
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <section className={styles.containerListAcount}>
            <div className={styles.containerDataList}>
              <div className={styles.containerInutPaginacao}>
                <Controller
                  control={control}
                  name="paginacao"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select
                      placeholder="Selecione a Bandeira"
                      options={numberPaginnation}
                      className="basic-single"
                      value={numberPaginnation.find((c) => c.value === perPage)}
                      onChange={(val: any) => {
                        onChange(val.value), setPerPage(val.value);
                        const inputValue = val.value;
                        let isValid = true;
                        if (inputValue > 0) {
                          handleTransactionEc()
                          isValid = true;
                          const auxInvalidFields = [
                            ...invalidFields,
                            'paginacao',
                          ];
                          setFieldRedux('invalidFields', auxInvalidFields);
                        } else {
                          isValid = false;
                          const auxInvalidFields = invalidFields.filter(
                            (field: string) => field !== 'paginacao'
                          );
                          setFieldRedux('invalidFields', auxInvalidFields);
                        }
                        handleValueChange({
                          name: 'paginacao',
                          valor: String(perPage),
                          isValid: true,
                          page: 1,
                        });
                      }}
                      defaultInputValue=""
                    />
                  )}
                />

              </div>
              <div className={styles.containerInutPaginacao}>
                <ExportToExcel excelData={listKeyExtract} fileName={"Export"} />
              </div>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer component={Paper}>

                <Table sx={{ minWidth: 650 }} aria-label="caption table" id="tabelaTeste">
                  <caption>
                    <footer className={styles.paginationContainer}>
                      <div className={styles.containerDetailsPagination}>
                        <div>
                          <h4>
                            {totalRegistro <= perPage ? totalRegistro : perPage} de {totalRegistro}, pagina {actualPage} de {pageSize}
                          </h4>
                        </div>
                      </div>
                      {pageSize == 1 ? (
                        <></>
                      )

                        :
                        (
                          <div className={styles.containerLinkPagination}>
                            <Pagination
                              limit={perPage}
                              total={totalRegistro}
                              offset={actualPage}
                              nextPage={nextPage}
                              backNextPage={backNextPage}
                              totalOfPage={perPage}
                              setOffset={setActualPage}
                            />
                          </div>
                        )}



                    </footer>
                  </caption>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{fontWeight: 'bold'}}>ID VENDA</TableCell>
                      <TableCell align="left"style={{fontWeight: 'bold'}}>EC</TableCell>
                      <TableCell align="left"style={{fontWeight: 'bold'}}>TERMINAL</TableCell>
                      <TableCell align="left"style={{fontWeight: 'bold'}}>BANDEIRA</TableCell>
                      <TableCell align="left"style={{fontWeight: 'bold'}}>TIPO TRANSAÇÃO</TableCell>
                      <TableCell align="left"style={{fontWeight: 'bold'}}>DATA</TableCell>
                      <TableCell align="left"style={{fontWeight: 'bold'}}>VALOR PAGO</TableCell>
                      <TableCell align="left"style={{fontWeight: 'bold'}}>STATUS</TableCell>
                      <TableCell align="left"style={{fontWeight: 'bold'}}>DETALHES</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listKeyExtract.map((row: any) => (
                      <TableRow key={row.transacaoid} className={styles.linhaTabela}>
                        <TableCell component="th">
                          {row.transacaoid}
                        </TableCell>
                        <TableCell align="left">{row.empresa}</TableCell>
                        <TableCell align="left">{row.equipamentoserial}</TableCell>
                        <TableCell align="left">{row.bandeira}</TableCell>
                        <TableCell align="left">{row.tipo}</TableCell>
                        <TableCell align="left">{dataUsaParaBr(row.data)}</TableCell>
                        <TableCell align="left">{moneyMask(String(row.valor_pago_cliente))}</TableCell>
                        <TableCell align="left">{row.descricao_status}</TableCell>
                        <TableCell align="left">
                          <Button
                            type="submit"
                            variant="contained"
                            color="warning"
                          >
                            Visualizar
                          </Button>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </TableContainer>
            </Paper>


          </section>
          
          {openAlert && (
            <AlertSnack
              message={menssageAlert}
              typeMessage={typeAlert}
              openAlertComponent={openAlert}
              onBack={() => { setOpenAlert(!openAlert) }}
            />
          )

          }

        </>
      )
        :
        (
          <div className={styles.contentdataForm}>
            <Stack sx={{ width: '100%' }} spacing={2} textAlign={'center'}>
              <Alert severity="warning">
                <AlertTitle>Ops</AlertTitle>
                Esta conta não possui equipamento,
                <strong>
                  <Link className={styles.linkMenu} href='/maquininhas'>
                    <span className={styles.labelTextMenuAtivo}>Contrate agora?</span>
                  </Link>
                </strong>
              </Alert>
            </Stack>
          </div>
        )}

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

    dias: getPropSegura(
      state,
      ['userRegisterReducer', 'dias'],
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
    formaPg: getPropSegura(
      state,
      ['userRegisterReducer', 'formaPg'],
      {
        valor: '',
        isValid: false,
        page: 1,
      }
    ),
    paginacao: getPropSegura(
      state,
      ['userRegisterReducer', 'paginacao'],
      {
        valor: '',
        isValid: false,
        page: 1,
      }
    ),
    dataStart: getPropSegura(
      state,
      ['userRegisterReducer', 'dataStart'],
      {
        valor: '',
        isValid: false,
        page: 1,
      }
    ),
    dataEnd: getPropSegura(
      state,
      ['userRegisterReducer', 'dataEnd'],
      {
        valor: '',
        isValid: false,
        page: 1,
      }
    ),
    filialid: getPropSegura(
      state,
      ['userRegisterReducer', 'filialid'],
      {
        valor: '',
        isValid: false,
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

export default connect(mapStateToProps, mapDispatchToProps)(ExtratoVendas);