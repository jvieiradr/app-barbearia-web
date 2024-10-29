import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formataDataInvertida, desinverteData } from '../../Utils';
import axios from 'axios';

import './Agenda.css';
const baseURL = 'https://api-barbearia-web.vercel.app';

const Agenda = () => {
    const [compromissos, setCompromissos] = useState([]);
    const [idCompromisso, setIdCompromisso] = useState('');
    const [onEdit, setOnEdit] = useState(false);

    const irPara = useNavigate();

    const limparCampos = () => {
        document.getElementById('data').value = formataDataInvertida(new Date());
        document.getElementById('compromisso').value = '';
        document.getElementById('hora').value = '08:00';
        setIdCompromisso('');
        setOnEdit(false);
        listarCompromissos();
        document.getElementById('data').focus();
    };

    const listarCompromissos = async () => {
        const data = document.getElementById('data').value;
        await axios.get(baseURL + '/listarcompromissos/' + data)
            .then((resposta) => {
                setCompromissos(resposta.data);
            })
            .catch((erro) => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">Erro ao Listar os Compromissos</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            });
    };

    useEffect(() => {
        limparCampos();
    }, []);

    const preencherCampos = (compromisso) => {
        document.getElementById('data').value = compromisso.data.substring(0, 10);
        document.getElementById('compromisso').value = compromisso.compromisso;
        document.getElementById('hora').value = compromisso.hora;
        setIdCompromisso(compromisso.id);
        setOnEdit(true);
        window.scrollTo(0, 0);
    };

    const handleCadastrarAlterarCompromisso = () => {
        if(!onEdit) {
            cadastrarCompromisso()
        } else {
            alterarCompromisso()
        };
    };

    const cadastrarCompromisso = async () => {
        const compromisso = {
            data: document.getElementById('data').value,
            compromisso: document.getElementById('compromisso').value,
            hora: document.getElementById('hora').value
        };

        if(!compromisso.compromisso){
             document.getElementById('notificacoes').innerHTML = '<label style="color: red">... Necessário Preencher todos os Campos ...</label>';
             setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
             return;
         };

        await axios.post(baseURL + '/cadastrarcompromisso', compromisso)
            .then(() => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: green">!!! Compromisso Cadastrado com Sucesso !!!</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            })
            .catch(() => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">Erro ao Cadastrar o Compromisso</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            });
        limparCampos(); 
    };

    const alterarCompromisso = async () => {
        const compromissoEditado = {
            data: document.getElementById('data').value,
            compromisso: document.getElementById('compromisso').value,
            hora: document.getElementById('hora').value,
            id: idCompromisso
        };

        if(!compromissoEditado.compromisso){
             document.getElementById('notificacoes').innerHTML = '<label style="color: red">... Necessário Preencher todos os Campos ...</label>';
             setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
             return;
         };

        await axios.put(baseURL + '/alterarcompromisso', compromissoEditado).
            then((resposta) => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: green">!!! Compromisso Alterado com Sucesso !!!</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            }).
            catch((erro) => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">Erro ao Alterar o Compromisso</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            });
        limparCampos();    
    };

    const excluirCompromisso = async () => {
        await axios.delete(baseURL + '/deletarcompromisso/' + idCompromisso)
            .then(() => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: green">!!! Compromisso Excluido com Sucesso !!!</label>';
                setTimeout(() => document.getElementById('notificacoes').innerHTML = '', 3000);
            })    
            .catch(() => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">Erro ao Excluir o Compromisso</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            });
        limparCampos();    
    };

    const abrirModal = (id) => {
        setIdCompromisso(id);
        let modal = document.getElementById('modal');
        modal.style.display = 'block';
    }
    
    const handleFecharModal = (confirmacao) => {
        let modal = document.getElementById('modal');
        modal.style.display = 'none';
        if(confirmacao) {
            excluirCompromisso();
        };
    }

    return(
        <>
        <div className="container-form-agenda">
                <div className='container-form-campos-agenda'>
                    <div className='div-label-input-form-agenda'>
                        <label className='label-form-agenda'>Data</label>
                        <input type="date" className='input-form-agenda' id="data" style={{ width: 150 }} onChange={() => listarCompromissos()}/>
                    </div>
                    <div className='div-label-input-form-agenda'>
                        <label className='label-form-agenda'>Compromisso</label>
                        <input type="text" className='input-form-agenda' id="compromisso" style={{ width: 400 }}/>
                    </div>
                    <div className='div-label-input-form-agenda'>
                        <label className='label-form-agenda'>Hora</label>
                        <input type="time" className='input-form-agenda' id="hora" style={{ width: 150 }}/>
                    </div>
                </div>

                <div className='container-form-button-agenda'>
                    <button className='button-form-agenda' type="button" onClick={() => handleCadastrarAlterarCompromisso()}>Salvar</button>
                    <button className='button-form-agenda' type="button" onClick={() => limparCampos()}>Limpar</button>
                    <button className='button-form-agenda' type="button" onClick={() => irPara('/')}>Voltar</button>
                </div>
            </div>

            <div className='container-notificacoes-clientes' id='notificacoes'>
            </div>

            <div name="Grid">
                <table className='grid-table-agenda'>
                    <thead>
                        <tr>
                            <th className='grid-table-th-agenda'>Data</th>
                            <th className='grid-table-th-agenda'>Compromisso</th>
                            <th className='grid-table-th-agenda'>Hora</th>
                            <th className='grid-table-th-agenda'></th>
                            <th className='grid-table-th-agenda'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {compromissos.map((compromisso, i) => (
                           <tr key={i}>
                                <td className='grid-table-td-agenda' width="20%">{desinverteData(compromisso.data.substring(10, 0))}</td>
                                <td className='grid-table-td-agenda' width="60%">{compromisso.compromisso}</td>
                                <td className='grid-table-td-agenda' width="25%">{compromisso.hora}</td>
                                <td ><button className='grid-table-button-agenda' onClick={() => preencherCampos(compromisso)}>Detalhar</button></td>
                                <td ><button className='grid-table-button-agenda' onClick={() => abrirModal(compromisso.id)}>Excluir</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div id="modal" className="modal">
                <div className="conteudo-modal">

                    <div className="corpo-modal">
                        Deseja Realmente Excluir este Compromisso?
                    </div>

                    <div className="rodape-modal">
                        <button style={{color: "green"}} className="btn-outline" onClick={() => handleFecharModal(true)}>Sim</button>
                        <button style={{color: "red"}} className="btn-outline" onClick={() => handleFecharModal(false)}>Não</button>
                    </div>

                </div>
            </div>
        </>
    )
};

export default Agenda;