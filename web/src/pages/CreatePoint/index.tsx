import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import {Map, TileLayer, Marker} from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import {LeafletMouseEvent} from 'leaflet';

import './styles.css';

import logo from '../../assets/logo.svg';  

interface Item {
    id:number;
    title:string;
    image_url:string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome :string;
}

const CreatePoint = () => {
    const [items, setItems]                 = useState<Item[]>([]);
    const [ufs, setUfs]                     = useState<string[]>([]);
    const [cities, setCities]               = useState<string[]>([]);
    const [selectedUf, setSelectedUf]       = useState('0');
    const [selectedCity, setSelectedCity]   = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    
    const history = useHistory();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const [selectedPositionMap, setSelectedPositionMap] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition]         = useState<[number, number]>([0, 0]);


    /**
     * Seta a posição atual 
     */
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setInitialPosition([
                position.coords.latitude,
                position.coords.longitude,
            ])
        })
    }, []);

    /**
     * Preencher itens de coleta
     */
    useEffect(() =>{
        api.get('items').then(response =>{
            setItems(response.data);
        })
    }, []);

    /**
     * Preencher Estados
     */
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response =>{
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);

    /**
     * Prencheer cidades
     */
    useEffect(()=> {
        if(selectedUf === '0'){
            setCities([]);
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response =>{
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames);
        });
        
    }, [selectedUf]);
    
    /**
     * Função disparada ao mudar o estado
     * @param event 
     */
    function onChangeUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    /**
     * Função disparada ao mudar a cidade
     * @param event 
     */
    function onChangeCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;

        setSelectedCity(city);
    }

    /**
     * Função disparada ao clickar no mapa
     * @param event 
     */
    function onClickMap(event: LeafletMouseEvent){
        setSelectedPositionMap([
            event.latlng.lat,
            event.latlng.lng
        ])
        console.log(selectedPositionMap);
    }

    /**
     * Função disparada ao alterar qualquer input
     * @param event 
     */
    function onChangeInput(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;

        setFormData({...formData, [name]: value});
    }

    /**
     * Função disparada ao clickar em um item
     * @param item 
     */
    function onClickItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);
        console.log(alreadySelected);
        if(alreadySelected >= 0){
            const filtredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filtredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    /**
     * Função disparada ao cadastrar um ponto de coleta
     * @param event 
     */
    async function onSubmit(event: FormEvent){
        event.preventDefault();
        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPositionMap;
        const items = selectedItems;

        const data ={ 
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        await api.post('points', data);
        alert('Ponto de coleta cadastrado');
        history.push('/');

    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={onSubmit}>
                <h1>Cadastro do <br />ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input 
                                type="text"
                                name="name"
                                id="name"
                                onChange={onChangeInput}
                            />
                        </div>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">E-mail</label>
                                <input 
                                    type="text"
                                    name="email"
                                    id="email"
                                    onChange={onChangeInput}
                                />
                            </div>   
                            <div className="field">
                                <label htmlFor="name">Whatsapp</label>
                                <input 
                                    type="text"
                                    name="whatsapp"
                                    id="whatsapp"
                                    onChange={onChangeInput}
                                />
                            </div>   
                        </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                        <Map center={[-27.201953, -49.640411]} zoom={15} onClick={onClickMap}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedPositionMap}/>
                        </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" onChange={onChangeUf} value={selectedUf}>
                                <option value="0">Selecione uma UF</option>
                                {
                                    ufs.map(uf => (
                                        <option key={uf} value={uf}> {uf} </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={onChangeCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {
                                    cities.map(city => (
                                        <option key={city} value={city}> {city} </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Seleciona um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {
                            items.map(item =>(
                                <li key={item.id} 
                                onClick={() => onClickItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : '' }
                                >
                                    <img src={item.image_url} alt={item.title}/>
                                    <span>{item.title}</span>
                                </li>
                            ))
                        }
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>

            </form>
        </div>
    )
}

export default CreatePoint;