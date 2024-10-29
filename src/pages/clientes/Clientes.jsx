import  { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mascaraTelefone, formataDataInvertida, mascaraCEP }from '../../Utils';
import axios from 'axios';
import '../../Basico.css';
import './Clientes.css';

const baseURL = 'https://api-barbearia-web.vercel.app'

const Clientes = () => {
    const irPara = useNavigate();
    const [idClienteExcluido, setIdClienteExcluido] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [clientes, setClientes] = useState([]);
    const [onEdit, setOnEdit] = useState(false);

    const limparCampos = () => {
        document.getElementById('nome').value = '';
        document.getElementById('telefone').value = '';
        document.getElementById('cep').value = '';
        document.getElementById('endereco').value = '';
        document.getElementById('numero').value = '';
        document.getElementById('bairro').value = '';
        document.getElementById('email').value = '';
        document.getElementById('cidade').value = '';
        document.getElementById('dt-nascimento').value = formataDataInvertida(new Date());
        document.getElementById('preferencia-corte').value = '';
        setIdCliente('');
        setIdClienteExcluido('');
        setOnEdit(false);
        listarClientes();
        document.getElementById('nome').focus();
    };

    const listarClientes = async () => {
        await axios.get(baseURL + '/listarclientes')
            .then((resposta) => {
                setClientes(resposta.data);
            })
            .catch((erro) => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">Erro ao Listar os Clientes</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            });
    };

    useEffect(() => {
        limparCampos();
    }, [])

    const preencherCampos = (cliente) => {
        document.getElementById('nome').value = cliente.nome;
        document.getElementById('telefone').value = cliente.telefone;
        document.getElementById('cep').value = cliente.cep;
        document.getElementById('endereco').value = cliente.endereco;
        document.getElementById('numero').value = cliente.numero;
        document.getElementById('bairro').value = cliente.bairro;
        document.getElementById('cidade').value = cliente.cidade;
        document.getElementById('email').value = cliente.email;
        document.getElementById('dt-nascimento').value = cliente.dtnascimento.substring(10, 0);
        document.getElementById('preferencia-corte').value = cliente.preferenciacorte;
        setIdCliente(cliente.id);
        setOnEdit(true);
        window.scrollTo(0, 0);
    };

    const handleCadastrarAlterarCliente = () => {
        if(!onEdit) {
            cadastrarCliente()
        } else {
            alterarCliente()
        };
    };

    const cadastrarCliente = async () => {
        const novoCliente = {
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            cep: document.getElementById('cep').value,
            endereco: document.getElementById('endereco').value,
            numero: document.getElementById('numero').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            email: document.getElementById('email').value,
            dtnascimento: document.getElementById('dt-nascimento').value,
            preferenciacorte: document.getElementById('preferencia-corte').value
        };

        if(!novoCliente.nome ||
           !novoCliente.telefone){
            document.getElementById('notificacoes').innerHTML = '<label style="color: red">... Necessário Preencher todos os Campos ...</label>';
            setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            return;
        };

        await axios.post(baseURL + '/cadastrarcliente', novoCliente).
            then((resposta) => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: green">!!! Cliente Cadastrado com Sucesso !!!</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            }).
            catch((erro) => {
                console.log(erro);
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">Erro ao Cadastrar o Cliente</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            });
        limparCampos();    
    };

    const alterarCliente = async () => {
        const clienteEditado = {
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            cep: document.getElementById('cep').value,
            endereco: document.getElementById('endereco').value,
            numero: document.getElementById('numero').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            email: document.getElementById('email').value,
            dtnascimento: document.getElementById('dt-nascimento').value,
            preferenciacorte: document.getElementById('preferencia-corte').value,
            id: idCliente
        };

        if(!clienteEditado.nome ||
           !clienteEditado.telefone){
            document.getElementById('notificacoes').innerHTML = '<label style="color: red">... Necessário Preencher todos os Campos ...</label>';
            setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            return;
        };

        await axios.put(baseURL + '/alterarcliente', clienteEditado).
            then((resposta) => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: green">!!! Cliente Alterado com Sucesso !!!</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            }).
            catch((erro) => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">Erro ao Alterar o Cliente</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            });
        limparCampos();    
    };

    const excluirCliente = async (id) => {
        await axios.delete(baseURL + '/deletarcliente/' + id)
            .then((resposta) => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: green">!!! Cliente Excluido com Sucesso !!!</label>';
                setTimeout(() => document.getElementById('notificacoes').innerHTML = '', 3000);
            })    
            .catch((erro) => {
                document.getElementById('notificacoes').innerHTML = '<label style="color: red">Erro ao Excluir o Cliente</label>';
                setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
            });
        limparCampos();    
    };

    const localizaEndereco = async () => {
        const cep = document.getElementById('cep').value;
        if(cep) {
            const baseURLCEP = 'https://viacep.com.br/ws/' + cep + '/json/';
            await axios.get(baseURLCEP)
                .then((resposta) => {
                    if(!resposta.data.erro) {
                        document.getElementById('cidade').value = resposta.data.localidade;
                        document.getElementById('endereco').value = resposta.data.logradouro;
                        document.getElementById('bairro').value = resposta.data.bairro;
                        document.getElementById('numero').focus();
                    };
                })
                .catch((erro) => {
                    document.getElementById('notificacoes').innerHTML = '<label style="color: red">Erro ao Localizar o Endereço</label>';
                    setTimeout(() => {document.getElementById('notificacoes').innerHTML = ''}, 3000);
                });
        };        
    };

    const abrirModal = (id) => {
        setIdClienteExcluido(id);
        let modal = document.getElementById('modal');
        modal.style.display = 'block';
    }
    
    const handleFecharModal = (confirmacao) => {
        let modal = document.getElementById('modal');
        modal.style.display = 'none';
        if(confirmacao) {
            excluirCliente(idClienteExcluido);
        };
    }
    
    return (
        <>
            <div className="container-form-clientes">
                <div className='container-form-campos-clientes'>
                    <div className='div-label-input-form-clientes'>
                        <label className='label-form-clientes'>Nome</label>
                        <input className='input-form-clientes' id="nome" maxLength={40} style={{ width: 349 }} autoFocus />
                    </div>

                    <div className='div-label-input-form-clientes'>
                        <label className='label-form-clientes'>Telefone</label>
                        <input className='input-form-clientes' id="telefone" maxLength={15} style={{ width: 200 }} onChange={() => mascaraTelefone()}/>
                    </div>

                    <div className='div-label-input-form-clientes'>
                        <label className='label-form-clientes'>CEP</label>
                        <input className='input-form-clientes' id="cep" maxLength={9} style={{ width: 150 }} onChange={() => mascaraCEP()} onBlur={() => localizaEndereco()} />
                    </div>

                    <div className='div-label-input-form-clientes'>
                        <label className='label-form-clientes'>Endereco</label>
                        <input className='input-form-clientes' id="endereco" maxLength={50} style={{ width: 348 }}/>
                    </div>

                    <div className='div-label-input-form-clientes'>
                        <label className='label-form-clientes'>Numero</label>
                        <input className='input-form-clientes' id="numero" maxLength={6} style={{ width: 70 }}/>
                    </div>

                    <div className='div-label-input-form-clientes'>
                        <label className='label-form-clientes'>Bairro</label>
                        <input className='input-form-clientes' id="bairro" maxLength={40} style={{ width: 280 }}/>
                    </div>

                    <div className='div-label-input-form-clientes'>
                        <label className='label-form-clientes'>Cidade</label>
                        <input className='input-form-clientes' id="cidade" maxLength={40} style={{ width: 300 }}/>
                    </div>

                    <div className='div-label-input-form-clientes'>
                        <label className='label-form-clientes'>E-Mail</label>
                        <input className='input-form-clientes' id="email" maxLength={40} style={{ width: 300 }}/>
                    </div>

                    <div className='div-label-input-form-clientes'>
                        <label className='label-form-clientes'>DT Nascimento</label>
                        <input type="date" className='input-form-clientes' id="dt-nascimento" style={{ width: 150 }}/>
                    </div>

                    <div className='div-label-input-form-clientes'>
                        <label className='label-form-clientes'>Preferência de Corte</label>
                        <input className='input-form-clientes' id="preferencia-corte" maxLength={70} style={{ width: 570 }}/>
                    </div>

                </div>

                <div className='container-form-button-clientes'>
                    <button className='button-form-clientes' type="button" onClick={() => handleCadastrarAlterarCliente()}>Salvar</button>
                    <button className='button-form-clientes' type="button" onClick={() => limparCampos()}>Limpar</button>
                    <button className='button-form-clientes' type="button" onClick={() => irPara('/')} >Voltar</button>
                </div>
            </div>

            <div className='container-notificacoes-clientes' id='notificacoes'>
            </div>

            <div name="Grid">
                <table className='grid-table-clientes'>
                    <thead>
                        <tr>
                            <th className='grid-table-th-clientes'>Nome</th>
                            <th className='grid-table-th-clientes'>Telefone</th>
                            <th className='grid-table-th-clientes'></th>
                            <th className='grid-table-th-clientes'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente, i) => (
                            <tr key={i}>
                                <td className='grid-table-td-clientes' width="40%">{cliente.nome}</td>
                                <td className='grid-table-td-clientes' width="50%">{cliente.telefone}</td>
                                <td ><button className='grid-table-button-clientes' onClick={() => preencherCampos(cliente)}>Detalhar</button></td>
                                <td ><button className='grid-table-button-clientes' onClick={() => abrirModal(cliente.id)}>Excluir</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div id="modal" className="modal">
                <div className="conteudo-modal">

                    <div className="corpo-modal">
                        Deseja Realmente Excluir este Cliente?
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

export default Clientes;