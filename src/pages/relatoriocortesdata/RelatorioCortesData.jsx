import { useNavigate } from 'react-router-dom';
import { formataDataInvertida, desinverteData, transMoeda, transInteiro } from '../../Utils.jsx';
import { useEffect } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';

import '../../Basico.css';
import './RelatorioCortesData.css';

const baseURL = 'https://api-barbearia-web.vercel.app';
var doc = '';
var cortes = [];
var valorTotalCortes = 0;

const relatorioCortesData = () => {
    const irPara = useNavigate();

    const limparCampos = () => {
        document.getElementById('dt-inicial').value = formataDataInvertida(new Date());
        var dataFinal = new Date();
        dataFinal.setDate(dataFinal.getDate() + 30);
        document.getElementById('dt-final').value = formataDataInvertida(dataFinal);
        cortes = [];
        document.getElementById('dt-inicial').focus();
    };

    useEffect(() => {
        limparCampos();
    }, []);

    const buscarCortes = async (dtInicial, dtFinal) => {
        await axios.get(baseURL + '/relatoriocortesdata/' + dtInicial + '/' + dtFinal)
            .then((resposta) => {
                cortes = resposta.data;
            })
            .catch((erro) => alert('Erro ao Listar os Cortes'));
        gerarRelatorio();    
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
            const text = "RELATÓRIO DE CORTES: (" + desinverteData(document.getElementById('dt-inicial').value) + ") <-> (" + desinverteData(document.getElementById('dt-final').value) + ")";
            doc.text(text, 15, 20);
            const textWidth = doc.getTextWidth(text);
            doc.line(15, 22, 15 + textWidth, 22)
            doc.setFontSize(14);
            doc.text('Nº', 15, 40);
            doc.text('Nome do Cliente', 40, 40);
            doc.text('Data do Corte', 275, 40);
            doc.text('Valor', 400, 40);
            doc.setFontSize(12);
            doc.setFont('Courier', 'normal');
            doc.text('-------------------------------------------------------------------------------', 10, 45);
        };

        const rodape = (numeroPagina, quantidadePaginas) => {
            doc.text('-------------------------------------------------------------------------------', 10, 610);
            doc.text('Pág.: ' + numeroPagina + '/' + quantidadePaginas, 387, 617);
        };

        if (cortes.length == 0) {
            cabecalho();
            rodape(1, 1);
        };

        var quantidadeCortesTotal = (cortes.length);
        var quantidadeCortesPagina = 56;
        var quantidadePaginas = Math.ceil(quantidadeCortesTotal / quantidadeCortesPagina);
        var numeroLinha = 53;
        var numeroPagina = 1;
        var numeroCortePagina = 1;
        var indice = 0;

        while (numeroPagina <= quantidadePaginas) {
            cabecalho();
            while (numeroCortePagina <= quantidadeCortesPagina) {
                if (indice < quantidadeCortesTotal) {
                    doc.text(String(indice + 1).padStart(2, ' '), 14, numeroLinha);
                    doc.text(cortes[indice].nomecliente.slice(0, 40), 40, numeroLinha);
                    doc.text(cortes[indice].data_formatada, 275, numeroLinha);
                    doc.text(cortes[indice].valor.padStart(10, ' '), 388, numeroLinha);
                    valorTotalCortes = valorTotalCortes + transInteiro(cortes[indice].valor);
                    indice++;
                    numeroLinha = numeroLinha + 10;
                };
                numeroCortePagina++;
            };

            if(numeroPagina = quantidadePaginas) {
                doc.text('Valor Total dos Cortes no Período ..: ' + transMoeda(valorTotalCortes), 15, 617);
            }

            rodape(numeroPagina, quantidadePaginas);
            numeroPagina++;
            numeroLinha = 53;
            numeroCortePagina = 1;
    
            if (numeroPagina <= quantidadePaginas) {
                doc.addPage()
            };
        };

        doc.output('dataurlnewwindow');
        //window.open(doc.output('bloburl'), '_self');
    };

    return (
        <>
            <div className='container-form-relatorio-cortes-data'>
                <div className='container-form-campos-relatorio-cortes-data'>

                    <div className='div-input-form-relatorio-cortes-data'>
                        <label className='label-form-relatorio-cortes-data'>Data Inicial</label>
                        <input type='date' className='input-form-relatorio-cortes-data' id='dt-inicial' style={{ minWidth: "150px", maxHeight: "37px" }} />
                    </div>

                    <div className='div-input-form-relatorio-cortes-data'>
                        <label className='label-form-relatorio-cortes-data'>Data Final</label>
                        <input type='date' className='input-form-relatorio-cortes-data' id='dt-final' style={{ minWidth: "150px", maxHeight: "37px" }} />
                    </div>
                </div>

                <div className='container-form-button-relatorio-cortes-data'>
                    <button className='button-form-relatorio-cortes-data' type="button" onClick={() => buscarCortes(document.getElementById('dt-inicial').value, document.getElementById('dt-final').value)}>Gerar</button>
                    <button className='button-form-relatorio-cortes-data' type="button" onClick={() => limparCampos()}>Limpar</button>
                    <button className='button-form-relatorio-cortes-data' type="button" onClick={() => irPara('/')}>Voltar</button>
                </div>
            </div>
        </>
    )
};

export default relatorioCortesData;