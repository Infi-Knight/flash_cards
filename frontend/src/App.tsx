import * as React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import {
  AppShell,
  Tabs,
  Center,
  TextInput,
  Textarea,
  Group,
  Button,
} from '@mantine/core';
import { MagicWandIcon, Pencil1Icon } from '@modulz/radix-icons';

const HomeTabs = () => {
  const [word, setWord] = React.useState('');
  const [definition, setDefinition] = React.useState('');

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };
  const handleDefinitionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDefinition(e.target.value);
  };

  const handleWordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Tabs variant="outline">
      <Tabs.Tab label="Study" icon={<MagicWandIcon />}>
        Gallery tab content
      </Tabs.Tab>
      <Tabs.Tab label="Admin" icon={<Pencil1Icon />}>
        <Center>
          <form onSubmit={handleWordSubmit}>
            <Group direction="column">
              <TextInput
                label="Word"
                placeholder="exalted"
                value={word}
                onChange={handleWordChange}
              />
              <Textarea
                label="Definition"
                placeholder="adjective: very happy"
                value={definition}
                onChange={handleDefinitionChange}
              />
              <Button
                variant="gradient"
                gradient={{ from: 'grape', to: 'pink', deg: 35 }}
                type="submit"
              >
                Submit
              </Button>
            </Group>
          </form>
        </Center>
      </Tabs.Tab>
    </Tabs>
  );
};

function App() {
  const { data, error, isLoading, isFetching } = useQuery('hello', async () => {
    const response = await axios.get(`/api/hello`);
    return response.data;
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) return <p>An error has occured</p>;

  return (
    <AppShell>
      <HomeTabs />
    </AppShell>
  );
}

export default App;
