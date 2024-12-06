import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
      brand: {
        100: '#f7fafc',
        900: '#1a202c',
      },
    },
    fonts: {
      heading: `'Roboto', sans-serif`,
      body: `'Open Sans', sans-serif`,
    },
  });

  console.log(theme);

export default theme;
