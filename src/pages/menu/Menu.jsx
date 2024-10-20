import { useNavigate } from 'react-router-dom';
import '../../Basico.css';
import './Menu.css';

import { relatorioGeralClientes } from '../relatoriogeralclientes/RelatorioGeralClientes.jsx';

const Menu = () => {
    const irPara = useNavigate();

    return(
      <>
      <div className='container-principal'>
        <div className='container-logo'>
          <img src='logo.jpg' className='logo' />
        </div>
          <div className="container-menu">
              <button className="button-menu" onClick={() => irPara('/clientes')}>Clientes</button>
              <button className="button-menu" onClick={() => relatorioGeralClientes()}>Relatório Geral de Clientes</button>
              <button className="button-menu" onClick={() => irPara('relatorioclientesaniversario')}>Relatório de Clientes Aniversariantes</button>
              <button className="button-menu" onClick={() => irPara('/cortes')}>Cortes</button>
              <button className="button-menu" onClick={() => irPara('/relatoriocortesdata')}>Relatório de Cortes por Data</button>
              <button className="button-menu" onClick={() => irPara('/maladireta')}>Mala Direta</button>
              <button className="button-menu" onClick={() => irPara('/agenda')}>Agenda</button>
          </div>
      </div>
      </>
    );
};

export default Menu;