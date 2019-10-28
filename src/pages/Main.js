import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes, { css } from 'prop-types';
import styled from 'styled-components';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import shortid from 'shortid';
import 'video-react/dist/video-react.css';
import { Player, BigPlayButton, LoadingSpinner, ControlBar } from 'video-react';
import { Parallax } from 'react-parallax';
import Fade from 'react-reveal/Fade';
import {
  FaLanguage,
  FaHospitalAlt,
  FaMedal,
  FaPassport,
  FaPlane,
  FaBus,
  FaHotel,
  FaHiking,
  FaUtensils,
  FaMapMarkedAlt,
} from 'react-icons/fa';
import { GiLightBackpack } from 'react-icons/gi';

import Nav from '../components/Nav';
import Footer from '../components/Footer';

const images = require.context('../images', true);

const Submit = styled.input.attrs({
  type: 'submit',
  value: 'Quero ir à China',
  disabled: props => props.disabled || false,
})``;

const Input = styled.input.attrs({
  type: 'email',
  name: 'email',
  placeholder: 'Digite seu melhor e-mail',
})``;

function Main({ history, callback }) {
  const menu = {
    home: 'Home',
    estudos: 'Estudos',
    cronograma: 'Cronograma',
    depoimentos: 'Depoimentos',
    servicos: 'Serviços',
    planos: 'Planos',
  };

  const vantagens = {
    kit: {
      title: 'Kit de Sobrevivência',
      text:
        'Você irá receber um Kit de Sobrevivência na China, com guia em português e chinês, guia de alimentação, mapas do metro, crachá especial, camiseta exclusiva',
      icon: <FaMapMarkedAlt size={48} />,
    },
    passaporte: {
      title: 'Trâmites Legais',
      text:
        'Todo o trâmite legal, os vistos necessários e as taxas de embaixadas estão inclusas no nosso pacote. Ou seja, sem dor de cabeça!',
      icon: <FaPassport size={48} />,
    },
    transporteaero: {
      title: 'Transporte aéreo',
      text:
        'O pacote já possui a passagem aérea e as taxas de embarque inclusas, gerando inclusive milhas aéreas. Assim, o grupo sai desde o Brasil junto!',
      icon: <FaPlane size={48} />,
    },
    transporteterrestre: {
      title: 'Transporte terrestre',
      text:
        'Traslados inclusos entre os aeroportos e hotéis e para os passeios, conforme o cronograma descrito',
      icon: <FaBus size={48} />,
    },
    hospedagem: {
      title: 'Hospedagem',
      text:
        'Hospedagem em quarto duplo de hoteis 4 e 5 estrelas e com café-da-manhã ocidental e oriental incluso',
      icon: <FaHotel size={48} />,
    },
    mochila: {
      title: 'Mochila exclusiva',
      text:
        'Você irá receber uma mochila exclusiva do grupo para carregar os seus pertences durante as aulas e os passeios',
      icon: <GiLightBackpack size={48} />,
    },
    alimentacao: {
      title: 'Alimentação',
      text:
        'Alimentação inclusa em restaurantes de nível itnernacional, conforme o cronograma descrito',
      icon: <FaUtensils size={48} />,
    },
    passeios: {
      title: 'Passeios exclusivos',
      text:
        'Passeios exclusivos, inclusos conforme o cronograma descrito, que você só encontra em nosso roteiro! Todos acompanhados de guias locais que falam em espanhol',
      icon: <FaHiking size={48} />,
    },
  };

  const [navOpacity, setNavOpacity] = useState(0);
  const [email, setEmail] = useState({});
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState(false);

  async function handleChange(event) {
    const { value } = event.currentTarget;
    setEmail(value);
  }

  useEffect(() => {
    callback(email);
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regex.test(email)) {
      setSubmit(false);
      setError(true);
    } else {
      setSubmit(true);
      setError(false);
    }
  }, [email]);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(email);
    history.push('/inscricao', { email });
  }
  return (
    <>
      <Parallax
        strength={600}
        bgImage={images('./banner.jpg')}
        renderLayer={p => setNavOpacity((p - 0.6) * 2.5)}
      >
        <Nav opacity={navOpacity} menu={menu} />
        <section className="banner" id="home">
          <div className="background filter" />
          <div className="container">
            <h3>51ª Edição</h3>
            <h1>Projeto Vamos à China</h1>
            <h2>Aprenda Acupuntura e Fitoterapia na China</h2>
            <AnchorLink href="#estudos" className="button round">
              Quero Saber Mais
            </AnchorLink>
          </div>
        </section>
      </Parallax>
      <section id="estudos" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="title">
            <h3 className="headline">Estude na</h3>
            <h2 className="headline">Taijin University of TCM</h2>
            <span className="snippet">
              Você terá aprender as diversas técnicas da Medicina Tradicional
              Chinesa, como Acupuntura, Tui-na, Qi Gong e Fitoterapia, além de
              ter uma imersão na cultura e língua chinesa
            </span>
          </div>
          <Fade bottom big cascade duration={1000}>
            <div className="cards">
              <div className="card">
                <div className="icon">
                  <FaLanguage size={48} />
                </div>
                <div className="content">
                  <h4>Tradução</h4>
                  <p>
                    Sabemos que nem todos conhecem a lingua chinesa, que é de
                    difícil aprendizado. Para contornar esse problema, as aulas
                    são traduzidas em português para que você possa aproveitar
                    ao máximo o curso.
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="icon">
                  <FaHospitalAlt size={48} />
                </div>
                <div className="content">
                  <h4>Teoria e Prática</h4>
                  <p>
                    Você irá ter uma imersão completa, aprendendo com os
                    melhores profissionais numa das maiores instituições de
                    Medicina Chinesa, tendo, inclusive, aulas monitoradas nos
                    hospitais da região.
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="icon">
                  <FaMedal size={48} />
                </div>
                <div className="content">
                  <h4>Certificado</h4>
                  <p>
                    Já pensou como um certificado internacional pode alavancar a
                    sua carreira? Além da vivência e aprendizado na viagem, você
                    irá receber um Certificado de Conclusão do Curso.
                  </p>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </section>
      <Parallax strength={600} bgImage={images('./quick-checkout.jpg')}>
        <section className="quick-checkout">
          <div className="background filter" />
          <h1>Projeto Vamos à China</h1>
          <h2>Garanta sua vaga logo!</h2>
          <form onSubmit={handleSubmit}>
            <Input onChange={handleChange} error={error} />
            <Submit disabled={!submit} />
          </form>
        </section>
      </Parallax>
      <section id="cronograma">
        <div className="container">
          <div className="title">
            <h3 className="headline">Conheça o</h3>
            <h2 className="headline">Cronograma</h2>
            <span className="snippet">
              São 20 dias de imersão nessa cultura incrível
            </span>
          </div>
          <div className="table">
            <table>
              <tbody>
                <tr>
                  <td>
                    <div className="text">
                      <h2>31/10/2020</h2>
                      <span className="headline">Saída do Brasil</span>
                      <p>
                        Embarque no aeroporto de Guarulhos com destino a
                        Beijing, China, com conexão em Dubai, Emirados Árabes
                        Unidos.
                      </p>
                    </div>
                  </td>
                  <td style={{ gridColumn: 'span 2' }}>
                    {/* <Fade right delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./airport.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                </tr>
                <tr>
                  <td style={{ gridColumn: 'span 2' }}>
                    {/* <Fade left delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./beijing.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                  <td>
                    <div className="text">
                      <h2>01/11/2020</h2>
                      <span className="headline">Chegada à Beijing</span>
                      <p>Check in no Hotel e Jantar de Confraternização</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="text">
                      <h2>02/11/2020</h2>
                      <span className="headline">Turismo Local</span>
                      <p>Câmbio no Banco da China</p>
                      <p>Visita ao Shopping da Rua da Seda</p>
                      <p>Jantar com o famoso Pato Laqueado</p>
                    </div>
                  </td>
                  <td>
                    {/* <Fade bottom delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images(
                          './forbbiden-city.jpg'
                        )})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                  <td>
                    <div className="text">
                      <h2>03/11/2020</h2>
                      <span className="headline">Turismo Local</span>
                      <p>Visita ao Shopping Bai Não Hui</p>
                      <p>Visita à Cidade Proibída e Praça da Paz Celestial</p>
                      <p>Passeio alternativo: Mercado de Pulgas</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="text">
                      <h2>04/11/2020</h2>
                      <span className="headline">Grande Muralha</span>
                      <p>Um dia inteiro de visita à Grande Muralha Mutian Yu</p>
                    </div>
                  </td>
                  <td style={{ gridColumn: 'span 2' }}>
                    {/* <Fade right delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./great-wall.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                </tr>
                <tr>
                  <td style={{ gridColumn: 'span 2' }}>
                    {/* <Fade left delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./798art.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                  <td>
                    <div className="text">
                      <h2>05/11/2020</h2>
                      <span className="headline">Distrito de Artes 798</span>
                      <p>
                        Passeio exclusivo a um dos locais mais incréiveis de
                        Beijing
                      </p>
                      <p>Saida à noite para Tian Jin</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ gridColumn: 'span 3' }}>
                    {/* <Fade bottom delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./tjutcm2.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                </tr>
                <tr>
                  <td style={{ gridColumn: 'span 3' }}>
                    <div
                      className="text no-counter"
                      style={{ counterIncrement: 'day 7' }}
                    >
                      <span className="counter">07 - 13</span>
                      <h2>06/11 à 12/11/2020</h2>
                      <span className="headline">
                        Universidade Tian Jin de MTC
                      </span>
                      <p>
                        Com um programa inédito e tradução em português, você
                        ira estudar as mais diversas técnicas da Medicina
                        Tradional Chinesa....
                      </p>
                      <p>No último dia, voltamos para Beijing</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="text">
                      <h2>13/11/2020</h2>
                      <span className="headline">Dia Livre para Turismo</span>
                      <p>Montanha Perfumada</p>
                      <p>Plataforma de Vidro</p>
                      <p>Montanha do Dragão</p>
                      <p>Shanghai-Xian</p>
                    </div>
                  </td>
                  <td>
                    {/* <Fade bottom delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./798art.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                  <td>
                    <div className="text">
                      <h2>14/11/2020</h2>
                      <span className="headline">Dia Livre para Turismo</span>
                      <p>Montanha Perfumada</p>
                      <p>Plataforma de Vidro</p>
                      <p>Montanha do Dragão</p>
                      <p>Shanghai-Xian</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    {/* <Fade left delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./798art.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                  <td>
                    <div className="text">
                      <h2>15/11/2020</h2>
                      <span className="headline">Dia Livre para Turismo</span>
                      <p>Montanha Perfumada</p>
                      <p>Plataforma de Vidro</p>
                      <p>Montanha do Dragão</p>
                      <p>Shanghai-Xian</p>
                    </div>
                  </td>
                  <td>
                    {/* <Fade right delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./798art.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                </tr>
                <tr>
                  <td style={{ gridColumn: 'span 2' }}>
                    {/* <Fade left delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./dubai2.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                  <td>
                    <div className="text">
                      <h2>16/11/2020</h2>
                      <span className="headline">
                        Feira Mundial de Dubai 2020
                      </span>
                      <p>Checkout e embarque para Dubai</p>
                      <p>Dia Livre para Turismo</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="text">
                      <h2>17/11/2020</h2>
                      <span className="headline">
                        Feira Mundial de Dubai 2020
                      </span>
                      <p>Burk Kalifa</p>
                      <p>Safari no Deserto</p>
                    </div>
                  </td>
                  <td>
                    {/* <Fade bottom delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./dubai3.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                  <td>
                    <div className="text">
                      <h2>18/11/2020</h2>
                      <span className="headline">
                        Feira Mundial de Dubai 2020
                      </span>
                      <p>City Tour em Abu Dhabi</p>
                      <p>Visita à Mesquita</p>
                      <p>Visita ao Parque da Ferrari</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="text">
                      <h2>19/11/2020</h2>
                      <span className="headline">Volta ao Brasil</span>
                      <p>Checkout e embarque para o Brasil</p>
                      <p>Chegada em Guarulhos</p>
                    </div>
                  </td>
                  <td style={{ gridColumn: 'span 2' }}>
                    {/* <Fade left delay={500}> */}
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(${images('./voltasp.jpg')})`,
                      }}
                    />
                    {/* </Fade> */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Parallax strength={600} bgImage={images('./quick-checkout2.jpg')}>
        <section className="quick-checkout">
          <div className="background filter" />
          <h1>Projeto Vamos à China</h1>
          <h2>Garanta sua vaga logo!</h2>
          <form onSubmit={handleSubmit}>
            <Input onChange={handleChange} error={error} />
            <Submit disabled={!submit} />
          </form>
        </section>
      </Parallax>
      <section id="depoimentos">
        <div className="container">
          <div className="title">
            <h3 className="headline">Assista aos</h3>
            <h2 className="headline">Depoimentos</h2>
            <span className="snippet">
              Desde 1992, temos a missão de conduzir profissionais para estudos
              na China
            </span>
          </div>
          <div className="videos">
            <div className="video">
              <Player preload="auto">
                <BigPlayButton className="video-playButton" />
                <LoadingSpinner />
                <ControlBar autoHide={false} className="video-controlBar" />
                <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
              </Player>
            </div>
            <div className="video">
              <Player preload="auto" autoHide>
                <BigPlayButton className="video-playButton" />
                <LoadingSpinner />
                <ControlBar autoHide={false} className="video-controlBar" />
                <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
              </Player>
            </div>
          </div>
          <div className="title">
            <span className="snippet">
              Somos também os pioneiros a levarmos grupos a Tian Jin e Fujien e
              a levarmos os maiores grupos à China
            </span>
          </div>
          <div className="cards">
            <div className="image">
              <div
                className="img"
                onClick={e => e.currentTarget.classList.toggle('zoom')}
                role="presentation"
              >
                <img src={images('./quick-checkout2.jpg')} alt="" />
                <div className="caption">Setembro 2006: 61 pessoas</div>
              </div>
              <div
                className="img"
                onClick={e => e.currentTarget.classList.toggle('zoom')}
                role="presentation"
              >
                <img src={images('./quick-checkout2.jpg')} alt="" />
                <div className="caption">Setembro 2010: 88 pessoas</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Parallax strength={600} bgImage={images('./quick-checkout3.jpg')}>
        <section className="quick-checkout">
          <div className="background filter" />
          <h1>Projeto Vamos à China</h1>
          <h2>Garanta sua vaga logo!</h2>
          <form onSubmit={handleSubmit}>
            <Input onChange={handleChange} error={error} />
            <Submit disabled={!submit} />
          </form>
        </section>
      </Parallax>
      <section id="servicos" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="title">
            <h3 className="headline">Veja as vantagens de</h3>
            <h2 className="headline">Viajar Conosco</h2>
          </div>
          <Fade bottom big cascade duration={1000}>
            <div className="cards">
              {Object.keys(vantagens).map(key => {
                const { title, text, icon } = vantagens[key];
                return (
                  <div className="card" key={shortid.generate()}>
                    <div className="icon">{icon}</div>
                    <div className="content">
                      <h4>{title}</h4>
                      <p>{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Fade>
        </div>
      </section>
      <section className="banner" id="planos">
        <div
          className="background filter"
          style={{ backgroundImage: `url(${images('./plans.jpg')})` }}
        />
        <div
          className="container"
          style={{
            backgroundColor: '#fff',
            borderRadius: '25px',
            padding: '50px 100px',
            boxSizing: 'content-box',
            color: '#292929',
          }}
        >
          <div className="title">
            <h3 className="headline">Conheça os nossos</h3>
            <h2 className="headline">Planos de Pagamento</h2>
            <span className="snippet">
              Para reservar a sua vaga, é necessário efetuar o pagamento da{' '}
              <strong>
                Taxa de Inscrição (R$800,00, em até 2x sem juros, não
                reembolsável)
              </strong>
            </span>
          </div>
          <h3 className="headline">Parte Aérea</h3>
          <div className="prices single-col">
            <div className="price_entry">
              <div className="price_container">
                <div className="price_info">
                  <ul>
                    {[
                      'Vôos em Classe Econômica operados pela Emirates',
                      'Saída de São Paulo, Guarulhos',
                      'Pagamento em até 9 vezes sem juros',
                    ].map(item => (
                      <li key={shortid.generate()}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="price_price">
                  <div className="price_price_container">
                    <span className="price_value">$ 1.590</span>
                    <span className="price_label">00</span>
                  </div>
                  <div className="price_price_snippets">
                    <span className="price_snippet">+ Taxa de Mebarque</span>
                    <span className="price_snippet">
                      Valor em Dólares Americanos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="title inline">
            <h3 className="headline">Parte Terrestre</h3>
            <span className="snippet">
              Você pode optar por pagar a parte terrestre ainda no Brasil (em
              até 10x sem juros) ou efetuar uma entrada e pagar o restante em
              dólares na chegada à China
            </span>
            <span className="snippet">
              <strong>
                Todos os quartos são duplos. Para quartos simples, entre em
                contato para verificar a disponibilidade.
              </strong>
            </span>
          </div>

          <div className="prices">
            <div className="price_entry">
              <div className="price_title">
                <span>Pagamento no</span>
                <span>Brasil</span>
              </div>
              <div className="price_container">
                <div className="price_date">
                  <span>Inscrição até</span>
                  <span>30/04/20</span>
                </div>
                <div className="price_price">
                  <div className="price_price_container">
                    <span className="price_label">10x</span>
                    <span className="price_value">R$ 1.192</span>
                    <span className="price_label">80</span>
                  </div>
                  <div className="price_price_snippets">
                    <span className="price_snippet">/ pessoa</span>
                    <span className="price_snippet">Total: $ 2.980,00</span>
                  </div>
                </div>
                <div className="price_date">
                  <span>Inscrição após</span>
                  <span>30/04/20</span>
                </div>
                <div className="price_price">
                  <div className="price_price_container">
                    <span className="price_label">10x</span>
                    <span className="price_value">R$ 1.272</span>
                    <span className="price_label">80</span>
                  </div>
                  <div className="price_price_snippets">
                    <span className="price_snippet">/ pessoa</span>
                    <span className="price_snippet">Total: $3.180,00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="price_entry">
              <div className="price_title">
                <span>Pagamento na</span>
                <span>China</span>
              </div>
              <div className="price_container">
                <div className="entry">Entrada de R$ 2.000,00</div>
                <div className="price_date">
                  <span>Inscrição até</span>
                  <span>30/07/20</span>
                </div>
                <div className="price_price">
                  <span className="price_pre-snippet">
                    Saldo a Pagar na China
                  </span>
                  <div className="price_price_container">
                    <span className="price_value">$ 2.480</span>
                    <span className="price_label">00</span>
                  </div>
                  <div className="price_price_snippets">
                    <span className="price_snippet">/ pessoa</span>
                    <span className="price_snippet">
                      Valor em Dólares Americanos
                    </span>
                    <span className="price_snippet">Total: $ 2.980,00</span>
                  </div>
                </div>
                <div className="price_date">
                  <span>Inscrição após</span>
                  <span>30/04/20</span>
                </div>
                <div className="price_price">
                  <span className="price_pre-snippet">
                    Saldo a Pagar na China
                  </span>
                  <div className="price_price_container">
                    <span className="price_value">$ 2.580</span>
                    <span className="price_label">00</span>
                  </div>
                  <div className="price_price_snippets">
                    <span className="price_snippet">/ pessoa</span>
                    <span className="price_snippet">
                      Valor em Dólares Americanos
                    </span>
                    <span className="price_snippet">Total: $ 3.180,00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="quick-checkout alt">
        <h1>Projeto Vamos à China</h1>
        <h2>Garanta sua vaga logo!</h2>
        <form onSubmit={handleSubmit}>
          <Input onChange={handleChange} error={error} />
          <Submit disabled={!submit} />
        </form>
      </section>
      <Footer menu={menu} />
    </>
  );
}

Main.propTypes = {
  history: PropTypes.shape().isRequired,
  callback: PropTypes.func.isRequired,
};

export default withRouter(Main);
