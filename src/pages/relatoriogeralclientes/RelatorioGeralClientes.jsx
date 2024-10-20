import jsPDF from 'jspdf';
import axios from 'axios';

import '../../Basico.css';
import './RelatorioGeralClientes.css';

var doc = '';

export const relatorioGeralClientes = () => {
    const buscarClientes = async () => {
        const baseURL = 'http://localhost:8080';

        await axios.get(baseURL + '/buscarclientes')
            .then((resposta) => {
                gerarRelatorio(resposta.data);
            })
            .catch((erro) => {
                alert(erro);
            })
    };

    buscarClientes();

    const gerarRelatorio = (clientes) => {
        doc = new jsPDF({ 
            orientation: "p",
            unit: "px",
            format: "a4"
        });
        
        const cabecalho = () => {
            doc.setFont('Courier', 'bold');
            doc.setFontSize(16);
            const text = "RELATÓRIO DE CLIENTES";
            doc.text(text, 15, 20);
            const textWidth = doc.getTextWidth(text);
            doc.line(15, 22, 15 + textWidth, 22)
            doc.setFontSize(14);
            doc.text('Nº', 15, 40);
            doc.text('Nome do Cliente', 40, 40);
            doc.text('Telefone', 300, 40);
            doc.setFontSize(12);
            doc.setFont('Courier', 'normal');
            doc.text('-------------------------------------------------------------------------------', 10, 45);
        };
        
        const rodape = (numeroPagina, quantidadePaginas) => {
            doc.text('-------------------------------------------------------------------------------', 10, 610);
            doc.text('Pág.: ' + numeroPagina + '/' + quantidadePaginas, 387, 617);
        };

        if (clientes.length == 0) {
            cabecalho();
            rodape(1, 1);
        };
        
        var quantidadeTotal = (clientes.length);
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
                    doc.text(clientes[indice].label, 40, numeroLinha);
                    doc.text(clientes[indice].telefone, 300, numeroLinha);
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
};