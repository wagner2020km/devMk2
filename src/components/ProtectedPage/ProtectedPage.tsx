import { useRouter } from 'next/router';
import { useEffect, useContext, useState } from 'react';
import MenssageError from '../MenssageError/MenssageError'
import { AuthContext } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';

const ProtectedPage = ({ children, errorMessage, errorType, page }) => {
    
  const router = useRouter();
  //const [session, loading] = useSession();
  const { signOut} = useContext(AuthContext);
  const user = useSelector((state: any) => state.userReducer.user);
  const [valida, setValida] = useState(false);

  const protect = () =>{
    if (user.perfilid == 8) {
        console.log('retorno verdadeiro')
        setValida(true)
      }else{
        setValida(false);
        console.log('retorno falso')
      }
  }
  useEffect(() => {
    protect()
  }, [setValida, router]);

  // Renderizar children somente se o usuário estiver autenticado
  return valida ? children : <MenssageError
  message={errorMessage}
  typeMessage='error'
 textAlert='Erro'

  />;
};

export default ProtectedPage;