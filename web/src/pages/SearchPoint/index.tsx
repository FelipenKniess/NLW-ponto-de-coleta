import React, {useState} from 'react';
import logo from '../../assets/logo.svg';
import {Link} from 'react-router-dom';
import {FiArrowLeft, FiSearch, FiRepeat} from 'react-icons/fi';
import api from '../../services/api';
import './styles.css';
    interface Points {
        id: number,
        name: string,
        image: string,
        email: string,
        whatsapp: string,
        latitude: number,
        longitude: number,
        City: string,
        uf: string
    }

    const SearchPoint = () => {
    const [points, setPoints] = useState<Points[]>([]);

    function onClickButtonSearch(){
        api.get('allPoints').then(response =>{
            setPoints(response.data);
        })
    }

    function onClickButtonReset(){
        setPoints([]);
    }

    return(
        <div id="page-search-point">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                    <Link to="/">
                        <FiArrowLeft/>
                        Voltar para home
                    </Link>
                </header>

                <main>
                    <button onClick={onClickButtonSearch}>
                        Buscar   
                        <FiSearch />
                    </button>
                    <button onClick={onClickButtonReset}className="btn-reset">
                        Resetar   
                        <FiRepeat />
                    </button>
                    <h1>Pontos de Coleta</h1>
                    <ul>
                        {
                            points.map(point => (
                                <li>
                                    <div className="container-data">
                                        <strong>Nome: </strong>
                                        <p>{point.name}</p>
                                        <strong>Cidade: </strong>
                                        <p>{point.City}</p>
                                        <strong>Estado: </strong>
                                        <p>{point.uf}</p> 
                                        <strong>Whatsapp:</strong>
                                        <p>{point.whatsapp}</p>
                                        <strong>Email:</strong>
                                        <p>{point.email}</p>
                                    </div>
                                    <div className="container-img">
                                        <img src={logo}/>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </main>
        </div>
    );
}

export default SearchPoint;