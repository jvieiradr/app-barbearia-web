export const limparURL = (aLimpar) => {
    var uri = window.location.toString();
    console.log(uri);
    if (uri.indexOf(aLimpar) > 0) {
        var clean_uri = uri.substring(0, uri.indexOf(aLimpar));
        window.history.replaceState({}, document.title, clean_uri);
    };
};

export const mascaraTelefone = () => {
    var v = document.getElementById('telefone').value;
    v = v.replace(/\D/g,'')
    v = v.replace(/(\d{2})(\d)/,"($1) $2")
    v = v.replace(/(\d)(\d{4})$/,"$1-$2")
    document.getElementById('telefone').value = v
    return
};

export const formataDataInvertida = (data) => {
    var mm = (data.getMonth() + 1).toString().padStart(2, '0');
    var dd = data.getDate().toString().padStart(2, '0');
    var aaaa = data.getFullYear();

    return aaaa + '-' + mm + '-' + dd;
};

export const mascaraCEP = () => {
    var v = document.getElementById('cep').value;
    v=v.replace(/\D/g,"")                    //Remove tudo o que não é dígito
    v=v.replace(/(\d{5})(\d)/,"$1-$2")       
    document.getElementById('cep').value = v
    return
};

export const mascaraMoeda = () => {
        var valor = document.getElementById('valor').value;
        valor = String(valor).replace('R', '');
        valor = String(valor).replace('$', '');
        valor = String(valor).replace(',', '');
        valor = String(valor.trim()).replace(/\D/, "");
        valor = Number(valor) / 100;
        valor = valor.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
        });
        document.getElementById('valor').value = valor;
        return
};

export const transMoeda = (valor) => {
    valor = String(valor).replace('R', '');
    valor = String(valor).replace('$', '');
    valor = String(valor).replace(',', '');
    valor = String(valor.trim()).replace(/\D/, "");
    valor = Number(valor) / 100;
    valor = valor.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });
    return valor;
};

export const desinverteData = (dataInvertida) => {
    var aaaa = dataInvertida.slice(0, 4);
    var mm = dataInvertida.slice(5, 7);
    var dd = dataInvertida.slice(8, 10);

    return dd + '/' + mm + '/' + aaaa;
};

export const transInteiro = (valor) => {
    valor = String(valor).replace('R', '');
    valor = String(valor).replace('$', '');
    valor = String(valor).replace(',', '');
    valor = String(valor.trim()).replace(/\D/g, "");
    return Number(valor);
};