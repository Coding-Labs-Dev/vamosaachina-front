/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';

import banner from '../images/banner.jpg';

const $PRODUCT_LIST = [
  {
    id: 'INSCRICAO',
    name: 'Inscrição',
    desc: 'Inscrição Projeto Vamos à China',
    value: 800,
  },
];

export default function Checkout({ email, history, handleStatus }) {
  const [productChoise] = useState(0);
  const [payWithCreditCard, setPayWithCreditCard] = useState(true);
  const [$CART, setCart] = useState([]);
  const [$TOTAL, setTotal] = useState(0);
  const [flash, setFlash] = useState(false);
  const [sameHolder, setSameHolder] = useState(true);
  const [cardBrand, setCardBrand] = useState(false);
  const [installmentValue, setInstallmentValue] = useState(0);
  const [installmentQty, setInstallmentQty] = useState(1);
  const [values, setValues] = useState({});
  const [validation, setValidation] = useState({});
  const [submit, setSubmit] = useState(false);
  const [paymentRejected, setPaymentRejection] = useState(false);
  const [formError, setFormError] = useState(false);

  const existingScript = document.getElementById('pagSeguro');

  const validationFn = {
    length: (value, min, max) => {
      if (!value || (min && value.length < min) || (max && value.length > max))
        return false;
      return true;
    },
    phone: value => {
      const regex = /^\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}$/;
      return regex.test(value);
    },
    email: (value, min, max) => {
      if (!value || (min && value.length < min) || (max && value.length > max))
        return false;
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(value);
    },
    name: (value, min, max) => {
      if (!value || (min && value.length < min) || (max && value.length > max))
        return false;
      return !!(
        value.replace(/\s*$/, '').length >= min &&
        value
          .replace(/\s*$/, '')
          .match(/^[A-zÀ-ÿ']+(\s)([A-zÀ-ÿ']\s?)*[A-zÀ-ÿ']+$/)
      );
    },
    textonly: (value, min, max) => {
      if (!value || (min && value.length < min) || (max && value.length > max))
        return false;
      return !!(
        value.replace(/\s*$/, '').length >= min &&
        value
          .replace(/\s*$/, '')
          .match(/^[A-zÀ-ÿ']+(\s)?([A-zÀ-ÿ']\s?)*[A-zÀ-ÿ']+$/)
      );
    },
    date: value => {
      const regex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19[2-9][0-9]|20[01][0-9])$/;
      return regex.test(value);
    },
    zip: value => {
      return !!value.match(/^([0-9]){5}[-]([0-9]){3}$/);
    },
    uf: value => {
      const ufs = [
        'RO',
        'AC',
        'AM',
        'RR',
        'PA',
        'AP',
        'TO',
        'MA',
        'PI',
        'CE',
        'RN',
        'PB',
        'PE',
        'AL',
        'SE',
        'BA',
        'MG',
        'ES',
        'RJ',
        'SP',
        'PR',
        'SC',
        'RS',
        'MS',
        'MT',
        'GO',
        'DF',
      ];
      return ufs.includes(value);
    },
    cpf: value => {
      const cpf = String(value).replace(/\D/g, '');

      if (cpf.length < 11 || !Number(cpf)) {
        return false;
      }

      const chars = [];
      for (let i = 0; i < 11; i += 1) {
        chars.push(Number(cpf.charAt(i)));
      }
      for (let i = 9; i < 11; i += 1) {
        const verificador = chars.map((char, index) => {
          return index < i ? char * (1 + i - index) : 0;
        });
        const soma = verificador.reduce((a, b) => {
          return a + b;
        }, 0);

        const resto = [10, 11].includes((soma * 10) % 11)
          ? 0
          : (soma * 10) % 11;
        if (resto !== chars[i]) {
          return false;
        }
      }
      return true;
    },
    cc_number: async value => {
      const cc = String(value).replace(/\D/g, '');
      // TODO
      if (cc.length === 16) {
        const result = await new Promise(resolve => {
          window.PagSeguroDirectPayment.getBrand({
            cardBin: cc.substr(0, 6),
            success: response => {
              setCardBrand(response.brand);
              resolve(true);
            },
            error: err => {
              console.log('error', err);
              setCardBrand(false);
              resolve(false);
            },
          });
        });
        return result;
      }
      return false;
    },
    cc_exp: value => {
      const regex = /^(0[1-9]|1[012])[/](19|[2-9][0-9])$/;
      return regex.test(value);
    },
    cc_cvv: value => {
      const cvv = String(value).replace(/\D/g, '');
      if (!cvv || cvv.length !== cardBrand.cvvSize) {
        return false;
      }
      return true;
    },
  };

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = process.env.REACT_APP_PAGSEGURO;
    script.id = 'pagSeguro';
    document.body.appendChild(script);
  }

  async function validateCreditCard(event) {
    let tglClass = !!event.type === 'blur';
    const field = event.target || event;
    const validationType = field.getAttribute('validation-type');
    const { name, value } = field;
    if (field.getAttribute('validation-force')) {
      tglClass = true;
    }

    setValues({
      ...values,
      [name]: value,
    });

    const result = await validationFn[`${validationType}`](value);

    if (!result) {
      if (tglClass) {
        field.classList.add('error');
      }
      setValidation({
        ...validation,
        [name]: false,
      });
      return false;
    }
    if (tglClass) {
      field.classList.remove('error');
    }
    setValidation({
      ...validation,
      [name]: true,
    });
    return true;
  }

  function handleCCSameValues() {
    setSameHolder(p => !p);
  }

  function validateField(event) {
    const tglClass = !!event.type === 'blur';
    const field = event.target || event;
    const minLength = field.getAttribute('validation-min-length');
    const maxLength = field.getAttribute('validation-max-length');
    const validationType = field.getAttribute('validation-type');
    const { name, value } = field;

    field.classList.remove('error');

    setValues({
      ...values,
      [name]: value,
    });

    const result = validationFn[`${validationType}`](
      value,
      minLength,
      maxLength
    );

    if (!result) {
      if (tglClass) {
        field.classList.add('error');
      }
      setValidation({
        ...validation,
        [name]: false,
      });
      return false;
    }
    if (tglClass) {
      field.classList.remove('error');
    }
    setValidation({
      ...validation,
      [name]: true,
    });
    return true;
  }

  function getTokens() {
    return new Promise(resolve => {
      const hash = new Promise(resolve2 => {
        window.PagSeguroDirectPayment.onSenderHashReady(response => {
          if (response.status === 'error') {
            console.log(response.message);
            return false;
          }
          return resolve2(response.senderHash);
        });
      });

      const ccToken = new Promise((resolve2, reject) => {
        window.PagSeguroDirectPayment.createCardToken({
          cardNumber: String(values.cc_cardNumber).replace(/\D/g, ''),
          brand: cardBrand.name,
          cvv: String(values.cc_cvv).replace(/\D/g, ''),
          expirationMonth: String(values.cc_exp)
            .replace(/\D/g, '')
            .substr(0, 2),
          expirationYear: `20${String(values.cc_exp)
            .replace(/\D/g, '')
            .substr(2, 2)}`,
          success: response => {
            resolve2(response);
          },
          error: () => {
            setFormError(true);
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(false);
          },
        });
      });
      Promise.all([hash, ccToken]).then(values2 => {
        resolve(values2);
      });
    });
  }

  async function handleSubmit() {
    let result = true;
    const data = {};
    const formElements = document.querySelector('form').elements;
    for (let i = 0; i < formElements.length; i += 1) {
      const element = formElements[i];
      if (
        element.getAttribute('name') &&
        !['cc_cardNumber', 'cc_exp', 'cc_cvv'].includes(
          element.getAttribute('name')
        )
      ) {
        if (element.type === 'radio') {
          if (element.checked) {
            data[`${element.getAttribute('name')}`] = element.value;
          }
        } else {
          data[`${element.getAttribute('name')}`] = element.value;
        }
      }

      if (
        element.getAttribute('validation-type') &&
        element.getAttribute('id')
      ) {
        if (!validateField(element)) {
          result = false;
        }
      }
    }
    data.cart = $CART;
    data.paymentMethod = payWithCreditCard ? 'creditcard' : 'debt';
    data.installmentValue = installmentValue;

    if (sameHolder) {
      data.cc_cpf = data.cpf;
      data.cc_phone = data.phone;
      data.cc_dob = data.dob;
      data.cc_street = data.street;
      data.cc_complement = data.complement;
      data.cc_number = data.number;
      data.cc_neigh = data.neigh;
      data.cc_city = data.city;
      data.cc_district = data.district;
      data.cc_zip = data.zip;
    }

    if (!result) {
      return false;
    }

    setSubmit(false);
    setPaymentRejection(false);
    setFormError(false);
    try {
      let tokens;
      if (payWithCreditCard) {
        tokens = await getTokens();
      }
      const [hash, ccToken] = tokens || [null, null];
      const response = await fetch(`${process.env.REACT_APP_API}/transaction`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hash,
          ccToken,
          data,
        }),
      }).then(response2 => {
        if (!response2.ok) {
          throw new Error('Error');
        }
        return response.json().then(response3 => {
          if (!response3.status) {
            setSubmit(true);
            setFormError(response3.message);
            throw new Error(response3.error);
          }
          return response3;
        });
      });

      // TODO
      const { status } = response;
      switch (status) {
        case 0:
          setSubmit(true);
          setFormError(true);
          break;
        case 7:
          setPaymentRejection(true);
          setSubmit(true);
          break;
        default:
          await window.fbq('track', 'Purchase', {
            value: payWithCreditCard ? installmentValue : 800,
            currency: 'BRL',
          });
          handleStatus(status);
          history.push('/obrigado');
          break;
      }
    } catch (err) {
      console.log(err.message);
      return false;
    }
    return true;
  }

  function SubmitButton() {
    return submit ? (
      <div className="continue">
        <button type="button" className="square" onClick={handleSubmit}>
          <span>Confirmar Inscrição</span>
        </button>
      </div>
    ) : (
      <div className="continue">
        <button type="button" className="square" disabled>
          <span>Confirmar Inscrição</span>
        </button>
      </div>
    );
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/session`, {
      method: 'GET',
      mode: 'cors',
    })
      .then(response => {
        if (!response.ok) {
          return false;
        }
        return response.json();
      })
      .then(response => {
        if (response.status) {
          window.PagSeguroDirectPayment.setSessionId(response.id);
          (async function getPaymentMethods(amount) {
            let methods;
            await window.PagSeguroDirectPayment.getPaymentMethods({
              amount,
              success(res) {
                methods = res;
                console.log(res);
              },
              error(res) {
                console.log(res);
                // Callback para chamadas que falharam.
              },
              complete(res) {
                console.log(res);
                // Callback para todas chamadas.
              },
            });
            return methods;
          })(0);
        }
      });
  }, []);

  useEffect(() => {
    let result = Object.entries(validation).length > 0;
    const keys = Object.keys(validation);
    keys.forEach(key => {
      if (!validation[key]) {
        result = false;
      }
    });
    setSubmit(result);
  }, [validation]);

  useEffect(() => {
    (async function setCCValidation() {
      const inputs = document.querySelector('form').elements;
      const results = {};
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        if (
          input.getAttribute('validation-type') &&
          input.name &&
          !input.name.startsWith('cc')
        ) {
          const result = validateField(input);
          results[input.name] = result;
        }
      }

      const allResults = [];
      for (let i = 0; i < inputs.length; i += 1) {
        const input = inputs[i];
        if (
          input.getAttribute('validation-type') &&
          input.name &&
          input.name.startsWith('cc')
        ) {
          allResults.push({
            input: input.name,
            result: validateCreditCard(input),
          });
        }
      }
      await Promise.all(allResults).then(eachResult => {
        eachResult.forEach(({ input, result }) => {
          results[input] = !result;
        });
      });
      setValidation(results);
    })();
  }, [payWithCreditCard, sameHolder]);

  useEffect(() => {
    setCart([$PRODUCT_LIST[productChoise]]);
  }, [productChoise]);

  useEffect(() => {
    const subTotal = $CART.reduce((total, { value }) => {
      return total + value;
    }, 0);
    setTotal(subTotal + (payWithCreditCard ? 10 : 0));
    setFlash(true);
  }, [$CART, payWithCreditCard]);

  useEffect(() => {
    if (payWithCreditCard && cardBrand && $TOTAL) {
      window.PagSeguroDirectPayment.getInstallments({
        amount: $TOTAL,
        maxInstallmentNoInterest: 2,
        brand: cardBrand.name,
        success: ({ installments }) => {
          setInstallmentValue(installments[cardBrand.name][0].totalAmount);
        },
        error: response => {
          console.dir(response);
        },
      });
    }
  }, [payWithCreditCard, cardBrand, $TOTAL]);

  useEffect(() => {
    if (flash) {
      setTimeout(() => {
        setFlash(false);
      }, 500);
    }
  }, [flash]);

  return (
    <>
      <section id="checkout">
        <div
          className="background filter"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundAttachment: 'fixed',
          }}
        />
        <form>
          <div className="container">
            <h2 className="align-left">Inscrição</h2>
            <p>
              Para reservar a sua vaga, é necessário efetuar o pagamento da{' '}
              <strong>
                Taxa de Inscrição no valor de R$ 800,00, não reembolsável,
              </strong>{' '}
              podendo ser pago à vista ou em até 2x sem juros no cartão de
              crédito.
            </p>
            <h3 className="align-left">Demais Pagamentos</h3>
            <p>
              Os demais pagamentos, referentes à parte aérea e terrestre,
              deverão ser efetuadas por transferência bancária, conforme
              instruções que serão enviadas por e-mail.
            </p>
            <div className="double">
              <div className="column data">
                <div className="form">
                  <h2 className="align-left">Dados do Inscrito</h2>
                  <div className="field">
                    <label htmlFor="nome">Nome Completo</label>
                    <input
                      type="text"
                      name="nome"
                      placeholder="Digite o seu nome e sobrenome"
                      onChange={e => validateField(e)}
                      onBlur={e => validateField(e)}
                      validation-type="name"
                      validation-max-length="50"
                      max-length="50"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="cpf">CPF</label>
                    <InputMask
                      type="tel"
                      name="cpf"
                      placeholder="000.000.000-00"
                      onChange={e => validateField(e)}
                      onBlur={e => validateField(e)}
                      validation-type="cpf"
                      mask="999.999.999-99"
                      maskChar="_"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">E-mail</label>
                    <input
                      type="text"
                      name="email"
                      placeholder="Digite o seu e-mail"
                      defaultValue={email}
                      onChange={e => validateField(e)}
                      onBlur={e => validateField(e)}
                      validation-type="email"
                      validation-max-length="60"
                      maxLength="60"
                    />
                  </div>
                  <div className="field dual">
                    <div className="half">
                      <label htmlFor="phone">Telefone</label>
                      <InputMask
                        type="tel"
                        name="phone"
                        placeholder="(00) 00000-0000"
                        onChange={e => validateField(e)}
                        onBlur={e => validateField(e)}
                        validation-type="phone"
                        mask="(99) 99999-9999"
                        maskChar="_"
                      />
                    </div>
                    <div className="half">
                      <label htmlFor="dob">Data de Nascimento</label>
                      <InputMask
                        type="tel"
                        name="dob"
                        placeholder="DD/MM/AAAA"
                        onChange={e => validateField(e)}
                        onBlur={e => validateField(e)}
                        validation-type="date"
                        mask="99/99/9999"
                        maskChar="_"
                      />
                    </div>
                  </div>
                  <h3 className="align-left">Endereço</h3>
                  <div className="field">
                    <label htmlFor="street">Rua</label>
                    <input
                      type="text"
                      name="street"
                      placeholder="Digite o nome da rua"
                      onChange={e => validateField(e)}
                      onBlur={e => validateField(e)}
                      validation-type="length"
                      validation-min-length="2"
                      validation-max-length="80"
                      maxLength="80"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="complement">Complemento</label>
                    <input
                      type="text"
                      name="complement"
                      placeholder="Condomínio, prédio, etc"
                      onChange={e => validateField(e)}
                      onBlur={e => validateField(e)}
                      validation-type="length"
                      validation-min-length="2"
                      validation-max-length="80"
                      maxLength="80"
                    />
                  </div>
                  <div className="field dual">
                    <div className="half">
                      <label htmlFor="number">Número</label>
                      <input
                        type="text"
                        name="number"
                        placeholder="Digite o número do endereço"
                        onChange={e => validateField(e)}
                        onBlur={e => validateField(e)}
                        validation-type="length"
                        validation-min-length="1"
                        validation-max-length="20"
                        maxLength="20"
                      />
                    </div>
                    <div className="half">
                      <label htmlFor="neigh">Bairro</label>
                      <input
                        type="text"
                        name="neigh"
                        placeholder="Digite o Bairro"
                        onChange={e => validateField(e)}
                        onBlur={e => validateField(e)}
                        validation-type="length"
                        validation-min-length="2"
                        validation-max-length="40"
                        maxLength="40"
                      />
                    </div>
                  </div>
                  <div className="field dual">
                    <div className="half">
                      <label htmlFor="city">Cidade</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Digite a cidade"
                        onChange={e => validateField(e)}
                        onBlur={e => validateField(e)}
                        validation-type="textonly"
                        validation-min-length="2"
                        validation-max-length="60"
                        maxLength="60"
                      />
                    </div>
                    <div className="half">
                      <label htmlFor="district">Estado</label>
                      <input
                        type="text"
                        name="district"
                        placeholder="Digite o estado"
                        onChange={e => {
                          e.target.value = e.target.value.toUpperCase();
                          validateField(e);
                        }}
                        onBlur={e => validateField(e)}
                        validation-type="uf"
                        validation-min-length="2"
                        validation-max-length="2"
                        maxLength="2"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="zip">CEP</label>
                    <InputMask
                      type="tel"
                      name="zip"
                      placeholder="00000-000"
                      onChange={e => validateField(e)}
                      onBlur={e => validateField(e)}
                      validation-type="zip"
                      mask="99999-999"
                      maskChar="_"
                    />
                  </div>
                </div>
              </div>
              <div className="column cart">
                <h2 className="align-left">Forma de Pagamento</h2>
                <div className="form">
                  <div className="field">
                    <div className="option">
                      <label
                        htmlFor="payWithCreditCard"
                        onClick={() => setPayWithCreditCard(true)}
                      >
                        <span>Cartão de Crédito</span>
                        <input
                          type="checkbox"
                          name="payWithCreditCard"
                          value="creditCard"
                          onChange={e => setPayWithCreditCard(e.target.checked)}
                          checked={payWithCreditCard}
                        />
                        <span className="checkmark" />
                      </label>
                    </div>
                    <div className="option">
                      <label
                        htmlFor="payWithBankTicket"
                        onClick={() => setPayWithCreditCard(false)}
                      >
                        <span>Boleto Bancário</span>
                        <input
                          type="checkbox"
                          name="payWithBankTicket"
                          value="bankTicket"
                          onChange={e =>
                            setPayWithCreditCard(!e.target.checked)
                          }
                          checked={!payWithCreditCard}
                        />
                        <span className="checkmark" />
                      </label>
                    </div>
                  </div>
                </div>
                {payWithCreditCard && (
                  <>
                    <h2 className="align-left">Dados do Cartão</h2>
                    <div className="form">
                      <div className="field">
                        <label htmlFor="cc_nome">Nome no Cartão</label>
                        <input
                          type="text"
                          name="cc_nome"
                          placeholder="Digite o nome completo"
                          onChange={e => validateField(e)}
                          onBlur={e => validateField(e)}
                          validation-type="name"
                          validation-min-length="3"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="cc_cardNumber">Número do Cartão</label>
                        <InputMask
                          type="tel"
                          name="cc_cardNumber"
                          placeholder="0000 0000 0000 0000"
                          onChange={e => validateCreditCard(e)}
                          onBlur={e => validateCreditCard(e)}
                          validation-type="cc_number"
                          mask="9999 9999 9999 9999"
                          maskChar=" "
                        />
                      </div>
                      <div className="field dual">
                        <div className="half">
                          <label htmlFor="cc_exp">Vencimento</label>
                          <InputMask
                            type="tel"
                            name="cc_exp"
                            placeholder="MM/AA"
                            onChange={e => validateCreditCard(e)}
                            onBlur={e => validateCreditCard(e)}
                            validation-type="cc_exp"
                            mask="99/99"
                            maskChar="0"
                          />
                        </div>
                        <div className="half">
                          <label htmlFor="cc_cvv">Código de Segurança</label>
                          <InputMask
                            type="tel"
                            name="cc_cvv"
                            placeholder="CVV"
                            onChange={e => validateCreditCard(e)}
                            onBlur={e => validateCreditCard(e)}
                            validation-type="cc_cvv"
                            mask="9999"
                            maskChar=" "
                          />
                        </div>
                      </div>
                      <h3 className="align-left">
                        Dados do Proprietário do Cartão de Crédito
                      </h3>
                      <div className="field">
                        <div className="option">
                          <label
                            htmlFor="ccSameValues"
                            onClick={handleCCSameValues}
                          >
                            <span>Mesmos dados do inscrito</span>
                            <input
                              type="checkbox"
                              name="ccSameValues"
                              value="ccSameValues"
                              id="ccSameValues"
                              onClick={handleCCSameValues}
                              defaultChecked={!!sameHolder}
                            />
                            <span className="checkmark" />
                          </label>
                        </div>
                      </div>
                      {!sameHolder && (
                        <>
                          <div className="field">
                            <label htmlFor="cc_cpf">CPF</label>
                            <InputMask
                              type="tel"
                              name="cc_cpf"
                              placeholder="000.000.000-00"
                              onChange={e => validateField(e)}
                              onBlur={e => validateField(e)}
                              validation-type="cpf"
                              mask="999.999.999-99"
                              maskChar="_"
                            />
                          </div>
                          <div className="field dual">
                            <div className="half">
                              <label htmlFor="cc_phone">Telefone</label>
                              <InputMask
                                type="tel"
                                name="cc_phone"
                                placeholder="(00) 00000-0000"
                                onChange={e => validateField(e)}
                                onBlur={e => validateField(e)}
                                validation-type="phone"
                                mask="(99) 99999-9999"
                                maskChar="_"
                              />
                            </div>
                            <div className="half">
                              <label htmlFor="cc_dob">Data de Nascimento</label>
                              <InputMask
                                type="tel"
                                name="cc_dob"
                                placeholder="DD/MM/AAAA"
                                onChange={e => validateField(e)}
                                onBlur={e => validateField(e)}
                                validation-type="date"
                                mask="99/99/9999"
                                maskChar="_"
                              />
                            </div>
                          </div>
                          <h3 className="align-left">Endereço de Cobrança</h3>
                          <div className="field">
                            <label htmlFor="cc_street">Rua</label>
                            <input
                              type="text"
                              name="cc_street"
                              placeholder="Digite o nome da rua"
                              onChange={e => validateField(e)}
                              onBlur={e => validateField(e)}
                              validation-type="length"
                              validation-min-length="2"
                              validation-max-length="80"
                              maxLength="80"
                            />
                          </div>
                          <div className="field">
                            <label htmlFor="cc_complement">Complemento</label>
                            <input
                              type="text"
                              name="cc_complement"
                              placeholder="Condomínio, prédio, etc"
                              onChange={e => validateField(e)}
                              onBlur={e => validateField(e)}
                              validation-type="length"
                              validation-min-length="2"
                              validation-max-length="80"
                              maxLength="80"
                            />
                          </div>
                          <div className="field dual">
                            <div className="half">
                              <label htmlFor="cc_number">Número</label>
                              <input
                                type="text"
                                name="cc_number"
                                placeholder="Digite o número do endereço"
                                onChange={e => validateField(e)}
                                onBlur={e => validateField(e)}
                                validation-type="length"
                                validation-min-length="1"
                                validation-max-length="20"
                                maxLength="20"
                              />
                            </div>
                            <div className="half">
                              <label htmlFor="cc_neigh">Bairro</label>
                              <input
                                type="text"
                                name="cc_neigh"
                                placeholder="Digite o Bairro"
                                onChange={e => validateField(e)}
                                onBlur={e => validateField(e)}
                                validation-type="length"
                                validation-min-length="2"
                                validation-max-length="40"
                                maxLength="40"
                              />
                            </div>
                          </div>
                          <div className="field dual">
                            <div className="half">
                              <label htmlFor="cc_city">Cidade</label>
                              <input
                                type="text"
                                name="cc_city"
                                placeholder="Digite a cidade"
                                onChange={e => validateField(e)}
                                onBlur={e => validateField(e)}
                                validation-type="textonly"
                                validation-min-length="2"
                                validation-max-length="60"
                                maxLength="60"
                              />
                            </div>
                            <div className="half">
                              <label htmlFor="cc_district">Estado</label>
                              <input
                                type="text"
                                name="cc_district"
                                placeholder="Digite o estado"
                                onChange={e => {
                                  e.target.value = e.target.value.toUpperCase();
                                  validateField(e);
                                }}
                                onBlur={e => validateField(e)}
                                validation-type="textonly"
                                validation-min-length="2"
                                validation-max-length="2"
                                maxLength="2"
                              />
                            </div>
                          </div>
                          <div className="field">
                            <label htmlFor="zip">CEP</label>
                            <InputMask
                              type="tel"
                              name="cc_zip"
                              placeholder="00000-000"
                              onChange={e => validateField(e)}
                              onBlur={e => validateField(e)}
                              validation-type="zip"
                              mask="99999-999"
                              maskChar="_"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
                <h2>Resumo</h2>
                <div className="cartContent">
                  {$CART.map(product => {
                    return (
                      <div className="product" key={product.name}>
                        <div className="details">
                          <span className={flash ? ' flash' : ''}>
                            {product.name}
                          </span>
                          <span className={flash ? ' flash' : ''}>
                            {product.desc}
                          </span>
                        </div>
                        <div className="price">
                          <span className={flash ? ' flash' : ''}>
                            R$ {product.value.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="total">
                    <span className={flash ? ' flash' : ''}>
                      Total: R$ {$TOTAL.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <SubmitButton />
                  {paymentRejected && (
                    <div className="form-error">
                      <span>Ops, seu pagamento foi rejeitado!</span>
                      <span>Verifique os dados do cartão</span>
                    </div>
                  )}
                  {formError && (
                    <div className="form-error">
                      <span>Ops, ocorreu um erro.</span>
                      <span>{formError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
