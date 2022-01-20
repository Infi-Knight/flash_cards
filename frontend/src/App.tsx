import * as React from 'react';
import { AppShell } from '@mantine/core';
import HomeTabs from './HomeTabs/HomeTabs';

function App() {
  return (
    <AppShell sx={{ backgroundColor: 'rgb(248 249 250)', minHeight: '100vh' }}>
      <HomeTabs />
    </AppShell>
  );
}

export default App;
