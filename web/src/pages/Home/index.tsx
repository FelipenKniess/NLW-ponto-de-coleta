import React from 'react';
import logo from '../../assets/logo.svg';
import {FiLogIn, FiArrowRight} from 'react-icons/fi';
import './styles.css';
import {Link} from 'react-router-dom';
const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                    <Link to="/create-point">
                        Cadastrar Ponto de Coleta
                        <FiArrowRight/>
                    </Link>
                </header>
                <main>
                    <h1>Seu Marketplace de coleta de resíduos</h1>
                    <p>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente</p>
                    <Link to="/search-point">
                        <span> 
                            <FiLogIn/>
                        </span>
                        <strong>Buscar Ponto de Coleta</strong>
                    </Link>

                </main>
            </div>
        </div>
    )
}

export default Home;