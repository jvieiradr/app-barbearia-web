import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import '../../Basico.css';
import './MalaDireta.css';

const baseURL = 'https://api-barbearia-web.vercel.app';

var clientesSelecionados = [];

const malaDireta = () => {
    const irPara = useNavigate();
    const [clientes, setClientes] = useState([]);

    const listarClientes = async () => {
        await axios.get(baseURL + '/listarclientes')
            .then((resposta) => {
                setClientes(resposta.data);
            })
            .catch((erro) => {
            });
    };

    const limparCampos = () => {
        setClientes([]);
        clientesSelecionados = [];
        listarClientes();
        document.getElementById('text-area-mensagem').value='';
        document.getElementById('text-area-mensagem').focus();
    };

    useEffect(() => {
        limparCampos();
    }, []);

    const marcaDesmarcaCliente = (cliente, i) => {
        const checkBox = document.getElementById(i);
        var indice = 0;

        if(checkBox.checked == true) {
            clientesSelecionados.push(cliente);
        } else {
            for(let contador = 0; contador < clientesSelecionados.length; contador++) {
                if(cliente.id == clientesSelecionados[contador].id) {
                    indice = contador;
                };
            };
            clientesSelecionados.splice(indice, 1);
        };
    };

    const enviarMala = () => {
        const texto = document.getElementById('text-area-mensagem').value;
        if(texto == '') {
            document.getElementById('notificacoes').innerHTML = '<label style="color: red">!!! Necessário Preencher uma Mensagem a ser Enviada !!!</label>';
            setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 2000);

        } else {
            if(clientesSelecionados.length == 0) {
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">!!! Necessário Selecionar ao Menos um Cliente !!!</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 2000);
            } else {
                enviar(texto);
            }
        }
    };

    const enviar = async (texto) => {
        const dadosEmail = {
            texto: texto,
            destinatario: clientesSelecionados
        };

        await axios.post(baseURL + '/enviarmala', dadosEmail)
            .then(() => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: green">!!! E-Mails Enviados com Sucesso !!!</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            })
            .catch(() => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">!!! Erro ao Enviar os Emails !!!</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            });
    };

    return(
    <>
        <div className="container-form-mala">
            <div className='container-form-campos-mala'>
                <div className='div-label-input-form-mala'>
                    <label className='label-form-mala'>Mensagem a ser enviada...</label>
                    <textarea id="text-area-mensagem" className="textarea-form-mala" autoFocus></textarea>
                </div>
            </div>

            <div className='container-form-button-mala'>
                <button className='button-form-mala' type="button"  id="btn-enviar" onClick={() => enviarMala()}>Enviar</button>
                <button className='button-form-mala' type="button" onClick={() => limparCampos()}>Limpar</button>
                <button className='button-form-mala' type="button" onClick={() => irPara('/')} >Voltar</button>
            </div>
        </div>

        <div className='container-notificacoes-mala' id='notificacoes'>
        </div>

        <div name="Grid" className='container-grid-mala'>
            <table className='grid-table-mala' cellSpacing="0">
                <thead>
                    <tr>
                        <th className='grid-table-th-mala'>Nome</th>
                        <th className='grid-table-th-mala'>E-Mail</th>
                        <th className='grid-table-th-mala'></th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente, i) => (
                        <tr key={i}>
                            <td className='grid-table-td-mala' width="40%">{cliente.nome}</td>
                            <td className='grid-table-td-mala' width="50%">{cliente.email}</td>
                            <td ><input type="checkbox" className='grid-table-checkbox-mala' id={i} onChange={() => marcaDesmarcaCliente(cliente, i)} /></td>
                        </tr>
                    ))}    
                </tbody>
            </table>
        </div>
    </>
    )
};

export default malaDireta;