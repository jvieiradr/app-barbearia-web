import { useNavigate } from 'react-router-dom';
import { formataDataInvertida, desinverteData } from '../../Utils.jsx';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import jsPDF from 'jspdf';
import axios from 'axios';

import '../../Basico.css';
import './RelatorioClientesAniversario.css';

var doc = '';
const baseURL = 'https://api-barbearia-web.vercel.app';

const relatorioClientesAniversario = () => {
    const irPara = useNavigate();
    const [meses] = useState([
        {value: 1, label: 'Janeiro'},
        {value: 2, label: 'Fevereiro'},
        {value: 3, label: 'Março'},
        {value: 4, label: 'Abril'},
        {value: 5, label: 'Maio'},
        {value: 6, label: 'Junho'},
        {value: 7, label: 'Julho'},
        {value: 8, label: 'Agosto'},
        {value: 9, label: 'Setembro'},
        {value: 10, label: 'Outubro'},
        {value: 11, label: 'Novembro'},
        {value: 12, label: 'Dezembro'}
    ]);
    const [mesSelecionado, setMesSelecionado] = useState(null);
    const [clientesAniversariantes, setClientesAniversariantes] = useState([]);

    const limparCampos = () => {
        setMesSelecionado(null);
        setClientesAniversariantes([]);
        document.getElementById('botaoGerarRelatorio').disabled = true;
    };

    useEffect(() => {
        limparCampos();
    }, []);

    const handleChange = async (mesSelecionado) => {
        setMesSelecionado(mesSelecionado);

        await axios.get(baseURL + '/buscarclientesaniversariantes/' + mesSelecionado.value)
            .then((resposta) => {
                setClientesAniversariantes(resposta.data);
                document.getElementById('botaoGerarRelatorio').disabled = false;
            })
            .catch((erro) => {
                alert(erro);
            })
    };

    const gerarRelatorio = async () => {
        doc = new jsPDF({ 
            orientation: "p",
            unit: "px",
            format: "a4"
        });

        const cabecalho = () => {
            doc.setFont('Courier', 'bold');
            doc.setFontSize(16);
            const text = "RELATÓRIO DE CLIENTES ANIVERSARIANTES DO MÊS DE " + mesSelecionado.label.toUpperCase();
            doc.text(text, 15, 20);
            const textWidth = doc.getTextWidth(text);
            doc.line(15, 22, 15 + textWidth, 22)
            doc.setFontSize(14);
            doc.text('Nº', 15, 40);
            doc.text('Nome do Cliente', 40, 40);
            doc.text('DT Nascimento', 235, 40);
            doc.text('Telefone', 340, 40);
            doc.setFontSize(12);
            doc.setFont('Courier', 'normal');
            doc.text('-------------------------------------------------------------------------------', 10, 45);
        };

        const rodape = (numeroPagina, quantidadePaginas) => {
            doc.text('-------------------------------------------------------------------------------', 10, 610);
            doc.text('Pág.: ' + numeroPagina + '/' + quantidadePaginas, 387, 617);
        };

        if (clientesAniversariantes.length == 0) {
            cabecalho();
            rodape(1, 1);
        };

        var quantidadeTotal = (clientesAniversariantes.length);
        var quantidadePagina = 56;
        var quantidadePaginas = Math.ceil(quantidadeTotal / quantidadePagina);
        var numeroLinha = 53;
        var numeroPagina = 1;
        var numeroItemPagina = 1;
        var indice = 0;

        while (numeroPagina <= quantidadePaginas) {
            cabecalho();
            while (numeroItemPagina <= quantidadePagina) {
                if (indice < quantidadeTotal) {
                    doc.text(String(indice + 1).padStart(2, ' '), 14, numeroLinha);
                    doc.text(clientesAniversariantes[indice].nome.slice(0, 40), 40, numeroLinha);
                    doc.text(desinverteData(clientesAniversariantes[indice].dtnascimento), 235, numeroLinha);
                    doc.text(clientesAniversariantes[indice].telefone, 340, numeroLinha);
                    indice++;
                    numeroLinha = numeroLinha + 10;
                };
                numeroItemPagina++;
            };

            rodape(numeroPagina, quantidadePaginas);
            numeroPagina++;
            numeroLinha = 53;
            numeroItemPagina = 1;
    
            if (numeroPagina <= quantidadePaginas) {
                doc.addPage()
            };
        };

        doc.output('dataurlnewwindow');
    };

    return (
        <>
            <div className='container-form-relatorio-clientes-aniversario'>
                <div className='container-form-campos-relatorio-clientes-aniversario'>
                <div className='div-input-form-corte' style={{minWidth: "260px", fontSize: "20px"}}>
                        <label className="label-form-corte">Mês do Aniversário</label>
                        <Select
                            id={"meses"}
                            autoFocus
                            options={meses}
                            value={mesSelecionado}
                            onChange={handleChange}
                            placeholder={'Selecione o Mês...'}
                            multi
                        />
                    </div>
                </div>

                <div className='container-form-button-relatorio-clientes-aniversario'>
                    <button id="botaoGerarRelatorio" className='button-form-relatorio-clientes-aniversario' type="button" onClick={() => gerarRelatorio()}>Gerar</button>
                    <button className='button-form-relatorio-clientes-aniversario' type="button" onClick={() => limparCampos()}>Limpar</button>
                    <button className='button-form-relatorio-clientes-aniversario' type="button" onClick={() => irPara('/')}>Voltar</button>
                </div>
            </div>
        </>
    )
};

export default relatorioClientesAniversario;