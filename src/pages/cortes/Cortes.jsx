import { useState, useEffect } from 'react';
import { formataDataInvertida, desinverteData, mascaraMoeda } from '../../Utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import '../../Basico.css';
import './Cortes.css';

const baseURL = 'https://api-barbearia-web.vercel.app'

const Cortes = () => {
    const irPara = useNavigate();

    const [idCorteExcluido, setIdCorteExcluido] = useState('');
    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [cortes, setCortes] = useState([]);
    const [idCorte, setIdCorte] = useState(null);
    const [onEdit, setOnEdit] = useState(false);

    const handleChange = async (clienteSelecionado) => {
        setClienteSelecionado(clienteSelecionado);
        
        await axios.get(baseURL + '/listarcortes/' + clienteSelecionado.value)
            .then((resposta) => {
                document.getElementById('tipo-corte').value = resposta.data.preferenciaCorte;
                setCortes(resposta.data);
            })
            .catch((erro) => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">Erro ao Listar os Cortes</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 2000);
            });
        document.getElementById('telefone').value = clienteSelecionado.telefone;
        document.getElementById('tipo-corte').value = clienteSelecionado.preferenciacorte;
        document.getElementById('dt-corte').focus();
    };

    useEffect (() => {
        limparCampos();
    }, [])

    const limparCampos = async () => {
        document.getElementById('telefone').value = '';
        document.getElementById('dt-corte').value = formataDataInvertida(new Date());
        document.getElementById('valor').value = 'R$ 0,00';
        document.getElementById('tipo-corte').value = '';
        setClienteSelecionado(null);
        setIdCorte(null);
        setCortes([]);
        setOnEdit(false);

        await axios.get(baseURL + '/buscarclientes')
            .then((resposta) => {
                setClientes(resposta.data);
            })
            .catch((erro) => {
                document.getElementById('notificacoes').innerHTML = `<label style="color: red">Erro ao Listar os Clientes: ${erro} </label>`;
                setTimeout(() => document.getElementById('notificacoes').innerHTML = '', 2000);
            });

        document.getElementById('cliente').focus();
    };

    const cadastrarCorte = async () => {
        if(!clienteSelecionado) {
            document.getElementById('notificacoes').innerHTML = '<label style="color: red">Necessário Selecionar um Cliente</label>';
            setTimeout(() => document.getElementById('notificacoes').innerHTML = '', 2000);
            return
        };

        const novoCorte = {
            idcliente: clienteSelecionado.value,
            nomecliente: clienteSelecionado.label,
            telefonecliente: clienteSelecionado.telefone,
            dtcorte: document.getElementById('dt-corte').value,
            valor: document.getElementById('valor').value,
            tipocorte: document.getElementById('tipo-corte').value
        }

        await axios.post(baseURL + '/cadastrarcorte', novoCorte)
            .then(() => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: green">!!! Corte Cadastrado com Sucesso !!!</label>';
                setTimeout(() => document.getElementById('notificacoes').innerHTML = '', 2000);
            })
            .catch((erro) => {
                document.getElementById('notificacoes').innerHTML = `<label style="color: red">Erro ao Cadastrar o Corte: ${erro} </label>`;
                setTimeout(() => document.getElementById('notificacoes').innerHTML = '', 2000);
            });
        limparCampos();    
    };

    const alterarCorte = async () => {
        const corteAlterado = {
            dtcorte: document.getElementById('dt-corte').value,
            valor: document.getElementById('valor').value,
            tipocorte: document.getElementById('tipo-corte').value,
            idcorte: idCorte
        };

        await axios.put(baseURL + '/alterarcorte', corteAlterado)
            .then(() => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: green">!!! Corte Alterado com Sucesso !!!</label>';
                setTimeout(() => document.getElementById('notificacoes').innerHTML = '', 2000);
            })
            .catch((erro) => {
                document.getElementById('notificacoes').innerHTML = `<label style="color: red">Erro ao Alterar o Corte: ${erro} </label>`;
                setTimeout(() => document.getElementById('notificacoes').innerHTML = '', 2000);
            });
        limparCampos();
    };

    const preencherCampos = (corte) => {
        document.getElementById('dt-corte').value = corte.dtcorte.substring(0, 10);
        document.getElementById('valor').value = corte.valor;
        document.getElementById('tipo-corte').value = corte.tipocorte;
        setIdCorte(corte.id);
        setOnEdit(true);
        window.scrollTo(0, 0);
    };

    const handleCadastrarAlterarCorte = () => {
        if(!onEdit) {
            cadastrarCorte();
        } else {
            alterarCorte();
        };
    };

    const excluirCorte = async (idcorte) => {
        axios.delete(baseURL + '/deletarcorte/' + idcorte)
        .then(() => {
            document.getElementById('notificacoes').innerHTML = '<label style="color: green">!!! Corte Excluido com Sucesso !!!</label>';
            setTimeout(() => document.getElementById('notificacoes').innerHTML = '', 2000);
        })
        .catch((erro) => {
            document.getElementById('notificacoes').innerHTML = `<label style="color: red">Erro ao Excluido o Corte: ${erro} </label>`;
            setTimeout(() => document.getElementById('notificacoes').innerHTML = '', 2000);
        });
        limparCampos();
    };
    
    const abrirModal = (id) => {
        setIdCorteExcluido(id);
        let modal = document.getElementById('modal');
        modal.style.display = 'block';
    }
    
    const handleFecharModal = (confirmacao) => {
        let modal = document.getElementById('modal');
        modal.style.display = 'none';
        if(confirmacao) {
            excluirCorte(idCorteExcluido);
        };
    }

    return(
        <>
            <div className='container-form-corte'>
                <div className='container-form-campos-corte'>

                    <div className='div-input-form-corte' style={{minWidth: "300px", fontSize: "20px"}}>
                        <label className="label-form-corte">Cliente</label>
                        <Select
                            id={"cliente"}
                            autoFocus
                            options={clientes}
                            value={clienteSelecionado}
                            onChange={handleChange}
                            placeholder={'Selecione o Cliente...'}
                            multi
                        />
                    </div>

                    <div className='div-input-form-corte'>
                        <label className='label-form-corte'>Telefone</label>
                        <input type='text' className='input-form-corte' id='telefone' style={{ minWidth: "200px", maxHeight: "37px" }} />
                    </div>

                    <div className='div-input-form-corte'>
                        <label className='label-form-corte'>Data do Corte</label>
                        <input type='date' className='input-form-corte' id='dt-corte' style={{ minWidth: "150px", maxHeight: "37px" }} />
                    </div>

                    <div className='div-input-form-corte'>
                        <label className='label-form-corte'>Valor</label>
                        <input type='text' className='input-form-corte' id='valor' maxLength={9} style={{ maxWidth: "100px", maxHeight: "37px", textAlign: "right" }} onChange={() => mascaraMoeda()}/>
                    </div>

                    <div className='div-input-form-corte'>
                        <label className='label-form-corte'>Tipo do Corte</label>
                        <input type='text' className='input-form-corte' id='tipo-corte' maxLength={70} style={{ minWidth: "580px", maxHeight: "37px" }} />
                    </div>

                </div>

                <div className='container-form-button-corte'>
                    <button className='button-form-corte' type="button" onClick={() => handleCadastrarAlterarCorte()}>Salvar</button>
                    <button className='button-form-corte' type="button" onClick={() => limparCampos()}>Limpar</button>
                    <button className='button-form-corte' type="button" onClick={() => irPara('/')}>Voltar</button>
                </div>

            </div>
                <div className='container-notificacoes-corte' id='notificacoes'>
            </div>

            <div name="grid-cortes">
                <table className='grid-cortes-table'>
                    <thead>
                        <tr>
                            <th className='grid-cortes-table-th'>Data</th>
                            <th className='grid-cortes-table-th'>Valor</th>
                            <th className='grid-cortes-table-th'>Tipo do Corte</th>
                            <th className='grid-cortes-table-th'></th>
                            <th className='grid-cortes-table-th'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cortes.map((corte, i) => (
                            <tr key={i}>
                                <td className='grid-cortes-table-td' width="17%">{desinverteData(corte.dtcorte.substring(10, 0))}</td>
                                <td className='grid-cortes-table-td' width="15%">{corte.valor}</td>
                                <td className='grid-cortes-table-td' width="70%">{corte.tipocorte}</td>
                                <td ><button className='grid-cortes-table-button' onClick={() => preencherCampos(corte)}>Detalhar</button></td>
                                <td ><button className='grid-cortes-table-button' onClick={() => abrirModal(corte.id)}>Excluir</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div id="modal" className="modal">
                <div className="conteudo-modal">

                    <div className="corpo-modal">
                        Deseja Realmente Excluir este Corte?
                    </div>

                    <div className="rodape-modal">
                        <button style={{color: "green"}} className="btn-outline" onClick={() => handleFecharModal(true)}>Sim</button>
                        <button style={{color: "red"}} className="btn-outline" onClick={() => handleFecharModal(false)}>Não</button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Cortes;