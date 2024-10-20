import { Routes, Route } from 'react-router-dom';

import Menu from './pages/menu/Menu.jsx';
import Clientes from './pages/clientes/Clientes.jsx';
import Cortes from './pages/cortes/Cortes.jsx';
import RelatorioCortesData from './pages/relatoriocortesdata/RelatorioCortesData.jsx';
import RelatorioClientesAniversario from './pages/relatorioclientesaniversario/RelatorioClientesAniversario.jsx';
import MalaDireta from './pages/maladireta/MalaDireta.jsx';
import Agenda from './pages/agenda/Agenda.jsx';

const Rotas = () => {
    return (
        <Routes>
            <Route path='/' exact element={<Menu />} />
            <Route path='/clientes' element={<Clientes />} />
            <Route path='/cortes' element={<Cortes />} />
            <Route path='/relatoriocortesdata' element={<RelatorioCortesData />} />
            <Route path='/relatorioclientesaniversario' element={<RelatorioClientesAniversario />} />
            <Route path='/maladireta' element={<MalaDireta />} />
            <Route path='/agenda' element={<Agenda />} />
        </Routes>
    )
};

export default Rotas;
