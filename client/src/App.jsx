import { Button } from "@chakra-ui/react";

function App() {
  return (
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">

    <Routes>
      <Route path="/" element={<HomePage />}/>
      <Route path="/login" element={<CreatePage />}/>
    </Routes>

    </Box>
  )
}

export default App
