import React, { useState } from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { FiMenu } from 'react-icons/fi';

export default function Nav({ opacity, menu }) {
  const [activeHash, setActiveHash] = useState('home');

  function handleMenu(e) {
    document.querySelector('nav').classList.toggle('active');
    const { hash } = e.currentTarget;
    if (hash) {
      setActiveHash(hash.substr(1));
    }
  }

  return (
    <>
      <div
        className="menu-button"
        onClick={handleMenu}
        role="presentation"
        style={{ opacity: opacity >= 0.9 ? 1 : 0 }}
      >
        <FiMenu size={20} color="#000" />
      </div>
      <nav style={{ opacity: opacity >= 0.9 ? 1 : 0 }}>
        <div className="background" />
        <div className="logo">
          <h1>Vamos à China</h1>
        </div>
        <ul>
          {Object.keys(menu).map(hash => {
            return (
              <AnchorLink
                href={`#${hash}`}
                onClick={handleMenu}
                key={shortid.generate()}
                className={hash === activeHash ? 'active' : undefined}
              >
                <li>{menu[hash]}</li>
              </AnchorLink>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

Nav.propTypes = {
  opacity: PropTypes.number.isRequired,
  menu: PropTypes.shape().isRequired,
};
