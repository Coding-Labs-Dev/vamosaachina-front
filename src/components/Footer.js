import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer({ menu }) {
  return (
    <>
      <footer>
        <div className="container">
          <div className="logo">
            <h1>Vamos à China</h1>
          </div>
          <div className="menu">
            <ul>
              {Object.keys(menu).map(hash => {
                return (
                  <AnchorLink href={`#${hash}`} key={shortid.generate()}>
                    <li>{menu[hash]}</li>
                  </AnchorLink>
                );
              })}
            </ul>
          </div>
          <div className="copywrite">
            <div className="socialmedia">
              {/* <div className="icon"> */}
              <a href="https://facebook.com/" className="icon">
                <FaFacebookF />
              </a>
              {/* </div> */}
              {/* <div className="icon"> */}
              <a href="https://instagram.com/" className="icon">
                <FaInstagram />
              </a>
              {/* </div> */}
            </div>
            <span>2019 - Vamos à China</span>
          </div>
        </div>
      </footer>
    </>
  );
}

Footer.propTypes = {
  menu: PropTypes.shape().isRequired,
};
