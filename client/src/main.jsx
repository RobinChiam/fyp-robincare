/* /clilent/src/main.jsx */
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <ChakraProvider>
        <Provider store={store}>
        <App />
        </Provider>
      </ChakraProvider>
    </BrowserRouter>
);
